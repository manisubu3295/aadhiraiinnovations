import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ExternalLink,
  MessageCircle, Truck, MapPin, Receipt,
  Package, SlidersHorizontal, FileText, BarChart3, Shield, ScrollText,
} from 'lucide-react'
import Container from '../components/ui/Container'

const DEMO_URL = 'https://transport.aadhiraiinnovations.com'
const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin', password: 'Admin@Demo2026' },
]

/* ─── Schema: SoftwareApplication + FAQ ──────────────────────────────── */
// FAQ schema questions are pulled from the `faqs` array below (single source shared with the
// visible FAQ section) so the structured data can never drift out of sync with what's on-page —
// mirrors HrInventoryPage.jsx's usePageSchema() pattern.
function usePageSchema(faqs) {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Aadhirai Transport & Logistics',
        url: 'https://www.aadhiraiinnovations.com/products/transport-logistics',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Cloud',
        description:
          'Transport and logistics software for Indian fleet operators — quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet and driver management, expense management, and revenue reporting in one system.',
        screenshot: 'https://www.aadhiraiinnovations.com/media/billing.png',
        offers: {
          '@type': 'Offer',
          seller: {
            '@type': 'Organization',
            name: 'Aadhirai Innovations',
            url: 'https://www.aadhiraiinnovations.com',
          },
        },
        featureList: [
          'Quotation to invoice conversion',
          'Live GPS driver tracking',
          'Configurable invoice/quotation numbering',
          'Delivery job tracking with driver status updates',
          'Driver and fleet management',
          'Expense management with approval workflow',
          'Item catalog and configurable rate units',
          'PDF and email invoice/quotation delivery',
          'Revenue dashboard and reports',
          'Role-based access for admin and drivers',
          'Statement of account for client billing',
        ],
        publisher: {
          '@type': 'Organization',
          name: 'Aadhirai Innovations',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ]

    const scripts = schemas.map((schema) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-schema', 'transport-logistics-page')
      s.text = JSON.stringify(schema)
      document.head.appendChild(s)
      return s
    })
    return () => scripts.forEach((s) => s.remove())
  }, [faqs])
}

/* ─── Features ───────────────────────────────────────────────────────── */
const features = [
  {
    icon: FileText,
    title: 'Quotation → Invoice',
    description: 'Build a quotation, then convert it to an invoice in one step — no re-typing line items or client details.',
  },
  {
    icon: MapPin,
    title: 'Live GPS Driver Tracking',
    description: 'A live map shows every driver\'s current position with pickup and delivery pins, refreshed automatically as jobs progress.',
  },
  {
    icon: Truck,
    title: 'Delivery Job Tracking',
    description: 'Assign jobs to drivers and track status from dispatch through delivery, with a driver-facing portal for status updates.',
  },
  {
    icon: Shield,
    title: 'Driver & Fleet Management',
    description: 'Driver records with licence expiry warnings, plus vehicle and fleet tracking in one place.',
  },
  {
    icon: Receipt,
    title: 'Expense Management',
    description: 'Drivers log fuel and vehicle expenses for approval, with every entry tied to a job or vehicle for accurate cost tracking.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Item Catalog & Rate Units',
    description: 'Reusable billable items with unit pricing, and configurable rate units — including true calendar-month billing periods.',
  },
  {
    icon: BarChart3,
    title: 'Revenue Dashboard',
    description: 'Aging, revenue, and client summary reports with CSV export, so you always know where the business stands.',
  },
  {
    icon: Package,
    title: 'PDF & Email Delivery',
    description: 'Branded invoice and quotation PDFs generated automatically and emailed directly to clients.',
  },
  {
    icon: ScrollText,
    title: 'Statement of Account',
    description: 'Date-ranged, status-filtered statements for client billing reconciliation, ready to export.',
  },
]

const whyPoints = [
  { label: 'One system', detail: 'Quotations, invoices, delivery jobs, and fleet records in one place — no more Word/PDF templates or spreadsheets' },
  { label: 'Live visibility', detail: 'See exactly where every driver and job is, in real time, without a phone call' },
  { label: 'Configurable billing', detail: 'Per-KM, per-trip, or true calendar-month rate units — invoices match how you actually bill clients' },
  { label: 'Fewer billing errors', detail: 'Auto-numbered invoices and a reusable item catalog keep every invoice consistent' },
  { label: 'Expense accountability', detail: 'Driver-submitted expenses go through approval, tied to the job or vehicle that incurred them' },
  { label: 'Role-based access', detail: 'Admins see everything; drivers see only their own jobs and expenses' },
]

// Shared between the visible FAQ section below and usePageSchema()'s FAQPage JSON-LD, so the
// structured data can never say something different from what's actually on the page.
const faqs = [
  {
    q: 'What is transport and logistics software?',
    a: 'Transport and logistics software replaces the manual Word/PDF invoicing and spreadsheet-based dispatch most transport companies run on today, centralizing quotations, invoicing, delivery job tracking, fleet and driver records, and revenue reporting into one system.',
  },
  {
    q: 'Does it support live GPS tracking of drivers?',
    a: 'Yes. A live map shows every active driver\'s current position along with pickup and delivery pins, updated automatically as their location pings in — useful for dispatchers and for answering "where is my delivery" without a phone call.',
  },
  {
    q: 'Can a quotation be converted directly into an invoice?',
    a: 'Yes. Build a quotation, and converting it to an invoice is a single step — no re-entering client details or line items.',
  },
  {
    q: 'How does billing work for different job types — per KM, per trip, per month?',
    a: 'Rate units are fully configurable, including a true calendar-month billing option, so invoices match however your business actually bills clients — per kilometre, per trip, or a fixed monthly rate.',
  },
  {
    q: 'Can drivers log fuel and vehicle expenses?',
    a: 'Yes. Drivers submit expense entries tied to a specific job or vehicle, which go through an approval workflow before they\'re counted against revenue.',
  },
  {
    q: 'What does driver and fleet management include?',
    a: 'Driver records with licence expiry warnings, vehicle/fleet records, and a driver-facing portal where drivers update job status and submit expenses — all tied together with delivery jobs and invoices.',
  },
  {
    q: 'Does it generate a statement of account for clients?',
    a: 'Yes. Date-ranged, status-filtered statements of account are available for every client, useful for billing reconciliation and collections.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Most transport companies go live in 2–3 weeks, including setup, invoice numbering configuration, item catalog setup, and staff/driver training.',
  },
]

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function TransportLogisticsPage() {
  usePageSchema(faqs)

  return (
    <>
      <Helmet>
        <title>Transport & Logistics Software India — Quotation, Invoicing, Fleet Tracking | Aadhirai Innovations</title>
        <meta
          name="description"
          content="Transport and logistics software for Indian fleet operators — quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet management, and revenue reporting in one system. Free live demo available."
        />
        <meta
          name="keywords"
          content="transport software, logistics software, fleet management software, transport billing software, delivery tracking software, transport company software India, fleet tracking software, transport invoicing software, logistics management system"
        />
        <link rel="canonical" href="https://www.aadhiraiinnovations.com/products/transport-logistics" />
        <meta property="og:title" content="Transport & Logistics Software India — Quotation, Invoicing, Fleet Tracking | Aadhirai Innovations" />
        <meta
          property="og:description"
          content="Quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet management, and revenue reporting — built for transport and logistics companies."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aadhiraiinnovations.com/products/transport-logistics" />
        <meta property="og:site_name" content="Aadhirai Innovations" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transport & Logistics Software India — Quotation, Invoicing, Fleet Tracking | Aadhirai Innovations" />
        <meta
          name="twitter:description"
          content="Quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet management, and revenue reporting — built for transport and logistics companies."
        />
      </Helmet>

      {/* ── Product hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #1d4ed8, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-white/18" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                  Transport & Logistics Software · India
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.08]">
                Aadhirai Transport & Logistics — quotation-to-invoice, fleet, and live tracking
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
                Billing + Delivery Jobs + Fleet Management
              </p>

              <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
                Aadhirai Transport & Logistics is transport operations software built for Indian fleet
                operators — quotations that convert straight into invoices, live GPS tracking of every
                driver, delivery job tracking, fleet and driver records, expense management, and revenue
                reporting. One system instead of manual Word/PDF invoicing and phone calls to find a driver.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 text-sm font-semibold text-[#060e1c] tracking-wide transition-colors hover:bg-white/92"
                >
                  Launch Live Demo
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://wa.me/918508716957"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/16 px-6 py-3.5 text-sm font-medium text-white/62 tracking-wide transition-colors hover:border-white/32 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Talk to us
                </a>
              </div>

              <div className="mt-6 inline-flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/32">
                  Demo login
                </div>
                {DEMO_CREDENTIALS.map((cred) => (
                  <div key={cred.role} className="flex items-center gap-3 text-[12.5px]">
                    <span className="w-16 shrink-0 text-white/45">{cred.role}</span>
                    <span className="font-mono text-white/78">{cred.email}</span>
                    <span className="font-mono text-white/45">/ {cred.password}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Quotation to Invoice', 'Live GPS Tracking', 'Fleet Management', 'Expense Approval'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-white/45"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-xl border border-white/8 shadow-2xl bg-slate-900 p-6">
                <div className="text-center">
                  <Truck className="h-16 w-16 text-slate-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-white font-semibold mb-2">Unified Transport Operations Dashboard</h3>
                  <p className="text-sm text-white/40">Quotations, invoicing, delivery jobs, and live fleet tracking in one system</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Features
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Billing, delivery jobs, and fleet tracking in one integrated system.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-5 w-5 text-[#1d4ed8]/70" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Why Aadhirai Transport & Logistics ───────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-slate-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Why Aadhirai Transport & Logistics
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                One system for billing, dispatch, and fleet — no more manual invoicing.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                Most transport companies still bill from a Word or PDF template and track jobs over phone
                calls and WhatsApp. Aadhirai Transport & Logistics brings quotations, invoicing, delivery
                jobs, live driver tracking, and fleet records into one system, with revenue reporting that
                updates as jobs close.
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="space-y-3"
            >
              {whyPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#1d4ed8]/40 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <div className="text-sm font-semibold text-[#0B1F3A]">{p.label}</div>
                    <div className="mt-0.5 text-xs text-slate-500 leading-relaxed">{p.detail}</div>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </Container>
      </section>

      {/* ── Available Across India ───────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-14 md:py-16">
        <Container>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Available Across India
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2] max-w-xl">
            Transport and logistics software for fleets across India.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: 'Chennai', href: '/transport-software/chennai' },
              { label: 'Mumbai', href: '/transport-software/mumbai' },
              { label: 'Delhi', href: '/transport-software/delhi' },
              { label: 'Bengaluru', href: '/transport-software/bengaluru' },
              { label: 'Hyderabad', href: '/transport-software/hyderabad' },
              { label: 'Kolkata', href: '/transport-software/kolkata' },
              { label: 'Pune', href: '/transport-software/pune' },
              { label: 'Coimbatore', href: '/transport-software/coimbatore' },
            ].map((c) => (
              <Link
                key={c.href}
                to={c.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-[#0B1F3A] transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
          <Link
            to="/transport-software"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0B1F3A] hover:underline"
          >
            Browse all states &amp; districts
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </section>

      {/* ── FAQ Section ───────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Common questions about Aadhirai Transport & Logistics
            </h2>
          </motion.div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 max-w-3xl"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="rounded-lg border border-slate-200 bg-slate-50 p-6"
              >
                <h3 itemProp="name" className="text-sm font-semibold text-[#0B1F3A] mb-3">
                  {faq.q}
                </h3>
                <div itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2]">
              See Aadhirai Transport & Logistics for your fleet.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Request a demo or try the live environment. We'll show you how quotations, invoicing,
              delivery jobs, and live driver tracking work together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                Launch Demo
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Request Demo
              </a>
            </div>
            <div className="mt-6 inline-flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/32">
                Demo login
              </div>
              {DEMO_CREDENTIALS.map((cred) => (
                <div key={cred.role} className="flex items-center gap-3 text-[12.5px]">
                  <span className="w-16 shrink-0 text-white/45">{cred.role}</span>
                  <span className="font-mono text-white/78">{cred.email}</span>
                  <span className="font-mono text-white/45">/ {cred.password}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-white/30">
              info@aadhiraiinnovations.com · +91 8508716957 · Peravurani & Chennai, Tamil Nadu
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
