import jwt from 'jsonwebtoken'
import { requireAuth as requireStaffAuth } from './auth.js'

// Deliberately separate from the admin_session cookie (server/middleware/auth.js) — forum
// accounts are public self-registrations (ForumUser), not staff/admin/CLIENT logins, and must
// never be able to satisfy a requireAuth/requireRole check meant for internal accounts. The
// `kind: 'forum'` claim is a belt-and-suspenders guard against cross-cookie confusion.
export const FORUM_AUTH_COOKIE = 'forum_session'

export function signForumSession(forumUser) {
  return jwt.sign(
    { sub: forumUser.id, kind: 'forum' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export function forumCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  }
}

function verifyForumToken(token) {
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload.kind !== 'forum') return null
    return { id: payload.sub }
  } catch {
    return null
  }
}

export function requireForumAuth(req, res, next) {
  const forumUser = verifyForumToken(req.cookies?.[FORUM_AUTH_COOKIE])
  if (!forumUser) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' })
  }
  req.forumUser = forumUser
  next()
}

export function optionalForumAuth(req, res, next) {
  req.forumUser = verifyForumToken(req.cookies?.[FORUM_AUTH_COOKIE])
  next()
}

// Answering/accepting an answer is allowed for either a logged-in forum user OR a logged-in
// staff/admin (reusing their existing admin_session cookie) — this tries forum auth first, then
// falls back to staff auth, and 401s only if neither identity resolves. Route handlers branch on
// req.forumUser vs req.user to decide which author field to set.
export function requireForumOrStaffAuth(req, res, next) {
  const forumUser = verifyForumToken(req.cookies?.[FORUM_AUTH_COOKIE])
  if (forumUser) {
    req.forumUser = forumUser
    return next()
  }
  return requireStaffAuth(req, res, next)
}
