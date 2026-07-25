import { prisma } from './prismaClient.js'
import { getSettings } from './settings.js'
import { getWhatsAppTemplate } from './whatsappTemplates.js'
import { logWhatsApp } from './whatsappLog.js'

// Client.phone (and the staff notify number) are free-text today, so this is a best-effort
// normalizer rather than strict validation: strips formatting, and assumes +91 for a bare
// 10-digit number since the business is India-based. Returns null if it still doesn't look
// like a plausible E.164 number.
export function normalizeWhatsAppNumber(raw) {
  const stripped = String(raw || '').replace(/[^\d+]/g, '').replace(/^\+/, '')
  if (/^\d{10}$/.test(stripped)) return `91${stripped}`
  if (/^\d{11,15}$/.test(stripped)) return stripped
  return null
}

export function isWhatsAppConfigured(settings) {
  return Boolean(settings.whatsappEnabled && settings.whatsappPhoneNumberId && settings.whatsappAccessToken)
}

// Always logs the attempt to WhatsAppLog and throws on failure (or missing config), so
// callers whose entire purpose is the message (test-send) can await it and report the real
// failure back to the user. Mirrors deliverMail in server/mailer.js.
export async function deliverWhatsApp({ to, templateKey, components = [], meta }) {
  const settings = await getSettings()
  const number = normalizeWhatsAppNumber(to)

  if (!number) {
    const error = new Error(`Not a valid WhatsApp number: ${to}`)
    await logWhatsApp({ to: to || '', status: 'FAILED', errorMessage: error.message, templateKey, ...meta })
    throw error
  }
  if (!isWhatsAppConfigured(settings)) {
    const error = new Error('WhatsApp is not configured yet — set it up on the Settings page.')
    await logWhatsApp({ to: number, status: 'FAILED', errorMessage: error.message, templateKey, ...meta })
    throw error
  }

  const template = await getWhatsAppTemplate(templateKey)
  if (!template.templateName) {
    const error = new Error(`WhatsApp template "${template.label}" has no Meta template name configured yet — set it on the Settings page.`)
    await logWhatsApp({ to: number, status: 'FAILED', errorMessage: error.message, templateKey, ...meta })
    throw error
  }

  const apiVersion = settings.whatsappApiVersion || 'v21.0'
  const url = `https://graph.facebook.com/${apiVersion}/${settings.whatsappPhoneNumberId}/messages`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.whatsappAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: number,
        type: 'template',
        template: {
          name: template.templateName,
          language: { code: template.language || 'en_US' },
          components: components.length
            ? [{ type: 'body', parameters: components.map((text) => ({ type: 'text', text: String(text ?? '') })) }]
            : [],
        },
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.error) {
      throw new Error(data?.error?.message || `WhatsApp API request failed (${response.status}).`)
    }
    await logWhatsApp({ to: number, status: 'SENT', templateKey, ...meta })
    return data
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
    await logWhatsApp({ to: number, status: 'FAILED', errorMessage: error.message, templateKey, ...meta })
    throw error
  }
}

// Fire-and-forget wrapper for background notifications (ticket lifecycle events) — these are
// side effects of an action that must still succeed even if WhatsApp is down/unconfigured, so
// existing callers don't await/catch this; failures are logged via deliverWhatsApp, not thrown.
export function sendWhatsApp(options) {
  deliverWhatsApp(options).catch(() => {})
}

// Every ADMIN/STAFF user who's set a personal notification number (Settings > My WhatsApp) —
// used to broadcast ticket-lifecycle notifications to each of them individually, in addition to
// (not instead of) the single shared Setting.whatsappStaffNotifyNumber.
export async function getStaffNotifyNumbers() {
  const users = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'STAFF', 'SUPER_ADMIN'] }, whatsappNumber: { not: null } },
    select: { whatsappNumber: true },
  })
  return users.map((u) => u.whatsappNumber).filter(Boolean)
}
