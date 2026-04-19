import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ExternalLink,
  MessageCircle, Users, Clock, Zap, BarChart3, Shield,
} from 'lucide-react'
import Container from '../components/ui/Container'

/* ─── Schema ─────────────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Workforce Manager',
      url: 'https://www.aadhiraiinnovations.com/products/workforce-manager',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows, Web, Cloud',
      description:
        'Workforce management system for attendance, leave, shift scheduling, and payroll data. Biometric integration, exception handling, and multi-location support.',
      offers: {
        '@type': 'Offer',
        seller: {
          '@type': 'Organization',
          name: 'Aadhirai Innovations',
          url: 'https://www.aadhiraiinnovations.com',
        },
      },
      featureList: [
        'Biometric integration with scanners',
        'Leave request and approval workflow',
        'Shift scheduling and planning',
        'Payroll data export',
        'Exception handling (late, early, absent)',
        'Multi-location support',
        'Role-based access control',
        'Attendance reports and analytics',
      ],
      publisher: {
        '@type': 'Organization',
        name: 'Aadhirai Innovations',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'workforce-manager-page')
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => script.remove()
  }, [])
}

/* ─── Features ───────────────────────────────────────────────────────── */
const features = [
  {
    icon: Clock,
    title: 'Biometric Integration',
    description: 'Connects with fingerprint and card scanners for accurate, tamper-proof attendance tracking.',
  },
  {
    icon: Users,
    title: 'Leave Management',
    description: 'Streamlined leave requests, approvals, and tracking with full audit history and compliance.',
  },
  {
    icon: Zap,
    title: 'Shift Scheduling',
    description: 'Plan and adjust shifts across teams with conflict detection and optimal resource allocation.',
  },
  {
    icon: BarChart3,
    title: 'Payroll Export',
    description: 'Accurate payroll data generated from verified attendance — export to accounting systems.',
  },
  {
    icon: Shield,
    title: 'Exception Handling',
    description: 'Automatic flagging of late arrivals, early departures, and absences for management review.',
  },
]

const whyPoints = [
  { label: 'Accurate payroll', detail: 'Payroll processed on verified data, not manual registers' },
  { label: 'Time savings', detail: 'Automated attendance eliminates back-and-forth coordination' },
  { label: 'Compliance records', detail: 'Full audit trail for every attendance and leave decision' },
  { label: 'Real-time visibility', detail: 'Know who is working, where, and when — instantly' },
  { label: 'Exception alerts', detail: 'Automatic flagging of attendance issues for immediate action' },
]

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function WorkforceManagerPage() {
  usePageSchema()

  return (
    <>
      {/* ── Product hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #047857, transparent 70%)' }}
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
                  Workforce Management
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.08]">
                Workforce Manager
              </h1>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
                Attendance · Leave · Scheduling · Payroll
              </p>

              <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
                Workforce Manager handles daily staff management — biometric attendance,
                leave approvals, shift scheduling, and payroll data generation. Works for manufacturing,
                retail, institutions, and any team-based operation.
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
                {['Biometric Ready', 'Shift Planning', 'Payroll Driven', 'Multi-Location'].map((tag) => (
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
                  <Clock className="h-16 w-16 text-slate-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-white font-semibold mb-2">Workforce Attendance & Scheduling</h3>
                  <p className="text-sm text-white/40">Biometric integration, leave management, shift planning</p>
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
              Complete workforce management system.
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

      {/* ── Why Workforce Manager ─────────────────────────────────────── */}
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
                  Why Workforce Manager
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
                Eliminate manual attendance tracking and leave chaos.
              </h2>
              <p className="mt-5 text-base text-slate-500 leading-relaxed">
                Workforce Manager transforms how you manage people — biometric accuracy, instant visibility,
                automated payroll data, and compliance-ready records.
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
              Common questions about Workforce Manager
            </h2>
          </motion.div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 max-w-3xl"
          >
            {[
              {
                q: 'Which biometric devices are supported?',
                a: 'Workforce Manager integrates with most fingerprint and card-based biometric devices. We support common brands and can help configure your existing hardware.',
              },
              {
                q: 'Can we customize leave types?',
                a: 'Yes. Create unlimited leave types and configure policies per department. Track usage, set approval workflows, and generate leave balance reports.',
              },
              {
                q: 'How does shift scheduling work?',
                a: 'Plan shifts visually with conflict detection. Auto-alert when staff are double-booked. Support rotating shifts, on-call, and weekend schedules.',
              },
              {
                q: 'Can it handle multiple locations?',
                a: 'Yes. Manage attendance and shifts across unlimited locations with centralized reporting and per-location analytics.',
              },
              {
                q: 'How does payroll integration work?',
                a: 'Attendance data automatically feeds payroll calculations. Export verified payroll data directly to your accounting system or payroll processor.',
              },
              {
                q: 'What reports are available?',
                a: 'Attendance summaries, leave usage, shift coverage, late/absent patterns, payroll reports, and custom analytics. Export to Excel or PDF.',
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
              See Workforce Manager for your team.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Request a live demo or try the demo environment. We'll show how Workforce Manager
              simplifies attendance, leave, and payroll management.
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
