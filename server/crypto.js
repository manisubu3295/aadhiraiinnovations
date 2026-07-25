import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

// ENCRYPTION_MASTER_KEY can be any length/format (the .env.example asks for a 32-char random
// string) — hashing it to a fixed 32-byte digest guarantees a valid AES-256 key regardless of
// what's actually in the env var.
function getKey() {
  const secret = process.env.ENCRYPTION_MASTER_KEY
  if (!secret) {
    throw new Error('ENCRYPTION_MASTER_KEY is not set — see .env.example.')
  }
  return crypto.createHash('sha256').update(secret).digest()
}

// Output layout: [iv (12 bytes)][authTag (16 bytes)][ciphertext], base64-encoded as one string.
export function encrypt(plaintext) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64')
}

export function decrypt(payload) {
  const buf = Buffer.from(payload, 'base64')
  const iv = buf.subarray(0, IV_LENGTH)
  const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const ciphertext = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
