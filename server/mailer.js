import nodemailer from 'nodemailer'
import { getSettings } from './settings.js'
import { logEmail } from './emailLog.js'

function buildTransporter(s) {
  return nodemailer.createTransport({
    host: s.smtpHost,
    port: Number(s.smtpPort),
    secure: Boolean(s.smtpSecure),
    auth: { user: s.smtpUser, pass: s.smtpPass },
  })
}

export async function isMailerConfigured() {
  const s = await getSettings()
  return Boolean(s.smtpHost && s.smtpPort && s.smtpUser && s.smtpPass)
}

// Always logs the attempt to EmailLog and throws on failure (or missing SMTP config), so
// callers whose entire purpose is the email (invoice/quotation send, test email, reminders)
// can await it and report the real failure back to the user.
export async function deliverMail({ meta, ...mailOptions }) {
  const s = await getSettings()
  if (!s.smtpHost || !s.smtpPort || !s.smtpUser || !s.smtpPass) {
    const error = new Error('SMTP is not configured yet — set it up on the Settings page.')
    await logEmail({ ...mailOptions, status: 'FAILED', errorMessage: error.message, ...meta })
    throw error
  }
  try {
    await buildTransporter(s).sendMail({ from: s.emailFrom, ...mailOptions })
    await logEmail({ ...mailOptions, status: 'SENT', ...meta })
  } catch (error) {
    console.error('Failed to send email:', error)
    await logEmail({ ...mailOptions, status: 'FAILED', errorMessage: error.message, ...meta })
    throw error
  }
}

// Fire-and-forget wrapper for background notifications (ticket/enquiry/expense emails) —
// these are side effects of an action that must still succeed even if SMTP is down, so
// existing callers don't await/catch this; failures are logged via deliverMail, not thrown.
export function sendMail(options) {
  deliverMail(options).catch(() => {})
}

export async function sendTestMail(to) {
  return deliverMail({
    to,
    subject: 'Aadhirai Innovations — test email',
    text: 'This is a test email confirming your SMTP settings are working.',
    html: '<p>This is a test email confirming your SMTP settings are working.</p>',
    meta: { relatedType: 'TEST' },
  })
}
