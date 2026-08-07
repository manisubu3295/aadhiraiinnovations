import express from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { nextTicketNumber, saveAttachments, attachmentDiskPath, parseCcEmails, logTicketActivity } from '../ticketUtils.js'
import { sendMail } from '../mailer.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendWhatsApp, getStaffNotifyNumbers } from '../whatsapp.js'

const router = express.Router()
router.use(requireAuth)
router.use(requireRole('CLIENT'))

// Client sessions only carry { id, role } — load the linked client + email once per request.
// The client relation is also loaded here (not just clientId) since WhatsApp notifications
// send to the company-level Client.phone, not a per-user number.
router.use(async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { client: true } })
  if (!user?.clientId) {
    return res.status(403).json({ success: false, message: 'No client account linked to this login.' })
  }
  req.clientUser = user
  req.client = user.client
  next()
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 5 },
})

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
// Mirrors tickets.js — shown by default whenever no explicit status filter is picked.
const NOT_CLOSED_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

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
  const { status, projectId, mine } = req.query
  const where = { clientId: req.clientUser.clientId }
  if (status && STATUSES.includes(status)) {
    where.status = status
  } else if (!status) {
    where.status = { in: NOT_CLOSED_STATUSES }
  }
  if (projectId) where.projectId = projectId
  // "My tickets" — this client account may have several logged-in contacts, so scope to
  // tickets this particular contact raised rather than the whole company's tickets.
  if (mine === '1' || mine === 'true') where.createdById = req.clientUser.id

  const tickets = await prisma.ticket.findMany({
    where,
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
      activities: {
        orderBy: { createdAt: 'asc' },
        include: { actor: { select: { id: true, name: true, role: true } } },
      },
    },
  })
  if (!ticket || ticket.clientId !== req.clientUser.clientId) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' })
  }
  res.json({ success: true, ticket })
})

router.post('/tickets', upload.array('attachments', 5), async (req, res) => {
  const { subject = '', description = '', priority, projectId, ccEmails } = req.body ?? {}
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
  let parsedCcEmails
  try {
    parsedCcEmails = parseCcEmails(ccEmails)
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
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
      ccEmails: parsedCcEmails,
    },
  })
  await saveAttachments({ files: req.files, ticketId: ticket.id, uploadedById: req.clientUser.id })
  await logTicketActivity({ ticketId: ticket.id, actorId: req.clientUser.id, type: 'CREATED' })

  const settings = await getSettings()
  if (settings.ticketNotifyEmail) {
    const tpl = await getTemplate('TICKET_NEW_STAFF_NOTIFY')
    const { subject, html } = renderTemplate(tpl, {
      ticketNumber,
      subject: trimmedSubject,
      clientName: req.clientUser.name,
      description: trimmedDescription.replace(/\n/g, '<br/>'),
    })
    sendMail({
      to: settings.ticketNotifyEmail,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_NEW_STAFF_NOTIFY', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }
  const newTicketStaffNumbers = new Set(await getStaffNotifyNumbers())
  if (settings.whatsappStaffNotifyNumber) newTicketStaffNumbers.add(settings.whatsappStaffNotifyNumber)
  for (const number of newTicketStaffNumbers) {
    sendWhatsApp({
      to: number,
      templateKey: 'TICKET_CREATED_STAFF',
      components: [req.client?.name || req.clientUser.name, ticketNumber, trimmedSubject],
      meta: { relatedType: 'TICKET', relatedId: ticket.id },
    })
  }
  if (req.clientUser.email) {
    const tpl = await getTemplate('TICKET_CLIENT_ACK')
    const { subject, html } = renderTemplate(tpl, { ticketNumber, subject: trimmedSubject })
    sendMail({
      to: req.clientUser.email,
      cc: parsedCcEmails.length ? parsedCcEmails : undefined,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_CLIENT_ACK', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }
  if (req.client?.phone) {
    sendWhatsApp({
      to: req.client.phone,
      templateKey: 'TICKET_CREATED_CLIENT',
      components: [req.client.name, ticketNumber, trimmedSubject],
      meta: { relatedType: 'TICKET', relatedId: ticket.id },
    })
  }

  res.status(201).json({ success: true, ticket })
})

router.put('/tickets/:id/cc-emails', async (req, res) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } })
  if (!ticket || ticket.clientId !== req.clientUser.clientId) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' })
  }
  let parsedCcEmails
  try {
    parsedCcEmails = parseCcEmails(req.body?.ccEmails)
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message })
  }
  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { ccEmails: parsedCcEmails },
  })
  res.json({ success: true, ticket: updated })
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

  const settings = await getSettings()
  if (settings.ticketNotifyEmail) {
    const tpl = await getTemplate('TICKET_CLIENT_REPLIED_STAFF_NOTIFY')
    const { subject, html } = renderTemplate(tpl, {
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      clientName: req.clientUser.name,
      body: trimmedBody.replace(/\n/g, '<br/>'),
    })
    sendMail({
      to: settings.ticketNotifyEmail,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_CLIENT_REPLIED_STAFF_NOTIFY', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }
  const replyStaffNumbers = new Set(await getStaffNotifyNumbers())
  if (settings.whatsappStaffNotifyNumber) replyStaffNumbers.add(settings.whatsappStaffNotifyNumber)
  for (const number of replyStaffNumbers) {
    sendWhatsApp({
      to: number,
      templateKey: 'TICKET_CLIENT_REPLIED_STAFF',
      components: [req.client?.name || req.clientUser.name, ticket.ticketNumber, ticket.subject],
      meta: { relatedType: 'TICKET', relatedId: ticket.id },
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
