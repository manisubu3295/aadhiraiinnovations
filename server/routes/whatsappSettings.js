import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { normalizeWhatsAppNumber } from '../whatsapp.js'
import { getForUser, saveForUser, sendTestMessage, toPublicShape } from '../userWhatsappSettings.js'
import { recordInboundMessage, recordStatusUpdate } from '../whatsappConversations.js'
import { advanceFlow } from '../chatFlowEngine.js'

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

// Meta requires a fast 200 ack on every event, so this responds immediately and does its work
// without making Meta wait — parsing/persistence failures are logged, never surfaced as a
// non-2xx (a non-2xx just makes Meta retry the same payload, which recordInboundMessage's
// metaMessageId dedup already handles safely, but there's no reason to invite it).
router.post('/webhook/:userId', async (req, res) => {
  res.sendStatus(200)

  const settings = await getForUser(req.params.userId)
  if (!settings) return

  try {
    const entries = req.body?.entry || []
    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const value = change.value || {}
        for (const metaMessage of value.messages || []) {
          const result = await recordInboundMessage(req.params.userId, metaMessage)
          // null means this exact message was already recorded (Meta retry) — don't re-run the bot.
          if (result) {
            advanceFlow(result.conversation.id, result.message).catch((err) =>
              console.error('Flow engine error:', err),
            )
          }
        }
        for (const status of value.statuses || []) {
          await recordStatusUpdate(status)
        }
      }
    }
  } catch (error) {
    console.error('Failed to process WhatsApp webhook payload:', error)
  }
})

// ---------- Self-service settings (ADMIN/STAFF only, scoped to the logged-in user) ----------

router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

router.get('/settings', async (req, res) => {
  const [settings, user] = await Promise.all([
    getForUser(req.user.id),
    prisma.user.findUnique({ where: { id: req.user.id }, select: { whatsappNumber: true } }),
  ])
  res.json({ success: true, settings: { ...toPublicShape(settings), whatsappNumber: user?.whatsappNumber || '' } })
})

router.put('/settings', async (req, res) => {
  const { phoneNumberId, accessToken, webhookVerifyToken, whatsappNumber } = req.body ?? {}

  // Meta credentials (phoneNumberId/accessToken/webhookVerifyToken) and the personal
  // notification number are independent — a staff member can set either without the other,
  // so credentials are only validated/saved when phoneNumberId is actually present.
  const wantsCredentials = phoneNumberId !== undefined
  if (wantsCredentials) {
    if (!String(phoneNumberId || '').trim()) {
      return res.status(400).json({ success: false, message: 'Phone Number ID is required.' })
    }
    if (!String(webhookVerifyToken || '').trim()) {
      return res.status(400).json({ success: false, message: 'Webhook verify token is required.' })
    }
  }

  let normalizedNotifyNumber
  if (whatsappNumber !== undefined) {
    const trimmed = String(whatsappNumber).trim()
    if (trimmed) {
      normalizedNotifyNumber = normalizeWhatsAppNumber(trimmed)
      if (!normalizedNotifyNumber) {
        return res.status(400).json({ success: false, message: `Invalid WhatsApp number: ${trimmed}` })
      }
    } else {
      normalizedNotifyNumber = null
    }
  }

  try {
    const [row] = await Promise.all([
      wantsCredentials ? saveForUser(req.user.id, { phoneNumberId, accessToken, webhookVerifyToken }) : getForUser(req.user.id),
      normalizedNotifyNumber !== undefined
        ? prisma.user.update({ where: { id: req.user.id }, data: { whatsappNumber: normalizedNotifyNumber } })
        : Promise.resolve(),
    ])
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { whatsappNumber: true } })
    res.json({ success: true, settings: { ...toPublicShape(row), whatsappNumber: user?.whatsappNumber || '' } })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to save WhatsApp settings.' })
  }
})

router.post('/settings/test', async (req, res) => {
  const { to, message } = req.body ?? {}
  if (!String(to || '').trim()) {
    return res.status(400).json({ success: false, message: 'Enter a recipient WhatsApp number.' })
  }
  if (!String(message || '').trim()) {
    return res.status(400).json({ success: false, message: 'Enter a message to send.' })
  }
  try {
    await sendTestMessage(req.user.id, { to, message })
    res.json({ success: true, message: `Test WhatsApp message sent to ${to}.` })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to send WhatsApp message.' })
  }
})

export default router
