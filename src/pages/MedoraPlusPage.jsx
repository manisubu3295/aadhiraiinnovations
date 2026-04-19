import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ExternalLink,
  Download, MessageCircle, Brain, PackageCheck,
  ShieldCheck, Cloud, Wifi, BarChart3, ClipboardList, Database,
} from 'lucide-react'
import Container from '../components/ui/Container'
import Breadcrumbs from '../components/ui/Breadcrumbs'

/* ─── Schema ─────────────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Medora+',
      url: 'https://www.aadhiraiinnovations.com/products/medora-plus',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows, Web, Cloud',
      description:
        "India's AI-powered pharmacy management software. GST-compliant billing, intelligent stock forecasting, medicine expiry tracking, offline-first with cloud sync. Built for Indian pharmacies.",
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
        'GST-compliant billing with HSN codes',
        'AI-powered demand forecasting',
        'Medicine expiry alert system',
        'Offline-first architecture',
        'Cloud sync and remote analytics',
        'Real-time inventory management',
        'Batch and supplier tracking',
        'Role-based access control',
        'Automated business reports',
        'Multi-branch support',
      ],
      publisher: {
        '@type': 'Organization',
        name: 'Aadhirai Innovations',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'medora-plus-page')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const features = [
  {
    icon: ClipboardList,
    title: 'GST-Compliant Billing',
    description: 'HSN codes, GSTIN validation, tax breakdowns, and audit-ready invoice generation — fully compliant with Indian pharmacy billing regulations.',
  },
  {
    icon: Brain,
    title: 'AI Demand Forecasting',
    description: 'Machine learning analyses your sales patterns to predict demand, prevent stockouts, and recommend optimal reorder quantities per medicine.',
  },
  {
    icon: PackageCheck,
    title: 'Expiry Management',
    description: 'Automatic tracking of medicine batch expiry dates with configurable alerts. Reduces expired stock losses and maintains regulatory compliance.',
  },
  {
    icon: Wifi,
    title: 'Offline-First Core',
    description: 'Complete billing, inventory, and reporting without internet. Built for Tamil Nadu pharmacies where connectivity is intermittent.',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Automatic sync to cloud when online. Access your pharmacy analytics and reports from any device, anywhere.',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Reports',
    description: 'Sales trends, profit margins, stock turnover, and supplier analytics — auto-generated daily without manual effort.',
  },
  {
    icon: Database,
    title: 'Batch & Supplier Tracking',
    description: 'Full batch traceability from supplier to patient. Track purchase costs, margins, and supplier delivery reliability.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description: 'Separate access levels for billing staff, pharmacists, managers, and owners. Full audit trail of all transactions.',
  },
]

const whyPoints = [
  { label: 'GST-native', detail: 'Designed around Indian GST — not adapted from foreign billing software' },
  { label: 'Offline-first', detail: 'All core operations work without internet — cloud sync when available' },
  { label: 'AI layer included', detail: 'Forecasting, expiry prediction, and anomaly detection in every tier' },
  { label: 'Built for Tamil Nadu', detail: 'Developed and used by pharmacies in Thanjavur, Chennai, and across Tamil Nadu' },
  { label: 'Full support', detail: 'Structured 5-phase implementation with post-launch engineering support' },
  { label: 'Live demo available', detail: 'Try Medora+ on the live demo environment before any commitment' },
]

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function MedoraPlusPage() {
  usePageSchema()

  return (
    <>
      {/* ── Product hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
        {/* Grid texture */}
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <div className="mb-8 text-white">
            <Breadcrumbs items={[{ label: 'Products', href: '/#portfolio' }, { label: 'Medora+' }]} isDark={true} />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-white/18" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                  Flagship Product · AI Pharmacy Software
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.08]">
                Medora<span className="text-white/35">+</span>
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
                AI-Powered Pharmacy Management Software — India
              </p>

              <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
                Medora+ is India's most complete pharmacy management system — GST-compliant billing,
                AI-powered stock forecasting, medicine expiry alerts, offline-first operation, and
                cloud sync. Built specifically for Indian pharmacies.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://demo.aadhiraiinnovations.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3.5 text-sm font-semibold text-[#060e1c] tracking-wide transition-colors hover:bg-white/92"
                >
                  Launch Live Demo
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="/media/Medora-brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/16 px-6 py-3.5 text-sm font-medium text-white/62 tracking-wide transition-colors hover:border-white/32 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Brochure
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['GST-Compliant', 'AI-Powered', 'Offline-First', 'Cloud Sync', 'Tamil Nadu Built'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium text-white/45"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: demo video */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-xl border border-white/8 shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/Cac-96pbNq0?si=Cl7BEZAgmz9WTrjZ"
                    title="Medora+ pharmacy management software walkthrough — India"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="mt-3 text-[11px] text-white/25 text-center tracking-wide">
                Medora+ product walkthrough · AI Pharmacy Management Software · India
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Product screenshot ────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-12">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              </div>
              <span className="ml-3 text-xs text-slate-400 tracking-wide">
                Medora+ · AI Billing & Inventory Dashboard
              </span>
            </div>
            <img
              src="/media/billing.png"
              alt="Medora+ pharmacy management software dashboard — GST billing and AI inventory"
              className="w-full"
              loading="lazy"
            />
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
                Full Feature Set
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Everything your pharmacy needs, in one integrated system.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ── Why Medora+ ───────────────────────────────────────────────── */}
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
                  Why Medora+
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                Why Indian pharmacies choose Medora+ over generic billing software.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                Most pharmacy software in India is either a foreign product poorly adapted for GST,
                or a basic billing tool with no intelligence layer. Medora+ was built from scratch for
                Indian pharmacy operations — GST-native, AI-powered, and offline-first.
              </p>
              <div className="mt-8">
                <Link
                  to="/solutions/pharmacy-software"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
                >
                  Full pharmacy software overview
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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
      <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20 lg:py-24">
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
              Frequently Asked Questions about Medora+
            </h2>
          </motion.div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 max-w-3xl"
          >
            {[
              {
                q: 'How does Medora+ work without internet?',
                a: 'Medora+ is built on an offline-first architecture. All billing, inventory, and reporting features work completely offline. When internet is available, data automatically syncs to the cloud.',
              },
              {
                q: 'Is Medora+ GST-compliant?',
                a: 'Yes, Medora+ is fully GST-compliant with HSN code management, GSTIN validation, automatic tax calculations, and audit-ready invoices. Every transaction is GST-ready for compliance and tax filing.',
              },
              {
                q: 'What is the pricing model for Medora+?',
                a: 'Medora+ pricing starts at ₹5,000/month for single pharmacy locations and ₹12,000/month for multi-location chains. A free 30-day trial is available. Pricing varies based on features and number of locations.',
              },
              {
                q: 'How long does implementation take?',
                a: 'Most pharmacies go live with Medora+ within 1-2 weeks. Implementation includes setup, data migration from existing systems, staff training, and go-live support. We minimize disruption to your daily operations.',
              },
              {
                q: 'Can Medora+ track medicine expiry dates?',
                a: 'Yes. Medora+ tracks batch-level expiry dates automatically. You receive alerts 30 days before expiry, and expired items are flagged during billing to prevent accidental sales.',
              },
              {
                q: 'Does Medora+ support multiple pharmacy locations?',
                a: 'Yes. Medora+ supports unlimited locations with centralized reporting. Each location has its own user login, but all data syncs to a single dashboard for branch-wide visibility and reporting.',
              },
              {
                q: 'What reports does Medora+ generate?',
                a: 'Medora+ generates daily sales summaries, profit margin analysis, stock turnover reports, top-selling medicines, supplier performance reports, and automated business analytics — all without manual work.',
              },
              {
                q: 'Can I migrate my existing pharmacy data to Medora+?',
                a: 'Yes. We help migrate your existing stock lists, customer records, and historical data. Data migration is included in the implementation process.',
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
                className="rounded-lg border border-slate-200 bg-white p-6"
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

      {/* ── City Pages Links ──────────────────────────────────────────── */}
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
                Medora+ in Your City
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Pharmacy billing software for your city.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl">
              Medora+ is used by pharmacies across Tamil Nadu and South India. Explore how Medora+ fits your city's pharmacy operations.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { city: 'Salem', slug: 'salem' },
              { city: 'Trichy', slug: 'trichy' },
              { city: 'Vellore', slug: 'vellore' },
              { city: 'Tirunelveli', slug: 'tirunelveli' },
              { city: 'Erode', slug: 'erode' },
            ].map((location) => (
              <motion.div
                key={location.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/pharmacy-billing-software/${location.slug}`}
                  className="block rounded-lg border border-slate-200 bg-slate-50 p-6 text-center hover:bg-slate-100 hover:border-slate-300 transition-all"
                >
                  <h3 className="text-sm font-semibold text-[#0B1F3A]">{location.city}</h3>
                  <p className="mt-2 text-xs text-slate-500">Pharmacy billing software</p>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#0B1F3A]/60 group-hover:text-[#0B1F3A]">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Client — Vasantham Pharmacy, Thanjavur, Tamil Nadu
              </span>
            </div>
            <blockquote>
              <p className="text-xl text-slate-700 leading-relaxed font-medium">
                "After implementing Medora+, our billing and stock management became significantly
                more efficient. Tracking medicines and managing inventory is now simple and
                reliable. It has meaningfully improved our daily pharmacy operations."
              </p>
              <footer className="mt-6">
                <div className="text-sm font-semibold text-[#0B1F3A]">Selvakumar</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Owner · Vasantham Pharmacy, Thanjavur, Tamil Nadu
                </div>
              </footer>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2]">
              See Medora+ running in a live pharmacy environment.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Request a live demo walkthrough or try the demo environment yourself. We'll show you
              how Medora+ handles billing, inventory, and AI forecasting for your pharmacy.
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
                Request Demo Call
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
