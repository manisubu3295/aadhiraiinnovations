import crypto from 'crypto'
import { readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRIVATE_KEY_PATH = process.env.LICENSE_PRIVATE_KEY_PATH || resolve(__dirname, 'license-private.pem')

// Internal LicensePlan enum values -> the desktop app's PlanTier values (server/license.ts
// in aadhirai-pharma-os — this and everything below must match that file exactly, since it's
// what actually verifies the license on the customer's machine).
export const PLAN_API_KEYS = {
  THREE_MONTH: '3mo',
  SIX_MONTH: '6mo',
  ONE_YEAR: '1y',
}

// Every plan's advertised duration already INCLUDES the 30-day free trial a customer has
// necessarily already used by the time they buy — so the license itself only covers
// (advertised duration - 30 days). Must stay identical to PLAN_DAYS in
// aadhirai-pharma-os/server/license.ts.
const PLAN_DAYS = {
  '3mo': 60,
  '6mo': 150,
  '1y': 335,
}

// Sorted-key JSON so signing here and verification on the customer's machine never disagree
// over key order — identical to canonicalizeLicensePayload() in aadhirai-pharma-os/server/license.ts.
function canonicalizeLicensePayload(payload) {
  return JSON.stringify(payload, Object.keys(payload).sort())
}

function signLicensePayload(payload, privateKeyPem) {
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  const signature = crypto.sign(null, Buffer.from(canonicalizeLicensePayload(payload)), privateKey)
  return signature.toString('base64')
}

// Signs a license directly in this process, matching aadhirai-pharma-os's own
// script/license/api-server.ts byte-for-byte (payload shape, canonicalization, signature
// encoding) — the desktop app's Activate screen only accepts files produced exactly this way.
// The private key never leaves this server and this function is never reachable from the
// frontend (only called from server/routes/licenses.js, itself behind requireAuth+requireRole).
export async function generateLicense({ machineId, plan, customerName, activationDate }) {
  const durationDays = PLAN_DAYS[plan]
  if (!durationDays) throw new Error(`Invalid plan "${plan}".`)
  if (!machineId || String(machineId).trim().length < 4) {
    throw new Error('machineId is required (shown on the customer\'s Activate screen).')
  }

  let privateKeyPem
  try {
    privateKeyPem = await readFile(PRIVATE_KEY_PATH, 'utf-8')
  } catch {
    throw new Error(`License signing key not found at ${PRIVATE_KEY_PATH}. Copy electron/keys/private.pem (from aadhirai-pharma-os) there to enable license generation.`)
  }

  const issuedAt = activationDate || new Date()
  const expiresAt = new Date(issuedAt.getTime() + durationDays * 24 * 60 * 60 * 1000)

  const payload = {
    machineId: String(machineId).trim(),
    planTier: plan,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    licenseId: crypto.randomUUID(),
    ...(customerName ? { customerName } : {}),
  }

  const signature = signLicensePayload(payload, privateKeyPem)
  const license = { payload, signature }

  return {
    success: true,
    fileContents: JSON.stringify(license, null, 2),
    licenseId: payload.licenseId,
    planTier: payload.planTier,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
  }
}
