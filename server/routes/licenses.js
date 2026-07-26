import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getSettings } from '../settings.js'
import { deliverMail } from '../mailer.js'
import { getTemplate, renderTemplate, htmlToText } from '../emailTemplates.js'
import { generateLicense, PLAN_API_KEYS } from '../licenseApi.js'

const router = express.Router()
// License handling is a Support function, shared by ADMIN and STAFF — same access level as Tickets.
router.use(requireAuth)
router.use(requireRole(['ADMIN', 'STAFF']))

const PLAN_KEYS = Object.keys(PLAN_API_KEYS)
const STATUSES = ['PENDING', 'FULFILLED', 'FAILED']

router.get('/', async (req, res) => {
  const { status } = req.query
  const where = {}
  if (status && STATUSES.includes(status)) where.status = status

  const licenses = await prisma.licenseRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { lead: { select: { id: true, name: true } } },
  })
  res.json({ success: true, licenses })
})

router.post('/', async (req, res) => {
  const { customerName, email, whatsapp, businessName, machineId, plan } = req.body ?? {}

  const trimmedName = String(customerName ?? '').trim()
  const trimmedEmail = String(email ?? '').trim()
  const trimmedMachineId = String(machineId ?? '').trim()

  if (!trimmedName || !trimmedEmail || !trimmedMachineId) {
    return res.status(400).json({ success: false, message: 'Customer name, email, and Machine ID are required.' })
  }
  if (!PLAN_KEYS.includes(plan)) {
    return res.status(400).json({ success: false, message: 'Invalid plan selected.' })
  }

  const license = await prisma.licenseRequest.create({
    data: {
      customerName: trimmedName,
      email: trimmedEmail,
      whatsapp: whatsapp ? String(whatsapp).trim() : null,
      businessName: businessName ? String(businessName).trim() : null,
      machineId: trimmedMachineId,
      plan,
    },
    include: { lead: { select: { id: true, name: true } } },
  })
  res.status(201).json({ success: true, license })
})

router.get('/:id', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({
    where: { id: req.params.id },
    include: { lead: { select: { id: true, name: true } } },
  })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  res.json({ success: true, license })
})

// Calls the external license-generation service (server/licenseApi.js) and emails the resulting
// .lic file to the customer. On failure, records the error on the LicenseRequest (visible in
// the UI for a retry) but leaves any linked Lead's status untouched so a misconfigured API key
// doesn't silently mark a real sale as lost.
router.post('/:id/generate', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id } })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  if (license.status === 'FULFILLED') {
    return res.status(400).json({ success: false, message: 'A license has already been sent for this request.' })
  }

  try {
    const data = await generateLicense({
      machineId: license.machineId,
      plan: PLAN_API_KEYS[license.plan],
      customerName: license.businessName || license.customerName,
      email: license.email,
    })

    const settings = await getSettings()
    const tpl = await getTemplate('LICENSE_DELIVERY')
    const { subject, html } = renderTemplate(tpl, {
      customerName: license.businessName || license.customerName,
      plan: license.plan,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : '-',
      businessName: settings.businessName,
    })

    await deliverMail({
      to: license.email,
      subject,
      text: htmlToText(html),
      html,
      attachments: [{ filename: 'license.lic', content: Buffer.from(data.fileContents, 'utf-8') }],
      meta: { templateKey: 'LICENSE_DELIVERY', relatedType: 'LICENSE_REQUEST', relatedId: license.id },
    })

    const updatedLicense = await prisma.licenseRequest.update({
      where: { id: license.id },
      data: {
        status: 'FULFILLED',
        licenseId: data.licenseId || null,
        issuedAt: data.issuedAt ? new Date(data.issuedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        errorMessage: null,
      },
      include: { lead: { select: { id: true, name: true } } },
    })

    if (license.leadId) {
      await prisma.lead.update({ where: { id: license.leadId }, data: { status: 'WON' } })
    }

    res.json({ success: true, license: updatedLicense })
  } catch (error) {
    const updatedLicense = await prisma.licenseRequest.update({
      where: { id: license.id },
      data: { status: 'FAILED', errorMessage: error.message },
      include: { lead: { select: { id: true, name: true } } },
    })
    res.status(400).json({ success: false, message: error.message || 'Failed to generate license.', license: updatedLicense })
  }
})

export default router
