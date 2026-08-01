import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = express.Router()
// Same convention as server/routes/admin.js: ADMIN-only (SUPER_ADMIN passes automatically
// via requireRole's implementation).
router.use(requireAuth)
router.use(requireRole('ADMIN'))

function paginationParams(req) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25))
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize }
}

// ---------- Forum users ----------
// Deliberately paginated (unlike src/admin/pages/UsersPage.jsx's internal-staff list, which
// fetches everything unpaginated) — public sign-ups can grow far larger than the staff roster.

router.get('/users', async (req, res) => {
  const { page, pageSize, skip, take } = paginationParams(req)
  const q = String(req.query.q || '').trim()
  const where = q
    ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] }
    : {}

  const [total, forumUsers] = await prisma.$transaction([
    prisma.forumUser.count({ where }),
    prisma.forumUser.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true, name: true, email: true, status: true, createdAt: true, lastLoginAt: true,
        _count: { select: { questions: true, answers: true } },
      },
    }),
  ])

  res.json({ success: true, forumUsers, page, pageSize, total })
})

router.put('/users/:id', async (req, res) => {
  const { status } = req.body ?? {}
  if (!['ACTIVE', 'BANNED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' })
  }
  const forumUser = await prisma.forumUser.update({
    where: { id: req.params.id },
    data: { status },
    select: { id: true, name: true, email: true, status: true, createdAt: true, lastLoginAt: true },
  })
  res.json({ success: true, forumUser })
})

// ---------- Forum questions/answers (moderation) ----------

router.get('/questions', async (req, res) => {
  const { page, pageSize, skip, take } = paginationParams(req)
  const q = String(req.query.q || '').trim()
  const where = q ? { title: { contains: q, mode: 'insensitive' } } : {}

  const [total, questions] = await prisma.$transaction([
    prisma.forumQuestion.count({ where }),
    prisma.forumQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true, slug: true, title: true, createdAt: true, hiddenAt: true,
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { answers: true } },
      },
    }),
  ])

  res.json({ success: true, questions, page, pageSize, total })
})

router.put('/questions/:id', async (req, res) => {
  const { hidden, hiddenReason } = req.body ?? {}
  const question = await prisma.forumQuestion.update({
    where: { id: req.params.id },
    data: {
      hiddenAt: hidden ? new Date() : null,
      hiddenReason: hidden ? (hiddenReason ? String(hiddenReason).trim() : null) : null,
    },
  })
  res.json({ success: true, question })
})

router.put('/answers/:id', async (req, res) => {
  const { hidden, hiddenReason } = req.body ?? {}
  const answer = await prisma.forumAnswer.update({
    where: { id: req.params.id },
    data: {
      hiddenAt: hidden ? new Date() : null,
      hiddenReason: hidden ? (hiddenReason ? String(hiddenReason).trim() : null) : null,
    },
  })
  res.json({ success: true, answer })
})

// ---------- Categories ----------

router.get('/categories', async (req, res) => {
  const categories = await prisma.forumCategory.findMany({ orderBy: { name: 'asc' } })
  res.json({ success: true, categories })
})

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

router.post('/categories', async (req, res) => {
  const { name = '' } = req.body ?? {}
  const trimmedName = String(name).trim()
  if (!trimmedName) {
    return res.status(400).json({ success: false, message: 'Category name is required.' })
  }
  const slug = slugify(trimmedName)
  const existing = await prisma.forumCategory.findFirst({ where: { OR: [{ name: trimmedName }, { slug }] } })
  if (existing) {
    return res.status(409).json({ success: false, message: 'A category with this name already exists.' })
  }
  const category = await prisma.forumCategory.create({ data: { name: trimmedName, slug } })
  res.status(201).json({ success: true, category })
})

router.delete('/categories/:id', async (req, res) => {
  const inUse = await prisma.forumQuestion.count({ where: { categoryId: req.params.id } })
  if (inUse > 0) {
    return res.status(400).json({ success: false, message: 'Cannot delete a category that has questions in it.' })
  }
  await prisma.forumCategory.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})

export default router
