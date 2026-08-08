import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ExternalLink,
  MessageCircle, Database, Barcode, ShieldCheck,
  ScrollText, Users, PackageSearch, MapPin,
} from 'lucide-react'
import Container from '../components/ui/Container'
import SeoMeta from '../components/seo/SeoMeta'

const APP_URL = 'https://billing.aadhiraiinnovations.com/login'
const PAGE_URL = 'https://www.aadhiraiinnovations.com/products/billing'

/* ─── Schema ─────────────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Aadhirai Billing',
      url: 'https://www.aadhiraiinnovations.com/products/billing',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, Cloud',
      description:
        'Multi-tenant billing and inventory management software for retail businesses in Tamil Nadu and across India. Every business gets its own isolated database, provisioned automatically at signup. Barcode billing, GST-compliant invoicing, and role-based staff access built in.',
      screenshot: 'https://www.aadhiraiinnovations.com/media/billing.png',
      areaServed: [
        { '@type': 'State', name: 'Tamil Nadu' },
        { '@type': 'Country', name: 'India' },
      ],
      offers: {
        '@type': 'Offer',
        seller: {
          '@type': 'Organization',
          name: 'Aadhirai Innovations',
          url: 'https://www.aadhiraiinnovations.com',
        },
      },
      featureList: [
        'Instant self-signup with automatic database provisioning',
        'Barcode and QR code billing',
        'Dual stock tracking — serialized and bulk quantity',
        'GST-compliant invoicing with HSN codes',
        'Custom fields per business',
        'Role-based staff access',
        'Inventory CSV/Excel/PDF import and export',
        'Admin-mediated password recovery',
      ],
      publisher: {
        '@type': 'Organization',
        name: 'Aadhirai Innovations',
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }

    const s1 = document.createElement('script')
    s1.type = 'application/ld+json'
    s1.setAttribute('data-schema', 'billing-page')
    s1.text = JSON.stringify(schema)
    document.head.appendChild(s1)

    const s2 = document.createElement('script')
    s2.type = 'application/ld+json'
    s2.setAttribute('data-schema', 'billing-page-faq')
    s2.text = JSON.stringify(faqSchema)
    document.head.appendChild(s2)

    return () => { s1.remove(); s2.remove() }
  }, [])
}

/* ─── Content ────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Database,
    title: 'Isolated Database Per Business',
    description: 'Every business that signs up gets its own dedicated database, provisioned automatically — never shared, never mixed with anyone else\'s data.',
  },
  {
    icon: Barcode,
    title: 'Barcode & QR Billing',
    description: 'Fast checkout with barcode and QR code scanning, plus instant thermal receipt printing at the counter.',
  },
  {
    icon: PackageSearch,
    title: 'Dual Stock Tracking',
    description: 'Serial-tracked for high-value items, bulk quantity for everyday stock — configured per product, not forced into one model.',
  },
  {
    icon: ScrollText,
    title: 'GST-Compliant Invoicing',
    description: 'HSN codes, tax breakdown, and audit-ready invoices with a UPI QR code on every receipt.',
  },
  {
    icon: Users,
    title: 'Role-Based Staff Access',
    description: 'Super Admin, Store Manager, Billing Clerk, and Inventory Manager roles — staff see and do only what their role permits.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Password Recovery',
    description: 'Password resets are admin-mediated, not self-service email links — one less way for accounts to be compromised.',
  },
]

const whyPoints = [
  { label: 'Live in minutes', detail: 'Self-signup provisions a dedicated database automatically — no manual onboarding, no waiting on a sales call' },
  { label: 'True data isolation', detail: 'Every business\'s data lives in its own separate database, by design — not a shared table with a tenant_id column' },
  { label: 'Built for any retail business', detail: 'Custom fields adapt to what your business actually sells — no rigid schema forcing you into someone else\'s category system' },
  { label: 'GST-ready from day one', detail: 'HSN codes, tax breakdown, and audit-ready invoices without extra configuration' },
  { label: 'Works at the counter', detail: 'Barcode-driven checkout and thermal receipt printing built for real billing counters, not just back-office reports' },
  { label: 'Made in Tamil Nadu', detail: 'Built and supported by Aadhirai Innovations, based in Peravurani, Tamil Nadu' },
]

const FAQS = [
  {
    q: 'Is Aadhirai Billing free to use?',
    a: 'Yes. You can create a free account and start billing immediately — a dedicated, isolated database is provisioned automatically for your business at signup.',
  },
  {
    q: 'Is this available for businesses in Tamil Nadu?',
    a: 'Yes. Aadhirai Billing is built and supported by Aadhirai Innovations, based in Peravurani, Tamil Nadu. We understand GST compliance, local business operations, and offer support in Tamil for businesses across Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Thanjavur, and every district in between.',
  },
  {
    q: 'Can multiple businesses use the same platform without seeing each other\'s data?',
    a: 'Yes — that\'s the core design. Every business that signs up gets its own completely separate database, not a shared table with row-level filtering. One business can never see, query, or accidentally access another business\'s products, customers, or invoices.',
  },
  {
    q: 'What kind of businesses is this suited for?',
    a: 'Any retail business that bills customers and tracks stock — spare parts and hardware stores, pharmacies, general retail, distributors. Custom fields let you configure exactly what your business needs to track on products and customers instead of forcing a fixed schema.',
  },
  {
    q: 'What happens if I forget my password?',
    a: 'Password resets are admin-mediated for security — you submit a request, our team verifies and resets it, and emails you a new password. This avoids the security risks of self-service email reset links.',
  },
  {
    q: 'Can I import my existing product and stock data?',
    a: 'Yes. Inventory supports bulk CSV import, plus CSV, Excel, and PDF export for your existing stock records.',
  },
  {
    q: 'Does it support GST billing?',
    a: 'Yes. Every invoice supports HSN codes, GST tax breakdown, and generates audit-ready records — with a UPI QR code on the printed receipt for instant payment.',
  },
  {
    q: 'How many staff members can I add?',
    a: 'As many as your business needs. Each staff member gets a role — Store Manager, Billing Clerk, or Inventory Manager — so they see and do only what\'s relevant to their job.',
  },
]

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function BillingPage() {
  usePageSchema()

  return (
    <>
      <SeoMeta
        title="Billing & Inventory Software for Tamil Nadu Businesses | Aadhirai Billing"
        description="Free multi-tenant billing and inventory software for retail businesses in Tamil Nadu — Chennai, Coimbatore, Madurai, Trichy, Salem & more. Barcode billing, GST invoicing, isolated database per business. Made in Peravurani, Tamil Nadu."
        keywords="billing software Tamil Nadu, inventory management software Tamil Nadu, GST billing software Chennai, retail billing software Coimbatore, POS software Madurai, barcode billing software Tamil Nadu, multi-tenant billing software India, free billing software for shops"
        canonical={PAGE_URL}
        ogTitle="Aadhirai Billing — Billing & Inventory Software for Tamil Nadu Businesses"
        ogDescription="Sign up free and get your own isolated database in minutes. Barcode billing, GST invoicing, and inventory management built for retail businesses across Tamil Nadu."
      />

      {/* ── Product hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #b91c1c, transparent 70%)' }}
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
                  Billing & Inventory
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.08]">
                Aadhirai Billing
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
                Multi-Tenant Billing &amp; Inventory Management
              </p>

              <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
                Sign up and get your own isolated database in minutes. Barcode billing, GST-compliant
                invoicing, dual stock tracking, and role-based staff access — built for any retail
                business, made in Tamil Nadu.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 text-sm font-semibold text-[#060e1c] tracking-wide transition-colors hover:bg-white/92"
                >
                  Create Free Account
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

              <div className="mt-8 flex flex-wrap gap-2">
                {['Multi-Tenant', 'GST Ready', 'Barcode Billing', 'Made in Tamil Nadu'].map((tag) => (
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
                  <Barcode className="h-16 w-16 text-slate-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-white font-semibold mb-2">Your Own Isolated Database</h3>
                  <p className="text-sm text-white/40">Provisioned automatically the moment you sign up</p>
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
              Everything a retail business needs to bill and track stock.
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
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-5 w-5 text-[#b91c1c]/70" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Why Aadhirai Billing ─────────────────────────────────────── */}
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
                  Why Aadhirai Billing
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                One database per business — not a shared table with your competitor's data.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                Most low-cost billing tools share one database across every customer, relying on filtering
                to keep your data separate. Aadhirai Billing provisions a genuinely separate database for
                every business at signup — isolation by architecture, not by hope.
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
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#b91c1c]/40 mt-0.5" strokeWidth={1.75} />
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

      {/* ── Built for Tamil Nadu ────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <MapPin className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Built in Tamil Nadu
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                Made and supported by Aadhirai Innovations, Peravurani.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                We're not a distant vendor reading your requirements off a support ticket. Aadhirai
                Innovations is based right here in Tamil Nadu — we understand GST compliance, local
                billing counter realities, and how retail businesses across the state actually operate
                day to day. Support is available in Tamil.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                Serving retail businesses across
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
                  'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Thoothukudi',
                  'Dindigul', 'Karur', 'Peravurani', 'Pattukottai',
                ].map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-slate-600"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-slate-400 leading-relaxed">
                Not seeing your district? Aadhirai Billing works anywhere in Tamil Nadu and across India —
                it's a cloud platform, not a location-locked installation.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── FAQ Section ───────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-20 lg:py-24">
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
              Common questions about Aadhirai Billing
            </h2>
          </motion.div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="grid gap-4 sm:grid-cols-2 max-w-4xl"
          >
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <h3 itemProp="name" className="text-sm font-semibold text-[#0B1F3A] mb-3">
                  {faq.q}
                </h3>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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
              Start billing in minutes — free.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Create your account and get your own isolated database automatically. No sales call
              required to get started.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                Create Free Account
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to us
              </a>
            </div>
            <p className="mt-6 text-xs text-white/30">
              info@aadhiraiinnovations.com · +91 8508716957 · Peravurani &amp; Chennai, Tamil Nadu
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
