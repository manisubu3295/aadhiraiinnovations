import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { prisma } from './prismaClient.js'

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'tickets')

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
