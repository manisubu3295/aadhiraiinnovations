import express from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { calculateTotals, calculateTds } from '../../shared/pricing.js'

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

router.put('/expenses/:id', async (req, res) => {
  const { status, reimbursedAmount } = req.body ?? {}
  if (!['APPROVED', 'REJECTED', 'REIMBURSED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' })
  }
  const existing = await prisma.expenseClaim.findUnique({ where: { id: req.params.id } })
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

export default router
