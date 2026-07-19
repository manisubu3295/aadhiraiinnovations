import express from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { nextTicketNumber, saveAttachments, attachmentDiskPath } from '../ticketUtils.js'
import { sendMail } from '../mailer.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole('CLIENT'))

// Client sessions only carry { id, role } — load the linked client + email once per request.
router.use(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user?.clientId) {
    return res.status(403).json({ success: false, message: 'No client account linked to this login.' })
  }
  req.clientUser = user
  next()
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 5 },
})

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const ticketListInclude = {
  project: { select: { id: true, name: true } },
  assignedTo: { select: { id: true, name: true } },
}

router.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { clientId: req.clientUser.clientId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })
  res.json({ success: true, projects })
})

router.get('/tickets', async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { clientId: req.clientUser.clientId },
    orderBy: { createdAt: 'desc' },
    include: ticketListInclude,
  })
  res.json({ success: true, tickets })
})

router.get('/tickets/:id', async (req, res) => {
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
  if (!ticket || ticket.clientId !== req.clientUser.clientId) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' })
  }
  res.json({ success: true, ticket })
})

router.post('/tickets', upload.array('attachments', 5), async (req, res) => {
  const { subject = '', description = '', priority, projectId } = req.body ?? {}
  const trimmedSubject = String(subject).trim()
  const trimmedDescription = String(description).trim()

  if (!trimmedSubject || !trimmedDescription) {
    return res.status(400).json({ success: false, message: 'Subject and description are required.' })
  }
  if (priority && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority.' })
  }
  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project || project.clientId !== req.clientUser.clientId) {
      return res.status(400).json({ success: false, message: 'Invalid project.' })
    }
  }

  const ticketNumber = await nextTicketNumber()
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      subject: trimmedSubject,
      description: trimmedDescription,
      priority: priority || undefined,
      clientId: req.clientUser.clientId,
      projectId: projectId || undefined,
      createdById: req.clientUser.id,
    },
  })
  await saveAttachments({ files: req.files, ticketId: ticket.id, uploadedById: req.clientUser.id })

  const notifyTo = process.env.TICKET_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL
  if (notifyTo) {
    sendMail({
      to: notifyTo,
      subject: `New ticket ${ticketNumber}: ${trimmedSubject}`,
      text: `${req.clientUser.name} raised a new ticket (${ticketNumber}):\n\n${trimmedDescription}`,
      html: `<p><strong>${req.clientUser.name}</strong> raised a new ticket (${ticketNumber}):</p><p>${trimmedDescription.replace(/\n/g, '<br/>')}</p>`,
    })
  }
  if (req.clientUser.email) {
    sendMail({
      to: req.clientUser.email,
      subject: `We received your ticket ${ticketNumber}`,
      text: `Thanks — we've received your ticket "${trimmedSubject}" (${ticketNumber}) and will respond soon.`,
      html: `<p>Thanks — we've received your ticket <strong>${trimmedSubject}</strong> (${ticketNumber}) and will respond soon.</p>`,
    })
  }

  res.status(201).json({ success: true, ticket })
})

router.post('/tickets/:id/messages', upload.array('attachments', 5), async (req, res) => {
  const { body = '' } = req.body ?? {}
  const trimmedBody = String(body).trim()
  if (!trimmedBody) {
    return res.status(400).json({ success: false, message: 'Message body is required.' })
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } })
  if (!ticket || ticket.clientId !== req.clientUser.clientId) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' })
  }

  const message = await prisma.ticketMessage.create({
    data: { body: trimmedBody, ticketId: ticket.id, authorId: req.clientUser.id },
  })
  await saveAttachments({ files: req.files, messageId: message.id, uploadedById: req.clientUser.id })

  const full = await prisma.ticketMessage.findUnique({
    where: { id: message.id },
    include: { author: { select: { id: true, name: true, role: true } }, attachments: true },
  })

  const notifyTo = process.env.TICKET_NOTIFY_EMAIL || process.env.ENQUIRY_TO_EMAIL
  if (notifyTo) {
    sendMail({
      to: notifyTo,
      subject: `[${ticket.ticketNumber}] Client replied`,
      text: `${req.clientUser.name} replied on ticket "${ticket.subject}" (${ticket.ticketNumber}):\n\n${trimmedBody}`,
      html: `<p><strong>${req.clientUser.name}</strong> replied on ticket <strong>${ticket.subject}</strong> (${ticket.ticketNumber}):</p><p>${trimmedBody.replace(/\n/g, '<br/>')}</p>`,
    })
  }

  res.status(201).json({ success: true, message: full })
})

router.get('/tickets/:id/attachments/:attachmentId', async (req, res) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } })
  if (!ticket || ticket.clientId !== req.clientUser.clientId) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' })
  }

  const attachment = await prisma.ticketAttachment.findUnique({ where: { id: req.params.attachmentId } })
  if (!attachment) return res.status(404).json({ success: false, message: 'Attachment not found.' })

  const belongsToTicket = attachment.ticketId === ticket.id
  const belongsViaMessage = attachment.messageId
    ? (await prisma.ticketMessage.findUnique({ where: { id: attachment.messageId } }))?.ticketId === ticket.id
    : false
  if (!belongsToTicket && !belongsViaMessage) {
    return res.status(404).json({ success: false, message: 'Attachment not found.' })
  }

  res.download(attachmentDiskPath(attachment.filePath), attachment.fileName)
})

export default router
