import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Shield, Target, FileText,
  Clock, BarChart3, Lock, Search, MessageSquare, Layers,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import Container from '../components/ui/Container'

/* ─── Animation ─────────────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }
const fadeIn   = { hidden: { opacity: 0 },         show: { opacity: 1,       transition: { duration: 0.7, ease: 'easeOut' } } }
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

/* ─── Data ──────────────────────────────────────────────────────────────── */
const metrics = [
  { value: '8+',    sup: 'yrs',   label: 'Backend engineering\nexperience'     },
  { value: '3',     sup: 'weeks', label: 'Kickoff to written\naudit report'     },
  { value: '₹4–6L', sup: '',      label: 'Fixed-price audit,\nagreed upfront'   },
  { value: '100%',  sup: '',      label: 'Written deliverables,\nevery engagement' },
]

const services = [
  {
    num: '01',
    title: 'Production Readiness Audit',
    tag: '₹4–6 lakh · 3 weeks',
    desc: "A structured 3-week assessment that maps every major risk in your backend — service architecture, data layer, infrastructure, observability, failure modes. Ends with a written report your team keeps and acts on.",
    href: '/services#audit',
  },
  {
    num: '02',
    title: 'Architecture Advisory Retainer',
    tag: 'Monthly · Min 3 months',
    desc: "Ongoing senior architectural judgment as you scale. Monthly working sessions, async review of technical proposals, and expert input on major decisions before you commit to them.",
    href: '/services#retainer',
  },
  {
    num: '03',
    title: 'Fixed-Scope Engineering',
    tag: 'Project-based · Fixed price',
    desc: "Senior implementation on a defined, high-stakes backend project. Multi-tenant data architecture, high-availability services, complex API design. Fixed quote, clear endpoint, clean handover.",
    href: '/services#engineering',
  },
]

const auditPhases = [
  {
    week: 'Week 1',
    icon: MessageSquare,
    title: 'Kickoff & Interviews',
    desc: 'Align on scope, access systems, structured technical interviews with engineering leads.',
    items: ['Codebase access', 'Infra review setup', 'Tech lead interviews'],
  },
  {
    week: 'Weeks 1–2',
    icon: Search,
    title: 'System Review',
    desc: 'Deep review of actual systems — codebase, infra-as-code, deployment config, monitoring.',
    items: ['Service architecture', 'Data layer analysis', 'Deployment posture'],
  },
  {
    week: 'Week 2–3',
    icon: Layers,
    title: 'Risk Analysis',
    desc: 'Classify every finding by severity and implementation effort. Ruthless prioritisation.',
    items: ['Failure mode mapping', 'Risk classification', 'Remediation scoping'],
  },
  {
    week: 'Week 3',
    icon: FileText,
    title: 'Written Report',
    desc: 'Structured written assessment — not a deck. A document your team acts from independently.',
    items: ['Findings document', 'Prioritised action list', 'Executive summary'],
  },
]

const differentiators = [
  {
    icon: Shield,
    title: 'Banking-grade systems experience',
    desc: 'Our senior architect brings direct experience from enterprise-grade financial infrastructure — the kind where failure means regulatory exposure. Those standards translate directly to better outcomes at growth stage.',
  },
  {
    icon: Target,
    title: 'Specialists, not generalists',
    desc: "We do backend architecture. Not frontend, not mobile, not product strategy. That narrow focus means genuine expertise in the domain where you need it — not work we're learning on your time.",
  },
  {
    icon: Lock,
    title: 'Fixed scope, written deliverables',
    desc: "Every engagement produces a document your team keeps and can evaluate us against. No vague retainers. No slide decks. Written work that stands on its own.",
  },
]

const engagements = [
  {
    featured: true,
    sector: 'Fintech Platform · Series A',
    title: 'Pre-scale architecture review',
    outcome: 'Remediation plan executed within one quarter',
    desc: 'A payments-adjacent company preparing for rapid customer growth needed to know whether their backend could handle a 10x increase in transaction volume. We assessed service architecture, database design, query performance characteristics, and failure handling. The written report gave their engineering team a prioritised action list they executed without further guidance.',
  },
  {
    featured: false,
    sector: 'B2B SaaS Marketplace · Series B',
    title: 'Multi-tenancy and data isolation review',
    outcome: 'Data boundary risk resolved pre-customer',
    desc: 'A marketplace platform scaling from 50 to 500 enterprise customers needed confidence in their data isolation model. We identified an existing boundary risk before it reached customers and simplified their compliance posture.',
  },
  {
    featured: false,
    sector: 'B2B SaaS · Series A',
    title: 'Reliability and observability uplift',
    outcome: 'Intermittent issue eliminated within 6 weeks',
    desc: 'An early-scale product experiencing reliability issues under load. We identified the architectural root causes and provided a prioritised written plan the team executed directly.',
  },
]

/* ─── Assessment scope for visual grid ─────────────────────────────────── */
const scopeAreas = [
  { label: 'Service Architecture',  note: 'Coupling · Boundaries · Communication' },
  { label: 'Data Layer',            note: 'Schema · Query performance · Migration risk' },
  { label: 'Infrastructure',        note: 'Config management · Deployment · Scaling headroom' },
  { label: 'Observability',         note: 'Logging · Metrics · Alerting · Detection' },
  { label: 'Failure Modes',         note: 'Single points · Cascading risk · Degradation' },
  { label: 'Multi-tenancy',         note: 'Data isolation · Tenant boundaries · Compliance' },
]

/* ══════════════════════════════════════════════════════════════════════════
   HomePage
══════════════════════════════════════════════════════════════════════════ */
function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ── 1. Metrics ───────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A]">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] md:grid-cols-4 md:divide-y-0">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-2 px-6 py-10 first:pl-0 last:pr-0"
              >
                <div className="flex items-end gap-1.5 leading-none">
                  <span
                    className="font-black text-white tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                  >
                    {m.value}
                  </span>
                  {m.sup && (
                    <span className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-300/50">
                      {m.sup}
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] font-medium text-white/28 leading-[1.55] whitespace-pre-line">
                  {m.label}
                </span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 2. Services — index row layout ───────────────────────────────── */}
      <section id="services" className="py-20 md:py-28 lg:py-32 scroll-mt-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-8 mb-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Services</span>
                <h2
                  className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                  style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)' }}
                >
                  Three engagements.
                  <br />
                  One area of focus.
                </h2>
              </div>
              <Link
                to="/services"
                className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-slate-400 hover:text-[#0B1F3A] transition-colors pb-1 border-b border-transparent hover:border-slate-300"
              >
                Full details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Rows */}
            <div className="mt-10">
              {services.map((s, i) => (
                <motion.div key={s.title} variants={fadeUp} transition={{ delay: i * 0.06 }}>
                  <Link to={s.href} className="group block">
                    <div className="grid grid-cols-[2.5rem_1fr] gap-6 border-t border-slate-100 py-7 transition-all duration-200 hover:pl-2 lg:grid-cols-[2.5rem_1fr_auto] lg:items-center lg:gap-10">
                      {/* Number */}
                      <span className="text-[11px] font-black tracking-[0.18em] text-slate-200 pt-1">
                        {s.num}
                      </span>

                      {/* Content */}
                      <div>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h3 className="text-[17px] font-semibold text-[#0B1F3A] group-hover:text-blue-700 transition-colors">
                            {s.title}
                          </h3>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                            {s.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] text-slate-500 leading-[1.75] max-w-[58ch]">
                          {s.desc}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className="hidden lg:block h-4 w-4 text-slate-300 group-hover:text-[#0B1F3A] group-hover:translate-x-1 transition-all"
                        strokeWidth={1.75}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-slate-100" />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 3. Why us — asymmetric dark section ──────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050d1a] py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute top-0 right-0 h-[700px] w-[700px] -translate-y-1/4 translate-x-1/4 rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:items-start">

            {/* Left: large statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/28">
                Why us
              </span>
              <h2
                className="mt-5 font-semibold leading-[1.08] tracking-[-0.04em] text-white"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)' }}
              >
                Banking-grade
                <br />
                rigour.
                <br />
                <span className="text-gradient-ai">Startup-stage</span>
                <br />
                focus.
              </h2>
              <p className="mt-7 text-[15px] text-white/38 leading-[1.85] max-w-[32ch]">
                We apply the standards of high-availability financial infrastructure
                to the specific problems of growth-stage software companies.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-white/40 hover:text-white/80 transition-colors"
              >
                Our approach <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Right: stacked items with dividers */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="divide-y divide-white/[0.07]"
            >
              {differentiators.map((d, i) => (
                <motion.div
                  key={d.title}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-5 py-8 first:pt-0"
                >
                  <div className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05]">
                    <d.icon className="h-4.5 w-4.5 text-blue-300/60" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">{d.title}</h3>
                    <p className="mt-2.5 text-[13.5px] text-white/40 leading-[1.75]">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── 4. Audit — visual timeline ───────────────────────────────────── */}
      <section id="audit" className="py-20 md:py-28 lg:py-32 scroll-mt-20 bg-white">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            variants={stagger}
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-2 lg:gap-16 lg:items-end mb-14">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Lead offering</span>
                <h2
                  className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                  style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)' }}
                >
                  Production Readiness Audit
                </h2>
              </div>
              <p className="text-[15px] text-slate-500 leading-[1.85]">
                A 3-week structured assessment that maps every material risk in your backend
                and delivers a written report your engineering team acts on directly.
                Not a deck. Not a conversation. A document.
              </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative mb-12">
              {/* Connector line */}
              <div className="absolute top-5 left-5 right-5 h-px bg-slate-100 hidden lg:block pointer-events-none" />

              <div className="grid gap-8 lg:grid-cols-4">
                {auditPhases.map((phase, i) => (
                  <motion.div
                    key={phase.title}
                    variants={fadeUp}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    {/* Node on timeline */}
                    <div className="relative z-10 mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1F3A] shadow-[0_0_0_4px_white,0_0_0_5px_#e2e8f0]">
                      <phase.icon className="h-4 w-4 text-white/80" strokeWidth={1.75} />
                    </div>

                    <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-blue-500/60 mb-1.5">
                      {phase.week}
                    </span>
                    <h3 className="text-[14.5px] font-semibold text-[#0B1F3A] mb-2">{phase.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-[1.7] mb-4">{phase.desc}</p>

                    <ul className="space-y-1.5">
                      {phase.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-[12px] text-slate-400">
                          <span className="h-1 w-1 rounded-full bg-slate-300 flex-none" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scope grid */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 mb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
                What we assess
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {scopeAreas.map((area, i) => (
                  <div key={area.label} className="flex items-start gap-3">
                    <span className="mt-[3px] flex h-5 w-5 flex-none items-center justify-center rounded bg-[#0B1F3A]/06 text-[9px] font-black text-[#0B1F3A]/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0B1F3A]">{area.label}</p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">{area.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Summary row */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {[
                  { icon: Clock,    label: 'Timeline',    value: '3 weeks from kickoff'            },
                  { icon: FileText, label: 'Deliverable', value: 'Written assessment + action list' },
                  { icon: Search,   label: 'Method',      value: 'Codebase · infra · interviews'   },
                  { icon: BarChart3,label: 'Investment',  value: '₹4–6 lakh, agreed upfront'       },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
                      <Icon className="h-3.5 w-3.5 text-[#0B1F3A]/40" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#0B1F3A]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
                >
                  Request an Audit <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-6 py-3 text-[13.5px] font-semibold text-[#0B1F3A] transition-colors hover:bg-slate-50"
                >
                  Full scope details
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </Container>
      </section>

      {/* ── 5. Engagements — featured + 2 ───────────────────────────────── */}
      <section className="py-20 md:py-28 lg:py-32 bg-slate-50">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Recent engagements
              </span>
              <h2
                className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)' }}
              >
                What we've been working on.
              </h2>
              <p className="mt-2 text-[12.5px] italic text-slate-400">
                Client confidentiality protected. Representative summaries.
              </p>
            </motion.div>

            {/* Featured engagement */}
            <motion.div
              variants={fadeUp}
              className="mb-5 overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="grid lg:grid-cols-[2fr_3fr]">
                {/* Left: dark metadata panel */}
                <div className="bg-[#0B1F3A] p-8 flex flex-col justify-between gap-8 relative overflow-hidden">
                  <div className="absolute inset-0 grid-texture pointer-events-none opacity-60" />
                  <div className="relative">
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/30 block mb-4">
                      {engagements[0].sector}
                    </span>
                    <h3
                      className="font-semibold text-white leading-[1.15] tracking-[-0.025em]"
                      style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)' }}
                    >
                      {engagements[0].title}
                    </h3>
                  </div>
                  <div className="relative inline-flex items-center gap-2.5 self-start rounded-full bg-white/[0.08] border border-white/[0.12] px-4 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-none" strokeWidth={2.5} />
                    <span className="text-[11.5px] font-semibold text-white/70">
                      {engagements[0].outcome}
                    </span>
                  </div>
                </div>

                {/* Right: description */}
                <div className="bg-white p-8 flex items-center">
                  <p className="text-[15px] text-slate-600 leading-[1.85]">
                    {engagements[0].desc}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Two smaller engagements */}
            <div className="grid gap-5 sm:grid-cols-2">
              {engagements.slice(1).map((e, i) => (
                <motion.div
                  key={e.title}
                  variants={fadeUp}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2">
                      {e.sector}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#0B1F3A]">{e.title}</h3>
                    <p className="mt-2.5 text-[13.5px] text-slate-500 leading-[1.75]">{e.desc}</p>
                  </div>
                  <div className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-green-100 bg-green-50 px-3 py-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-none" strokeWidth={2} />
                    <span className="text-[11px] font-semibold text-green-700">{e.outcome}</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </Container>
      </section>

      {/* ── 6. CTA ───────────────────────────────────────────────────────── */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
