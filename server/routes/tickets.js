import express from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { saveAttachments, attachmentDiskPath } from '../ticketUtils.js'
import { sendMail } from '../mailer.js'

const router = express.Router()
// Ticket handling is shared by ADMIN and STAFF — clients use /api/client instead.
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 5 },
})

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const ticketListInclude = {
  client: true,
  project: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
}

router.get('/', async (req, res) => {
  const { status, priority, assignedToId } = req.query
  const where = {}
  if (status && STATUSES.includes(status)) where.status = status
  if (priority && PRIORITIES.includes(priority)) where.priority = priority
  if (assignedToId) where.assignedToId = assignedToId

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: ticketListInclude,
  })
  res.json({ success: true, tickets })
})

router.get('/:id', async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      ...ticketListInclude,
      attachments: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, name: true, role: true } },
          attachments: true,
        },
      },
    },
  })
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' })
  res.json({ success: true, ticket })
})

router.put('/:id', async (req, res) => {
  const { status, priority, assignedToId } = req.body ?? {}
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id }, include: { createdBy: true } })
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' })

  const data = {}
  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' })
    }
    data.status = status
    if (status === 'RESOLVED' && !ticket.resolvedAt) data.resolvedAt = new Date()
    if (status === 'CLOSED' && !ticket.closedAt) data.closedAt = new Date()
  }
  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority.' })
    }
    data.priority = priority
  }
  if (assignedToId !== undefined) {
    data.assignedToId = assignedToId || null
  }

  const updated = await prisma.ticket.update({
    where: { id: req.params.id },
    data,
    include: ticketListInclude,
  })

  if (status !== undefined && status !== ticket.status && ticket.createdBy?.email) {
    sendMail({
      to: ticket.createdBy.email,
      subject: `[${ticket.ticketNumber}] Status updated: ${status}`,
      text: `Your ticket "${ticket.subject}" (${ticket.ticketNumber}) status changed to ${status}.`,
      html: `<p>Your ticket <strong>${ticket.subject}</strong> (${ticket.ticketNumber}) status changed to <strong>${status}</strong>.</p>`,
    })
  }

  res.json({ success: true, ticket: updated })
})

router.post('/:id/messages', upload.array('attachments', 5), async (req, res) => {
  const { body = '' } = req.body ?? {}
  const trimmedBody = String(body).trim()
  if (!trimmedBody) {
    return res.status(400).json({ success: false, message: 'Message body is required.' })
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id }, include: { createdBy: true } })
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' })

  const message = await prisma.ticketMessage.create({
    data: { body: trimmedBody, ticketId: ticket.id, authorId: req.user.id },
  })
  await saveAttachments({ files: req.files, messageId: message.id, uploadedById: req.user.id })

  const full = await prisma.ticketMessage.findUnique({
    where: { id: message.id },
    include: { author: { select: { id: true, name: true, role: true } }, attachments: true },
  })

  if (ticket.createdBy?.email) {
    sendMail({
      to: ticket.createdBy.email,
      subject: `[${ticket.ticketNumber}] New reply on your ticket`,
      text: `A new reply was posted on your ticket "${ticket.subject}" (${ticket.ticketNumber}):\n\n${trimmedBody}`,
      html: `<p>A new reply was posted on your ticket <strong>${ticket.subject}</strong> (${ticket.ticketNumber}):</p><p>${trimmedBody.replace(/\n/g, '<br/>')}</p>`,
    })
  }

  res.status(201).json({ success: true, message: full })
})

router.get('/:id/attachments/:attachmentId', async (req, res) => {
  const attachment = await prisma.ticketAttachment.findUnique({ where: { id: req.params.attachmentId } })
  if (!attachment) return res.status(404).json({ success: false, message: 'Attachment not found.' })

  const belongsToTicket = attachment.ticketId === req.params.id
  const belongsViaMessage = attachment.messageId
    ? (await prisma.ticketMessage.findUnique({ where: { id: attachment.messageId } }))?.ticketId === req.params.id
    : false
  if (!belongsToTicket && !belongsViaMessage) {
    return res.status(404).json({ success: false, message: 'Attachment not found.' })
  }

  res.download(attachmentDiskPath(attachment.filePath), attachment.fileName)
})

export default router
