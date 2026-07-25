import { prisma } from './prismaClient.js'
import { encrypt, decrypt } from './crypto.js'

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
