import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { prisma } from './prismaClient.js'

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'tickets')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_CC_EMAILS = 5

// Accepts an array or a comma/semicolon/newline-separated string; throws on invalid input.
export function parseCcEmails(input) {
  if (input === undefined || input === null || input === '') return []
  const raw = Array.isArray(input) ? input : String(input).split(/[,;\n]/)
  const emails = []
  for (const entry of raw) {
    const email = String(entry).trim().toLowerCase()
    if (!email) continue
    if (!EMAIL_RE.test(email)) throw new Error(`Invalid CC email: ${email}`)
    if (!emails.includes(email)) emails.push(email)
  }
  if (emails.length > MAX_CC_EMAILS) throw new Error(`No more than ${MAX_CC_EMAILS} CC emails allowed.`)
  return emails
}

export async function nextTicketNumber() {
  const year = new Date().getFullYear()
  const count = await prisma.ticket.count({
    where: { ticketNumber: { startsWith: `TKT-${year}-` } },
  })
  return `TKT-${year}-${String(count + 1).padStart(4, '0')}`
}

export async function saveAttachments({ files, ticketId, messageId, uploadedById }) {
  if (!files?.length) return []
  await fs.mkdir(UPLOAD_ROOT, { recursive: true })
  const created = []
  for (const file of files) {
    const safeName = `${crypto.randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    await fs.writeFile(path.join(UPLOAD_ROOT, safeName), file.buffer)
    const attachment = await prisma.ticketAttachment.create({
      data: {
        fileName: file.originalname,
        filePath: safeName,
        mimeType: file.mimetype,
        size: file.size,
        ticketId: ticketId ?? undefined,
        messageId: messageId ?? undefined,
        uploadedById,
      },
    })
    created.push(attachment)
  }
  return created
}

export function attachmentDiskPath(filePath) {
  return path.join(UPLOAD_ROOT, filePath)
}

// Writes one or more rows to the ticket's audit trail (the detail page's "Activity" tab) —
// kept separate from TicketMessage, which is the client-facing comment thread.
export async function logTicketActivity(entries) {
  const list = Array.isArray(entries) ? entries : [entries]
  if (!list.length) return
  await prisma.ticketActivity.createMany({ data: list })
}
