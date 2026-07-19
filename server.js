import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './server/routes/auth.js'
import adminRoutes from './server/routes/admin.js'
import employeeRoutes from './server/routes/employee.js'
import ticketRoutes from './server/routes/tickets.js'
import clientRoutes from './server/routes/client.js'
import { sendMail, mailerReady } from './server/mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config()

const requiredEnv = ['JWT_SECRET', 'DATABASE_URL']
const missingRequiredEnv = requiredEnv.filter((key) => !process.env[key])
if (missingRequiredEnv.length) {
  console.error(`Missing required environment variable(s): ${missingRequiredEnv.join(', ')}. See .env.example.`)
  process.exit(1)
}

const app = express()
const port = process.env.PORT || 8787

// Behind nginx/a reverse proxy in production — needed so express-rate-limit sees the
// real client IP (not the proxy's) instead of rate-limiting every visitor as one.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim())

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/client', clientRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiries from this address. Try again later.' },
})

app.post('/api/enquiry', enquiryLimiter, async (req, res) => {
  try {
    if (!mailerReady || !process.env.ENQUIRY_TO_EMAIL) {
      return res.status(500).json({
        success: false,
        message: 'Missing SMTP configuration.',
      })
    }

    const { name = '', company = '', city = '', message = '' } = req.body ?? {}

    const trimmedName = String(name).trim()
    const trimmedCompany = String(company).trim()
    const trimmedCity = String(city).trim()
    const trimmedMessage = String(message).trim()

    if (!trimmedName || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: 'Name and message are required.',
      })
    }

    const subject = `New Enquiry - ${trimmedName}`

    const textBody = [
      `Name: ${trimmedName}`,
      `Company: ${trimmedCompany || '-'}`,
      `City: ${trimmedCity || '-'}`,
      '',
      'Message:',
      trimmedMessage,
    ].join('\n')

    const htmlBody = `
      <h2>New Website Enquiry</h2>
      <p><strong>Name:</strong> ${trimmedName}</p>
      <p><strong>Company:</strong> ${trimmedCompany || '-'}</p>
      <p><strong>City:</strong> ${trimmedCity || '-'}</p>
      <p><strong>Message:</strong></p>
      <p>${trimmedMessage.replace(/\n/g, '<br/>')}</p>
    `

    await sendMail({
      to: process.env.ENQUIRY_TO_EMAIL,
      replyTo: process.env.ENQUIRY_REPLY_TO || undefined,
      subject,
      text: textBody,
      html: htmlBody,
    })

    res.status(200).json({ success: true, message: 'Enquiry sent successfully.' })
  } catch (error) {
    console.error('Enquiry email send failed:', error)
    res.status(500).json({ success: false, message: 'Failed to send enquiry.' })
  }
})

// On a self-hosted Linux server (not Vercel), this process also serves the built SPA
// so nginx/PM2 only need to point at one Node process. Run `npm run build` first.
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist')
  app.use(express.static(distPath))
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
