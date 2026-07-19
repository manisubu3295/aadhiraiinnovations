import nodemailer from 'nodemailer'

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']

const missingEnv = requiredEnv.filter((key) => !process.env[key])

export const mailerReady = missingEnv.length === 0

const transporter = mailerReady
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

export async function sendMail(options) {
  if (!transporter) {
    console.warn(`Mailer not configured (missing: ${missingEnv.join(', ')}) — skipped email "${options.subject}"`)
    return
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      ...options,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}
