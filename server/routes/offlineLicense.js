import express from 'express'
import rateLimit from 'express-rate-limit'
import { prisma } from '../prismaClient.js'
import { getSettings } from '../settings.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { sendMail } from '../mailer.js'
import { sendWhatsApp, getStaffNotifyNumbers } from '../whatsapp.js'

const router = express.Router()

const PLAN_KEYS = ['THREE_MONTH', 'SIX_MONTH', 'ONE_YEAR']

// Public — no auth. Whitelisted fields only; licenseApiKey/licenseApiUrl never leave the server.
router.get('/pricing', async (req, res) => {
  const settings = await getSettings()
  res.json({
    success: true,
    pricing: {
      threeMonthPrice: settings.licensePlan3MoPrice,
      sixMonthPrice: settings.licensePlan6MoPrice,
      oneYearPrice: settings.licensePlan1YrPrice,
      downloadUrl: settings.licenseDownloadUrl || '',
      installGuideUrl: settings.licenseInstallGuideUrl || '',
    },
  })
})

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this address. Try again later.' },
})

router.post('/subscribe', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, whatsapp, businessName, machineId, plan } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedWhatsapp = String(whatsapp || '').trim()
    const trimmedBusinessName = String(businessName || '').trim()
    const trimmedMachineId = String(machineId || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp || !trimmedMachineId) {
      return res.status(400).json({ success: false, message: 'Name, email, WhatsApp number, and Machine ID are required.' })
    }
    if (!PLAN_KEYS.includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' })
    }

    const { lead, licenseRequest } = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedWhatsapp,
          company: trimmedBusinessName || null,
          source: 'Medora Offline Subscription',
        },
      })
      const licenseRequest = await tx.licenseRequest.create({
        data: { leadId: lead.id, plan, machineId: trimmedMachineId },
      })
      return { lead, licenseRequest }
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      whatsapp: trimmedWhatsapp,
      businessName: trimmedBusinessName || '-',
      machineId: trimmedMachineId,
      plan,
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('OFFLINE_LICENSE_LEAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'OFFLINE_LICENSE_LEAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'OFFLINE_LICENSE_LEAD_STAFF',
        components: [trimmedName, plan, trimmedMachineId],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    res.status(201).json({
      success: true,
      message: "Thanks! We'll email your license within 24 hours of confirming payment.",
      leadId: lead.id,
      licenseRequestId: licenseRequest.id,
    })
  } catch (error) {
    console.error('Offline license subscribe failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

// Guided/custom setup — no fixed plan or Machine ID (nothing to activate yet; the whole point is
// a human scopes it first), so this creates a plain Lead with no LicenseRequest, distinguished
// from self-service subscriptions by `source`.
router.post('/enterprise-inquiry', subscribeLimiter, async (req, res) => {
  try {
    const { name, email, whatsapp, businessName, message } = req.body ?? {}

    const trimmedName = String(name || '').trim()
    const trimmedEmail = String(email || '').trim()
    const trimmedWhatsapp = String(whatsapp || '').trim()
    const trimmedBusinessName = String(businessName || '').trim()
    const trimmedMessage = String(message || '').trim()

    if (!trimmedName || !trimmedEmail || !trimmedWhatsapp) {
      return res.status(400).json({ success: false, message: 'Name, email, and WhatsApp number are required.' })
    }

    const lead = await prisma.lead.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedWhatsapp,
        company: trimmedBusinessName || null,
        source: 'Medora Offline — Enterprise/Guided Setup',
        notes: trimmedMessage || null,
      },
    })

    const settings = await getSettings()
    const templateVars = {
      name: trimmedName,
      email: trimmedEmail,
      whatsapp: trimmedWhatsapp,
      businessName: trimmedBusinessName || '-',
      message: trimmedMessage ? trimmedMessage.replace(/\n/g, '<br/>') : '-',
    }

    if (settings.enquiryNotifyEmail || settings.ticketNotifyEmail) {
      const tpl = await getTemplate('OFFLINE_ENTERPRISE_LEAD_STAFF_NOTIFY')
      const { subject, html } = renderTemplate(tpl, templateVars)
      sendMail({
        to: settings.enquiryNotifyEmail || settings.ticketNotifyEmail,
        subject,
        text: htmlToText(html),
        html,
        meta: { templateKey: 'OFFLINE_ENTERPRISE_LEAD_STAFF_NOTIFY', relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    const staffNumbers = new Set(await getStaffNotifyNumbers())
    if (settings.whatsappStaffNotifyNumber) staffNumbers.add(settings.whatsappStaffNotifyNumber)
    for (const number of staffNumbers) {
      sendWhatsApp({
        to: number,
        templateKey: 'OFFLINE_ENTERPRISE_LEAD_STAFF',
        components: [trimmedName, trimmedBusinessName || '-', trimmedWhatsapp],
        meta: { relatedType: 'LEAD', relatedId: lead.id },
      })
    }

    res.status(201).json({
      success: true,
      message: "Thanks! We'll get back to you shortly to discuss your requirements.",
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Offline enterprise inquiry failed:', error)
    res.status(500).json({ success: false, message: 'Failed to submit your request. Please try again.' })
  }
})

export default router
