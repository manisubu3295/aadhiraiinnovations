import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getForUser, saveForUser, toPublicShape } from '../userWhatsappSettings.js'

const router = express.Router()

// ---------- Meta webhook (public — Meta calls these directly, no session cookie) ----------
// Each user gets their own callback URL (rather than one shared endpoint) since each configures
// a separate Meta App/Business Manager with its own webhook verify token.

router.get('/webhook/:userId', async (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  const settings = await getForUser(req.params.userId)
  if (mode === 'subscribe' && settings && token === settings.webhookVerifyToken) {
    return res.status(200).send(challenge)
  }
  return res.sendStatus(403)
})

// Meta requires a fast 200 ack on every event. Inbound message/status handling is a future
// feature — this just confirms delivery reaches a configured user and logs the raw payload.
router.post('/webhook/:userId', async (req, res) => {
  const settings = await getForUser(req.params.userId)
  if (!settings) return res.sendStatus(404)
  console.log(`WhatsApp webhook event for user ${req.params.userId}:`, JSON.stringify(req.body))
  res.sendStatus(200)
})

// ---------- Self-service settings (ADMIN/STAFF only, scoped to the logged-in user) ----------

router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

router.get('/settings', async (req, res) => {
  const settings = await getForUser(req.user.id)
  res.json({ success: true, settings: toPublicShape(settings) })
})

router.put('/settings', async (req, res) => {
  const { phoneNumberId, accessToken, webhookVerifyToken } = req.body ?? {}

  if (!String(phoneNumberId || '').trim()) {
    return res.status(400).json({ success: false, message: 'Phone Number ID is required.' })
  }
  if (!String(webhookVerifyToken || '').trim()) {
    return res.status(400).json({ success: false, message: 'Webhook verify token is required.' })
  }

  try {
    const row = await saveForUser(req.user.id, { phoneNumberId, accessToken, webhookVerifyToken })
    res.json({ success: true, settings: toPublicShape(row) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to save WhatsApp settings.' })
  }
})

export default router
