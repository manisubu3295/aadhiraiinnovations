import express from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendMail } from '../mailer.js'
import { sendWhatsApp, getStaffNotifyNumbers } from '../whatsapp.js'
import { mintLicense, emailLicense, invoiceLicense } from '../licenseFulfillment.js'
import { PLAN_PRICE_FIELD } from '../licenseApi.js'

const router = express.Router()

const PLAN_KEYS = ['THREE_MONTH', 'SIX_MONTH', 'ONE_YEAR']

function getRazorpayClient(settings) {
  if (!settings.razorpayKeyId || !settings.razorpayKeySecret) return null
  return new Razorpay({ key_id: settings.razorpayKeyId, key_secret: settings.razorpayKeySecret })
}

// Public — no auth. Whitelisted fields only; licenseApiKey/licenseApiUrl never leave the server.
router.get('/pricing', async (req, res) => {
  const settings = await getSettings()
  res.json({
    success: true,
    pricing: {
      threeMonthPrice: settings.licensePlan3MoPrice,
      sixMonthPrice: settings.licensePlan6MoPrice,
      oneYearPrice: settings.licensePlan1YrPrice,
      downloadUrl: settings.licenseDownloadUrl || '',
      installGuideUrl: settings.licenseInstallGuideUrl || '',
    },
  })
})

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this address. Try again later.' },
})

router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, whatsapp, businessName, machineId, plan } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedWhatsapp = String(whatsapp || '').trim()
    const trimmedBusinessName = String(businessName || '').trim()
    const trimmedMachineId = String(machineId || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp || !trimmedMachineId) {
      return res.status(400).json({ success: false, message: 'Name, email, WhatsApp number, and Machine ID are required.' })
    }
    if (!PLAN_KEYS.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' })
    }

    const { lead, licenseRequest } = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedWhatsapp,
          company: trimmedBusinessName || null,
          source: 'Medora Offline Subscription',
        },
      })
      const licenseRequest = await tx.licenseRequest.create({
        data: {
          leadId: lead.id,
          plan,
          machineId: trimmedMachineId,
          customerName: trimmedName,
          email: trimmedEmail,
          whatsapp: trimmedWhatsapp,
          businessName: trimmedBusinessName || null,
        },
      })
      return { lead, licenseRequest }
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      whatsapp: trimmedWhatsapp,
      businessName: trimmedBusinessName || '-',
      machineId: trimmedMachineId,
      plan,
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('OFFLINE_LICENSE_LEAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'OFFLINE_LICENSE_LEAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const ackTpl = await getTemplate('OFFLINE_SUBSCRIBE_ACK')
    const ack = renderTemplate(ackTpl, { name: trimmedName, plan })
    sendMail({
      to: trimmedEmail,
      subject: ack.subject,
      text: htmlToText(ack.html),
      html: ack.html,
      meta: { templateKey: 'OFFLINE_SUBSCRIBE_ACK', relatedType: 'LEAD', relatedId: lead.id },
    })

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'OFFLINE_LICENSE_LEAD_STAFF',
        components: [trimmedName, plan, trimmedMachineId],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    // Payment: only attempted if both a price is configured for this plan and Razorpay is set
    // up — otherwise fall back to today's "we'll email within 24h of confirming payment"
    // manual flow untouched (nothing to charge an exact amount for otherwise).
    const price = settings[PLAN_PRICE_FIELD[plan]]
    const razorpay = getRazorpayClient(settings)
    if (price && razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: price * 100, // paise
          currency: 'INR',
          receipt: licenseRequest.id,
        })
        await prisma.licenseRequest.update({
          where: { id: licenseRequest.id },
          data: { razorpayOrderId: order.id },
        })
        return res.status(201).json({
          success: true,
          message: 'Complete payment to receive your license by email within minutes.',
          leadId: lead.id,
          licenseRequestId: licenseRequest.id,
          razorpayOrderId: order.id,
          razorpayKeyId: settings.razorpayKeyId,
          amount: order.amount,
          currency: order.currency,
        })
      } catch (error) {
        // Payment setup failing shouldn't block the lead being captured — fall through to the
        // manual-confirmation response below, same as if no gateway were configured at all.
        console.error('Razorpay order creation failed:', error)
      }
    }

    res.status(201).json({
      success: true,
      message: "Thanks! We'll email your license within 24 hours of confirming payment.",
      leadId: lead.id,
      licenseRequestId: licenseRequest.id,
    })
  } catch (error) {
    console.error('Offline license subscribe failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

// Razorpay calls this directly (no auth — secured by signature verification instead). Needs
// the raw request body to verify the HMAC signature; server.js's express.json() captures it
// into req.rawBody via a `verify` callback for exactly this purpose.
router.post('/razorpay-webhook', async (req, res) => {
  const settings = await getSettings()
  if (!settings.razorpayWebhookSecret) {
    console.error('Razorpay webhook received but no webhook secret is configured — rejecting.')
    return res.status(400).json({ success: false, message: 'Webhook not configured.' })
  }

  const signature = req.get('x-razorpay-signature')
  const expected = crypto
    .createHmac('sha256', settings.razorpayWebhookSecret)
    .update(req.rawBody || Buffer.from(''))
    .digest('hex')

  if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    console.error('Razorpay webhook signature verification failed.')
    return res.status(400).json({ success: false, message: 'Invalid signature.' })
  }

  const event = req.body
  if (event?.event !== 'payment.captured') {
    // Not an event we act on — acknowledge so Razorpay doesn't retry it forever.
    return res.json({ success: true })
  }

  const payment = event.payload?.payment?.entity
  const orderId = payment?.order_id
  if (!orderId) return res.json({ success: true })

  const licenseRequest = await prisma.licenseRequest.findUnique({ where: { razorpayOrderId: orderId } })
  if (!licenseRequest) {
    console.error(`Razorpay webhook: no LicenseRequest found for order ${orderId}.`)
    return res.json({ success: true })
  }

  // Idempotency — Razorpay retries webhooks, and this must never mint/send a license twice.
  if (licenseRequest.paymentStatus === 'PAID') {
    return res.json({ success: true })
  }

  await prisma.licenseRequest.update({
    where: { id: licenseRequest.id },
    data: {
      paymentStatus: 'PAID',
      razorpayPaymentId: payment.id,
      amountPaid: Math.round(payment.amount / 100),
      paidAt: new Date(),
    },
  })

  try {
    await mintLicense(licenseRequest.id)
    await emailLicense(licenseRequest.id)
    await invoiceLicense(licenseRequest.id) // never throws — safe alongside the above
  } catch (error) {
    // mintLicense/emailLicense already persisted status:FAILED / errorMessage on the
    // LicenseRequest — it's visible on the admin Licenses page for staff to pick up manually,
    // same as any other failed generation. Still ack the webhook so Razorpay doesn't retry
    // (retrying wouldn't fix a broken signing key or SMTP config anyway).
    console.error(`Auto-fulfillment failed for LicenseRequest ${licenseRequest.id}:`, error.message)
  }

  res.json({ success: true })
})

// Free trial — no Machine ID (the trial self-activates on first launch, nothing to license yet)
// and no LicenseRequest, just a Lead so trial downloads still show up for follow-up.
router.post('/trial-signup', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, whatsapp, businessName } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedWhatsapp = String(whatsapp || '').trim()
    const trimmedBusinessName = String(businessName || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp) {
      return res.status(400).json({ success: false, message: 'Name, email, and WhatsApp number are required.' })
    }

    const lead = await prisma.lead.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedWhatsapp,
        company: trimmedBusinessName || null,
        source: 'Medora Offline — Free Trial Download',
      },
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      whatsapp: trimmedWhatsapp,
      businessName: trimmedBusinessName || '-',
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('OFFLINE_TRIAL_LEAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'OFFLINE_TRIAL_LEAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const ackTpl = await getTemplate('OFFLINE_TRIAL_DOWNLOAD_ACK')
    const ack = renderTemplate(ackTpl, { name: trimmedName })
    sendMail({
      to: trimmedEmail,
      subject: ack.subject,
      text: htmlToText(ack.html),
      html: ack.html,
      meta: { templateKey: 'OFFLINE_TRIAL_DOWNLOAD_ACK', relatedType: 'LEAD', relatedId: lead.id },
    })

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'OFFLINE_TRIAL_LEAD_STAFF',
        components: [trimmedName, trimmedBusinessName || '-', trimmedWhatsapp],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    res.status(201).json({ success: true, message: 'Thanks! Your download will start now.', leadId: lead.id })
  } catch (error) {
    console.error('Offline trial signup failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

// Guided/custom setup — no fixed plan or Machine ID (nothing to activate yet; the whole point is
// a human scopes it first), so this creates a plain Lead with no LicenseRequest, distinguished
// from self-service subscriptions by `source`.
router.post('/enterprise-inquiry', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, whatsapp, businessName, message } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedWhatsapp = String(whatsapp || '').trim()
    const trimmedBusinessName = String(businessName || '').trim()
    const trimmedMessage = String(message || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp) {
      return res.status(400).json({ success: false, message: 'Name, email, and WhatsApp number are required.' })
    }

    const lead = await prisma.lead.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedWhatsapp,
        company: trimmedBusinessName || null,
        source: 'Medora Offline — Enterprise/Guided Setup',
        notes: trimmedMessage || null,
      },
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      whatsapp: trimmedWhatsapp,
      businessName: trimmedBusinessName || '-',
      message: trimmedMessage ? trimmedMessage.replace(/\n/g, '<br/>') : '-',
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('OFFLINE_ENTERPRISE_LEAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'OFFLINE_ENTERPRISE_LEAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'OFFLINE_ENTERPRISE_LEAD_STAFF',
        components: [trimmedName, trimmedBusinessName || '-', trimmedWhatsapp],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    res.status(201).json({
      success: true,
      message: "Thanks! We'll get back to you shortly to discuss your requirements.",
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Offline enterprise inquiry failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

export default router
