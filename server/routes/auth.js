import express from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { requireAuth, signSession, cookieOptions, AUTH_COOKIE } from '../middleware/auth.js'

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
})

router.post('/login', loginLimiter, async (req, res) => {
  const { username = '', password = '' } = req.body ?? {}
  const trimmedUsername = String(username).trim().toLowerCase()

  if (!trimmedUsername || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' })
  }

  const user = await prisma.user.findUnique({ where: { username: trimmedUsername } })
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid username or password.' })
  }

  const token = signSession(user)
  res.cookie(AUTH_COOKIE, token, cookieOptions())
  res.json({ success: true, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role } })
})

router.post('/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined })
  res.json({ success: true })
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' })
  }
  res.json({ success: true, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role } })
})

export default router
