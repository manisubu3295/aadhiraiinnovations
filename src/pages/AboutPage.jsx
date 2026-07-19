import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const principles = [
  {
    title: 'Start with the real system',
    desc: 'Architecture diagrams lie. We work from source — codebase, infrastructure-as-code, deployment configuration, and monitoring setup.',
  },
  {
    title: 'Prioritise by impact, not completeness',
    desc: 'A 50-item findings list is not useful. We tell you what matters most and why, so your team knows where to focus.',
  },
  {
    title: 'Leave something tangible',
    desc: 'Every engagement produces a document your team keeps. You paid for an outcome, not a conversation.',
  },
  {
    title: 'Say what we see',
    desc: "Our value is in honest, expert assessment. We don't shade findings to preserve the relationship — we tell you what's there.",
  },
]

const values = [
  { label: 'Clarity in architecture and scope' },
  { label: 'Reliability in delivery and support' },
  { label: 'Transparency in communication and decisions' },
  { label: 'Long-term maintainability over short-term shortcuts' },
]

function AboutPage() {
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
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">About</span>
            <h1
              className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}
            >
              Built to do one thing well.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] text-slate-500 leading-[1.85]">
              Aadhirai Innovations was founded to help growth-stage software companies build backend infrastructure
              that can carry the weight of real growth.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Company story */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_34px_rgba(11,31,58,0.06)]">
              <p className="text-slate-600 leading-[1.85]">
                The company was founded by Arthi Manikandan, who identified a consistent gap in the market —
                startups reaching Series A and B with capable engineering teams but backend systems that hadn't
                been designed to scale. The options available to them were large generalist consultancies that
                brought broad capability but shallow specialisation, or individual freelancers who lacked the
                structured methodology to deliver something a CTO could act on with confidence. Aadhirai was
                built to sit in neither of those categories.
              </p>
              <p className="mt-5 text-slate-600 leading-[1.85]">
                Our practice is built around Manikandan Subramaniyan, our senior architect and technical lead,
                who brings over eight years of backend engineering experience including direct work on
                enterprise-grade financial systems — high-availability, high-compliance infrastructure where
                reliability is non-negotiable. That background shapes how we approach every engagement: we
                look at startup systems with the same rigour applied to systems where failure carries serious
                consequences. We've found that the habits and frameworks from that world translate directly
                into better outcomes for growth-stage startups.
              </p>
              <p className="mt-5 text-slate-600 leading-[1.85]">
                We take a small number of engagements at a time. That's a deliberate choice, not a capacity
                constraint we're working to fix. The work we do requires genuine immersion in a client's
                systems and context — it can't be done well at volume.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Why we exist */}
      <section className="border-y border-slate-100 bg-[#0B1F3A] py-16 sm:py-20 lg:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16"
          >
            <motion.div variants={fadeUp}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">Why we exist</span>
              <h2
                className="mt-4 font-semibold tracking-[-0.04em] text-white leading-[1.15]"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
              >
                The window between fast and broken.
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-[14.5px] text-white/50 leading-[1.85]">
                Most startups that reach Series A have built their backend to move fast. That's the right call
                at the early stage. But there's a window — usually between Series A and the first serious
                enterprise customer, or between Series B and the next growth inflection — where the decisions
                you made to move fast start to become the decisions that slow you down or create risk.
              </p>
              <p className="text-[14.5px] text-white/50 leading-[1.85]">
                The problem is that from the inside, it can be hard to see it clearly. The team that built
                the system is close to it. The knowledge is distributed. The technical debt is normalised.
                What looks like a manageable situation often has a sharper edge than it appears — and the
                first time you see it clearly is during an incident.
              </p>
              <p className="text-[14.5px] text-white/50 leading-[1.85]">
                We exist to help engineering leaders see that edge before it becomes a problem. Not to scare
                them — to give them an honest, expert picture of where they stand and what to do about it.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Principles + Values */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Our approach</span>
              <h2
                className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
              >
                How we work.
              </h2>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {principles.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-[14px] font-semibold text-[#0B1F3A]">{p.title}</h3>
                  <p className="mt-3 text-[13px] text-slate-500 leading-[1.7]">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-[14px] font-semibold text-[#0B1F3A] mb-4">Values</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {values.map((v) => (
                  <div key={v.label} className="flex items-center gap-2.5">
                    <span className="h-1 w-1 flex-none rounded-full bg-[#0B1F3A]/30" />
                    <span className="text-[13px] text-slate-600">{v.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 bg-slate-50 py-14 lg:py-18">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[15px] font-semibold text-[#0B1F3A]">Ready to start a conversation?</p>
              <p className="mt-1 text-[13.5px] text-slate-500">
                Engagements are limited. We work with a small number of clients to maintain quality.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
            >
              Get in Touch <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}

export default AboutPage
