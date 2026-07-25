import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { calculateTotals, calculateTds } from '../../shared/pricing.js'
import { getSettings, updateSettings } from '../settings.js'
import { sendTestMail, sendMail, deliverMail } from '../mailer.js'
import { getTemplate, renderTemplate, htmlToText, DEFAULT_TEMPLATES } from '../emailTemplates.js'
import { renderDocumentHtml } from '../documentRenderer.js'
import { htmlToPdfBuffer } from '../pdfRenderer.js'
import { deliverWhatsApp, normalizeWhatsAppNumber } from '../whatsapp.js'
import { paramsForKey, DEFAULT_TEMPLATES as DEFAULT_WHATSAPP_TEMPLATES } from '../whatsappTemplates.js'
import { generateLicense, PLAN_API_KEYS } from '../licenseApi.js'

const router = express.Router()
// Everything under /api/admin is ADMIN-only — staff use /api/employee instead.
router.use(requireAuth)
router.use(requireRole('ADMIN'))

function toNumber(value) {
  return value === null || value === undefined ? 0 : Number(value)
}

function sumPayments(payments) {
  return payments.reduce((total, payment) => total + toNumber(payment.amount), 0)
}

async function nextDocumentNumber(model, prefix) {
  const year = new Date().getFullYear()
  const count = await model.count({
    where: { [prefix === 'QUO' ? 'quotationNumber' : 'invoiceNumber']: { startsWith: `${prefix}-${year}-` } },
  })
  return `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
}

// ---------- Clients ----------

router.get('/clients', async (req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ success: true, clients })
})

router.get('/clients/:id', async (req, res) => {
  const client = await prisma.client.findUnique({
    where: { id: req.params.id },
    include: { projects: true, quotations: true, invoices: true },
  })
  if (!client) return res.status(404).json({ success: false, message: 'Client not found.' })
  res.json({ success: true, client })
})

router.post('/clients', async (req, res) => {
  const { name, company, email, phone, address, gstNumber } = req.body ?? {}
  if (!String(name || '').trim()) {
    return res.status(400).json({ success: false, message: 'Client name is required.' })
  }
  const client = await prisma.client.create({
    data: { name, company, email, phone, address, gstNumber, createdById: req.user.id },
  })
  res.status(201).json({ success: true, client })
})

router.put('/clients/:id', async (req, res) => {
  const { name, company, email, phone, address, gstNumber } = req.body ?? {}
  const client = await prisma.client.update({
    where: { id: req.params.id },
    data: { name, company, email, phone, address, gstNumber },
  })
  res.json({ success: true, client })
})

router.delete('/clients/:id', async (req, res) => {
  await prisma.client.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

router.get('/clients/:id/portal-user', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { clientId: req.params.id, role: 'CLIENT' },
    select: { id: true, name: true, username: true, email: true, createdAt: true },
  })
  res.json({ success: true, user })
})

router.post('/clients/:id/portal-user', async (req, res) => {
  const { username, email, password } = req.body ?? {}
  const trimmedUsername = String(username || '').trim().toLowerCase()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  if (!trimmedUsername || !trimmedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Username, email, and password are required.' })
  }
  if (String(password).length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
  }
  const client = await prisma.client.findUnique({ where: { id: req.params.id } })
  if (!client) return res.status(404).json({ success: false, message: 'Client not found.' })

  const existing = await prisma.user.findFirst({ where: { OR: [{ username: trimmedUsername }, { email: trimmedEmail }] } })
  if (existing) {
    return res.status(409).json({ success: false, message: 'A user with that username or email already exists.' })
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name: client.name, username: trimmedUsername, email: trimmedEmail, passwordHash, role: 'CLIENT', clientId: client.id },
    select: { id: true, name: true, username: true, email: true, createdAt: true },
  })
  res.status(201).json({ success: true, user })
})

router.put('/clients/:id/portal-user', async (req, res) => {
  const { username, email, password } = req.body ?? {}
  const trimmedUsername = String(username || '').trim().toLowerCase()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  if (!trimmedUsername || !trimmedEmail) {
    return res.status(400).json({ success: false, message: 'Username and email are required.' })
  }
  const existing = await prisma.user.findFirst({ where: { clientId: req.params.id, role: 'CLIENT' } })
  if (!existing) return res.status(404).json({ success: false, message: 'No portal login exists for this client yet.' })

  if (trimmedUsername !== existing.username || trimmedEmail !== existing.email) {
    const taken = await prisma.user.findFirst({
      where: { id: { not: existing.id }, OR: [{ username: trimmedUsername }, { email: trimmedEmail }] },
    })
    if (taken) return res.status(409).json({ success: false, message: 'A user with that username or email already exists.' })
  }
  if (password && String(password).length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
  }

  const data = { username: trimmedUsername, email: trimmedEmail }
  if (password) data.passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.update({
    where: { id: existing.id },
    data,
    select: { id: true, name: true, username: true, email: true, createdAt: true },
  })
  res.json({ success: true, user })
})

// ---------- Projects ----------

router.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true, payments: true, milestones: { orderBy: { sequence: 'asc' } } },
  })
  const withTotals = projects.map(({ payments, ...project }) => {
    const paid = sumPayments(payments)
    return { ...project, paid, due: toNumber(project.totalValue) - paid }
  })
  res.json({ success: true, projects: withTotals })
})

router.get('/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      client: true,
      payments: { orderBy: { paidOn: 'desc' } },
      quotations: { orderBy: { createdAt: 'desc' } },
      invoices: { orderBy: { createdAt: 'desc' } },
      milestones: { orderBy: { sequence: 'asc' } },
    },
  })
  if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
  const paid = sumPayments(project.payments)
  res.json({ success: true, project: { ...project, paid, due: toNumber(project.totalValue) - paid } })
})

router.post('/projects', async (req, res) => {
  const { name, clientId, description, status, billingType, hourlyRate, totalValue, currency, startDate, endDate, notes } = req.body ?? {}
  if (!String(name || '').trim() || !clientId) {
    return res.status(400).json({ success: false, message: 'Project name and client are required.' })
  }
  const project = await prisma.project.create({
    data: {
      name,
      clientId,
      description,
      status: status || undefined,
      billingType: billingType || undefined,
      hourlyRate: hourlyRate || undefined,
      totalValue: totalValue ?? 0,
      currency: currency || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      notes,
      createdById: req.user.id,
    },
  })
  res.status(201).json({ success: true, project })
})

router.put('/projects/:id', async (req, res) => {
  const { name, clientId, description, status, billingType, hourlyRate, totalValue, currency, startDate, endDate, notes } = req.body ?? {}
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      name,
      clientId,
      description,
      status,
      billingType,
      hourlyRate: hourlyRate === '' ? null : hourlyRate,
      totalValue,
      currency,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      notes,
    },
  })
  res.json({ success: true, project })
})

router.delete('/projects/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ---------- Project milestones ----------

router.post('/projects/:id/milestones', async (req, res) => {
  const { title, description, amount, dueDate, sequence } = req.body ?? {}
  if (!String(title || '').trim() || amount === undefined || Number(amount) < 0) {
    return res.status(400).json({ success: false, message: 'A title and non-negative amount are required.' })
  }
  const milestone = await prisma.projectMilestone.create({
    data: {
      projectId: req.params.id,
      title,
      description,
      amount,
      sequence: sequence ?? 0,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  })
  res.status(201).json({ success: true, milestone })
})

router.put('/milestones/:id', async (req, res) => {
  const { title, description, amount, dueDate, sequence, status } = req.body ?? {}
  const data = { title, description, amount, sequence, status }
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null
  if (status === 'COMPLETED') data.completedAt = new Date()
  const milestone = await prisma.projectMilestone.update({ where: { id: req.params.id }, data })
  res.json({ success: true, milestone })
})

router.delete('/milestones/:id', async (req, res) => {
  await prisma.projectMilestone.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ---------- Payments ----------

router.get('/payments', async (req, res) => {
  const { projectId, invoiceId } = req.query
  const where = {}
  if (projectId) where.projectId = String(projectId)
  if (invoiceId) where.invoiceId = String(invoiceId)
  const payments = await prisma.payment.findMany({ where, orderBy: { paidOn: 'desc' } })
  res.json({ success: true, payments })
})

router.post('/payments', async (req, res) => {
  const { projectId, invoiceId, amount, paidOn, method, reference, notes } = req.body ?? {}
  if (!projectId || !amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'A project and a positive amount are required.' })
  }
  const payment = await prisma.payment.create({
    data: {
      projectId,
      invoiceId: invoiceId || undefined,
      amount,
      paidOn: paidOn ? new Date(paidOn) : undefined,
      method: method || undefined,
      reference,
      notes,
      recordedById: req.user.id,
    },
  })

  if (invoiceId) {
    await refreshInvoiceStatus(invoiceId)
  }

  res.status(201).json({ success: true, payment })
})

router.delete('/payments/:id', async (req, res) => {
  const payment = await prisma.payment.delete({ where: { id: req.params.id } })
  if (payment.invoiceId) {
    await refreshInvoiceStatus(payment.invoiceId)
  }
  res.json({ success: true })
})

async function refreshInvoiceStatus(invoiceId) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } })
  if (!invoice || invoice.status === 'CANCELLED' || invoice.status === 'DRAFT') return
  const { grandTotal } = calculateTotals(invoice.items, invoice.discount)
  const payable = invoice.tdsApplicable ? calculateTds(grandTotal, invoice.tdsRate).netPayable : grandTotal
  const paid = sumPayments(invoice.payments)
  let status = invoice.status
  if (paid <= 0) status = 'SENT'
  else if (paid < payable) status = 'PARTIALLY_PAID'
  else status = 'PAID'
  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } })
}

// ---------- Quotations ----------

router.get('/quotations', async (req, res) => {
  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true },
  })
  const withTotals = quotations.map((q) => ({ ...q, totals: calculateTotals(q.items, q.discount) }))
  res.json({ success: true, quotations: withTotals })
})

router.get('/quotations/:id', async (req, res) => {
  const quotation = await prisma.quotation.findUnique({
    where: { id: req.params.id },
    include: { client: true, project: true },
  })
  if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found.' })
  res.json({ success: true, quotation: { ...quotation, totals: calculateTotals(quotation.items, quotation.discount) } })
})

router.post('/quotations', async (req, res) => {
  const {
    clientId, projectId, issueDate, validUntil, subject, billingType, items, discount, notes, terms,
    scopeOfWork, outOfScope, assumptions, revisionPolicy, warrantyPeriod, ipOwnership, techStack,
    currency, status,
  } = req.body ?? {}
  if (!clientId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'A client and at least one line item are required.' })
  }
  const quotationNumber = await nextDocumentNumber(prisma.quotation, 'QUO')
  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber,
      clientId,
      projectId: projectId || undefined,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      subject,
      billingType: billingType || undefined,
      items,
      discount: discount ?? 0,
      notes,
      terms,
      scopeOfWork,
      outOfScope,
      assumptions,
      revisionPolicy,
      warrantyPeriod,
      ipOwnership,
      techStack,
      currency: currency || undefined,
      status: status || undefined,
      createdById: req.user.id,
    },
  })
  res.status(201).json({ success: true, quotation })
})

router.put('/quotations/:id', async (req, res) => {
  const {
    clientId, projectId, issueDate, validUntil, subject, billingType, items, discount, notes, terms,
    scopeOfWork, outOfScope, assumptions, revisionPolicy, warrantyPeriod, ipOwnership, techStack,
    currency, status,
  } = req.body ?? {}
  const quotation = await prisma.quotation.update({
    where: { id: req.params.id },
    data: {
      clientId,
      projectId: projectId || undefined,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      subject,
      billingType,
      items,
      discount,
      notes,
      terms,
      scopeOfWork,
      outOfScope,
      assumptions,
      revisionPolicy,
      warrantyPeriod,
      ipOwnership,
      techStack,
      currency,
      status,
    },
  })
  res.json({ success: true, quotation })
})

router.delete('/quotations/:id', async (req, res) => {
  await prisma.quotation.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

router.post('/quotations/:id/convert-to-invoice', async (req, res) => {
  const quotation = await prisma.quotation.findUnique({ where: { id: req.params.id } })
  if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found.' })

  const invoiceNumber = await nextDocumentNumber(prisma.invoice, 'INV')
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId: quotation.clientId,
      projectId: quotation.projectId,
      quotationId: quotation.id,
      items: quotation.items,
      discount: quotation.discount,
      notes: quotation.notes,
      terms: quotation.terms,
      currency: quotation.currency,
      status: 'SENT',
      createdById: req.user.id,
    },
  })
  await prisma.quotation.update({ where: { id: quotation.id }, data: { status: 'ACCEPTED' } })

  // Seed the project's milestone tracker from the quoted phases, so progress
  // tracking starts pre-populated with what was actually quoted.
  if (quotation.billingType === 'MILESTONE' && quotation.projectId) {
    const existingCount = await prisma.projectMilestone.count({ where: { projectId: quotation.projectId } })
    if (existingCount === 0 && Array.isArray(quotation.items)) {
      await prisma.projectMilestone.createMany({
        data: quotation.items.map((item, index) => ({
          projectId: quotation.projectId,
          title: item.description || `Milestone ${index + 1}`,
          amount: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
          sequence: index,
        })),
      })
    }
  }

  res.status(201).json({ success: true, invoice })
})

function sellerFromSettings(settings) {
  return {
    businessName: settings.businessName,
    contactPerson: settings.businessContactPerson,
    address: settings.businessAddress,
    phone: settings.businessPhone,
    email: settings.emailFrom,
    gst: settings.businessGst,
    bankName: settings.bankName,
    accountNumber: settings.bankAccountNumber,
    ifsc: settings.bankIfsc,
    upiId: settings.upiId,
  }
}

function customerFromClient(client) {
  return { name: client.name, company: client.company, address: client.address, phone: client.phone, email: client.email, gst: client.gstNumber }
}

router.post('/quotations/:id/send', async (req, res) => {
  const quotation = await prisma.quotation.findUnique({ where: { id: req.params.id }, include: { client: true } })
  if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found.' })
  if (!quotation.client.email) return res.status(400).json({ success: false, message: 'Client has no email on file.' })

  const settings = await getSettings()
  const totals = calculateTotals(quotation.items, quotation.discount)
  const html = renderDocumentHtml({
    type: 'quotation',
    seller: sellerFromSettings(settings),
    customer: customerFromClient(quotation.client),
    details: { quotationNumber: quotation.quotationNumber, issueDate: quotation.issueDate?.toLocaleDateString(), validUntil: quotation.validUntil?.toLocaleDateString() },
    items: quotation.items,
    totals,
    billingType: quotation.billingType,
    notes: quotation.notes,
    terms: quotation.terms,
    sow: {
      scopeOfWork: quotation.scopeOfWork, outOfScope: quotation.outOfScope, assumptions: quotation.assumptions,
      revisionPolicy: quotation.revisionPolicy, warrantyPeriod: quotation.warrantyPeriod, ipOwnership: quotation.ipOwnership, techStack: quotation.techStack,
    },
  })

  try {
    const pdfBuffer = await htmlToPdfBuffer(html)
    const tpl = await getTemplate('QUOTATION_SENT')
    const { subject, html: coverHtml } = renderTemplate(tpl, {
      clientName: quotation.client.name,
      quotationNumber: quotation.quotationNumber,
      currency: quotation.currency,
      amount: totals.grandTotal.toFixed(2),
      validUntil: quotation.validUntil ? quotation.validUntil.toLocaleDateString() : '-',
      businessName: settings.businessName,
    })
    await deliverMail({
      to: quotation.client.email,
      subject,
      text: htmlToText(coverHtml),
      html: coverHtml,
      attachments: [{ filename: `${quotation.quotationNumber}.pdf`, content: pdfBuffer }],
      meta: { templateKey: 'QUOTATION_SENT', relatedType: 'QUOTATION', relatedId: quotation.id },
    })
    if (quotation.status === 'DRAFT') {
      await prisma.quotation.update({ where: { id: quotation.id }, data: { status: 'SENT' } })
    }
    res.json({ success: true, message: `Quotation emailed to ${quotation.client.email}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send quotation.' })
  }
})

// ---------- Invoices ----------

function withInvoiceTotals(invoice, payments) {
  const totals = calculateTotals(invoice.items, invoice.discount)
  const paid = sumPayments(payments)
  const tds = invoice.tdsApplicable ? calculateTds(totals.grandTotal, invoice.tdsRate) : null
  const payable = tds ? tds.netPayable : totals.grandTotal
  return { ...invoice, totals, tds, paid, due: payable - paid }
}

router.get('/invoices', async (req, res) => {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true, payments: true },
  })
  const withTotals = invoices.map(({ payments, ...invoice }) => withInvoiceTotals(invoice, payments))
  res.json({ success: true, invoices: withTotals })
})

router.get('/invoices/:id', async (req, res) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id },
    include: { client: true, project: true, milestone: true, payments: { orderBy: { paidOn: 'desc' } } },
  })
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' })
  const { payments, ...rest } = invoice
  res.json({ success: true, invoice: withInvoiceTotals(rest, payments) })
})

router.post('/invoices', async (req, res) => {
  const { clientId, projectId, milestoneId, dueDate, items, discount, notes, terms, tdsApplicable, tdsRate, currency, status } = req.body ?? {}
  if (!clientId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'A client and at least one line item are required.' })
  }
  const invoiceNumber = await nextDocumentNumber(prisma.invoice, 'INV')
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId,
      projectId: projectId || undefined,
      milestoneId: milestoneId || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      items,
      discount: discount ?? 0,
      notes,
      terms,
      tdsApplicable: Boolean(tdsApplicable),
      tdsRate: tdsRate ?? undefined,
      currency: currency || undefined,
      status: status || undefined,
      createdById: req.user.id,
    },
  })
  res.status(201).json({ success: true, invoice })
})

router.put('/invoices/:id', async (req, res) => {
  const { clientId, projectId, milestoneId, dueDate, items, discount, notes, terms, tdsApplicable, tdsRate, currency, status } = req.body ?? {}
  const invoice = await prisma.invoice.update({
    where: { id: req.params.id },
    data: {
      clientId,
      projectId: projectId || undefined,
      milestoneId: milestoneId || null,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      items,
      discount,
      notes,
      terms,
      tdsApplicable: tdsApplicable === undefined ? undefined : Boolean(tdsApplicable),
      tdsRate,
      currency,
      status,
    },
  })
  res.json({ success: true, invoice })
})

router.delete('/invoices/:id', async (req, res) => {
  await prisma.invoice.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

router.post('/invoices/:id/send', async (req, res) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { client: true } })
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' })
  if (!invoice.client.email) return res.status(400).json({ success: false, message: 'Client has no email on file.' })

  const settings = await getSettings()
  const totals = calculateTotals(invoice.items, invoice.discount)
  const tds = invoice.tdsApplicable ? calculateTds(totals.grandTotal, invoice.tdsRate) : null
  const html = renderDocumentHtml({
    type: 'invoice',
    seller: sellerFromSettings(settings),
    customer: customerFromClient(invoice.client),
    details: { invoiceNumber: invoice.invoiceNumber, issueDate: invoice.issueDate?.toLocaleDateString(), dueDate: invoice.dueDate?.toLocaleDateString() },
    items: invoice.items,
    totals,
    tds: tds ? { ...tds, applicable: true } : null,
    notes: invoice.notes,
    terms: invoice.terms,
    bankDetails: { bankName: settings.bankName, accountNumber: settings.bankAccountNumber, ifsc: settings.bankIfsc, upiId: settings.upiId },
  })

  try {
    const pdfBuffer = await htmlToPdfBuffer(html)
    const tpl = await getTemplate('INVOICE_SENT')
    const { subject, html: coverHtml } = renderTemplate(tpl, {
      clientName: invoice.client.name,
      invoiceNumber: invoice.invoiceNumber,
      currency: invoice.currency,
      amount: (tds ? tds.netPayable : totals.grandTotal).toFixed(2),
      dueDate: invoice.dueDate ? invoice.dueDate.toLocaleDateString() : '-',
      businessName: settings.businessName,
    })
    await deliverMail({
      to: invoice.client.email,
      subject,
      text: htmlToText(coverHtml),
      html: coverHtml,
      attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer }],
      meta: { templateKey: 'INVOICE_SENT', relatedType: 'INVOICE', relatedId: invoice.id },
    })
    if (invoice.status === 'DRAFT') {
      await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'SENT' } })
    }
    res.json({ success: true, message: `Invoice emailed to ${invoice.client.email}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send invoice.' })
  }
})

// ---------- Dashboard ----------

router.get('/dashboard/summary', async (req, res) => {
  const [invoices, projects] = await Promise.all([
    prisma.invoice.findMany({ include: { payments: true } }),
    prisma.project.findMany({ include: { payments: true } }),
  ])

  let totalInvoiced = 0
  let totalPaid = 0
  let overdueCount = 0
  const now = new Date()

  for (const invoice of invoices) {
    const totals = calculateTotals(invoice.items, invoice.discount)
    const paid = sumPayments(invoice.payments)
    totalInvoiced += totals.grandTotal
    totalPaid += paid
    if (invoice.dueDate && invoice.dueDate < now && paid < totals.grandTotal && invoice.status !== 'CANCELLED') {
      overdueCount += 1
    }
  }

  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length

  const dueFollowUps = await prisma.lead.count({
    where: { nextFollowUpAt: { lte: now }, status: { notIn: ['WON', 'LOST'] } },
  })

  res.json({
    success: true,
    summary: {
      totalInvoiced,
      totalPaid,
      totalDue: totalInvoiced - totalPaid,
      activeProjects,
      overdueInvoices: overdueCount,
      totalProjects: projects.length,
      totalClients: await prisma.client.count(),
      dueFollowUps,
    },
  })
})

// ---------- Users (admin-only) ----------

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
  })
  res.json({ success: true, users })
})

router.post('/users', async (req, res) => {
  const { name, username, email, password, role } = req.body ?? {}
  const trimmedUsername = String(username || '').trim().toLowerCase()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  if (!name || !trimmedUsername || !trimmedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Name, username, email, and password are required.' })
  }
  if (String(password).length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
  }
  const existing = await prisma.user.findFirst({ where: { OR: [{ username: trimmedUsername }, { email: trimmedEmail }] } })
  if (existing) {
    return res.status(409).json({ success: false, message: 'A user with that username or email already exists.' })
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, username: trimmedUsername, email: trimmedEmail, passwordHash, role: role === 'ADMIN' ? 'ADMIN' : 'STAFF' },
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
  })
  res.status(201).json({ success: true, user })
})

router.put('/users/:id', async (req, res) => {
  const { name, role, password } = req.body ?? {}
  const data = { name, role }
  if (password) {
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
    }
    data.passwordHash = await bcrypt.hash(password, 12)
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data,
    select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
  })
  res.json({ success: true, user })
})

router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own account.' })
  }
  await prisma.user.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ---------- Timesheets (admin review) ----------

router.get('/timesheets', async (req, res) => {
  const { userId, projectId, from, to } = req.query
  const where = {}
  if (userId) where.userId = String(userId)
  if (projectId) where.projectId = String(projectId)
  if (from || to) {
    where.date = {}
    if (from) where.date.gte = new Date(String(from))
    if (to) where.date.lte = new Date(String(to))
  }
  const timesheets = await prisma.timesheet.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { user: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } },
  })
  res.json({ success: true, timesheets })
})

router.post('/timesheets/remind', async (req, res) => {
  const userId = String(req.body?.userId ?? '')
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

  const settings = await getSettings()
  const tpl = await getTemplate('TIMESHEET_REMINDER')
  const { subject, html } = renderTemplate(tpl, { userName: user.name, businessName: settings.businessName })
  try {
    await deliverMail({
      to: user.email,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TIMESHEET_REMINDER', relatedType: 'TIMESHEET', relatedId: user.id },
    })
    res.json({ success: true, message: `Reminder sent to ${user.name}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send reminder.' })
  }
})

// ---------- Expense claims (admin review) ----------

router.get('/expenses', async (req, res) => {
  const { status, userId } = req.query
  const where = {}
  if (status) where.status = String(status)
  if (userId) where.userId = String(userId)
  const expenses = await prisma.expenseClaim.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } },
  })
  res.json({ success: true, expenses })
})

// Per-employee payables: what's still owed (approved, not yet reimbursed) and lifetime paid.
router.get('/expenses/summary', async (req, res) => {
  const expenses = await prisma.expenseClaim.findMany({
    where: { status: { in: ['APPROVED', 'REIMBURSED'] } },
    include: { user: { select: { id: true, name: true } } },
  })
  const byUser = new Map()
  for (const exp of expenses) {
    if (!byUser.has(exp.userId)) {
      byUser.set(exp.userId, { userId: exp.userId, userName: exp.user.name, owed: 0, totalReimbursed: 0 })
    }
    const entry = byUser.get(exp.userId)
    if (exp.status === 'APPROVED') {
      entry.owed += toNumber(exp.amount)
    } else {
      entry.totalReimbursed += toNumber(exp.reimbursedAmount ?? exp.amount)
    }
  }
  const summary = Array.from(byUser.values()).sort((a, b) => b.owed - a.owed)
  res.json({ success: true, summary })
})

const EXPENSE_STATUS_TEMPLATE_KEY = {
  APPROVED: 'EXPENSE_APPROVED',
  REJECTED: 'EXPENSE_REJECTED',
  REIMBURSED: 'EXPENSE_REIMBURSED',
}

router.put('/expenses/:id', async (req, res) => {
  const { status, reimbursedAmount } = req.body ?? {}
  if (!['APPROVED', 'REJECTED', 'REIMBURSED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' })
  }
  const existing = await prisma.expenseClaim.findUnique({ where: { id: req.params.id }, include: { user: true } })
  if (!existing) return res.status(404).json({ success: false, message: 'Expense claim not found.' })

  const data = { status }
  if (status === 'APPROVED') {
    data.approvedById = req.user.id
    data.approvedAt = new Date()
  }
  if (status === 'REIMBURSED') {
    const amount = reimbursedAmount === undefined || reimbursedAmount === null || reimbursedAmount === ''
      ? toNumber(existing.amount)
      : Number(reimbursedAmount)
    if (!(amount > 0)) {
      return res.status(400).json({ success: false, message: 'Reimbursed amount must be greater than zero.' })
    }
    data.reimbursedAt = new Date()
    data.reimbursedAmount = amount
  }
  const expense = await prisma.expenseClaim.update({ where: { id: req.params.id }, data })

  if (existing.user?.email) {
    const settings = await getSettings()
    const tpl = await getTemplate(EXPENSE_STATUS_TEMPLATE_KEY[status])
    const { subject, html } = renderTemplate(tpl, {
      userName: existing.user.name,
      currency: 'INR',
      amount: toNumber(status === 'REIMBURSED' ? expense.reimbursedAmount : expense.amount).toFixed(2),
      description: existing.description,
      businessName: settings.businessName,
    })
    sendMail({
      to: existing.user.email,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: EXPENSE_STATUS_TEMPLATE_KEY[status], relatedType: 'EXPENSE', relatedId: expense.id },
    })
  }

  res.json({ success: true, expense })
})

// ---------- Business expenses (GST, hosting, domains, salaries paid out) ----------

const BUSINESS_EXPENSE_CATEGORIES = ['GST', 'SERVER', 'DOMAIN', 'SALARY', 'SOFTWARE', 'OTHER']

router.get('/business-expenses', async (req, res) => {
  const { category, from, to } = req.query
  const where = {}
  if (category) where.category = String(category)
  if (from || to) {
    where.paidOn = {}
    if (from) where.paidOn.gte = new Date(String(from))
    if (to) where.paidOn.lte = new Date(String(to))
  }
  const expenses = await prisma.businessExpense.findMany({
    where,
    orderBy: { paidOn: 'desc' },
    include: { createdBy: { select: { id: true, name: true } } },
  })
  const total = expenses.reduce((sum, exp) => sum + toNumber(exp.amount), 0)
  res.json({ success: true, expenses, total })
})

router.post('/business-expenses', async (req, res) => {
  const { category, amount, paidOn, paidTo, description } = req.body ?? {}
  if (!BUSINESS_EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category.' })
  }
  const numericAmount = Number(amount)
  if (!(numericAmount > 0)) {
    return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' })
  }
  const expense = await prisma.businessExpense.create({
    data: {
      category,
      amount: numericAmount,
      paidOn: paidOn ? new Date(paidOn) : new Date(),
      paidTo: paidTo ? String(paidTo).trim() : null,
      description: description ? String(description).trim() : null,
      createdById: req.user.id,
    },
    include: { createdBy: { select: { id: true, name: true } } },
  })
  res.status(201).json({ success: true, expense })
})

router.put('/business-expenses/:id', async (req, res) => {
  const existing = await prisma.businessExpense.findUnique({ where: { id: req.params.id } })
  if (!existing) return res.status(404).json({ success: false, message: 'Expense not found.' })

  const { category, amount, paidOn, paidTo, description } = req.body ?? {}
  const data = {}
  if (category !== undefined) {
    if (!BUSINESS_EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category.' })
    }
    data.category = category
  }
  if (amount !== undefined) {
    const numericAmount = Number(amount)
    if (!(numericAmount > 0)) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' })
    }
    data.amount = numericAmount
  }
  if (paidOn !== undefined) data.paidOn = new Date(paidOn)
  if (paidTo !== undefined) data.paidTo = paidTo ? String(paidTo).trim() : null
  if (description !== undefined) data.description = description ? String(description).trim() : null

  const expense = await prisma.businessExpense.update({
    where: { id: req.params.id },
    data,
    include: { createdBy: { select: { id: true, name: true } } },
  })
  res.json({ success: true, expense })
})

router.delete('/business-expenses/:id', async (req, res) => {
  await prisma.businessExpense.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ---------- Leads ----------

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'QUALIFIED', 'WON', 'LOST']

const leadListInclude = {
  createdBy: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
}

router.get('/leads', async (req, res) => {
  const { status, assignedToId, dueFollowUps } = req.query
  const where = {}
  if (status && LEAD_STATUSES.includes(status)) where.status = status
  if (assignedToId) where.assignedToId = String(assignedToId)
  if (dueFollowUps === 'true') {
    where.nextFollowUpAt = { lte: new Date() }
    where.status = { notIn: ['WON', 'LOST'] }
  }
  const leads = await prisma.lead.findMany({
    where,
    orderBy: [{ nextFollowUpAt: 'asc' }, { createdAt: 'desc' }],
    include: leadListInclude,
  })
  res.json({ success: true, leads })
})

router.get('/leads/reminders/count', async (req, res) => {
  const count = await prisma.lead.count({
    where: { nextFollowUpAt: { lte: new Date() }, status: { notIn: ['WON', 'LOST'] } },
  })
  res.json({ success: true, count })
})

router.post('/leads', async (req, res) => {
  const { name, company, email, phone, source, notes, assignedToId } = req.body ?? {}
  const trimmedName = String(name ?? '').trim()
  if (!trimmedName) return res.status(400).json({ success: false, message: 'Name is required.' })

  const lead = await prisma.lead.create({
    data: {
      name: trimmedName,
      company: company ? String(company).trim() : null,
      email: email ? String(email).trim() : null,
      phone: phone ? String(phone).trim() : null,
      source: source ? String(source).trim() : null,
      notes: notes ? String(notes).trim() : null,
      assignedToId: assignedToId || undefined,
      createdById: req.user.id,
    },
    include: leadListInclude,
  })
  res.status(201).json({ success: true, lead })
})

router.get('/leads/:id', async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: {
      ...leadListInclude,
      calls: { orderBy: { calledAt: 'desc' }, include: { createdBy: { select: { id: true, name: true } } } },
      licenseRequest: true,
    },
  })
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' })
  res.json({ success: true, lead })
})

router.put('/leads/:id', async (req, res) => {
  const { name, company, email, phone, source, notes, status, assignedToId } = req.body ?? {}
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' })

  const data = {}
  if (name !== undefined) {
    const trimmed = String(name).trim()
    if (!trimmed) return res.status(400).json({ success: false, message: 'Name is required.' })
    data.name = trimmed
  }
  if (company !== undefined) data.company = company ? String(company).trim() : null
  if (email !== undefined) data.email = email ? String(email).trim() : null
  if (phone !== undefined) data.phone = phone ? String(phone).trim() : null
  if (source !== undefined) data.source = source ? String(source).trim() : null
  if (notes !== undefined) data.notes = notes ? String(notes).trim() : null
  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' })
    data.status = status
  }
  if (assignedToId !== undefined) data.assignedToId = assignedToId || null

  const updated = await prisma.lead.update({ where: { id: req.params.id }, data, include: leadListInclude })
  res.json({ success: true, lead: updated })
})

router.delete('/leads/:id', async (req, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

router.post('/leads/:id/convert', async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' })

  const client = await prisma.client.create({
    data: {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      createdById: req.user.id,
    },
  })
  await prisma.lead.update({ where: { id: lead.id }, data: { status: 'WON' } })
  res.status(201).json({ success: true, client })
})

router.post('/leads/:id/calls', async (req, res) => {
  const { calledAt, durationMinutes, notes, followUpNeeded, followUpAt } = req.body ?? {}
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' })

  const trimmedNotes = String(notes ?? '').trim()
  if (!trimmedNotes) return res.status(400).json({ success: false, message: 'Call notes are required.' })
  if (followUpNeeded && !followUpAt) {
    return res.status(400).json({ success: false, message: 'Pick a follow-up date/time.' })
  }

  const calledAtDate = calledAt ? new Date(calledAt) : new Date()
  const call = await prisma.leadCall.create({
    data: {
      leadId: lead.id,
      calledAt: calledAtDate,
      durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      notes: trimmedNotes,
      followUpNeeded: Boolean(followUpNeeded),
      followUpAt: followUpNeeded ? new Date(followUpAt) : null,
      createdById: req.user.id,
    },
  })

  const nextStatus = lead.status === 'NEW' ? 'CONTACTED' : lead.status
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      lastContactedAt: !lead.lastContactedAt || calledAtDate > lead.lastContactedAt ? calledAtDate : undefined,
      nextFollowUpAt: followUpNeeded ? call.followUpAt : lead.nextFollowUpAt,
      status: followUpNeeded ? 'FOLLOW_UP' : nextStatus,
    },
  })

  res.status(201).json({ success: true, call })
})

router.put('/leads/:id/calls/:callId', async (req, res) => {
  const { followUpDone } = req.body ?? {}
  const call = await prisma.leadCall.findUnique({ where: { id: req.params.callId } })
  if (!call || call.leadId !== req.params.id) return res.status(404).json({ success: false, message: 'Call not found.' })

  const updated = await prisma.leadCall.update({
    where: { id: call.id },
    data: { followUpDone: Boolean(followUpDone) },
  })

  if (followUpDone) {
    // Recompute the lead's next reminder from whatever pending follow-ups remain.
    const nextPending = await prisma.leadCall.findFirst({
      where: { leadId: req.params.id, followUpNeeded: true, followUpDone: false },
      orderBy: { followUpAt: 'asc' },
    })
    await prisma.lead.update({
      where: { id: req.params.id },
      data: { nextFollowUpAt: nextPending?.followUpAt ?? null },
    })
  }

  res.json({ success: true, call: updated })
})

// Calls the external license-generation service (server/licenseApi.js) and emails the resulting
// .lic file to the lead — the one-click fulfillment action from the offline-license build spec.
// On failure, records the error on LicenseRequest (visible in the UI for a retry) but leaves
// Lead.status untouched so a misconfigured API key doesn't silently mark a real sale as lost.
router.post('/leads/:id/license/generate', async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id }, include: { licenseRequest: true } })
  if (!lead || !lead.licenseRequest) {
    return res.status(404).json({ success: false, message: 'This lead has no license request.' })
  }
  if (lead.licenseRequest.status === 'FULFILLED') {
    return res.status(400).json({ success: false, message: 'A license has already been sent for this lead.' })
  }

  try {
    if (!lead.email) {
      throw new Error('This lead has no email address to send the license to.')
    }

    const data = await generateLicense({
      machineId: lead.licenseRequest.machineId,
      plan: PLAN_API_KEYS[lead.licenseRequest.plan],
      customerName: lead.company || lead.name,
    })

    const settings = await getSettings()
    const tpl = await getTemplate('LICENSE_DELIVERY')
    const { subject, html } = renderTemplate(tpl, {
      customerName: lead.company || lead.name,
      plan: lead.licenseRequest.plan,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : '-',
      businessName: settings.businessName,
    })

    await deliverMail({
      to: lead.email,
      subject,
      text: htmlToText(html),
      html,
      attachments: [{ filename: 'license.lic', content: Buffer.from(data.fileContents, 'utf-8') }],
      meta: { templateKey: 'LICENSE_DELIVERY', relatedType: 'LEAD', relatedId: lead.id },
    })

    const updatedRequest = await prisma.licenseRequest.update({
      where: { id: lead.licenseRequest.id },
      data: {
        status: 'FULFILLED',
        licenseId: data.licenseId || null,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        errorMessage: null,
      },
    })
    await prisma.lead.update({ where: { id: lead.id }, data: { status: 'WON' } })

    res.json({ success: true, licenseRequest: updatedRequest })
  } catch (error) {
    const updatedRequest = await prisma.licenseRequest.update({
      where: { id: lead.licenseRequest.id },
      data: { status: 'FAILED', errorMessage: error.message },
    })
    res.status(400).json({ success: false, message: error.message || 'Failed to generate license.', licenseRequest: updatedRequest })
  }
})

// ---------- Settings (SMTP + notification emails) ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.get('/settings', async (req, res) => {
  const settings = await getSettings()
  const { smtpPass, whatsappAccessToken, licenseApiKey, ...rest } = settings
  res.json({
    success: true,
    settings: {
      ...rest,
      smtpPassSet: Boolean(smtpPass),
      whatsappAccessTokenSet: Boolean(whatsappAccessToken),
      licenseApiKeySet: Boolean(licenseApiKey),
    },
  })
})

const BUSINESS_PROFILE_FIELDS = [
  'businessName', 'businessContactPerson', 'businessAddress', 'businessPhone', 'businessGst',
  'bankName', 'bankAccountNumber', 'bankIfsc', 'upiId', 'logoUrl',
]

const WHATSAPP_TEXT_FIELDS = ['whatsappPhoneNumberId', 'whatsappBusinessAccountId', 'whatsappApiVersion']

const LICENSE_PRICE_FIELDS = ['licensePlan3MoPrice', 'licensePlan6MoPrice', 'licensePlan1YrPrice']

router.put('/settings', async (req, res) => {
  const {
    smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, emailFrom, ticketNotifyEmail, enquiryNotifyEmail, enquiryReplyTo,
    whatsappEnabled, whatsappAccessToken, whatsappStaffNotifyNumber,
    licenseApiUrl, licenseApiKey, licenseDownloadUrl, licenseInstallGuideUrl,
  } = req.body ?? {}

  const data = {}
  if (smtpHost !== undefined) data.smtpHost = String(smtpHost).trim() || null
  if (smtpPort !== undefined) {
    const port = smtpPort === '' || smtpPort === null ? null : Number(smtpPort)
    if (port !== null && (!Number.isInteger(port) || port <= 0 || port > 65535)) {
      return res.status(400).json({ success: false, message: 'Invalid SMTP port.' })
    }
    data.smtpPort = port
  }
  if (smtpSecure !== undefined) data.smtpSecure = Boolean(smtpSecure)
  if (smtpUser !== undefined) data.smtpUser = String(smtpUser).trim() || null
  // Empty string means "leave the stored password alone" — the frontend never re-displays it,
  // so a blank field on save should not wipe out a previously configured password.
  if (smtpPass !== undefined && smtpPass !== '') data.smtpPass = String(smtpPass)

  for (const [key, value] of Object.entries({ emailFrom, ticketNotifyEmail, enquiryNotifyEmail, enquiryReplyTo })) {
    if (value === undefined) continue
    const trimmed = String(value).trim()
    if (trimmed && !EMAIL_RE.test(trimmed)) {
      return res.status(400).json({ success: false, message: `Invalid email: ${trimmed}` })
    }
    data[key] = trimmed || null
  }

  for (const key of BUSINESS_PROFILE_FIELDS) {
    if (req.body?.[key] === undefined) continue
    data[key] = String(req.body[key]).trim() || null
  }

  if (whatsappEnabled !== undefined) data.whatsappEnabled = Boolean(whatsappEnabled)
  for (const key of WHATSAPP_TEXT_FIELDS) {
    if (req.body?.[key] === undefined) continue
    data[key] = String(req.body[key]).trim() || null
  }
  // Same "empty string = leave alone" rule as smtpPass — the frontend never re-displays it.
  if (whatsappAccessToken !== undefined && whatsappAccessToken !== '') data.whatsappAccessToken = String(whatsappAccessToken)
  if (whatsappStaffNotifyNumber !== undefined) {
    const trimmed = String(whatsappStaffNotifyNumber).trim()
    if (trimmed && !normalizeWhatsAppNumber(trimmed)) {
      return res.status(400).json({ success: false, message: `Invalid WhatsApp number: ${trimmed}` })
    }
    data.whatsappStaffNotifyNumber = trimmed || null
  }

  if (licenseApiUrl !== undefined) data.licenseApiUrl = String(licenseApiUrl).trim() || null
  // Same "empty string = leave alone" rule as smtpPass/whatsappAccessToken above.
  if (licenseApiKey !== undefined && licenseApiKey !== '') data.licenseApiKey = String(licenseApiKey)
  if (licenseDownloadUrl !== undefined) data.licenseDownloadUrl = String(licenseDownloadUrl).trim() || null
  if (licenseInstallGuideUrl !== undefined) data.licenseInstallGuideUrl = String(licenseInstallGuideUrl).trim() || null
  for (const key of LICENSE_PRICE_FIELDS) {
    if (req.body?.[key] === undefined) continue
    const raw = req.body[key]
    const price = raw === '' || raw === null ? null : Number(raw)
    if (price !== null && (!Number.isInteger(price) || price < 0)) {
      return res.status(400).json({ success: false, message: `Invalid price for ${key}.` })
    }
    data[key] = price
  }

  await updateSettings(data)
  const settings = await getSettings()
  const { smtpPass: _pass, whatsappAccessToken: _token, licenseApiKey: _licenseKey, ...rest } = settings
  res.json({
    success: true,
    settings: {
      ...rest,
      smtpPassSet: Boolean(settings.smtpPass),
      whatsappAccessTokenSet: Boolean(settings.whatsappAccessToken),
      licenseApiKeySet: Boolean(settings.licenseApiKey),
    },
  })
})

router.post('/settings/test-email', async (req, res) => {
  const to = String(req.body?.to ?? '').trim()
  if (!EMAIL_RE.test(to)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email to send the test to.' })
  }
  try {
    await sendTestMail(to)
    res.json({ success: true, message: `Test email sent to ${to}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send test email.' })
  }
})

// ---------- Email templates ----------

const SAMPLE_VARS = {
  ticketNumber: 'TKT-2026-0001',
  subject: 'Sample ticket subject',
  status: 'RESOLVED',
  clientName: 'Jane Doe',
  description: 'This is a sample ticket description.',
  body: 'This is a sample reply body.',
  name: 'Jane Doe',
  company: 'Acme Co',
  city: 'Chennai',
  message: 'This is a sample enquiry message.',
  invoiceNumber: 'INV-2026-0001',
  quotationNumber: 'QUO-2026-0001',
  currency: 'INR',
  amount: '25000.00',
  dueDate: '31/12/2026',
  validUntil: '31/12/2026',
  businessName: 'Aadhirai Innovations',
  userName: 'Sample Staff',
}

const VARIABLES_BY_KEY = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.key, t.variables]))

router.get('/email-templates', async (req, res) => {
  const templates = await prisma.emailTemplate.findMany({ orderBy: [{ category: 'asc' }, { label: 'asc' }] })
  res.json({ success: true, templates: templates.map((t) => ({ ...t, variables: VARIABLES_BY_KEY[t.key] || [] })) })
})

router.put('/email-templates/:key', async (req, res) => {
  const { subject, bodyHtml } = req.body ?? {}
  const trimmedSubject = String(subject ?? '').trim()
  const trimmedBody = String(bodyHtml ?? '').trim()
  if (!trimmedSubject || !trimmedBody) {
    return res.status(400).json({ success: false, message: 'Subject and body are required.' })
  }
  const template = await prisma.emailTemplate.update({
    where: { key: req.params.key },
    data: { subject: trimmedSubject, bodyHtml: trimmedBody },
  })
  res.json({ success: true, template })
})

router.post('/email-templates/:key/test', async (req, res) => {
  const to = String(req.body?.to ?? '').trim()
  if (!EMAIL_RE.test(to)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email to send the test to.' })
  }
  try {
    const tpl = await getTemplate(req.params.key)
    const { subject, html } = renderTemplate(tpl, SAMPLE_VARS)
    await deliverMail({
      to,
      subject: `[TEST] ${subject}`,
      text: htmlToText(html),
      html,
      meta: { templateKey: tpl.key, relatedType: 'TEST' },
    })
    res.json({ success: true, message: `Test email sent to ${to}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send test email.' })
  }
})

// ---------- Email log ----------

router.get('/email-logs', async (req, res) => {
  const { status, relatedType, search, page = '1', pageSize = '50' } = req.query
  const where = {}
  if (status) where.status = String(status)
  if (relatedType) where.relatedType = String(relatedType)
  if (search) {
    where.OR = [
      { subject: { contains: String(search), mode: 'insensitive' } },
      { to: { has: String(search) } },
    ]
  }
  const take = Math.min(Number(pageSize) || 50, 200)
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take

  const [logs, total] = await Promise.all([
    prisma.emailLog.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take }),
    prisma.emailLog.count({ where }),
  ])
  res.json({ success: true, logs, total, page: Number(page) || 1, pageSize: take })
})

// ---------- WhatsApp templates ----------

router.get('/whatsapp-templates', async (req, res) => {
  const rows = await prisma.whatsAppTemplate.findMany({ orderBy: { label: 'asc' } })
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]))
  const templates = DEFAULT_WHATSAPP_TEMPLATES.map((t) => ({
    key: t.key,
    label: t.label,
    templateName: byKey[t.key]?.templateName ?? null,
    language: byKey[t.key]?.language ?? 'en_US',
    params: paramsForKey(t.key),
  }))
  res.json({ success: true, templates })
})

router.put('/whatsapp-templates/:key', async (req, res) => {
  if (!paramsForKey(req.params.key).length) {
    return res.status(404).json({ success: false, message: 'Unknown WhatsApp template key.' })
  }
  const { templateName, language } = req.body ?? {}
  const template = await prisma.whatsAppTemplate.upsert({
    where: { key: req.params.key },
    create: {
      key: req.params.key,
      label: DEFAULT_WHATSAPP_TEMPLATES.find((t) => t.key === req.params.key)?.label || req.params.key,
      templateName: String(templateName ?? '').trim() || null,
      language: String(language ?? '').trim() || 'en_US',
    },
    update: {
      templateName: String(templateName ?? '').trim() || null,
      language: String(language ?? '').trim() || 'en_US',
    },
  })
  res.json({ success: true, template })
})

router.post('/whatsapp-templates/:key/test', async (req, res) => {
  const to = String(req.body?.to ?? '').trim()
  if (!normalizeWhatsAppNumber(to)) {
    return res.status(400).json({ success: false, message: 'Enter a valid WhatsApp number to send the test to.' })
  }
  const params = paramsForKey(req.params.key)
  if (!params.length) {
    return res.status(404).json({ success: false, message: 'Unknown WhatsApp template key.' })
  }
  try {
    await deliverWhatsApp({
      to,
      templateKey: req.params.key,
      components: params.map((p) => SAMPLE_VARS[p] ?? ''),
      meta: { relatedType: 'TEST' },
    })
    res.json({ success: true, message: `Test WhatsApp message sent to ${to}.` })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Failed to send test WhatsApp message.' })
  }
})

// ---------- WhatsApp log ----------

router.get('/whatsapp-logs', async (req, res) => {
  const { status, relatedType, search, page = '1', pageSize = '50' } = req.query
  const where = {}
  if (status) where.status = String(status)
  if (relatedType) where.relatedType = String(relatedType)
  if (search) {
    where.OR = [
      { to: { contains: String(search), mode: 'insensitive' } },
      { templateKey: { contains: String(search), mode: 'insensitive' } },
    ]
  }
  const take = Math.min(Number(pageSize) || 50, 200)
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take

  const [logs, total] = await Promise.all([
    prisma.whatsAppLog.findMany({ where, orderBy: { sentAt: 'desc' }, skip, take }),
    prisma.whatsAppLog.count({ where }),
  ])
  res.json({ success: true, logs, total, page: Number(page) || 1, pageSize: take })
})

export default router
