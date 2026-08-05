import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Briefcase, Globe2, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const roleHighlights = [
  {
    icon: Briefcase,
    label: 'Two ways to work with us',
    desc: 'Commission-based channel partner, or a full-time salaried role — whichever fits how you want to work.',
  },
  {
    icon: Globe2,
    label: 'Fully remote',
    desc: 'Work from anywhere in India. No relocation, no office requirement.',
  },
  {
    icon: IndianRupee,
    label: 'Compensation discussed directly',
    desc: "We scope commission structure or salary based on experience and the track you're on — no fixed number posted here.",
  },
]

function CareersPage() {
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
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Careers</span>
            <h1
              className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}
            >
              We hire rarely — and only for the right fit.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] text-slate-500 leading-[1.85]">
              We're a small, founder-led team. We don't run a pipeline of open roles — we hire when there's real
              work and a real fit. Right now, that's one role.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* How we hire */}
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
                We work with a small number of clients at a time, by design — and we hire the same way. We're
                not building a large team for its own sake. We look for people who are genuinely strong at
                something we need, and who'd rather do focused work well than manage a large scope thinly.
              </p>
              <p className="mt-5 text-slate-600 leading-[1.85]">
                If a role isn't listed below, that doesn't mean we're not interested — it means we haven't
                found the fit yet. If you think you're that fit, reach out anyway.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Open role */}
      <section className="border-y border-slate-100 bg-[#0B1F3A] py-16 sm:py-20 lg:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">Open Role</span>
              <h2
                className="mt-4 font-semibold tracking-[-0.04em] text-white leading-[1.15]"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
              >
                Sales Partner — Medora+ &amp; Aadhirai Billing
              </h2>
              <p className="mt-5 max-w-[56ch] text-[14.5px] text-white/50 leading-[1.85]">
                We're looking for someone to represent and sell Medora+ (our AI-powered pharmacy management
                platform) and Aadhirai Billing (our free-to-signup multi-tenant billing product) to pharmacies
                and retail businesses. You'd own outreach, demos, and follow-up through to a closed account —
                working from your own network and territory.
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {roleHighlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    variants={fadeUp}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-xl border border-white/[0.1] bg-white/[0.04] p-6"
                  >
                    <Icon className="h-5 w-5 text-white/50" strokeWidth={1.75} />
                    <h3 className="mt-4 text-[14px] font-semibold text-white">{item.label}</h3>
                    <p className="mt-2.5 text-[13px] text-white/45 leading-[1.7]">{item.desc}</p>
                  </motion.div>
                )
              })}
            </div>

            <motion.div variants={fadeUp} className="mt-10">
              <a
                href="mailto:info@aadhiraiinnovations.com?subject=Sales%20Partner%20role"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-[13.5px] font-bold text-[#0B1F3A] transition-colors hover:bg-white/90"
              >
                Email us about this role
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Evergreen CTA */}
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
              <p className="text-[15px] font-semibold text-[#0B1F3A]">Don't see a fit above?</p>
              <p className="mt-1 text-[13.5px] text-slate-500">
                If you're strong at engineering, delivery, or sales for the kind of work we do, reach out anyway.
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

export default CareersPage
