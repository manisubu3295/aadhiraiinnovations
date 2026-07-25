import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendConversationMessage } from '../userWhatsappSettings.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

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
  })

  // Opening the thread marks it read.
  if (conversation.unreadCount > 0) {
    await prisma.whatsAppConversation.update({ where: { id: conversation.id }, data: { unreadCount: 0 } })
  }

  res.json({ success: true, conversation, messages })
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

export default router
