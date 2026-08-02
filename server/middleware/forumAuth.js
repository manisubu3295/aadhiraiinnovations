import jwt from 'jsonwebtoken'
import { AUTH_COOKIE } from './auth.js'

const STAFF_ROLES = new Set(['ADMIN', 'STAFF', 'SUPER_ADMIN'])

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
// ADMIN/STAFF (reusing their existing admin_session cookie) — this tries forum auth first, then
// falls back to a staff-only admin_session check, and 401s only if neither identity resolves.
// Deliberately excludes CLIENT: a client-portal login should post under its own forum identity
// via POST /forum/client-login (see server/routes/forum.js), not be mislabeled as staff here.
// Route handlers branch on req.forumUser vs req.user to decide which author field to set.
export function requireForumOrStaffAuth(req, res, next) {
  const forumUser = verifyForumToken(req.cookies?.[FORUM_AUTH_COOKIE])
  if (forumUser) {
    req.forumUser = forumUser
    return next()
  }

  const token = req.cookies?.[AUTH_COOKIE]
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (STAFF_ROLES.has(payload.role)) {
        req.user = { id: payload.sub, role: payload.role }
        return next()
      }
    } catch {
      // fall through to 401 below
    }
  }
  return res.status(401).json({ success: false, message: 'Not authenticated.' })
}
