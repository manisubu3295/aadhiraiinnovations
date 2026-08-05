import express from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendMail } from '../mailer.js'

const router = express.Router()

// Add an entry here (and a matching DEFAULT_TEMPLATES pair in emailTemplates.js) for each
// downloadable resource. Keyed by a stable id the frontend passes in `resourceId`.
const RESOURCES = {
  'pharmacy-gst-compliance-checklist': {
    name: 'Pharmacy GST & Compliance Checklist',
    url: '/media/pharmacy-gst-compliance-checklist.html',
  },
}

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this address. Try again later.' },
})

// Public — no auth. Captures a Lead for the requested resource, emails the requester the
// download link, and notifies staff. Mirrors the Lead-creation pattern in offlineLicense.js.
router.post('/download', downloadLimiter, async (req, res) => {
  try {
    const { name, email, resourceId } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const resource = RESOURCES[resourceId]

    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' })
    }
    if (!resource) {
      return res.status(400).json({ success: false, message: 'Unknown resource requested.' })
    }

    const lead = await prisma.lead.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        source: `Resource Download — ${resource.name}`,
      },
    })

    const settings = await getSettings()
    const staffEmail = settings.enquiryNotifyEmail || settings.ticketNotifyEmail
    if (staffEmail) {
      const tpl = await getTemplate('RESOURCE_DOWNLOAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, {
        name: trimmedName,
        email: trimmedEmail,
        resourceName: resource.name,
      })
      sendMail({
        to: staffEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'RESOURCE_DOWNLOAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const ackTpl = await getTemplate('RESOURCE_DOWNLOAD_ACK')
    const ack = renderTemplate(ackTpl, {
      name: trimmedName,
      resourceName: resource.name,
      resourceUrl: `${process.env.SITE_URL || 'https://www.aadhiraiinnovations.com'}${resource.url}`,
    })
    sendMail({
      to: trimmedEmail,
      subject: ack.subject,
      text: htmlToText(ack.html),
      html: ack.html,
      meta: { templateKey: 'RESOURCE_DOWNLOAD_ACK', relatedType: 'LEAD', relatedId: lead.id },
    })

    res.status(200).json({ success: true, downloadUrl: resource.url, leadId: lead.id })
  } catch (error) {
    console.error('Resource download failed:', error)
    res.status(500).json({ success: false, message: 'Failed to process download request.' })
  }
})

export default router
