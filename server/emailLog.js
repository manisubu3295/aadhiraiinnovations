import { prisma } from './prismaClient.js'

function toArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

// A logging failure must never break the actual email send, so this swallows its own errors.
export async function logEmail({ to, cc, subject, status, errorMessage, templateKey, relatedType, relatedId }) {
  try {
    await prisma.emailLog.create({
      data: {
        to: toArray(to),
        cc: toArray(cc),
        subject: subject || '',
        status,
        errorMessage: errorMessage || null,
        templateKey: templateKey || null,
        relatedType: relatedType || null,
        relatedId: relatedId || null,
      },
    })
  } catch (error) {
    console.error('Failed to write email log:', error)
  }
}
