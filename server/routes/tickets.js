import express from 'express'
import multer from 'multer'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { nextTicketNumber, saveAttachments, attachmentDiskPath, parseCcEmails, logTicketActivity } from '../ticketUtils.js'
import { sendMail } from '../mailer.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendWhatsApp } from '../whatsapp.js'

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

// Statuses treated as "still open" by the openOnly/mine quick filters — RESOLVED is deliberately
// excluded from CLOSED-adjacent grouping but also not "open" in the sense of needing action.
const OPEN_STATUSES = ['OPEN', 'IN_PROGRESS']

router.get('/', async (req, res) => {
  const { status, priority, assignedToId, projectId, clientId, mine, openOnly } = req.query
  const where = {}
  if (status && STATUSES.includes(status)) {
    where.status = status
  } else if (openOnly === '1' || openOnly === 'true') {
    where.status = { in: OPEN_STATUSES }
  }
  if (priority && PRIORITIES.includes(priority)) where.priority = priority
  if (projectId) where.projectId = projectId
  if (clientId) where.clientId = clientId
  if (mine === '1' || mine === 'true') {
    where.assignedToId = req.user.id
  } else if (assignedToId) {
    where.assignedToId = assignedToId
  }

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: ticketListInclude,
  })
  res.json({ success: true, tickets })
})

// Staff/admin picker for the assignment dropdown — must come before /:id or "assignable-users" would match as an id.
router.get('/assignable-users', async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'STAFF', 'SUPER_ADMIN'] } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  })
  res.json({ success: true, users })
})

router.post('/', upload.array('attachments', 5), async (req, res) => {
  const { subject = '', description = '', priority, clientId, projectId, assignedToId, ccEmails } = req.body ?? {}
  const trimmedSubject = String(subject).trim()
  const trimmedDescription = String(description).trim()

  if (!trimmedSubject || !trimmedDescription) {
    return res.status(400).json({ success: false, message: 'Subject and description are required.' })
  }
  if (!clientId) {
    return res.status(400).json({ success: false, message: 'Client is required.' })
  }
  if (priority && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority.' })
  }
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client) return res.status(400).json({ success: false, message: 'Invalid client.' })

  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project || project.clientId !== clientId) {
      return res.status(400).json({ success: false, message: 'Invalid project.' })
    }
  }
  if (assignedToId) {
    const assignee = await prisma.user.findUnique({ where: { id: assignedToId } })
    if (!assignee || !['ADMIN', 'STAFF', 'SUPER_ADMIN'].includes(assignee.role)) {
      return res.status(400).json({ success: false, message: 'Invalid assignee.' })
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
      clientId,
      projectId: projectId || undefined,
      assignedToId: assignedToId || undefined,
      createdById: req.user.id,
      ccEmails: parsedCcEmails,
    },
    include: ticketListInclude,
  })
  await saveAttachments({ files: req.files, ticketId: ticket.id, uploadedById: req.user.id })
  await logTicketActivity({ ticketId: ticket.id, actorId: req.user.id, type: 'CREATED' })

  // Staff/admin logging a ticket on the client's behalf (e.g. a phone call) still needs to
  // reach the client and whoever it's assigned to — unlike the client-portal creation path,
  // nothing here notifies anyone by default otherwise.
  if (client.email) {
    const tpl = await getTemplate('TICKET_CLIENT_ACK')
    const { subject: renderedSubject, html } = renderTemplate(tpl, { ticketNumber, subject: trimmedSubject })
    sendMail({
      to: client.email,
      cc: parsedCcEmails.length ? parsedCcEmails : undefined,
      subject: renderedSubject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_CLIENT_ACK', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }
  if (ticket.assignedTo?.email) {
    const tpl = await getTemplate('TICKET_ASSIGNED_STAFF')
    const { subject: renderedSubject, html } = renderTemplate(tpl, {
      staffName: ticket.assignedTo.name,
      ticketNumber,
      subject: trimmedSubject,
      clientName: client.name,
    })
    sendMail({
      to: ticket.assignedTo.email,
      subject: renderedSubject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_ASSIGNED_STAFF', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }

  res.status(201).json({ success: true, ticket })
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
      activities: {
        orderBy: { createdAt: 'asc' },
        include: { actor: { select: { id: true, name: true, role: true } } },
      },
    },
  })
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' })
  res.json({ success: true, ticket })
})

router.put('/:id', async (req, res) => {
  const { status, priority, assignedToId, ccEmails } = req.body ?? {}
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: { createdBy: true, client: true, assignedTo: true },
  })
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
  let newAssignee = null
  if (assignedToId !== undefined) {
    if (assignedToId) {
      newAssignee = await prisma.user.findUnique({ where: { id: assignedToId } })
      if (!newAssignee || !['ADMIN', 'STAFF', 'SUPER_ADMIN'].includes(newAssignee.role)) {
        return res.status(400).json({ success: false, message: 'Invalid assignee.' })
      }
    }
    data.assignedToId = assignedToId || null
  }
  if (ccEmails !== undefined) {
    try {
      data.ccEmails = parseCcEmails(ccEmails)
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message })
    }
  }

  // Diff against the pre-update ticket so the Activity tab shows one row per field that
  // actually changed, not per field the client happened to send.
  const activityEntries = []
  if (status !== undefined && status !== ticket.status) {
    activityEntries.push({ type: 'STATUS_CHANGED', field: 'status', oldValue: ticket.status, newValue: status })
  }
  if (priority !== undefined && priority !== ticket.priority) {
    activityEntries.push({ type: 'PRIORITY_CHANGED', field: 'priority', oldValue: ticket.priority, newValue: priority })
  }
  if (assignedToId !== undefined && (assignedToId || null) !== ticket.assignedToId) {
    activityEntries.push({
      type: 'ASSIGNED',
      field: 'assignedTo',
      oldValue: ticket.assignedTo?.name || null,
      newValue: newAssignee?.name || null,
    })
  }

  const updated = await prisma.ticket.update({
    where: { id: req.params.id },
    data,
    include: ticketListInclude,
  })

  if (activityEntries.length) {
    await logTicketActivity(
      activityEntries.map((entry) => ({ ...entry, ticketId: ticket.id, actorId: req.user.id }))
    )
  }

  if (status !== undefined && status !== ticket.status && ticket.createdBy?.email) {
    const tpl = await getTemplate('TICKET_STATUS_CHANGED')
    const { subject: renderedSubject, html } = renderTemplate(tpl, {
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      status,
    })
    sendMail({
      to: ticket.createdBy.email,
      cc: ticket.ccEmails.length ? ticket.ccEmails : undefined,
      subject: renderedSubject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_STATUS_CHANGED', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }

  if (assignedToId && assignedToId !== ticket.assignedToId && newAssignee?.email) {
    const tpl = await getTemplate('TICKET_ASSIGNED_STAFF')
    const { subject: renderedSubject, html } = renderTemplate(tpl, {
      staffName: newAssignee.name,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      clientName: ticket.client?.name || '',
    })
    sendMail({
      to: newAssignee.email,
      subject: renderedSubject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_ASSIGNED_STAFF', relatedType: 'TICKET', relatedId: ticket.id },
    })
  }

  if (status !== undefined && status !== ticket.status && ticket.client?.phone) {
    const whatsappKey = status === 'RESOLVED' ? 'TICKET_RESOLVED_CLIENT' : 'TICKET_STATUS_UPDATED_CLIENT'
    sendWhatsApp({
      to: ticket.client.phone,
      templateKey: whatsappKey,
      components: whatsappKey === 'TICKET_RESOLVED_CLIENT'
        ? [ticket.client.name, ticket.ticketNumber]
        : [ticket.client.name, ticket.ticketNumber, status],
      meta: { relatedType: 'TICKET', relatedId: ticket.id },
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
    const tpl = await getTemplate('TICKET_STAFF_REPLY')
    const { subject, html } = renderTemplate(tpl, {
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      body: trimmedBody.replace(/\n/g, '<br/>'),
    })
    sendMail({
      to: ticket.createdBy.email,
      cc: ticket.ccEmails.length ? ticket.ccEmails : undefined,
      subject,
      text: htmlToText(html),
      html,
      meta: { templateKey: 'TICKET_STAFF_REPLY', relatedType: 'TICKET', relatedId: ticket.id },
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
