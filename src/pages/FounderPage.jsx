import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'

const founderPhoto = '/media/founder.PNG'

function FounderPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24 lg:py-28">
        <PatternBackground />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Founder</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0B1F3A] sm:text-5xl">Founder’s Note</h1>
            <p className="mt-6 max-w-3xl text-base text-slate-600 sm:text-lg">
              A disciplined approach to building business systems that remain practical, reliable, and measurable in
              real operating environments.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="mx-auto w-full max-w-[300px]"
            >
              <img
                src={founderPhoto}
                alt="Founder portrait"
                className="w-full rounded-2xl border border-slate-200 object-cover shadow-[0_16px_40px_rgba(11,31,58,0.1)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_34px_rgba(11,31,58,0.06)]"
            >
              <p className="text-slate-600">
                I founded Aadhirai Innovations with a simple principle — build systems that work in real business
                environments. My experience contributing to enterprise and banking-grade systems has shaped how we
                design, implement, and support technology solutions. We focus on clarity, reliability, and long-term
                value.
              </p>
              <p className="mt-4 text-slate-600">
                From Peravurani and Chennai, we work with SMEs, pharmacies, and growing businesses across Tamil Nadu,
                translating operational needs into structured software delivery.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/40 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Values</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Clarity in architecture and scope</li>
                <li>Reliability in delivery and support</li>
                <li>Transparency in communication and decisions</li>
                <li>Long-term maintainability over short-term shortcuts</li>
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-[#0B1F3A]">Delivery Philosophy</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Understand business workflow before proposing software</li>
                <li>Implement in phases with controlled release gates</li>
                <li>Document system behavior for operational continuity</li>
                <li>Measure and refine after go-live using real usage feedback</li>
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-[#0B1F3A]">SaaS Vision</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Build configurable platforms that scale with business maturity</li>
                <li>Maintain product clarity for non-technical operational teams</li>
                <li>Balance offline resilience with cloud-ready architecture</li>
                <li>Deliver measurable workflow improvements over time</li>
              </ul>
            </motion.article>
          </div>
        </Container>
      </section>
    </>
  )
}

export default FounderPage
