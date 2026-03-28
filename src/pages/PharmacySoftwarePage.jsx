import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, MessageCircle,
  Brain, PackageCheck, ShieldCheck, Wifi, Cloud,
  BarChart3, ClipboardList, Plus, Minus, ExternalLink,
} from 'lucide-react'
import Container from '../components/ui/Container'

/* ─── Schema: SoftwareApplication + FAQ ──────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Medora+',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Windows, Web',
        description:
          'AI-powered pharmacy management software with GST-compliant billing, inventory control, expiry alerts, and cloud sync for Indian pharmacies.',
        offers: {
          '@type': 'Offer',
          seller: { '@type': 'Organization', name: 'Aadhirai Innovations' },
        },
        featureList: [
          'GST-compliant billing',
          'AI demand forecasting',
          'Medicine expiry alerts',
          'Offline-first with cloud sync',
          'Real-time inventory management',
          'Multi-user access control',
          'Audit-ready reports',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the best pharmacy billing software in Tamil Nadu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Medora+ by Aadhirai Innovations is a leading pharmacy billing software built for Tamil Nadu pharmacies. It offers GST-compliant billing, AI stock forecasting, medicine expiry alerts, and works offline — designed specifically for Indian pharmacy operations.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Medora+ work without internet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Medora+ is built offline-first. All billing, inventory, and reporting features work without internet. Data syncs to the cloud automatically when connectivity is restored.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Medora+ GST-compliant for Indian pharmacies?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Medora+ handles HSN codes, GSTIN validation, GST tax breakdowns, and generates audit-ready GST reports for Indian pharmacy billing requirements.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does pharmacy management software cost in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Medora+ pricing is tailored to pharmacy size and requirements. Contact Aadhirai Innovations via WhatsApp (+91 8508716957) or email for a custom quote.',
            },
          },
        ],
      },
    ]

    const scripts = schemas.map((schema) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-schema', 'pharmacy-page')
      s.text = JSON.stringify(schema)
      document.head.appendChild(s)
      return s
    })

    return () => scripts.forEach((s) => s.remove())
  }, [])
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const features = [
  {
    icon: ClipboardList,
    title: 'GST-Compliant Billing',
    description:
      'Generate GST invoices with HSN codes, GSTIN validation, and audit-ready tax breakdowns. Fully compliant with Indian pharmacy billing requirements.',
  },
  {
    icon: Brain,
    title: 'AI Stock Forecasting',
    description:
      'AI analyses your sales patterns to predict demand, flag slow-moving stock, and recommend reorder quantities — reducing stockouts and overstock.',
  },
  {
    icon: PackageCheck,
    title: 'Medicine Expiry Alerts',
    description:
      'Automatic expiry tracking with configurable alerts weeks before expiry. Reduces expired stock losses and maintains compliance.',
  },
  {
    icon: Wifi,
    title: 'Offline-First Architecture',
    description:
      'All core operations — billing, stock control, reporting — run without internet. Built for Indian pharmacies where connectivity is inconsistent.',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description:
      'When connectivity is available, data syncs automatically to the cloud. Access reports and analytics from anywhere, anytime.',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Reports',
    description:
      'Sales trends, profit margins, stock turnover, and supplier analytics — all generated automatically, with no manual report preparation.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description:
      'Control what each staff member can view and action. Separate access levels for billing, inventory, and management functions.',
  },
  {
    icon: PackageCheck,
    title: 'Batch & Supplier Tracking',
    description:
      'Full batch traceability from supplier to sale. Track purchase prices, margins, and supplier reliability in real time.',
  },
]

const whyPoints = [
  'Built for Indian GST system — not adapted from foreign software',
  'Offline-first core for unreliable connectivity environments',
  'AI intelligence layer included — not an expensive add-on',
  'Structured 5-phase implementation with training included',
  'Post-launch support with direct engineering access',
  'Used by real pharmacies in Tamil Nadu — not just demo clients',
]

const faqs = [
  {
    q: 'What is the best pharmacy billing software in Tamil Nadu?',
    a: 'Medora+ by Aadhirai Innovations is purpose-built for Tamil Nadu pharmacies. It handles GST billing, stock management, expiry alerts, and AI forecasting — all offline-capable.',
  },
  {
    q: 'Does Medora+ work without internet?',
    a: 'Yes. Medora+ is offline-first. Billing, inventory, and reporting all work without internet. Cloud sync happens automatically when connectivity is restored.',
  },
  {
    q: 'Is Medora+ GST-compliant?',
    a: 'Yes. Medora+ generates GST-compliant invoices with HSN codes, GSTIN validation, and audit-ready tax reports — fully aligned with Indian pharmacy compliance requirements.',
  },
  {
    q: 'How long does implementation take?',
    a: 'A standard pharmacy deployment typically takes 2–4 weeks including setup, data migration, staff training, and go-live support. We follow a structured 5-phase delivery process.',
  },
  {
    q: 'Can Medora+ handle multiple pharmacy branches?',
    a: 'Yes. Medora+ supports multi-location pharmacy operations with centralised stock visibility, branch-level billing, and consolidated reporting.',
  },
]

/* ─── Sub-components ─────────────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-[#0B1F3A] leading-snug">
          {faq.q}
        </span>
        <span className="mt-0.5 flex-none text-slate-400">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function PharmacySoftwarePage() {
  usePageSchema()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B1F3A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Pharmacy Software · Tamil Nadu, India
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl leading-[1.08]">
              Pharmacy Management
              <br />
              Software for India.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
              Medora+ is an AI-powered pharmacy management system built specifically for Indian
              pharmacies — GST-compliant billing, intelligent stock forecasting, medicine expiry
              alerts, and offline-first operation with cloud sync.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-7 py-3.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
              >
                View Live Demo
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-7 py-3.5 text-sm font-medium text-[#0B1F3A] tracking-wide transition-colors hover:bg-slate-50"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>

            {/* Trust chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['GST-Compliant', 'Offline-First', 'AI-Powered', 'Tamil Nadu Built', 'Post-Launch Support'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────── */}
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
                What Medora+ Includes
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Complete pharmacy management system — not just billing software.
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
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
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
      <section className="bg-[#0B1F3A] py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-white/20" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Why Indian Pharmacies Choose Medora+
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl leading-[1.2]">
                Built for India, not adapted from foreign software.
              </h2>
              <p className="mt-5 text-base text-white/50 leading-relaxed">
                Most pharmacy software in India is either a foreign product adapted for GST, or
                a basic billing tool with no intelligence. Medora+ was designed from the ground up for
                Indian pharmacies — GST-native, offline-capable, and AI-powered from day one.
              </p>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="space-y-3"
            >
              {whyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-none text-white/40 mt-0.5" strokeWidth={1.75} />
                  <span className="text-sm text-white/65 leading-relaxed">{point}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </Container>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20">
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
                  Client Testimonial — Thanjavur, Tamil Nadu
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2]">
                Vasantham Pharmacy, Thanjavur — using Medora+ for pharmacy billing and stock management.
              </h2>
              <blockquote className="mt-6 border-l-2 border-slate-200 pl-5">
                <p className="text-base text-slate-600 leading-relaxed">
                  "After implementing Medora+, our billing and stock management became significantly
                  more efficient. Tracking medicines and managing inventory is now simple and
                  reliable. It has meaningfully improved our daily pharmacy operations."
                </p>
                <footer className="mt-4">
                  <div className="text-sm font-semibold text-[#0B1F3A]">Selvakumar</div>
                  <div className="text-xs text-slate-400 mt-0.5">Owner · Vasantham Pharmacy, Thanjavur</div>
                </footer>
              </blockquote>
            </motion.div>

            {/* Video testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="overflow-hidden rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/4vQjlgKnycY"
                  title="Medora+ pharmacy software testimonial — Vasantham Pharmacy, Thanjavur"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-slate-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  FAQ
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2]">
                Common questions about Medora+ pharmacy software.
              </h2>
            </motion.div>

            <div className="bg-white rounded-xl border border-slate-200 px-6 md:px-8">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  faq={faq}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2]">
              Ready to upgrade your pharmacy's billing and inventory system?
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Talk to us about Medora+. We'll walk you through a live demo, discuss your
              pharmacy's specific requirements, and give you a clear implementation plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                View Demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp India
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
