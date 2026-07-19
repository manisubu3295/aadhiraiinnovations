import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const username = String(process.env.ADMIN_USERNAME || email.split('@')[0] || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Admin'

  if (!email || !username || !password) {
    throw new Error('Set ADMIN_EMAIL, ADMIN_USERNAME (or an email with a local part), and ADMIN_PASSWORD in your .env before seeding.')
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
  if (existing) {
    console.log(`Admin user ${username} already exists — skipping.`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { name, username, email, passwordHash, role: 'ADMIN' },
  })
  console.log(`Created admin user "${username}". You can now log in at /admin.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
