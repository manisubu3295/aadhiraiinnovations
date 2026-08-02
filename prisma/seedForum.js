// Standalone, manually-run seed for demo forum content — NOT wired into `npm run db:seed`
// (that script is for one-time app bootstrap data; this is optional example content so the
// forum isn't empty on first launch). Run with: node prisma/seedForum.js
//
// Safe to re-run: categories are upserted by slug, demo accounts are upserted by email, and
// each question is skipped if a question with the same title already exists.
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { slugifyTitle } from '../server/forumUtils.js'

dotenv.config()

const prisma = new PrismaClient()

const DEMO_PASSWORD = 'ForumDemo123!'

const CATEGORIES = [
  { name: 'General', slug: 'general' },
  { name: 'Billing', slug: 'billing' },
  { name: 'Medora', slug: 'medora' },
  { name: 'Technical Support', slug: 'technical-support' },
]

const DEMO_FORUM_USERS = [
  { name: 'Priya Sharma', email: 'priya.demo@aadhiraiinnovations.com' },
  { name: 'Karthik R', email: 'karthik.demo@aadhiraiinnovations.com' },
]

// answeredBy: 'staff' (uses the SUPER_ADMIN account, shown as "Aadhirai Support") or a demo
// forum user's email (shown as a regular community answer). accepted marks that answer as the
// question's accepted answer.
const QUESTIONS = [
  {
    category: 'medora',
    askedBy: 'priya.demo@aadhiraiinnovations.com',
    title: 'How do I set up expiry alerts in Medora+?',
    body: "We keep discovering near-expiry stock too late. Is there a way to get a heads-up before medicines expire, and can I control how far in advance we're warned?",
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: 'Go to Settings > Inventory > Expiry Alerts and set your warning threshold (30/60/90 days are the common presets, but you can enter a custom number of days). Once set, anything crossing that window shows up on the dashboard\'s expiry widget, and you can also turn on email notifications to the owner from the same screen so it doesn\'t rely on someone checking the dashboard daily.',
      },
    ],
  },
  {
    category: 'medora',
    askedBy: 'priya.demo@aadhiraiinnovations.com',
    title: 'Does Medora Offline sync data once internet is back, like Medora+ does?',
    body: "I'm evaluating Medora Offline for a branch with unreliable internet. If we go a few days without connectivity and then get it back, does the offline data sync up automatically the way I've seen described for Medora+?",
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: "Good question to clarify before you commit — Medora Offline and Medora+ are two different products, not two modes of the same one. Medora Offline is a one-time-license, fully offline application with no cloud component at all; there's no automatic sync when internet comes back, since it isn't designed to talk to a server. If you need cloud sync/multi-branch visibility, Medora+ is the one built for that (offline-first, syncs in the background once connectivity returns). Medora Offline is the right fit if you specifically want zero ongoing internet dependency and no monthly server costs.",
      },
    ],
  },
  {
    category: 'billing',
    askedBy: 'karthik.demo@aadhiraiinnovations.com',
    title: 'Can multiple staff members have different access levels in Aadhirai Billing?',
    body: "I run two counters and want my billing clerks to only be able to bill, not touch inventory or reports. Is that kind of role separation possible, or is it one login for everyone?",
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: 'Yes — Aadhirai Billing has four built-in roles: Super Admin, Store Manager, Billing Clerk, and Inventory Manager. Each is scoped to what it sounds like: a Billing Clerk login can only bill, not edit inventory or view full reports. You (as the account owner) invite staff from Settings > Team and assign the role at that point — no shared logins needed.',
      },
      {
        answeredBy: 'priya.demo@aadhiraiinnovations.com',
        accepted: false,
        body: "We run it this way across three branches — Billing Clerk role for counter staff, Store Manager for the branch lead who needs to see stock. Works well, just make sure whoever sets it up double-checks each invite got the right role before handing out logins.",
      },
    ],
  },
  {
    category: 'billing',
    askedBy: 'karthik.demo@aadhiraiinnovations.com',
    title: 'Is GST calculated automatically as CGST/SGST vs IGST, or do I have to select it manually?',
    body: 'Some of our customers are in-state and some are out-of-state. Do invoices automatically split into CGST+SGST vs IGST based on that, or is there a manual toggle I need to remember to set on every invoice?',
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: "It's automatic — the system compares the customer's billing state against your registered business state. Same state → CGST + SGST split; different state → IGST. Nothing to toggle per invoice. If you just want to sanity-check a number quickly outside the billing flow, the free GST Calculator tool on our site does the same CGST/SGST/IGST breakdown for a one-off amount.",
      },
    ],
  },
  {
    category: 'technical-support',
    askedBy: 'priya.demo@aadhiraiinnovations.com',
    title: "I forgot my client portal password — how do I reset it myself?",
    body: "I'm locked out of the client portal and don't see a 'forgot password' link anywhere. Am I missing it, or is there another way to reset it?",
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: "You're not missing anything — it's intentionally not self-service. Client portal passwords are reset by our staff rather than an automated email link, so there's no self-service reset flow to exploit. Raise a support ticket (or just email/WhatsApp us with your account details) and we'll issue you a new password directly.",
      },
    ],
  },
  {
    category: 'general',
    askedBy: 'karthik.demo@aadhiraiinnovations.com',
    title: "What's the actual difference between Medora+, Medora Offline, and Aadhirai Billing? Which one is for a pharmacy like mine?",
    body: "I run a single pharmacy and I'm confused looking at the products page — all three seem to do billing and inventory. Which one is actually meant for me, and are any of them overkill?",
    answers: [
      {
        answeredBy: 'staff',
        accepted: true,
        body: "Fair question, the naming isn't obvious at a glance. Medora+ is pharmacy-specific — AI-assisted billing, expiry tracking, GST compliance, offline-first with cloud sync/backup in the background. Medora Offline is also pharmacy-specific but deliberately simpler: one-time license, fully offline, zero ongoing server cost — good if you don't want any cloud dependency at all. Aadhirai Billing is not pharmacy-specific; it's a general multi-tenant billing/inventory tool (barcode checkout, GST invoicing) for any retail business. For a single pharmacy, it's Medora+ vs Medora Offline depending on whether you want cloud backup/multi-branch visibility (Medora+) or zero internet dependency (Medora Offline) — Aadhirai Billing would be the wrong fit unless you also run a separate non-pharmacy retail side.",
      },
      {
        answeredBy: 'priya.demo@aadhiraiinnovations.com',
        accepted: false,
        body: "Seconding Medora+ if your internet is decent — the cloud backup alone was worth it for us after a laptop issue last year. Would've lost weeks of billing data otherwise.",
      },
    ],
  },
]

async function seedCategories() {
  const bySlug = {}
  for (const c of CATEGORIES) {
    bySlug[c.slug] = await prisma.forumCategory.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }
  console.log(`Categories ready: ${Object.keys(bySlug).join(', ')}`)
  return bySlug
}

async function seedDemoForumUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  const byEmail = {}
  for (const u of DEMO_FORUM_USERS) {
    byEmail[u.email] = await prisma.forumUser.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash },
    })
  }
  console.log(`Demo forum accounts ready (password: ${DEMO_PASSWORD}): ${DEMO_FORUM_USERS.map((u) => u.email).join(', ')}`)
  return byEmail
}

async function getStaffAnswerer() {
  const staff = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  if (!staff) {
    console.warn('No SUPER_ADMIN account found — staff-authored answers will be skipped.')
  }
  return staff
}

async function seedQuestions(categoriesBySlug, forumUsersByEmail, staffUser) {
  let created = 0
  let skipped = 0

  for (const q of QUESTIONS) {
    const existing = await prisma.forumQuestion.findFirst({ where: { title: q.title } })
    if (existing) {
      skipped++
      continue
    }

    const author = forumUsersByEmail[q.askedBy]
    const category = categoriesBySlug[q.category]
    const question = await prisma.forumQuestion.create({
      data: {
        slug: slugifyTitle(q.title),
        title: q.title,
        body: q.body,
        authorId: author.id,
        categoryId: category.id,
      },
    })

    let acceptedAnswerId = null
    for (const a of q.answers) {
      if (a.answeredBy === 'staff' && !staffUser) continue
      const isStaff = a.answeredBy === 'staff'
      const answer = await prisma.forumAnswer.create({
        data: {
          body: a.body,
          questionId: question.id,
          authorForumUserId: isStaff ? null : forumUsersByEmail[a.answeredBy]?.id,
          authorStaffUserId: isStaff ? staffUser.id : null,
        },
      })
      if (a.accepted) acceptedAnswerId = answer.id
    }
    if (acceptedAnswerId) {
      await prisma.forumQuestion.update({ where: { id: question.id }, data: { acceptedAnswerId } })
    }

    created++
    console.log(`Created: "${q.title}"`)
  }

  console.log(`Questions: ${created} created, ${skipped} already existed (skipped).`)
}

async function main() {
  const categoriesBySlug = await seedCategories()
  const forumUsersByEmail = await seedDemoForumUsers()
  const staffUser = await getStaffAnswerer()
  await seedQuestions(categoriesBySlug, forumUsersByEmail, staffUser)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
