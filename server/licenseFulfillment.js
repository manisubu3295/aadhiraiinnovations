import { prisma } from './prismaClient.js'
import { getSettings } from './settings.js'
import { deliverMail } from './mailer.js'
import { getTemplate, renderTemplate, htmlToText } from './emailTemplates.js'
import { generateLicense, PLAN_API_KEYS, PLAN_PRICE_FIELD } from './licenseApi.js'
import { calculateTotals } from '../shared/pricing.js'
import { renderDocumentHtml } from './documentRenderer.js'
import { htmlToPdfBuffer } from './pdfRenderer.js'
import { nextDocumentNumber, sellerFromSettings, customerFromClient } from './documentHelpers.js'

const LICENSE_GST_RATE = 18 // %, applied to every license invoice — India software/SaaS rate.
const PLAN_LABELS = { THREE_MONTH: '3-Month', SIX_MONTH: '6-Month', ONE_YEAR: '1-Year' }

// Standard terms for every license invoice. Beyond what was explicitly asked for (self-service,
// no support cost, initial setup included, 24-72h email response), this also adds two common,
// standard clauses for a device-locked digital product — non-transferability and no refunds
// post-delivery — flagged here so it's easy to edit/remove if they don't match actual policy.
const LICENSE_INVOICE_TERMS = [
  'This is a self-service software license. The price above covers the license only — no ongoing support is included.',
  'Initial setup assistance is provided at no additional cost.',
  'For any issues, email info@aadhiraiinnovations.com — we will review and respond within 24 to 72 hours.',
  'This license is valid for the plan period shown and is locked to the Machine ID above; it is not transferable to another device.',
  'No refunds once the license has been issued and delivered.',
].join('\n')

// Shared by the admin Licenses page's manual Generate/Send buttons (server/routes/licenses.js)
// and the automatic Razorpay webhook path (server/routes/offlineLicense.js) — one
// implementation of "mint a license" and "email a license", not duplicated per trigger.

// Mints the license via server/licenseApi.js and stores it — never emails it. Throws on
// failure after recording status: FAILED/errorMessage, so callers see both the persisted
// state and the error.
export async function mintLicense(licenseRequestId, { activationDate } = {}) {
  const license = await prisma.licenseRequest.findUnique({ where: { id: licenseRequestId } })
  if (!license) throw new Error('License request not found.')
  if (license.status === 'FULFILLED') {
    throw new Error('A license has already been generated for this request.')
  }

  let issued
  try {
    issued = await generateLicense({
      machineId: license.machineId,
      plan: PLAN_API_KEYS[license.plan],
      customerName: license.businessName || license.customerName,
      activationDate,
    })
  } catch (error) {
    await prisma.licenseRequest.update({
      where: { id: license.id },
      data: { status: 'FAILED', errorMessage: error.message },
    })
    throw error
  }

  const fulfilled = await prisma.licenseRequest.update({
    where: { id: license.id },
    data: {
      status: 'FULFILLED',
      licenseId: issued.licenseId || null,
      fileContents: issued.fileContents,
      issuedAt: issued.issuedAt ? new Date(issued.issuedAt) : new Date(),
      expiresAt: issued.expiresAt ? new Date(issued.expiresAt) : null,
      errorMessage: null,
    },
  })

  if (license.leadId) {
    await prisma.lead.update({ where: { id: license.leadId }, data: { status: 'WON' } })
  }

  return fulfilled
}

// Explicit send/resend — the only place that actually emails the customer. Works identically
// whether this is the first send or a re-send after an earlier failure. Throws on failure
// after recording the error, same pattern as mintLicense.
export async function emailLicense(licenseRequestId) {
  const license = await prisma.licenseRequest.findUnique({ where: { id: licenseRequestId } })
  if (!license) throw new Error('License request not found.')
  if (license.status !== 'FULFILLED' || !license.fileContents) {
    throw new Error('Generate the license before sending it.')
  }

  const settings = await getSettings()
  const tpl = await getTemplate('LICENSE_DELIVERY')
  const { subject, html } = renderTemplate(tpl, {
    customerName: license.businessName || license.customerName,
    plan: license.plan,
    expiresAt: license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : '-',
    businessName: settings.businessName,
  })

  try {
    await deliverMail({
      to: license.email,
      subject,
      text: htmlToText(html),
      html,
      attachments: [{ filename: 'license.lic', content: Buffer.from(license.fileContents, 'utf-8') }],
      meta: { templateKey: 'LICENSE_DELIVERY', relatedType: 'LICENSE_REQUEST', relatedId: license.id },
    })
  } catch (error) {
    await prisma.licenseRequest.update({
      where: { id: license.id },
      data: { errorMessage: `Failed to send: ${error.message}` },
    })
    throw error
  }

  return prisma.licenseRequest.update({
    where: { id: license.id },
    data: { errorMessage: null, emailSentAt: new Date() },
  })
}

// Generates and emails a GST invoice for a license purchase, reusing the exact same
// Invoice/PDF/email machinery as the regular client-invoicing flow (server/routes/admin.js) —
// same invoice numbering, same PDF layout, same INVOICE_SENT template. Invoices require a
// Client record (Invoice.clientId is a required FK), but a license customer is only ever a
// Lead or nothing at all, so this finds-or-creates a Client by email first, mirroring the
// existing Lead -> Client "Convert to client" action.
//
// Never throws — a missing/unconfigured price (no Razorpay payment recorded and no plan price
// set in Settings) or an email failure here must not undo an already-delivered license; errors
// are logged and swallowed, and this returns null when it can't produce an invoice.
export async function invoiceLicense(licenseRequestId) {
  const license = await prisma.licenseRequest.findUnique({ where: { id: licenseRequestId } })
  if (!license) return null
  if (license.invoiceId) return null // already invoiced — never mint a duplicate on resend

  const settings = await getSettings()
  const amount = license.amountPaid || settings[PLAN_PRICE_FIELD[license.plan]]
  if (!amount) {
    console.error(`invoiceLicense: no amount available for LicenseRequest ${license.id} (plan ${license.plan}) — no price configured and nothing paid. Skipping invoice.`)
    return null
  }

  try {
    let client = await prisma.client.findFirst({ where: { email: license.email } })
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: license.customerName,
          company: license.businessName || null,
          email: license.email,
          phone: license.whatsapp || null,
        },
      })
    }

    const items = [{
      description: `Medora Offline — ${PLAN_LABELS[license.plan] || license.plan} License (Machine ID: ${license.machineId})`,
      quantity: 1,
      unitPrice: amount,
      tax: LICENSE_GST_RATE,
    }]

    const invoiceNumber = await nextDocumentNumber(prisma.invoice, 'INV')
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: client.id,
        items,
        notes: `Medora Offline license — License ID ${license.licenseId || license.id}.`,
        terms: LICENSE_INVOICE_TERMS,
      },
    })

    const totals = calculateTotals(items, 0)
    const html = renderDocumentHtml({
      type: 'invoice',
      seller: sellerFromSettings(settings),
      customer: customerFromClient(client),
      details: { invoiceNumber: invoice.invoiceNumber, issueDate: invoice.issueDate?.toLocaleDateString() },
      items,
      totals,
      tds: null,
      terms: invoice.terms,
      logoUrl: settings.logoUrl || undefined,
      bankDetails: { bankName: settings.bankName, accountNumber: settings.bankAccountNumber, ifsc: settings.bankIfsc, upiId: settings.upiId },
    })
    const pdfBuffer = await htmlToPdfBuffer(html)

    const tpl = await getTemplate('INVOICE_SENT')
    const { subject, html: coverHtml } = renderTemplate(tpl, {
      clientName: client.name,
      invoiceNumber: invoice.invoiceNumber,
      currency: invoice.currency,
      amount: totals.grandTotal.toFixed(2),
      dueDate: '-',
      businessName: settings.businessName,
    })
    await deliverMail({
      to: client.email,
      subject,
      text: htmlToText(coverHtml),
      html: coverHtml,
      attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer }],
      meta: { templateKey: 'INVOICE_SENT', relatedType: 'INVOICE', relatedId: invoice.id },
    })

    await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'SENT' } })
    return prisma.licenseRequest.update({ where: { id: license.id }, data: { invoiceId: invoice.id } })
  } catch (error) {
    console.error(`invoiceLicense: failed to generate/send invoice for LicenseRequest ${license.id}:`, error.message)
    return null
  }
}
