import { prisma } from './prismaClient.js'
import { encrypt, decrypt } from './crypto.js'
import { normalizeWhatsAppNumber } from './whatsapp.js'

const API_VERSION = 'v21.0'

function mask(last4) {
  return last4 ? `••••••••••••${last4}` : null
}

// Safe to return to the frontend — the encrypted token itself and its plaintext are never included.
export function toPublicShape(row) {
  if (!row) return null
  return {
    phoneNumberId: row.phoneNumberId,
    webhookVerifyToken: row.webhookVerifyToken,
    accessTokenSet: Boolean(row.accessTokenEncrypted),
    accessTokenMasked: mask(row.accessTokenLast4),
    updatedAt: row.updatedAt,
  }
}

export async function getForUser(userId) {
  return prisma.userWhatsAppSettings.findUnique({ where: { userId } })
}

// accessToken undefined/'' means "leave the stored token alone" (same convention as
// Setting.smtpPass/whatsappAccessToken) — the frontend never gets it back, so it never re-sends it.
export async function saveForUser(userId, { phoneNumberId, accessToken, webhookVerifyToken }) {
  const data = {
    phoneNumberId: String(phoneNumberId || '').trim(),
    webhookVerifyToken: String(webhookVerifyToken || '').trim(),
  }
  if (accessToken) {
    data.accessTokenEncrypted = encrypt(accessToken)
    data.accessTokenLast4 = String(accessToken).slice(-4)
  }

  const existing = await getForUser(userId)
  if (!existing && !accessToken) {
    throw new Error('Access token is required.')
  }

  const row = await prisma.userWhatsAppSettings.upsert({
    where: { userId },
    create: { userId, accessTokenEncrypted: '', accessTokenLast4: null, ...data },
    update: data,
  })
  return row
}

// Only call this at the point of an actual Meta API request — never for display/settings responses.
export async function getDecryptedAccessTokenForUser(userId) {
  const row = await getForUser(userId)
  if (!row?.accessTokenEncrypted) return null
  return decrypt(row.accessTokenEncrypted)
}

// Low-level Meta call shared by sendTestMessage and sendConversationMessage — plain text, not a
// Message Template, so it only delivers if the recipient has an open 24-hour session with this
// number (they messaged it first) or is a verified test recipient in Meta's dashboard. A cold
// business-initiated send still needs an approved template (see server/whatsapp.js).
async function callMetaSendText(userId, number, message) {
  const settings = await getForUser(userId)
  if (!settings?.accessTokenEncrypted || !settings.phoneNumberId) {
    throw new Error('Save your Phone Number ID and access token first.')
  }
  const accessToken = decrypt(settings.accessTokenEncrypted)
  const url = `https://graph.facebook.com/${API_VERSION}/${settings.phoneNumberId}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: number,
      type: 'text',
      text: { body: message },
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.error) {
    throw new Error(data?.error?.message || `WhatsApp API request failed (${response.status}).`)
  }
  return data
}

export async function sendTestMessage(userId, { to, message }) {
  const number = normalizeWhatsAppNumber(to)
  if (!number) {
    throw new Error(`Not a valid WhatsApp number: ${to}`)
  }
  return callMetaSendText(userId, number, message)
}

// The single place that sends an outbound conversation message AND persists it — used by both
// the human-reply route (server/routes/conversations.js) and the bot engine (chatFlowEngine.js),
// so there is exactly one place that talks to Meta and writes WhatsAppMessage rows for outbound.
// Always records the attempt (even on failure, as a FAILED row) before rethrowing, so a failed
// send is visible in the thread rather than silently vanishing.
export async function sendConversationMessage(conversation, body, { sentByUserId, sentByBot = false } = {}) {
  try {
    const data = await callMetaSendText(conversation.userId, conversation.contactNumber, body)
    const metaMessageId = data?.messages?.[0]?.id || null
    const message = await prisma.whatsAppMessage.create({
      data: {
        conversationId: conversation.id,
        direction: 'OUTBOUND',
        body,
        metaMessageId,
        sentByUserId: sentByUserId || null,
        sentByBot,
        status: 'SENT',
      },
    })
    await prisma.whatsAppConversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date(), lastMessagePreview: body.slice(0, 120) },
    })
    return message
  } catch (error) {
    await prisma.whatsAppMessage.create({
      data: {
        conversationId: conversation.id,
        direction: 'OUTBOUND',
        body,
        sentByUserId: sentByUserId || null,
        sentByBot,
        status: 'FAILED',
      },
    })
    throw error
  }
}
