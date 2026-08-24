import express from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendConversationMessage, sendConversationMedia, uploadOutboundMedia } from '../userWhatsappSettings.js'
import { mediaDiskPath, storeOutboundMediaFile, sanitizeOriginalFilename } from '../whatsappMedia.js'
import { MAX_MEDIA_SIZES } from '../whatsappMediaLimits.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

// Matches server/routes/tickets.js's multer config style. Cap the multer-level limit at the
// largest per-type cap (DOCUMENT) — the real per-type cap is enforced afterward by
// validateOutboundMedia (inside uploadOutboundMedia), this is just an upper bound so an
// oversized upload is rejected before it's fully buffered into memory.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MEDIA_SIZES.DOCUMENT, files: 1 },
})

const contactInclude = {
  client: { select: { id: true, name: true } },
  lead: { select: { id: true, name: true } },
}

router.get('/', async (req, res) => {
  const conversations = await prisma.whatsAppConversation.findMany({
    where: { userId: req.user.id },
    orderBy: { lastMessageAt: 'desc' },
    include: contactInclude,
  })
  res.json({ success: true, conversations })
})

router.get('/:id/messages', async (req, res) => {
  const conversation = await prisma.whatsAppConversation.findUnique({
    where: { id: req.params.id },
    include: contactInclude,
  })
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' })
  }

  const messages = await prisma.whatsAppMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    include: { media: true },
  })

  // Opening the thread marks it read.
  if (conversation.unreadCount > 0) {
    await prisma.whatsAppConversation.update({ where: { id: conversation.id }, data: { unreadCount: 0 } })
  }

  res.json({ success: true, conversation, messages })
})

// Serves the actual downloaded bytes for one message's media — private (never a public/static
// path), gated behind the same ownership check as the rest of this router. Images/audio/video
// are served inline (no Content-Disposition) so <img>/<audio>/<video> tags can render them
// directly; documents force a download with their original filename.
router.get('/:id/messages/:messageId/media', async (req, res) => {
  const conversation = await prisma.whatsAppConversation.findUnique({ where: { id: req.params.id } })
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' })
  }

  const message = await prisma.whatsAppMessage.findUnique({
    where: { id: req.params.messageId },
    include: { media: true },
  })
  if (!message || message.conversationId !== conversation.id) {
    return res.status(404).json({ success: false, message: 'Message not found.' })
  }
  if (!message.media || message.media.downloadStatus !== 'COMPLETE' || !message.media.storageKey) {
    return res.status(404).json({ success: false, message: 'Media is not available yet.' })
  }

  const filePath = mediaDiskPath(message.media.storageKey)
  const contentType = message.media.mimeType || 'application/octet-stream'
  if (message.messageType === 'DOCUMENT') {
    return res.download(filePath, message.media.originalFilename || 'document', { headers: { 'Content-Type': contentType } })
  }
  return res.sendFile(filePath, { headers: { 'Content-Type': contentType } })
})

router.post('/:id/messages', async (req, res) => {
  const { body } = req.body ?? {}
  const trimmed = String(body || '').trim()
  if (!trimmed) {
    return res.status(400).json({ success: false, message: 'Message body is required.' })
  }

  const conversation = await prisma.whatsAppConversation.findUnique({ where: { id: req.params.id } })
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' })
  }

  try {
    const message = await sendConversationMessage(conversation, trimmed, { sentByUserId: req.user.id })
    // A human is actively replying — the bot must go quiet so it doesn't talk over them.
    await prisma.chatFlowSession.updateMany({
      where: { conversationId: conversation.id, status: 'ACTIVE' },
      data: { status: 'PAUSED' },
    })
    res.status(201).json({ success: true, message })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to send message.' })
  }
})

function inferMessageType(mimeType) {
  const top = String(mimeType || '').split('/')[0]
  if (top === 'image') return 'IMAGE'
  if (top === 'video') return 'VIDEO'
  if (top === 'audio') return 'AUDIO'
  return 'DOCUMENT'
}

// Outbound media — a separate route from POST /:id/messages (text) rather than overloading it,
// so the existing text-reply flow above is completely untouched. Supports both send paths (item
// 9): a multipart `file` field (Upload path — the file's bytes go to Meta first, then its media
// id is sent) or a `link` field with no file (Link path — a publicly reachable HTTPS url; Meta's
// fetcher is unauthenticated, so a private/signed url will fail here, which is expected).
router.post('/:id/media', upload.single('file'), async (req, res) => {
  const conversation = await prisma.whatsAppConversation.findUnique({ where: { id: req.params.id } })
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' })
  }

  const { caption, link, messageType: explicitType } = req.body ?? {}
  const trimmedCaption = String(caption || '').trim() || null

  try {
    let message
    if (req.file) {
      const messageType = explicitType || inferMessageType(req.file.mimetype)
      const mediaId = await uploadOutboundMedia(req.user.id, {
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        messageType,
      })
      const storageKey = await storeOutboundMediaFile(req.user.id, req.file.buffer, req.file.mimetype)
      message = await sendConversationMedia(
        conversation,
        {
          messageType,
          source: { mediaId },
          caption: trimmedCaption,
          filename: messageType === 'DOCUMENT' ? sanitizeOriginalFilename(req.file.originalname) : null,
          storageKey,
          mimeType: req.file.mimetype,
          fileSize: req.file.buffer.length,
        },
        { sentByUserId: req.user.id },
      )
    } else if (String(link || '').trim()) {
      const trimmedLink = String(link).trim()
      if (!/^https:\/\//i.test(trimmedLink)) {
        return res.status(400).json({ success: false, message: 'Link must be a public https:// URL — Meta fetches it unauthenticated.' })
      }
      if (!explicitType) {
        return res.status(400).json({ success: false, message: 'messageType is required when sending by link.' })
      }
      message = await sendConversationMedia(
        conversation,
        { messageType: explicitType, source: { link: trimmedLink }, caption: trimmedCaption },
        { sentByUserId: req.user.id },
      )
    } else {
      return res.status(400).json({ success: false, message: 'Attach a file or provide a link.' })
    }

    await prisma.chatFlowSession.updateMany({
      where: { conversationId: conversation.id, status: 'ACTIVE' },
      data: { status: 'PAUSED' },
    })
    res.status(201).json({ success: true, message })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to send media.' })
  }
})

export default router
