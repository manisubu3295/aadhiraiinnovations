import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { DEFAULT_TEMPLATES } from '../server/emailTemplates.js'
import { DEFAULT_TEMPLATES as DEFAULT_WHATSAPP_TEMPLATES } from '../server/whatsappTemplates.js'

dotenv.config()

const prisma = new PrismaClient()

async function seedAdmin() {
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

// update: {} so re-running the seed never clobbers an admin's edited template copy —
// only genuinely new keys get created.
async function seedEmailTemplates() {
  for (const { key, category, label, subject, bodyHtml } of DEFAULT_TEMPLATES) {
    await prisma.emailTemplate.upsert({
      where: { key },
      update: {},
      create: { key, category, label, subject, bodyHtml },
    })
  }
  console.log(`Seeded ${DEFAULT_TEMPLATES.length} email templates (existing ones left untouched).`)
}

// Same update: {} pattern as seedEmailTemplates — only creates rows for new keys, never
// touches a templateName an admin has already configured.
async function seedWhatsAppTemplates() {
  for (const { key, label } of DEFAULT_WHATSAPP_TEMPLATES) {
    await prisma.whatsAppTemplate.upsert({
      where: { key },
      update: {},
      create: { key, label },
    })
  }
  console.log(`Seeded ${DEFAULT_WHATSAPP_TEMPLATES.length} WhatsApp templates (existing ones left untouched).`)
}

async function main() {
  await seedAdmin()
  await seedEmailTemplates()
  await seedWhatsAppTemplates()
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
