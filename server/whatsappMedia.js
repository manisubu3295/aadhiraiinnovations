import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import { prisma } from './prismaClient.js'
import { GRAPH_API_VERSION } from './graphApiVersion.js'
import { getDecryptedAccessTokenForUser } from './userWhatsappSettings.js'
import { MAX_MEDIA_SIZES } from './whatsappMediaLimits.js'

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'whatsapp')

const METADATA_TIMEOUT_MS = 15_000
const DOWNLOAD_TIMEOUT_MS = 120_000 // documents up to 100MB need real headroom
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const MAX_REDIRECT_HOPS = 5
const MAX_RETRIES = 5
const BASE_BACKOFF_MS = 1000

const EXTENSION_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/3gpp': '3gp',
  'audio/aac': 'aac',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/amr': 'amr',
  'audio/ogg': 'ogg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/plain': 'txt',
}

// Thrown for every Graph/CDN-facing failure so the retry logic has one place to read
// `.retryable`/`.status` from, instead of sniffing error shapes ad hoc.
export class GraphApiError extends Error {
  constructor(message, { status, retryable } = {}) {
    super(message)
    this.name = 'GraphApiError'
    this.status = status
    this.retryable = Boolean(retryable)
  }
}

function mimeTopLevel(mime) {
  return String(mime || '').split(';')[0].trim().split('/')[0].toLowerCase()
}

// Pure and exported so size-cap enforcement (item 6) is directly unit-testable without going
// through the Prisma-backed download orchestration.
export function exceedsSizeCap(messageType, fileSize) {
  const cap = MAX_MEDIA_SIZES[messageType] ?? MAX_MEDIA_SIZES.DOCUMENT
  return Boolean(fileSize) && fileSize > cap
}

// Only compares top-level type (image/video/audio/application) rather than the full mime string
// — a codec-parameter difference like declared "audio/ogg" vs sniffed "audio/ogg" with a
// different container detail is still the same media family and shouldn't hard-reject; declaring
// "image/jpeg" but sniffing actual video bytes should.
export function mimesAreCompatible(declaredMime, sniffedMime) {
  if (!sniffedMime) return true // nothing sniffed (e.g. file-type doesn't recognize the format) — don't reject on absence
  return mimeTopLevel(declaredMime) === mimeTopLevel(sniffedMime)
}

function extensionForMime(mime, sniffedExt) {
  return EXTENSION_BY_MIME[String(mime || '').toLowerCase()] || sniffedExt || 'bin'
}

// Never used to build a filesystem path — only for the user-facing filename on download
// (server/routes/conversations.js res.download second argument). storageKey is always a
// server-generated UUID, independent of anything the client sent.
export function sanitizeOriginalFilename(name) {
  const cleaned = String(name || '').replace(/[\\/]/g, '_').replace(/[^\w.\- ]/g, '_').trim()
  return cleaned.slice(0, 200) || 'file'
}

// Exponential backoff with jitter, capped at 30s — exported so tests can assert the curve
// without waiting on real timers.
export function computeBackoffMs(attempt) {
  const exp = Math.min(BASE_BACKOFF_MS * 2 ** (attempt - 1), 30_000)
  return Math.round(exp + exp * 0.2 * Math.random())
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    // Deliberately not including error.message here — Node's fetch failure messages can embed
    // the request URL, and for the CDN download step that URL is the short-lived signed media
    // URL this module must never log (see module docstring below).
    const timedOut = error?.name === 'AbortError'
    throw new GraphApiError(timedOut ? 'Request timed out.' : `Network error (${error?.code || error?.name || 'unknown'}).`, {
      status: undefined,
      retryable: true,
    })
  } finally {
    clearTimeout(timer)
  }
}

// Meta's media-metadata lookup (step a) returns a temporary CDN url that redirects cross-host.
// Fetch's default `redirect: 'follow'` — and most HTTP clients generally — drop the Authorization
// header once a redirect crosses origins, which the CDN then rejects with 401. This fetches with
// redirect handling disabled and manually re-issues the request to the Location target on every
// hop, re-attaching the same Authorization header each time. Never logs `url`/`currentUrl` —
// that's the temporary, credential-bearing media URL itself (item 13).
export async function fetchWithAuthAcrossRedirects(url, headers, { maxHops = MAX_REDIRECT_HOPS, timeoutMs = DOWNLOAD_TIMEOUT_MS } = {}) {
  let currentUrl = url
  for (let hop = 0; hop <= maxHops; hop++) {
    const response = await fetchWithTimeout(currentUrl, { headers, redirect: 'manual' }, timeoutMs)
    if (!REDIRECT_STATUSES.has(response.status)) return response

    const location = response.headers.get('location')
    if (!location) {
      throw new GraphApiError(`Redirect response (${response.status}) had no Location header.`, {
        status: response.status,
        retryable: true,
      })
    }
    currentUrl = new URL(location, currentUrl).toString()
  }
  throw new GraphApiError(`Exceeded ${maxHops} redirect hops fetching media.`, { status: undefined, retryable: false })
}

// Step (a): resolve a media id to its temporary download url + declared metadata. Never persist
// the returned `url` — it expires in ~5 minutes; only the downloaded bytes get persisted.
export async function fetchMediaMetadata(accessToken, mediaId) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${mediaId}`
  const response = await fetchWithTimeout(url, { headers: { Authorization: `Bearer ${accessToken}` } }, METADATA_TIMEOUT_MS)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.error) {
    const status = response.status
    throw new GraphApiError(data?.error?.message || `Media metadata lookup failed (${status}).`, {
      status,
      retryable: status >= 500 || status === 429,
    })
  }
  return { url: data.url, mimeType: data.mime_type, fileSize: data.file_size, sha256: data.sha256 }
}

// Step (b): download the actual bytes, following the redirect with Authorization intact.
export async function fetchMediaBytes(accessToken, url) {
  const response = await fetchWithAuthAcrossRedirects(url, { Authorization: `Bearer ${accessToken}` })
  if (!response.ok) {
    throw new GraphApiError(`Media download failed (${response.status}).`, {
      status: response.status,
      retryable: response.status >= 500 || response.status === 401 || response.status === 429,
    })
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function writeMediaFile(userId, buffer, mime, sniffedExt) {
  const now = new Date()
  const dir = path.join(UPLOAD_ROOT, String(userId), String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'))
  await fs.mkdir(dir, { recursive: true })
  const filename = `${crypto.randomUUID()}.${extensionForMime(mime, sniffedExt)}`
  await fs.writeFile(path.join(dir, filename), buffer)
  return path.relative(UPLOAD_ROOT, path.join(dir, filename)).split(path.sep).join('/')
}

export function mediaDiskPath(storageKey) {
  return path.join(UPLOAD_ROOT, storageKey)
}

// Same on-disk layout/naming as inbound download, exposed for the outbound send route
// (server/routes/conversations.js) so a staff member's uploaded attachment is stored exactly
// the same way an inbound one is, and both are served back through the same download route.
export async function storeOutboundMediaFile(userId, buffer, mimeType) {
  return writeMediaFile(userId, buffer, mimeType, null)
}

// Pulls the {mediaId, mimeType, caption, filename, isVoiceNote} out of one inbound Meta message
// object. Returns null for message types that never carry a downloadable media object (text,
// location, contacts, reaction, interactive, unknown-future-types) — those are handled entirely
// by recordInboundMessage's rawPayload capture and never reach this module.
export function extractMediaRef(metaMessage) {
  switch (metaMessage?.type) {
    case 'image':
      return { mediaId: metaMessage.image?.id, mimeType: metaMessage.image?.mime_type, caption: metaMessage.image?.caption || null, filename: null, isVoiceNote: false }
    case 'video':
      return { mediaId: metaMessage.video?.id, mimeType: metaMessage.video?.mime_type, caption: metaMessage.video?.caption || null, filename: null, isVoiceNote: false }
    case 'audio':
      return { mediaId: metaMessage.audio?.id, mimeType: metaMessage.audio?.mime_type, caption: null, filename: null, isVoiceNote: Boolean(metaMessage.audio?.voice) }
    case 'document':
      return {
        mediaId: metaMessage.document?.id,
        mimeType: metaMessage.document?.mime_type,
        caption: metaMessage.document?.caption || null,
        filename: metaMessage.document?.filename || null,
        isVoiceNote: false,
      }
    case 'sticker':
      return { mediaId: metaMessage.sticker?.id, mimeType: metaMessage.sticker?.mime_type, caption: null, filename: null, isVoiceNote: false }
    default:
      return null
  }
}

async function markFailed(mediaRowId, message, retryCount) {
  await prisma.whatsAppMedia.update({
    where: { id: mediaRowId },
    data: { downloadStatus: 'FAILED', lastError: String(message).slice(0, 500), retryCount },
  })
}

// The whole resolve -> cap-check -> download -> verify -> store sequence for one WhatsAppMedia
// row. Re-resolves the media url from step (a) fresh on every call (including every retry) — it
// never caches/reuses a previously-fetched temporary url across attempts, which is what makes
// retries automatically immune to the ~5-minute url expiry (item 12) without any special-cased
// "is this url stale" check.
async function downloadAndStore(userId, mediaRow, messageType, attempt = 0) {
  const accessToken = await getDecryptedAccessTokenForUser(userId)
  if (!accessToken) {
    await markFailed(mediaRow.id, 'No WhatsApp access token configured for this user.', attempt)
    return
  }

  await prisma.whatsAppMedia.update({ where: { id: mediaRow.id }, data: { downloadStatus: 'DOWNLOADING' } })

  try {
    const meta = await fetchMediaMetadata(accessToken, mediaRow.mediaId)

    if (exceedsSizeCap(messageType, meta.fileSize)) {
      const cap = MAX_MEDIA_SIZES[messageType] ?? MAX_MEDIA_SIZES.DOCUMENT
      await prisma.whatsAppMedia.update({
        where: { id: mediaRow.id },
        data: {
          downloadStatus: 'REJECTED_SIZE',
          fileSize: meta.fileSize,
          sha256: meta.sha256 || null,
          lastError: `File size ${meta.fileSize} bytes exceeds the ${cap}-byte cap for ${messageType}.`,
        },
      })
      console.warn(`Rejected inbound WhatsApp media ${mediaRow.mediaId}: ${meta.fileSize} bytes > ${cap}-byte cap for ${messageType}.`)
      return
    }

    const buffer = await fetchMediaBytes(accessToken, meta.url)

    const actualSha256 = crypto.createHash('sha256').update(buffer).digest('hex')
    if (meta.sha256 && actualSha256 !== meta.sha256) {
      throw new GraphApiError(`sha256 mismatch for media ${mediaRow.mediaId} — possibly a truncated or corrupted download.`, { retryable: true })
    }

    const sniffed = await fileTypeFromBuffer(buffer)
    const detectedMimeType = sniffed?.mime || null
    const declaredMimeType = meta.mimeType || mediaRow.mimeType
    if (!mimesAreCompatible(declaredMimeType, detectedMimeType)) {
      await prisma.whatsAppMedia.update({
        where: { id: mediaRow.id },
        data: {
          downloadStatus: 'FAILED',
          detectedMimeType,
          sha256: actualSha256,
          fileSize: buffer.length,
          lastError: `Declared mime type "${declaredMimeType}" doesn't match the downloaded bytes ("${detectedMimeType}").`,
        },
      })
      console.warn(`Rejected inbound WhatsApp media ${mediaRow.mediaId}: mime mismatch (declared ${declaredMimeType}, sniffed ${detectedMimeType}).`)
      return
    }

    // Storage dedup: identical bytes already downloaded for a different message reuse the same
    // file instead of writing a duplicate copy to disk.
    const dupe = await prisma.whatsAppMedia.findFirst({
      where: { sha256: actualSha256, downloadStatus: 'COMPLETE', storageKey: { not: null } },
      select: { storageKey: true },
    })
    const storageKey = dupe?.storageKey || (await writeMediaFile(userId, buffer, declaredMimeType, sniffed?.ext))

    await prisma.whatsAppMedia.update({
      where: { id: mediaRow.id },
      data: {
        downloadStatus: 'COMPLETE',
        sha256: actualSha256,
        detectedMimeType,
        fileSize: buffer.length,
        storageKey,
        mimeType: declaredMimeType,
      },
    })
  } catch (error) {
    const retryCount = attempt + 1
    console.error(`WhatsApp media download failed (mediaId=${mediaRow.mediaId}, attempt=${retryCount}):`, error.message)
    await markFailed(mediaRow.id, error.message, retryCount)

    if (!error?.retryable || retryCount >= MAX_RETRIES) return

    const delay = computeBackoffMs(retryCount)
    setTimeout(() => {
      downloadAndStore(userId, mediaRow, messageType, retryCount).catch((err) =>
        console.error(`WhatsApp media retry threw unexpectedly (mediaId=${mediaRow.mediaId}):`, err.message),
      )
    }, delay)
  }
}

// Entry point called (fire-and-forget) from the webhook handler once a WhatsAppMessage row
// already exists for an inbound media message. Idempotent: safe to call more than once for the
// same message — a completed download is never redone, and an in-flight/failed one resumes from
// the existing WhatsAppMedia row rather than creating a second one (messageId is @unique).
export async function processInboundMedia(userId, whatsAppMessage, metaMessage) {
  const ref = extractMediaRef(metaMessage)
  if (!ref?.mediaId) return null

  const existing = await prisma.whatsAppMedia.findUnique({ where: { messageId: whatsAppMessage.id } })
  if (existing?.downloadStatus === 'COMPLETE') return existing

  const mediaRow = existing
    || (await prisma.whatsAppMedia.create({
      data: {
        messageId: whatsAppMessage.id,
        mediaId: ref.mediaId,
        mimeType: ref.mimeType || 'application/octet-stream',
        caption: ref.caption,
        originalFilename: ref.filename ? sanitizeOriginalFilename(ref.filename) : null,
        isVoiceNote: ref.isVoiceNote,
        downloadStatus: 'PENDING',
      },
    }))

  await downloadAndStore(userId, mediaRow, whatsAppMessage.messageType, existing?.retryCount ?? 0)
  return mediaRow
}
