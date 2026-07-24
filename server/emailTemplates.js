import { prisma } from './prismaClient.js'

// Single source of truth for every template's default copy (used by the seed script) and
// the list of {{variables}} it supports (shown as a hint in the admin Email Templates editor).
// Wording here matches what was previously hardcoded inline at each send site, so seeding
// this doesn't change any email's content until an admin edits it.
export const DEFAULT_TEMPLATES = [
  {
    key: 'TICKET_CLIENT_ACK',
    category: 'TICKET',
    label: 'Ticket received (to client)',
    variables: ['ticketNumber', 'subject'],
    subject: 'We received your ticket {{ticketNumber}}',
    bodyHtml: '<p>Thanks — we\'ve received your ticket <strong>{{subject}}</strong> ({{ticketNumber}}) and will respond soon.</p>',
  },
  {
    key: 'TICKET_NEW_STAFF_NOTIFY',
    category: 'TICKET',
    label: 'New ticket raised (to staff)',
    variables: ['ticketNumber', 'subject', 'clientName', 'description'],
    subject: 'New ticket {{ticketNumber}}: {{subject}}',
    bodyHtml: '<p><strong>{{clientName}}</strong> raised a new ticket ({{ticketNumber}}):</p><p>{{description}}</p>',
  },
  {
    key: 'TICKET_STATUS_CHANGED',
    category: 'TICKET',
    label: 'Ticket status changed (to client)',
    variables: ['ticketNumber', 'subject', 'status'],
    subject: '[{{ticketNumber}}] Status updated: {{status}}',
    bodyHtml: '<p>Your ticket <strong>{{subject}}</strong> ({{ticketNumber}}) status changed to <strong>{{status}}</strong>.</p>',
  },
  {
    key: 'TICKET_STAFF_REPLY',
    category: 'TICKET',
    label: 'Staff replied (to client)',
    variables: ['ticketNumber', 'subject', 'body'],
    subject: '[{{ticketNumber}}] New reply on your ticket',
    bodyHtml: '<p>A new reply was posted on your ticket <strong>{{subject}}</strong> ({{ticketNumber}}):</p><p>{{body}}</p>',
  },
  {
    key: 'TICKET_CLIENT_REPLIED_STAFF_NOTIFY',
    category: 'TICKET',
    label: 'Client replied (to staff)',
    variables: ['ticketNumber', 'subject', 'clientName', 'body'],
    subject: '[{{ticketNumber}}] Client replied',
    bodyHtml: '<p><strong>{{clientName}}</strong> replied on ticket <strong>{{subject}}</strong> ({{ticketNumber}}):</p><p>{{body}}</p>',
  },
  {
    key: 'ENQUIRY_STAFF_NOTIFY',
    category: 'ENQUIRY',
    label: 'Website enquiry (to staff)',
    variables: ['name', 'company', 'city', 'message'],
    subject: 'New Enquiry - {{name}}',
    bodyHtml:
      '<h2>New Website Enquiry</h2><p><strong>Name:</strong> {{name}}</p><p><strong>Company:</strong> {{company}}</p><p><strong>City:</strong> {{city}}</p><p><strong>Message:</strong></p><p>{{message}}</p>',
  },
  {
    key: 'INVOICE_SENT',
    category: 'INVOICE',
    label: 'Invoice sent (to client)',
    variables: ['clientName', 'invoiceNumber', 'currency', 'amount', 'dueDate', 'businessName'],
    subject: 'Invoice {{invoiceNumber}} from {{businessName}}',
    bodyHtml:
      '<p>Dear {{clientName}},</p><p>Please find attached invoice <strong>{{invoiceNumber}}</strong> for <strong>{{currency}} {{amount}}</strong>, due on {{dueDate}}.</p><p>Thank you for your business.</p><p>Regards,<br/>{{businessName}}</p>',
  },
  {
    key: 'QUOTATION_SENT',
    category: 'QUOTATION',
    label: 'Quotation sent (to client)',
    variables: ['clientName', 'quotationNumber', 'currency', 'amount', 'validUntil', 'businessName'],
    subject: 'Quotation {{quotationNumber}} from {{businessName}}',
    bodyHtml:
      '<p>Dear {{clientName}},</p><p>Please find attached our quotation <strong>{{quotationNumber}}</strong> for <strong>{{currency}} {{amount}}</strong>, valid until {{validUntil}}.</p><p>Let us know if you have any questions.</p><p>Regards,<br/>{{businessName}}</p>',
  },
  {
    key: 'TIMESHEET_REMINDER',
    category: 'TIMESHEET',
    label: 'Timesheet reminder (to staff)',
    variables: ['userName', 'businessName'],
    subject: 'Reminder: please submit your timesheet',
    bodyHtml:
      '<p>Hi {{userName}},</p><p>This is a friendly reminder to log your work hours for this period. Please update your timesheet in the portal at your earliest convenience.</p><p>Thanks,<br/>{{businessName}}</p>',
  },
  {
    key: 'EXPENSE_APPROVED',
    category: 'EXPENSE',
    label: 'Expense claim approved (to staff)',
    variables: ['userName', 'currency', 'amount', 'description', 'businessName'],
    subject: 'Your expense claim was approved',
    bodyHtml:
      '<p>Hi {{userName}},</p><p>Your expense claim of <strong>{{currency}} {{amount}}</strong> for "{{description}}" has been approved.</p><p>Regards,<br/>{{businessName}}</p>',
  },
  {
    key: 'EXPENSE_REJECTED',
    category: 'EXPENSE',
    label: 'Expense claim rejected (to staff)',
    variables: ['userName', 'currency', 'amount', 'description', 'businessName'],
    subject: 'Your expense claim was rejected',
    bodyHtml:
      '<p>Hi {{userName}},</p><p>Your expense claim of <strong>{{currency}} {{amount}}</strong> for "{{description}}" has been rejected. Please contact your manager for details.</p><p>Regards,<br/>{{businessName}}</p>',
  },
  {
    key: 'EXPENSE_REIMBURSED',
    category: 'EXPENSE',
    label: 'Expense claim reimbursed (to staff)',
    variables: ['userName', 'currency', 'amount', 'description', 'businessName'],
    subject: 'Your expense claim has been reimbursed',
    bodyHtml:
      '<p>Hi {{userName}},</p><p>Your expense claim for "{{description}}" has been reimbursed: <strong>{{currency}} {{amount}}</strong>.</p><p>Regards,<br/>{{businessName}}</p>',
  },
]

const DEFAULTS_BY_KEY = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.key, t]))

// Falls back to the in-code default if the DB row is somehow missing (should only happen
// if the seed script hasn't run yet), so a missing row never breaks a send.
export async function getTemplate(key) {
  const row = await prisma.emailTemplate.findUnique({ where: { key } })
  if (row) return row
  const fallback = DEFAULTS_BY_KEY[key]
  if (!fallback) throw new Error(`Unknown email template key: ${key}`)
  return fallback
}

export function renderTemplate(template, vars) {
  const fill = (str) => str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => (vars[key] ?? ''))
  return { subject: fill(template.subject), html: fill(template.bodyHtml) }
}

export function htmlToText(html) {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
