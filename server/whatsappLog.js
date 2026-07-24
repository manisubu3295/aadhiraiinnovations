import { prisma } from './prismaClient.js'

// A logging failure must never break the actual send, so this swallows its own errors.
export async function logWhatsApp({ to, status, errorMessage, templateKey, relatedType, relatedId }) {
  try {
    await prisma.whatsAppLog.create({
      data: {
        to: to || '',
        status,
        errorMessage: errorMessage || null,
        templateKey: templateKey || null,
        relatedType: relatedType || null,
        relatedId: relatedId || null,
      },
    })
  } catch (error) {
    console.error('Failed to write WhatsApp log:', error)
  }
}
