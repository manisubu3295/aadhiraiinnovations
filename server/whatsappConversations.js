import { prisma } from './prismaClient.js'
import { normalizeWhatsAppNumber, sanitizeMetaWhatsAppNumber } from './whatsapp.js'
import { sendMail } from './mailer.js'

const NOTIFY_EMAIL = 'info@aadhiraiinnovations.com'

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

const MESSAGE_TYPE_MAP = {
  text: 'TEXT',
  image: 'IMAGE',
  document: 'DOCUMENT',
  audio: 'AUDIO',
  video: 'VIDEO',
  sticker: 'STICKER',
  location: 'LOCATION',
  contacts: 'CONTACTS',
  reaction: 'REACTION',
  interactive: 'INTERACTIVE',
}

export function mapMessageType(metaType) {
  return MESSAGE_TYPE_MAP[metaType] || 'OTHER'
}

// `body` was previously text-only, which silently dropped captions on image/video/document
// messages — they were only reachable via rawPayload. Captions now surface the same way a text
// body does, so both the conversation preview and the admin inbox show them without a separate
// code path per media type.
export function extractMessageBody(metaMessage) {
  switch (metaMessage.type) {
    case 'text':
      return metaMessage.text?.body || null
    case 'image':
      return metaMessage.image?.caption || null
    case 'video':
      return metaMessage.video?.caption || null
    case 'document':
      return metaMessage.document?.caption || null
    default:
      return null
  }
}

// Finds the conversation for (userId, contactNumber), or creates one — matching against
// Client.phone/Lead.phone (normalized) at creation time so the inbox shows a name instead of a
// raw number. Small business scale (not thousands of clients), so an in-memory scan is fine —
// this only runs once per new conversation, not per message.
export async function findOrCreateConversation(userId, contactNumber) {
  const existing = await prisma.whatsAppConversation.findUnique({
    where: { userId_contactNumber: { userId, contactNumber } },
  })
  if (existing) return existing

  const [clients, leads] = await Promise.all([
    prisma.client.findMany({ where: { phone: { not: null } }, select: { id: true, phone: true } }),
    prisma.lead.findMany({ where: { phone: { not: null } }, select: { id: true, phone: true } }),
  ])
  const client = clients.find((c) => normalizeWhatsAppNumber(c.phone) === contactNumber)
  const lead = !client ? leads.find((l) => normalizeWhatsAppNumber(l.phone) === contactNumber) : null

  return prisma.whatsAppConversation.create({
    data: { userId, contactNumber, clientId: client?.id || null, leadId: lead?.id || null },
  })
}

// Records one inbound Meta message, deduped by metaMessageId (handles Meta's webhook retries) —
// returns null if already recorded, so callers know not to re-run the flow engine on it.
export async function recordInboundMessage(userId, metaMessage) {
  if (metaMessage.id) {
    const existing = await prisma.whatsAppMessage.findUnique({ where: { metaMessageId: metaMessage.id } })
    if (existing) return null
  }

  const contactNumber = sanitizeMetaWhatsAppNumber(metaMessage.from)
  if (!contactNumber) return null

  const conversation = await findOrCreateConversation(userId, contactNumber)
  const messageType = mapMessageType(metaMessage.type)
  const body = extractMessageBody(metaMessage)

  const message = await prisma.whatsAppMessage.create({
    data: {
      conversationId: conversation.id,
      direction: 'INBOUND',
      messageType,
      body,
      rawPayload: messageType === 'TEXT' ? undefined : metaMessage,
      metaMessageId: metaMessage.id || null,
      status: 'RECEIVED',
    },
  })

  await prisma.whatsAppConversation.update({
    where: { id: conversation.id },
    data: {
      lastMessageAt: new Date(),
      lastMessagePreview: body ? body.slice(0, 120) : `[${messageType.toLowerCase()}]`,
      unreadCount: { increment: 1 },
    },
  })

  const preview = body ? escapeHtml(body) : `[${messageType.toLowerCase()} message]`
  sendMail({
    to: NOTIFY_EMAIL,
    subject: `New WhatsApp message from ${contactNumber}`,
    text: `New WhatsApp message from ${contactNumber}:\n\n${body || `[${messageType.toLowerCase()} message]`}`,
    html: `<p>New WhatsApp message from <strong>${escapeHtml(contactNumber)}</strong>:</p><p>${preview}</p>`,
    meta: { relatedType: 'WHATSAPP_MESSAGE', relatedId: message.id },
  })

  return { conversation, message }
}

// Best-effort status callback (delivered/read/failed) — never throws, matches the
// "logging must never break the actual flow" convention used elsewhere (e.g. server/whatsappLog.js).
export async function recordStatusUpdate(status) {
  if (!status?.id) return
  try {
    await prisma.whatsAppMessage.updateMany({
      where: { metaMessageId: status.id },
      data: { status: String(status.status || '').toUpperCase() || undefined },
    })
  } catch (error) {
    console.error('Failed to record WhatsApp status update:', error)
  }
}
