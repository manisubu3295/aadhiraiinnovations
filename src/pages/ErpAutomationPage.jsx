import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, MessageCircle,
  Brain, Building2, Workflow, BarChart3, Database,
  ShieldCheck, Layers, MonitorCog, Plus, Minus,
} from 'lucide-react'
import Container from '../components/ui/Container'

/* ─── Schema ─────────────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What ERP systems do you build for Indian SMEs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Aadhirai Innovations builds custom ERP systems for Indian small and mid-sized businesses covering inventory management, multi-location operations, workflow automation, AI analytics, and process intelligence. Systems are delivered in structured phases with full post-launch support.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is workflow automation for Indian businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Workflow automation replaces manual, repetitive business processes with AI-driven routing and decision support. Examples include automated approval workflows, purchase order processing, inventory reorder triggers, and staff task routing — reducing manual overhead by 60–80%.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you build ERP systems that work offline in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We build offline-first ERP systems that operate without continuous internet connectivity — essential for many Indian business environments. Cloud sync and centralised reporting work when connectivity is available.',
          },
        },
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'erp-page')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const capabilities = [
  {
    icon: Layers,
    title: 'Custom ERP Systems',
    description:
      'End-to-end ERP designed around your actual business workflows — not a generic template. Inventory, billing, procurement, staff, and reporting in one system.',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'Replace manual approvals, routing, and data entry with AI-driven automation. Approval chains, reorder triggers, escalations — all intelligent and automatic.',
  },
  {
    icon: Brain,
    title: 'AI Business Analytics',
    description:
      'Embedded AI transforms your operational data into demand forecasts, anomaly alerts, and business insights — without manual analysis.',
  },
  {
    icon: Building2,
    title: 'Multi-Location Operations',
    description:
      'Centralised visibility across multiple branches, warehouses, or outlets. Consolidated reporting with branch-level operational control.',
  },
  {
    icon: Database,
    title: 'Inventory Intelligence',
    description:
      'Real-time stock tracking with predictive reorder alerts, supplier performance analytics, and AI-driven demand forecasting across all locations.',
  },
  {
    icon: BarChart3,
    title: 'Operational Reporting',
    description:
      'Automated daily, weekly, and monthly reports. Sales performance, stock turnover, staff productivity — available without manual preparation.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    description:
      'Granular access control so each team member sees only what they need — from floor staff to management to multi-location administrators.',
  },
  {
    icon: MonitorCog,
    title: 'Hybrid Desktop + Web',
    description:
      'Offline-capable desktop for operations, cloud dashboard for management visibility. Works in environments with inconsistent internet connectivity.',
  },
]

const process = [
  {
    step: '01',
    title: 'Business Discovery',
    description: 'We study your actual workflows, bottlenecks, and operational requirements before designing anything.',
  },
  {
    step: '02',
    title: 'System Architecture',
    description: 'Architecture designed for your scale, data model, and integration requirements — not a cloned template.',
  },
  {
    step: '03',
    title: 'Phased Build',
    description: 'Development in controlled phases with milestone reviews. No big-bang delivery — each phase is production-tested.',
  },
  {
    step: '04',
    title: 'Go-Live & Training',
    description: 'Structured cutover with staff training, parallel running period, and on-site support during go-live.',
  },
  {
    step: '05',
    title: 'Post-Launch Support',
    description: 'Ongoing engineering support, performance monitoring, and iterative improvements based on real usage.',
  },
]

const faqs = [
  {
    q: 'What ERP systems do you build for Indian SMEs?',
    a: 'We build custom ERP systems for Indian businesses covering inventory, billing, procurement, workflow automation, and AI analytics. Every system is designed around your actual business — not a repurposed foreign template.',
  },
  {
    q: 'How is your ERP different from SAP or Tally?',
    a: 'SAP is for large enterprises with large budgets and large IT teams. Tally is accounting software, not ERP. We build purpose-designed systems for your specific business workflows — with AI intelligence, offline capability, and founder-led delivery accountability.',
  },
  {
    q: 'Do your ERP systems work offline?',
    a: 'Yes. We build offline-first systems designed for Indian business environments where internet connectivity is inconsistent. Cloud sync and centralised analytics work when connectivity is available.',
  },
  {
    q: 'What industries do you build ERP for?',
    a: 'Retail, pharmacy chains, distribution, manufacturing SMEs, and service businesses. Any operation that needs to replace manual processes, spreadsheets, or fragmented software with a single intelligent system.',
  },
  {
    q: 'How long does an ERP project take?',
    a: 'Depending on scope, a standard SME ERP project takes 8–20 weeks from discovery to go-live. We deliver in phases, so you start seeing production value before the full system is complete.',
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
        <span className="text-sm font-semibold text-[#0B1F3A] leading-snug">{faq.q}</span>
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
export default function ErpAutomationPage() {
  usePageSchema()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
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
                ERP & Automation · India
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl leading-[1.08]">
              ERP & Business Automation
              <br />
              for Indian SMEs.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
              We design and build custom ERP systems and workflow automation for Indian small and
              mid-sized businesses — AI-powered, offline-capable, and delivered in structured
              phases with full post-launch support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-7 py-3.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
              >
                Discuss Your Requirements
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@aadhiraiinnovations.com"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-7 py-3.5 text-sm font-medium text-[#0B1F3A] tracking-wide transition-colors hover:bg-slate-50"
              >
                Email Us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {['Custom-Built ERP', 'AI Analytics', 'Offline-First', 'Tamil Nadu Based', '5-Phase Delivery'].map(
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

      {/* ── Capabilities ──────────────────────────────────────────────── */}
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
                What We Build
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              ERP and automation capabilities built for serious Indian operations.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-5 w-5 text-[#0B1F3A]/60" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-white/20" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                How We Deliver
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl max-w-xl leading-[1.2]">
              5-phase delivery for ERP and automation projects.
            </h2>
            <p className="mt-4 text-base text-white/50 max-w-xl leading-relaxed">
              No big-bang launches. Every ERP project is delivered in controlled phases — each
              milestone tested and approved before the next begins.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-xl border border-white/8 bg-white/5 p-5"
              >
                <div className="text-2xl font-bold text-white/15 mb-3 leading-none">{p.step}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Industries ────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Industries We Serve
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              ERP and automation for every demanding Indian industry.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Pharmacy Chains',
                desc: 'Multi-branch pharmacy ERP with centralised stock control, AI demand forecasting, GST billing, and expiry management across all locations.',
              },
              {
                n: '02',
                title: 'Retail Operations',
                desc: 'Retail ERP covering point-of-sale, multi-location inventory, supplier management, AI demand forecasting, and consolidated reporting.',
              },
              {
                n: '03',
                title: 'SME Businesses',
                desc: 'Process automation, workflow intelligence, and operational ERP for growing Indian businesses that need enterprise capability without enterprise pricing.',
              },
            ].map((ind, i) => (
              <motion.div
                key={ind.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-xl border border-slate-200 p-7"
              >
                <div className="text-3xl font-bold text-slate-100 mb-4 leading-none">{ind.n}</div>
                <h3 className="text-base font-semibold text-[#0B1F3A] mb-2">{ind.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
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
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">FAQ</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2]">
                Questions about our ERP and automation systems.
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
              Ready to replace spreadsheets and fragmented software with a real ERP system?
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Start with a 30-minute technical discussion. We'll understand your business,
              identify automation opportunities, and outline a clear implementation plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp India
              </a>
              <a
                href="mailto:info@aadhiraiinnovations.com"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                Email Us
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
