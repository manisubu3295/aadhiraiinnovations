import crypto from 'crypto'
import { readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PRIVATE_KEY_PATH = process.env.LICENSE_PRIVATE_KEY_PATH || resolve(__dirname, 'license-private.pem')

// Internal LicensePlan enum values -> license duration.
export const PLAN_API_KEYS = {
  THREE_MONTH: '3mo',
  SIX_MONTH: '6mo',
  ONE_YEAR: '1y',
}
const PLAN_DURATION_DAYS = {
  '3mo': 90,
  '6mo': 180,
  '1y': 365,
}

// Same token format as aadhirai-pharma-os/server/licensing/issue-license-token.ts —
// header.payload.signature, base64url, Ed25519 — so tokens issued here verify identically
// to ones minted by that project's own CLI script.
function encodeBase64Url(input) {
  const value = Buffer.isBuffer(input) ? input.toString('base64') : Buffer.from(input, 'utf8').toString('base64')
  return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function issueLicenseToken(claims, privateKeyPem) {
  const header = { alg: 'EdDSA', typ: 'LCT' }
  const encodedHeader = encodeBase64Url(JSON.stringify(header))
  const encodedPayload = encodeBase64Url(JSON.stringify(claims))
  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`, 'utf8')

  const privateKey = crypto.createPrivateKey(privateKeyPem)
  const signature = crypto.sign(null, signingInput, privateKey)

  return `${encodedHeader}.${encodedPayload}.${encodeBase64Url(signature)}`
}

// Signs a license directly in this process — no separate service or network call. The private
// key never leaves this server and this function is never reachable from the frontend (it's
// only ever called from server/routes/licenses.js, itself behind requireAuth+requireRole).
export async function generateLicense({ machineId, plan, customerName, email, activationDate }) {
  const durationDays = PLAN_DURATION_DAYS[plan]
  if (!durationDays) throw new Error(`Invalid plan "${plan}".`)
  if (!machineId) throw new Error('machineId is required.')
  if (!email) throw new Error('email is required.')

  let privateKeyPem
  try {
    privateKeyPem = await readFile(PRIVATE_KEY_PATH, 'utf-8')
  } catch {
    throw new Error(`License signing key not found at ${PRIVATE_KEY_PATH}. Copy license-private.pem there to enable license generation.`)
  }

  const activatedAt = activationDate ? activationDate.getTime() : Date.now()
  const expiresAt = activatedAt + durationDays * 24 * 60 * 60 * 1000
  const licenseId = `LIC-${plan}-${Date.now()}`

  const fileContents = issueLicenseToken(
    { licenseId, email, tier: 'OFFLINE', deviceId: machineId, activatedAt, expiresAt },
    privateKeyPem,
  )

  return {
    success: true,
    fileContents,
    licenseId,
    planTier: plan,
    issuedAt: new Date(activatedAt).toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
  }
}
