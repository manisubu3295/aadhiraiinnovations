// Shared inbound/outbound WhatsApp media caps and the outbound MIME allowlist. Kept in their own
// module (not defined inside server/whatsappMedia.js) so server/userWhatsappSettings.js's
// outbound send path can import them without a circular dependency — whatsappMedia.js already
// imports getDecryptedAccessTokenForUser from userWhatsappSettings.js, so the reverse import
// would form a cycle.
export const MAX_MEDIA_SIZES = {
  IMAGE: 5 * 1024 * 1024,
  // Meta's real sticker limits (~100KB static / ~500KB animated) are far smaller than this —
  // it's a generous ceiling, not a target, since Meta doesn't document a distinct number.
  STICKER: 5 * 1024 * 1024,
  AUDIO: 16 * 1024 * 1024,
  VIDEO: 16 * 1024 * 1024,
  DOCUMENT: 100 * 1024 * 1024,
}

// Meta's supported outbound MIME types per message type (WhatsApp Cloud API docs). Inbound
// download doesn't need an allowlist — Meta only ever delivers types it itself supports — but
// outbound send must reject an unsupported file before ever calling the API, with a clear error
// instead of letting Meta's own rejection surface first.
export const OUTBOUND_ALLOWED_MIME = {
  IMAGE: new Set(['image/jpeg', 'image/png']),
  STICKER: new Set(['image/webp']),
  AUDIO: new Set(['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg']),
  VIDEO: new Set(['video/mp4', 'video/3gpp']),
  DOCUMENT: new Set([
    'text/plain',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]),
}

// Throws a clear, user-facing message before any Meta API call is made.
export function validateOutboundMedia(messageType, mimeType, sizeBytes) {
  const cap = MAX_MEDIA_SIZES[messageType]
  if (!cap) {
    throw new Error(`Unsupported outbound media type: ${messageType}`)
  }
  if (sizeBytes > cap) {
    throw new Error(`File is ${sizeBytes} bytes — over the ${cap}-byte limit for ${messageType.toLowerCase()}.`)
  }
  const allowed = OUTBOUND_ALLOWED_MIME[messageType]
  if (allowed && !allowed.has(String(mimeType || '').toLowerCase())) {
    throw new Error(`"${mimeType}" isn't a supported ${messageType.toLowerCase()} type for WhatsApp.`)
  }
}
