import express from 'express'
import { prisma } from '../prismaClient.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { PLAN_API_KEYS } from '../licenseApi.js'
import { mintLicense, emailLicense, invoiceLicense } from '../licenseFulfillment.js'

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
  emailSentAt: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
  leadId: true,
  lead: { select: { id: true, name: true } },
  paymentStatus: true,
  amountPaid: true,
  paidAt: true,
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

// Mints the license (server/licenseFulfillment.js, shared with the automatic Razorpay webhook
// path) — deliberately does NOT email it. Sending is a separate, explicit action (POST
// /:id/send) so staff can generate, double-check details, and only then decide to send.
router.post('/:id/generate', async (req, res) => {
  // Lets the admin backdate/postdate when the plan period actually starts (e.g. payment
  // confirmed on a different day than the license is generated) instead of always using "now".
  let activationDate
  if (req.body?.activationDate) {
    activationDate = new Date(req.body.activationDate)
    if (Number.isNaN(activationDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid activation date.' })
    }
  }

  try {
    await mintLicense(req.params.id, { activationDate })
  } catch (error) {
    const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id }, select: PUBLIC_SELECT })
    if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
    return res.status(400).json({ success: false, message: error.message || 'Failed to generate license.', license })
  }

  const publicLicense = await prisma.licenseRequest.findUnique({ where: { id: req.params.id }, select: PUBLIC_SELECT })
  res.json({ success: true, license: publicLicense })
})

// Explicit, manual send/resend (server/licenseFulfillment.js) — the only place that actually
// emails the customer from the admin side. Works identically whether this is the first send
// or a re-send after an earlier failure.
router.post('/:id/send', async (req, res) => {
  try {
    await emailLicense(req.params.id)
  } catch (error) {
    const license = await prisma.licenseRequest.findUnique({ where: { id: req.params.id }, select: PUBLIC_SELECT })
    if (!license) return res.status(404).json({ success: false, message: 'License request not found.' })
    return res.status(400).json({ success: false, message: error.message, license })
  }

  // Never throws (returns null on any failure) and skips silently if already invoiced — safe
  // to call on every send, including resends.
  await invoiceLicense(req.params.id)

  const updatedLicense = await prisma.licenseRequest.findUnique({ where: { id: req.params.id }, select: PUBLIC_SELECT })
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
