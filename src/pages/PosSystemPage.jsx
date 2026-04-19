import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ExternalLink,
  MessageCircle, Store, Zap, BarChart3, Users, Shield,
} from 'lucide-react'
import Container from '../components/ui/Container'

function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'POS System',
      url: 'https://www.aadhiraiinnovations.com/products/pos-system',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows, Web, Cloud',
      description:
        'Point of Sale (POS) system for retail and pharmacy stores. Fast billing, inventory tracking, customer management, and detailed sales analytics.',
      offers: {
        '@type': 'Offer',
        seller: {
          '@type': 'Organization',
          name: 'Aadhirai Innovations',
          url: 'https://www.aadhiraiinnovations.com',
        },
      },
      featureList: [
        'Fast barcode-based billing',
        'Real-time inventory management',
        'Customer and loyalty management',
        'Sales analytics and reporting',
        'Offline-first operation',
        'Multi-branch support',
        'Tax and compliance ready',
        'Automated daily reconciliation',
      ],
      publisher: {
        '@type': 'Organization',
        name: 'Aadhirai Innovations',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'pos-system-page')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

const features = [
  {
    icon: Zap,
    title: 'Fast Barcode Billing',
    description: 'Process transactions in seconds with barcode scanning. Handle peak hours without slowdowns.',
  },
  {
    icon: BarChart3,
    title: 'Inventory Tracking',
    description: 'Real-time stock visibility across locations with low-stock alerts and reorder recommendations.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Track customer preferences, purchase history, and loyalty rewards in one place.',
  },
  {
    icon: Store,
    title: 'Sales Analytics',
    description: 'Daily sales summaries, top-selling products, peak hours, and profit visibility.',
  },
  {
    icon: Shield,
    title: 'Compliance Ready',
    description: 'Tax-compliant invoicing, automatic reconciliation, and audit-ready records.',
  },
]

const whyPoints = [
  { label: 'Fast transactions', detail: 'Counter speeds of 20-30 seconds per customer' },
  { label: 'Real inventory', detail: 'Always know what is in stock and reorder automatically' },
  { label: 'Customer insights', detail: 'Loyalty, preferences, and repeat buying patterns' },
  { label: 'Profit visibility', detail: 'Know your margins and top-selling products daily' },
  { label: 'Offline capable', detail: 'Works without internet — billing never stops' },
]

export default function PosSystemPage() {
  usePageSchema()

  return (
    <>
      {/* ── Product hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }}
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
                  Retail Point of Sale
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.08]">
                POS System
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
                Fast Billing · Inventory · Analytics
              </p>

              <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
                Fast, reliable point-of-sale system for retail stores, pharmacies, and supermarkets.
                Real-time billing, inventory management, customer tracking, and detailed sales analytics.
                Works online and offline.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://demo.aadhiraiinnovations.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 text-sm font-semibold text-[#060e1c] tracking-wide transition-colors hover:bg-white/92"
                >
                  Launch Demo
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
                {['Fast Billing', 'Inventory Ready', 'Compliance', 'Multi-Store'].map((tag) => (
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
                  <Store className="h-16 w-16 text-slate-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-white font-semibold mb-2">Retail Point of Sale System</h3>
                  <p className="text-sm text-white/40">Fast billing, inventory, customer management</p>
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
              Everything you need for fast, reliable retail billing.
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
                    <Icon className="h-5 w-5 text-[#0B1F3A]/60" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Why POS ───────────────────────────────────────────────────── */}
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
                  Why Our POS
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                POS built for Indian retail and pharmacies.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                Most POS systems are generic or foreign-built. Our POS is designed for Indian retail operations
                with tax compliance, offline capability, and multi-store management built in from day one.
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
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#0B1F3A]/30 mt-0.5" strokeWidth={1.75} />
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
              Common questions about POS System
            </h2>
          </motion.div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 max-w-3xl"
          >
            {[
              {
                q: 'Does the POS work without internet?',
                a: 'Yes. The POS system works completely offline. Billing continues uninterrupted. Sales sync to the cloud when internet returns.',
              },
              {
                q: 'Can we integrate with barcode scanners?',
                a: 'Yes. The POS integrates with standard barcode, QR code, and RFID scanners for fast product lookup and billing.',
              },
              {
                q: 'Is the POS tax-compliant?',
                a: 'Yes. Full GST compliance with automatic tax calculation, HSN codes, and audit-ready invoicing built in.',
              },
              {
                q: 'Can it manage multiple store locations?',
                a: 'Yes. Manage unlimited store locations with centralized inventory visibility, sales reporting, and staff management.',
              },
              {
                q: 'What hardware does the POS need?',
                a: 'The POS runs on standard retail hardware — computer, cash drawer, receipt printer, customer display. Setup in minutes.',
              },
              {
                q: 'Can we track customer loyalty?',
                a: 'Yes. Build customer profiles, track purchase history, manage loyalty points, and run targeted promotions.',
              },
            ].map((faq, i) => (
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
              See the POS System in action.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Request a live demo at your store or try the demo environment. We'll show how fast
              and reliable billing works with our POS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
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
            <p className="mt-6 text-xs text-white/30">
              info@aadhiraiinnovations.com · +91 8508716957 · Peravurani & Chennai, Tamil Nadu
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
