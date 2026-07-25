import { prisma } from './prismaClient.js'

// Which Meta-approved template each ticket event uses, and the ordered list of variables it
// sends as {{1}}, {{2}}, ... — the wording itself lives in Meta Business Manager, so all we
// own here is "what to call it" and "what params it expects", shown as a hint in the admin
// WhatsApp Templates tab so the template created in Meta can be kept in sync.
export const DEFAULT_TEMPLATES = [
  {
    key: 'TICKET_CREATED_CLIENT',
    label: 'Ticket created (to client)',
    params: ['clientName', 'ticketNumber', 'subject'],
  },
  {
    key: 'TICKET_STATUS_UPDATED_CLIENT',
    label: 'Ticket status updated (to client)',
    params: ['clientName', 'ticketNumber', 'status'],
  },
  {
    key: 'TICKET_RESOLVED_CLIENT',
    label: 'Ticket resolved (to client)',
    params: ['clientName', 'ticketNumber'],
  },
  {
    key: 'TICKET_CREATED_STAFF',
    label: 'New ticket created (to staff)',
    params: ['clientName', 'ticketNumber', 'subject'],
  },
  {
    key: 'TICKET_CLIENT_REPLIED_STAFF',
    label: 'Client replied (to staff)',
    params: ['clientName', 'ticketNumber', 'subject'],
  },
  {
    key: 'OFFLINE_LICENSE_LEAD_STAFF',
    label: 'Offline license subscription request (to staff)',
    params: ['name', 'plan', 'machineId'],
  },
  {
    key: 'OFFLINE_ENTERPRISE_LEAD_STAFF',
    label: 'Offline enterprise/guided setup inquiry (to staff)',
    params: ['name', 'businessName', 'whatsapp'],
  },
]

const DEFAULTS_BY_KEY = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.key, t]))

export function paramsForKey(key) {
  return DEFAULTS_BY_KEY[key]?.params || []
}

// Falls back to the in-code default (label only, no templateName) if the DB row is somehow
// missing — should only happen if the seed script hasn't run yet.
export async function getWhatsAppTemplate(key) {
  const row = await prisma.whatsAppTemplate.findUnique({ where: { key } })
  if (row) return row
  const fallback = DEFAULTS_BY_KEY[key]
  if (!fallback) throw new Error(`Unknown WhatsApp template key: ${key}`)
  return { key: fallback.key, label: fallback.label, templateName: null, language: 'en_US' }
}
