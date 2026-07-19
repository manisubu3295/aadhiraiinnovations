import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Clock, FileText, Search, BarChart3, CheckCircle2, Lock, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const auditScope = [
  { label: 'Service architecture', desc: 'Coupling, cohesion, service boundaries, inter-service communication patterns' },
  { label: 'Data layer', desc: 'Schema design, query performance, migration risk, backup and recovery posture' },
  { label: 'Infrastructure & deployment', desc: 'Configuration management, deployment reliability, environment parity, scaling headroom' },
  { label: 'Observability', desc: 'Logging, metrics, alerting, incident detection capability' },
  { label: 'Failure modes', desc: 'Single points of failure, cascading failure risk, degradation patterns' },
  { label: 'Multi-tenancy', desc: 'Data isolation model, tenant boundary integrity, compliance posture (where applicable)' },
]

const retainerIncludes = [
  'Monthly working sessions with your engineering leadership',
  'Async review of technical proposals, architecture decision records, and design documents',
  'Input on technology selection and build-vs-buy decisions',
  'Architecture review of planned major changes before implementation begins',
  'Ongoing visibility into how your architecture is evolving relative to your growth trajectory',
]

const engineeringTypes = [
  'High-availability service design and implementation',
  'Multi-tenant data architecture and migration',
  'Backend integration layer development',
  'Performance-critical data pipeline design',
  'Database design for complex domain models',
  'API design for external-facing platforms',
]

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24 lg:py-28">
        <PatternBackground />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Services</span>
            <h1 className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}>
              Three ways to engage.
              <br />
              One area of focus.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] text-slate-500 leading-[1.85]">
              We specialise in backend architecture for funded startups. Every engagement we take is in
              this domain — we don't dilute our practice with adjacent work outside our expertise.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Service 1 — Production Readiness Audit */}
      <section id="audit" className="py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 lg:items-start"
          >
            <div>
              <motion.div variants={fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Service 01</span>
                <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0B1F3A]">
                  Production Readiness Audit
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  ₹4–6 lakh · 3 weeks
                </p>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-[15px] text-slate-500 leading-[1.85]">
                Understand your backend risks before they become incidents. The Production Readiness Audit
                is a fixed-scope, time-boxed assessment that gives your engineering team a clear and honest
                picture of where your backend stands. We work from your actual systems — codebase,
                infrastructure-as-code, deployment configuration, and monitoring setup — not documentation
                or architecture diagrams alone.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">What we assess</p>
                <div className="space-y-4">
                  {auditScope.map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0B1F3A]/35" strokeWidth={1.75} />
                      <div>
                        <span className="text-[13.5px] font-semibold text-[#0B1F3A]">{item.label}</span>
                        <span className="text-[13.5px] text-slate-400"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-[13.5px] text-slate-600 leading-[1.8]">
                  <strong className="text-[#0B1F3A]">Deliverable:</strong> A written assessment document — not a
                  presentation. A structured report covering current-state findings and a prioritised
                  recommendations list, with each item classified by risk severity and implementation effort.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-24"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-6">Engagement summary</p>
              <div className="space-y-5">
                {[
                  { icon: Clock,     label: 'Timeline',    value: '3 weeks from kickoff to report' },
                  { icon: FileText,  label: 'Deliverable', value: 'Written assessment + prioritised recommendations' },
                  { icon: Search,    label: 'Method',      value: 'Codebase review · infra review · technical interviews' },
                  { icon: BarChart3, label: 'Investment',  value: '₹4–6 lakh (scope-dependent, agreed upfront)' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                      <Icon className="h-3.5 w-3.5 text-[#0B1F3A]/50" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</p>
                      <p className="mt-0.5 text-[13.5px] font-medium text-[#0B1F3A]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                className="mt-8 flex items-center justify-center gap-2 rounded-sm bg-[#0B1F3A] py-3.5 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
              >
                Request an Audit <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Service 2 — Retainer */}
      <section id="retainer" className="border-t border-slate-100 bg-slate-50/50 py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start"
          >
            <div>
              <motion.div variants={fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Service 02</span>
                <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0B1F3A]">
                  Architecture Advisory Retainer
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Monthly engagement · Minimum 3 months
                </p>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-[15px] text-slate-500 leading-[1.85]">
                Senior architectural judgment, available on an ongoing basis. As your startup scales,
                the decisions that matter most aren't always the ones that feel urgent. The Advisory
                Retainer gives you consistent access to senior architectural thinking as those decisions
                come up — not after the fact.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">What it includes</p>
                <div className="space-y-3">
                  {retainerIncludes.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0B1F3A]/35" strokeWidth={1.75} />
                      <span className="text-[13.5px] text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 flex-none text-slate-400" strokeWidth={1.75} />
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#0B1F3A]">Advisory only — not implementation</p>
                    <p className="mt-1.5 text-[13px] text-slate-500 leading-[1.7]">
                      This is an advisory engagement — we provide judgment and recommendations,
                      your team executes. For implementation work, see Fixed-Scope Engineering Engagements.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Layers className="mt-0.5 h-4 w-4 flex-none text-slate-400" strokeWidth={1.75} />
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#0B1F3A]">Who it's for</p>
                    <p className="mt-1.5 text-[13px] text-slate-500 leading-[1.7]">
                      Engineering teams that have a capable in-house team but want experienced outside
                      perspective on major architectural decisions. Particularly useful during periods of
                      rapid scaling where consequential technical choices are made frequently.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 rounded-sm border border-[#0B1F3A] bg-white py-3.5 text-[13.5px] font-bold text-[#0B1F3A] transition-all hover:bg-[#0B1F3A] hover:text-white"
              >
                Enquire about the Retainer <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Service 3 — Fixed-Scope Engineering */}
      <section id="engineering" className="border-t border-slate-100 py-16 sm:py-20 lg:py-24 scroll-mt-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start"
          >
            <div>
              <motion.div variants={fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Service 03</span>
                <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0B1F3A]">
                  Fixed-Scope Engineering Engagements
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Project-based · Fixed price
                </p>
              </motion.div>

              <motion.p variants={fadeUp} className="mt-6 text-[15px] text-slate-500 leading-[1.85]">
                When your team needs senior implementation capacity on a defined piece of work. Some
                engineering challenges are high-stakes enough that you want a specialist to own them —
                not someone learning on the job. We take a defined piece of backend work, deliver it
                to production, and hand it over cleanly.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">Typical engagement types</p>
                <div className="space-y-3">
                  {engineeringTypes.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0B1F3A]/35" strokeWidth={1.75} />
                      <span className="text-[13.5px] text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[13.5px] font-semibold text-[#0B1F3A]">How it works</p>
                <p className="mt-2 text-[13px] text-slate-500 leading-[1.7]">
                  We scope the work in detail before committing — agreeing on deliverables, timeline,
                  and definition of done before a line of code is written. We don't take open-ended
                  engagements. Every project has a clear endpoint and a clear handover.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[13.5px] font-semibold text-[#0B1F3A]">Investment</p>
                <p className="mt-2 text-[13px] text-slate-500 leading-[1.7]">
                  Priced by scope. We provide a fixed quote after scoping — no time-and-materials
                  billing. Pricing is agreed before engagement begins.
                </p>
              </div>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 rounded-sm border border-[#0B1F3A] bg-white py-3.5 text-[13.5px] font-bold text-[#0B1F3A] transition-all hover:bg-[#0B1F3A] hover:text-white"
              >
                Discuss a Project <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[15px] font-semibold text-[#0B1F3A]">Not sure where to start?</p>
              <p className="mt-1 text-[13.5px] text-slate-500">
                Most clients begin with the Production Readiness Audit. It gives us a common baseline — and you
                get an actionable document regardless of whether you continue to work with us.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
            >
              Talk to us <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}

export default ServicesPage
