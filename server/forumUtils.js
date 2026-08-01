import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { prisma } from './prismaClient.js'

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'forum')

// Forum uploads are public-facing (unlike ticket attachments, which are private per-client), so
// unlike server/ticketUtils.js (no MIME filter) this allowlists what's accepted.
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

export function forumUploadFileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error(`Unsupported file type: ${file.mimetype}`))
  }
  cb(null, true)
}

// Sized so the worst case (every file maxed out) stays safely under nginx's
// client_max_body_size 80m (deploy/nginx.support.conf) — 3 x 25MB = 75MB. That way an
// oversized request is rejected here with a friendly JSON error instead of nginx's raw 413.
export const FORUM_UPLOAD_LIMITS = { fileSize: 25 * 1024 * 1024, files: 3 }

// title-slug-<shortId> — avoids the race a counter-based scheme (see nextTicketNumber in
// ticketUtils.js, which counts existing rows and isn't safe under concurrent creates) would have.
export function slugifyTitle(title) {
  const base = String(title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${base || 'question'}-${crypto.randomUUID().slice(0, 8)}`
}

export async function saveForumAttachments({ files, questionId, answerId, uploadedByForumUserId, uploadedByStaffUserId }) {
  if (!files?.length) return []
  await fs.mkdir(UPLOAD_ROOT, { recursive: true })
  const created = []
  for (const file of files) {
    const safeName = `${crypto.randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    await fs.writeFile(path.join(UPLOAD_ROOT, safeName), file.buffer)
    const attachment = await prisma.forumAttachment.create({
      data: {
        fileName: file.originalname,
        filePath: safeName,
        mimeType: file.mimetype,
        size: file.size,
        questionId: questionId ?? undefined,
        answerId: answerId ?? undefined,
        uploadedByForumUserId: uploadedByForumUserId ?? undefined,
        uploadedByStaffUserId: uploadedByStaffUserId ?? undefined,
      },
    })
    created.push(attachment)
  }
  return created
}

export function attachmentDiskPath(filePath) {
  return path.join(UPLOAD_ROOT, filePath)
}
