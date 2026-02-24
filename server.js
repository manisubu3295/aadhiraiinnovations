import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ENQUIRY_TO_EMAIL']

const missingEnv = requiredEnv.filter((key) => !process.env[key])

const transporter = missingEnv.length
  ? null
  : nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.post('/api/enquiry', async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: `Missing SMTP configuration: ${missingEnv.join(', ')}`,
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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
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

app.listen(port, () => {
  console.log(`Enquiry API running on http://localhost:${port}`)
})
