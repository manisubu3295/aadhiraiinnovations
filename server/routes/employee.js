import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

// Lightweight project picker — no client or financial fields, available to any logged-in user.
router.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, status: true },
  })
  res.json({ success: true, projects })
})

// Lightweight client picker — needed so staff can raise a ticket on a client's behalf.
router.get('/clients', async (req, res) => {
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, company: true },
  })
  res.json({ success: true, clients })
})

// ---------- Timesheets (own entries only) ----------

router.get('/timesheets', async (req, res) => {
  const timesheets = await prisma.timesheet.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
    include: { project: { select: { id: true, name: true } } },
  })
  res.json({ success: true, timesheets })
})

router.post('/timesheets', async (req, res) => {
  const { projectId, date, hours, taskDescription, billable } = req.body ?? {}
  if (!projectId || !hours || Number(hours) <= 0 || !String(taskDescription || '').trim()) {
    return res.status(400).json({ success: false, message: 'Project, hours, and a task description are required.' })
  }
  const timesheet = await prisma.timesheet.create({
    data: {
      userId: req.user.id,
      projectId,
      date: date ? new Date(date) : undefined,
      hours,
      taskDescription,
      billable: billable === undefined ? undefined : Boolean(billable),
    },
  })
  res.status(201).json({ success: true, timesheet })
})

router.put('/timesheets/:id', async (req, res) => {
  const existing = await prisma.timesheet.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Timesheet entry not found.' })
  }
  const { projectId, date, hours, taskDescription, billable } = req.body ?? {}
  const timesheet = await prisma.timesheet.update({
    where: { id: req.params.id },
    data: {
      projectId,
      date: date ? new Date(date) : undefined,
      hours,
      taskDescription,
      billable: billable === undefined ? undefined : Boolean(billable),
    },
  })
  res.json({ success: true, timesheet })
})

router.delete('/timesheets/:id', async (req, res) => {
  const existing = await prisma.timesheet.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Timesheet entry not found.' })
  }
  await prisma.timesheet.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

// ---------- Expense claims (own entries only; status changes are admin-only) ----------

router.get('/expenses', async (req, res) => {
  const expenses = await prisma.expenseClaim.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: { project: { select: { id: true, name: true } } },
  })
  res.json({ success: true, expenses })
})

router.post('/expenses', async (req, res) => {
  const { projectId, category, amount, expenseDate, description } = req.body ?? {}
  if (!amount || Number(amount) <= 0 || !String(description || '').trim()) {
    return res.status(400).json({ success: false, message: 'Amount and a description are required.' })
  }
  const expense = await prisma.expenseClaim.create({
    data: {
      userId: req.user.id,
      projectId: projectId || undefined,
      category: category || undefined,
      amount,
      expenseDate: expenseDate ? new Date(expenseDate) : undefined,
      description,
    },
  })
  res.status(201).json({ success: true, expense })
})

export default router
