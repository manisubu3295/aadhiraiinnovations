import jwt from 'jsonwebtoken'

export const AUTH_COOKIE = 'admin_session'

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  }
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE]
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired or invalid.' })
  }
}

export function requireRole(role) {
  const allowed = Array.isArray(role) ? role : [role]
  return (req, res, next) => {
    if (!allowed.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized.' })
    }
    next()
  }
}
