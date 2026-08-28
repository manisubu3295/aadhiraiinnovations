import express from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendMail } from '../mailer.js'
import { sendWhatsApp, getStaffNotifyNumbers } from '../whatsapp.js'

const router = express.Router()

// Mirrors server/routes/offlineLicense.js's POST /enterprise-inquiry — same shape (public,
// rate-limited, creates a Lead, notifies staff by email + WhatsApp) for the "Get a ballpark
// estimate" form on the /pricing page. Deliberately does NOT compute or return a price: the 5
// custom-scoped systems this covers are genuinely bespoke-priced, so the honest response is
// "we'll follow up with a scoped estimate," not a generated number.
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this address. Try again later.' },
})

router.post('/', inquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, product, teamSize, locations, message } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedPhone = String(phone || '').trim()
    const trimmedProduct = String(product || '').trim()
    const trimmedTeamSize = String(teamSize || '').trim()
    const trimmedLocations = String(locations || '').trim()
    const trimmedMessage = String(message || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedProduct) {
      return res.status(400).json({ success: false, message: 'Name, email, and the system you\'re interested in are required.' })
    }

    const notesLines = [
      `Product: ${trimmedProduct}`,
      trimmedTeamSize ? `Team size: ${trimmedTeamSize}` : null,
      trimmedLocations ? `Locations: ${trimmedLocations}` : null,
      trimmedMessage ? `Notes: ${trimmedMessage}` : null,
    ].filter(Boolean)

    const lead = await prisma.lead.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || null,
        source: 'Pricing Page Estimate Request',
        notes: notesLines.join('\n'),
      },
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || '-',
      product: trimmedProduct,
      teamSize: trimmedTeamSize || '-',
      locations: trimmedLocations || '-',
      message: trimmedMessage ? trimmedMessage.replace(/\n/g, '<br/>') : '-',
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('PRICING_INQUIRY_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'PRICING_INQUIRY_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'PRICING_INQUIRY_LEAD_STAFF',
        components: [trimmedName, trimmedProduct, trimmedPhone || '-'],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    res.status(201).json({
      success: true,
      message: "Thanks — we'll follow up with a scoped estimate within 1 business day.",
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Pricing inquiry failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

export default router
