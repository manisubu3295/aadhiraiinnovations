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

// The raw signed license token (fileContents) is deliberately never included in a JSON
// response — it's only ever streamed directly via GET /:id/download, so a page load never
// carries the actual license text through the browser's network log unnecessarily.
const PUBLIC_SELECT = {
  id: true,
  customerName: true,
  email: true,
  whatsapp: true,
  businessName: true,
  plan: true,
  machineId: true,
  status: true,
  licenseId: true,
  issuedAt: true,
  expiresAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
  leadId: true,
  lead: { select: { id: true, name: true } },
}

router.get('/', async (req, res) => {
  const { status } = req.query
  const where = {}
  if (status && STATUSES.includes(status)) where.status = status

  const licenses = await prisma.licenseRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: PUBLIC_SELECT,
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
    select: PUBLIC_SELECT,
  })
  res.status(201).json({ success: true, license })
})

router.get('/:id', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({
    where: { id: req.params.id },
    select: PUBLIC_SELECT,
  })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  res.json({ success: true, license })
})

async function sendLicenseEmail(license) {
  const settings = await getSettings()
  const tpl = await getTemplate('LICENSE_DELIVERY')
  const { subject, html } = renderTemplate(tpl, {
    customerName: license.businessName || license.customerName,
    plan: license.plan,
    expiresAt: license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : '-',
    businessName: settings.businessName,
  })

  await deliverMail({
    to: license.email,
    subject,
    text: htmlToText(html),
    html,
    attachments: [{ filename: 'license.lic', content: Buffer.from(license.fileContents, 'utf-8') }],
    meta: { templateKey: 'LICENSE_DELIVERY', relatedType: 'LICENSE_REQUEST', relatedId: license.id },
  })
}

// Calls the external license-generation service (server/licenseApi.js) and emails the resulting
// .lic file to the customer. Generation and email delivery are tracked separately: once the
// license API mints a token it is saved and the request marked FULFILLED immediately — a real
// license now exists and must never be silently discarded — even if the email step then fails
// (e.g. bad SMTP creds). A retry in that case would mint a second, redundant license instead of
// just resending the one that already exists, so email failure surfaces as a warning with the
// Resend/Download actions, not as FAILED. Only a failure to mint a license at all is FAILED.
router.post('/:id/generate', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id } })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  if (license.status === 'FULFILLED') {
    return res.status(400).json({ success: false, message: 'A license has already been sent for this request.' })
  }

  // Lets the admin backdate/postdate when the plan period actually starts (e.g. payment
  // confirmed on a different day than the license is generated) instead of always using "now".
  let activationDate
  if (req.body?.activationDate) {
    activationDate = new Date(req.body.activationDate)
    if (Number.isNaN(activationDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid activation date.' })
    }
  }

  let issued
  try {
    issued = await generateLicense({
      machineId: license.machineId,
      plan: PLAN_API_KEYS[license.plan],
      customerName: license.businessName || license.customerName,
      email: license.email,
      activationDate,
    })
  } catch (error) {
    const updatedLicense = await prisma.licenseRequest.update({
      where: { id: license.id },
      data: { status: 'FAILED', errorMessage: error.message },
      select: PUBLIC_SELECT,
    })
    return res.status(400).json({ success: false, message: error.message || 'Failed to generate license.', license: updatedLicense })
  }

  const fulfilled = await prisma.licenseRequest.update({
    where: { id: license.id },
    data: {
      status: 'FULFILLED',
      licenseId: issued.licenseId || null,
      fileContents: issued.fileContents,
      issuedAt: issued.issuedAt ? new Date(issued.issuedAt) : new Date(),
      expiresAt: issued.expiresAt ? new Date(issued.expiresAt) : null,
      errorMessage: null,
    },
  })

  if (license.leadId) {
    await prisma.lead.update({ where: { id: license.leadId }, data: { status: 'WON' } })
  }

  try {
    await sendLicenseEmail(fulfilled)
  } catch (error) {
    const withWarning = await prisma.licenseRequest.update({
      where: { id: license.id },
      data: { errorMessage: `License generated, but the email failed to send: ${error.message}. Use Download or Resend below.` },
      select: PUBLIC_SELECT,
    })
    return res.json({ success: true, license: withWarning })
  }

  const publicLicense = await prisma.licenseRequest.findUnique({ where: { id: license.id }, select: PUBLIC_SELECT })
  res.json({ success: true, license: publicLicense })
})

// Re-sends the already-generated license without minting a new one — the fix for exactly the
// case above (email delivery failed after a real license was already issued).
router.post('/:id/resend', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id } })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  if (license.status !== 'FULFILLED' || !license.fileContents) {
    return res.status(400).json({ success: false, message: 'No generated license to resend yet.' })
  }

  try {
    await sendLicenseEmail(license)
  } catch (error) {
    return res.status(400).json({ success: false, message: `Failed to resend: ${error.message}` })
  }

  const updatedLicense = await prisma.licenseRequest.update({
    where: { id: license.id },
    data: { errorMessage: null },
    select: PUBLIC_SELECT,
  })
  res.json({ success: true, license: updatedLicense })
})

// Direct download of the already-generated license file — same auth as everything else in this
// router (session-based requireAuth + requireRole), never a bare guessable URL.
router.get('/:id/download', async (req, res) => {
  const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id } })
  if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
  if (license.status !== 'FULFILLED' || !license.fileContents) {
    return res.status(400).json({ success: false, message: 'This license has not been generated yet.' })
  }

  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', `attachment; filename="license-${license.customerName.replace(/[^a-z0-9]/gi, '_')}.lic"`)
  res.send(license.fileContents)
})

export default router
