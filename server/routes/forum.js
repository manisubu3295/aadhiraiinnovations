import express from 'express'
import multer from 'multer'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import {
  FORUM_AUTH_COOKIE,
  signForumSession,
  forumCookieOptions,
  requireForumAuth,
  optionalForumAuth,
  requireForumOrStaffAuth,
} from '../middleware/forumAuth.js'
import { saveForumAttachments, attachmentDiskPath, slugifyTitle, forumUploadFileFilter, FORUM_UPLOAD_LIMITS } from '../forumUtils.js'
import { sendMail } from '../mailer.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'

const router = express.Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = (process.env.SITE_URL || 'https://aadhiraiinnovations.com').replace(/\/$/, '')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: FORUM_UPLOAD_LIMITS,
  fileFilter: forumUploadFileFilter,
})

// Same shape as loginLimiter/enquiryLimiter/subscribeLimiter used elsewhere in this codebase.
function makeLimiter(message) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  })
}

const registerLimiter = makeLimiter('Too many sign-up attempts. Try again later.')
const loginLimiter = makeLimiter('Too many login attempts. Try again later.')
const postLimiter = makeLimiter('Too many posts from this account. Try again later.')

const forumUserPublicSelect = { id: true, name: true, status: true }

const questionSummarySelect = {
  id: true,
  slug: true,
  title: true,
  createdAt: true,
  viewCount: true,
  acceptedAnswerId: true,
  author: { select: forumUserPublicSelect },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { answers: true } },
}

// ---------- Auth ----------

router.post('/register', registerLimiter, async (req, res) => {
  const { name = '', email = '', password = '' } = req.body ?? {}
  const trimmedName = String(name).trim()
  const trimmedEmail = String(email).trim().toLowerCase()

  if (!trimmedName || !trimmedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })
  }
  if (!EMAIL_RE.test(trimmedEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' })
  }
  if (String(password).length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
  }

  const existing = await prisma.forumUser.findUnique({ where: { email: trimmedEmail } })
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const forumUser = await prisma.forumUser.create({
    data: { name: trimmedName, email: trimmedEmail, passwordHash },
  })

  const token = signForumSession(forumUser)
  res.cookie(FORUM_AUTH_COOKIE, token, forumCookieOptions())
  res.status(201).json({ success: true, forumUser: { id: forumUser.id, name: forumUser.name, email: forumUser.email } })
})

router.post('/login', loginLimiter, async (req, res) => {
  const { email = '', password = '' } = req.body ?? {}
  const trimmedEmail = String(email).trim().toLowerCase()

  if (!trimmedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' })
  }

  const forumUser = await prisma.forumUser.findUnique({ where: { email: trimmedEmail } })
  if (!forumUser || forumUser.status === 'BANNED') {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' })
  }
  const valid = await bcrypt.compare(password, forumUser.passwordHash)
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' })
  }

  await prisma.forumUser.update({ where: { id: forumUser.id }, data: { lastLoginAt: new Date() } })

  const token = signForumSession(forumUser)
  res.cookie(FORUM_AUTH_COOKIE, token, forumCookieOptions())
  res.json({ success: true, forumUser: { id: forumUser.id, name: forumUser.name, email: forumUser.email } })
})

// Lets an existing client-portal login (User, role CLIENT) post on the forum under their
// portal credentials instead of creating a separate forum account — see
// ForumUser.linkedUserId in prisma/schema.prisma. First use auto-links (or creates) a forum
// identity for that client; every login after that reuses the same linked ForumUser.
router.post('/client-login', loginLimiter, async (req, res) => {
  const { username = '', password = '' } = req.body ?? {}
  const trimmedUsername = String(username).trim().toLowerCase()

  if (!trimmedUsername || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' })
  }

  const user = await prisma.user.findUnique({ where: { username: trimmedUsername } })
  if (!user || user.role !== 'CLIENT') {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' })
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' })
  }

  let forumUser = await prisma.forumUser.findUnique({ where: { linkedUserId: user.id } })
  if (!forumUser) {
    // Reuse an existing self-signed-up forum account sharing this client's email if one
    // exists (same person), otherwise mint a new linked forum identity for them.
    const existingByEmail = await prisma.forumUser.findUnique({ where: { email: user.email } })
    if (existingByEmail) {
      forumUser = await prisma.forumUser.update({ where: { id: existingByEmail.id }, data: { linkedUserId: user.id } })
    } else {
      // Never used to log in directly — client-login always authenticates against the
      // linked User's own password instead.
      const placeholderHash = await bcrypt.hash(crypto.randomUUID(), 12)
      forumUser = await prisma.forumUser.create({
        data: { name: user.name, email: user.email, passwordHash: placeholderHash, linkedUserId: user.id },
      })
    }
  }
  if (forumUser.status === 'BANNED') {
    return res.status(403).json({ success: false, message: 'This account is not allowed to use the forum.' })
  }

  await prisma.forumUser.update({ where: { id: forumUser.id }, data: { lastLoginAt: new Date() } })

  const token = signForumSession(forumUser)
  res.cookie(FORUM_AUTH_COOKIE, token, forumCookieOptions())
  res.json({ success: true, forumUser: { id: forumUser.id, name: forumUser.name, email: forumUser.email } })
})

router.post('/logout', (req, res) => {
  res.clearCookie(FORUM_AUTH_COOKIE, { ...forumCookieOptions(), maxAge: undefined })
  res.json({ success: true })
})

router.get('/me', requireForumAuth, async (req, res) => {
  const forumUser = await prisma.forumUser.findUnique({ where: { id: req.forumUser.id } })
  if (!forumUser || forumUser.status === 'BANNED') {
    return res.status(401).json({ success: false, message: 'Not authenticated.' })
  }
  res.json({ success: true, forumUser: { id: forumUser.id, name: forumUser.name, email: forumUser.email } })
})

// ---------- Categories ----------

router.get('/categories', async (req, res) => {
  const categories = await prisma.forumCategory.findMany({ orderBy: { name: 'asc' } })
  res.json({ success: true, categories })
})

// ---------- Questions ----------

router.get('/questions', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20))
  const { category, q } = req.query

  const where = { hiddenAt: null }
  if (category) where.category = { slug: String(category) }
  if (q) {
    const term = String(q).trim()
    if (term) where.title = { contains: term, mode: 'insensitive' }
  }

  const [total, questions] = await prisma.$transaction([
    prisma.forumQuestion.count({ where }),
    prisma.forumQuestion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: questionSummarySelect,
    }),
  ])

  res.json({ success: true, questions, page, pageSize, total })
})

// Trigram-similarity "did you mean" suggestions while composing a new question's title —
// see the CREATE EXTENSION pg_trgm + GIN index added in the add_forum migration.
router.get('/questions/similar', async (req, res) => {
  const title = String(req.query.title || '').trim()
  if (title.length < 3) {
    return res.json({ success: true, questions: [] })
  }
  const matches = await prisma.$queryRaw`
    SELECT id, slug, title, similarity(title, ${title}) AS score
    FROM forum_questions
    WHERE "hiddenAt" IS NULL AND similarity(title, ${title}) > 0.15
    ORDER BY score DESC
    LIMIT 5
  `
  res.json({ success: true, questions: matches.map((m) => ({ id: m.id, slug: m.slug, title: m.title })) })
})

router.get('/questions/:slug', optionalForumAuth, async (req, res) => {
  const question = await prisma.forumQuestion.findUnique({
    where: { slug: req.params.slug },
    include: {
      author: { select: forumUserPublicSelect },
      category: true,
      attachments: true,
      answers: {
        where: { hiddenAt: null },
        orderBy: { createdAt: 'asc' },
        include: {
          authorForumUser: { select: forumUserPublicSelect },
          authorStaffUser: { select: { id: true, name: true, role: true } },
          attachments: true,
        },
      },
    },
  })
  if (!question || question.hiddenAt) {
    return res.status(404).json({ success: false, message: 'Question not found.' })
  }

  prisma.forumQuestion.update({ where: { id: question.id }, data: { viewCount: { increment: 1 } } }).catch(() => {})

  res.json({ success: true, question, viewer: { forumUserId: req.forumUser?.id ?? null } })
})

router.post('/questions', requireForumAuth, postLimiter, upload.array('attachments', 3), async (req, res, next) => {
  try {
    const { title = '', body = '', categoryId = '' } = req.body ?? {}
    const trimmedTitle = String(title).trim()
    const trimmedBody = String(body).trim()

    if (!trimmedTitle || !trimmedBody || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title, body, and category are required.' })
    }

    const forumUser = await prisma.forumUser.findUnique({ where: { id: req.forumUser.id } })
    if (!forumUser || forumUser.status === 'BANNED') {
      return res.status(403).json({ success: false, message: 'This account is not allowed to post.' })
    }
    const category = await prisma.forumCategory.findUnique({ where: { id: categoryId } })
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category.' })
    }

    const slug = slugifyTitle(trimmedTitle)
    const question = await prisma.forumQuestion.create({
      data: { slug, title: trimmedTitle, body: trimmedBody, authorId: forumUser.id, categoryId: category.id },
    })
    await saveForumAttachments({ files: req.files, questionId: question.id, uploadedByForumUserId: forumUser.id })

    const settings = await getSettings()
    if (settings.forumNotifyEmail) {
      const tpl = await getTemplate('FORUM_NEW_QUESTION_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, {
        title: trimmedTitle,
        authorName: forumUser.name,
        category: category.name,
        url: `${SITE_URL}/forum/questions/${slug}`,
      })
      sendMail({
        to: settings.forumNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'FORUM_NEW_QUESTION_STAFF_NOTIFY', relatedType: 'FORUM_QUESTION', relatedId: question.id },
      })
    }

    res.status(201).json({ success: true, question })
  } catch (err) {
    next(err)
  }
})

// ---------- Answers ----------

router.post('/questions/:id/answers', requireForumOrStaffAuth, postLimiter, upload.array('attachments', 3), async (req, res, next) => {
  try {
    const { body = '' } = req.body ?? {}
    const trimmedBody = String(body).trim()
    if (!trimmedBody) {
      return res.status(400).json({ success: false, message: 'Answer body is required.' })
    }

    const question = await prisma.forumQuestion.findUnique({ where: { id: req.params.id } })
    if (!question || question.hiddenAt) {
      return res.status(404).json({ success: false, message: 'Question not found.' })
    }

    let authorForumUserId = null
    let authorStaffUserId = null
    let authorName

    if (req.forumUser) {
      const forumUser = await prisma.forumUser.findUnique({ where: { id: req.forumUser.id } })
      if (!forumUser || forumUser.status === 'BANNED') {
        return res.status(403).json({ success: false, message: 'This account is not allowed to post.' })
      }
      authorForumUserId = forumUser.id
      authorName = forumUser.name
    } else {
      authorStaffUserId = req.user.id
      const staffUser = await prisma.user.findUnique({ where: { id: req.user.id } })
      authorName = staffUser?.name || 'Aadhirai Support'
    }

    const answer = await prisma.forumAnswer.create({
      data: { body: trimmedBody, questionId: question.id, authorForumUserId, authorStaffUserId },
    })
    await saveForumAttachments({
      files: req.files,
      answerId: answer.id,
      uploadedByForumUserId: authorForumUserId ?? undefined,
      uploadedByStaffUserId: authorStaffUserId ?? undefined,
    })

    const settings = await getSettings()
    if (settings.forumNotifyEmail) {
      const tpl = await getTemplate('FORUM_NEW_ANSWER_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, {
        authorName,
        questionTitle: question.title,
        url: `${SITE_URL}/forum/questions/${question.slug}`,
      })
      sendMail({
        to: settings.forumNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'FORUM_NEW_ANSWER_STAFF_NOTIFY', relatedType: 'FORUM_ANSWER', relatedId: answer.id },
      })
    }

    res.status(201).json({ success: true, answer })
  } catch (err) {
    next(err)
  }
})

router.post('/questions/:id/accept-answer/:answerId', requireForumOrStaffAuth, async (req, res) => {
  const question = await prisma.forumQuestion.findUnique({ where: { id: req.params.id } })
  if (!question || question.hiddenAt) {
    return res.status(404).json({ success: false, message: 'Question not found.' })
  }
  const isStaff = Boolean(req.user)
  const isAuthor = req.forumUser?.id === question.authorId
  if (!isStaff && !isAuthor) {
    return res.status(403).json({ success: false, message: 'Only the question author or staff can accept an answer.' })
  }

  const answer = await prisma.forumAnswer.findUnique({ where: { id: req.params.answerId } })
  if (!answer || answer.questionId !== question.id || answer.hiddenAt) {
    return res.status(404).json({ success: false, message: 'Answer not found.' })
  }

  const updated = await prisma.forumQuestion.update({
    where: { id: question.id },
    data: { acceptedAnswerId: answer.id },
  })
  res.json({ success: true, question: updated })
})

// ---------- Attachments ----------

router.get('/attachments/:id', async (req, res) => {
  const attachment = await prisma.forumAttachment.findUnique({
    where: { id: req.params.id },
    include: { question: true, answer: true },
  })
  if (!attachment) return res.status(404).json({ success: false, message: 'Attachment not found.' })
  const hidden = attachment.question?.hiddenAt || attachment.answer?.hiddenAt
  if (hidden) return res.status(404).json({ success: false, message: 'Attachment not found.' })

  res.download(attachmentDiskPath(attachment.filePath), attachment.fileName)
})

// Multer errors (oversized/unsupported file) land here rather than the generic 500 handler in server.js.
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || /Unsupported file type/.test(err?.message || '')) {
    return res.status(400).json({ success: false, message: err.message })
  }
  next(err)
})

export default router
