import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, ExternalLink, Clock, Users, Layers, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'
import ToolCta from '../components/tools/ToolCta'

const DECK_URL = 'https://webinar-01-lo6w.vercel.app/'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

const modules = [
  { num: '01', label: 'Requirement Gathering', desc: '9:50 – 10:10 AM · 20 min' },
  { num: '02', label: 'Technology Selection', desc: '10:10 – 10:30 AM · 20 min — Frontend, backend, and how to choose' },
  { num: '03', label: 'Database', desc: '10:30 – 10:50 AM · 20 min' },
  { num: '04', label: 'Architecture', desc: '10:50 – 11:00 AM · 10 min', highlight: true },
  { num: '05', label: 'Build & Testing', desc: '11:05 – 11:25 AM · 20 min (5 min break beforehand)' },
  { num: '06', label: 'DevOps, Cloud & Observability', desc: '11:25 – 11:45 AM · 20 min' },
  { num: '07', label: 'Closing: Career Guidance', desc: '11:45 AM – 12:00 PM · 15 min' },
  { num: '08', label: 'Live Question & Answer', desc: '12:00 – 12:10 PM · 10 min' },
]

function WebinarPage() {
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
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Live Technical Webinar
            </span>
            <h1 className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}>
              NextGen Builder
              <br />
              Session 01.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[15px] text-slate-500 leading-[1.85]">
              A free, course-style walkthrough of what it actually takes to go from an idea to a
              production system — requirement gathering, technology selection, database design,
              architecture, build & testing, and DevOps — closing with career guidance and a live
              Q&A. Delivered as an interactive deck with real diagrams and working playgrounds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={DECK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3.5 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
              >
                Open the Webinar Deck <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="#curriculum"
                className="inline-flex items-center gap-2 rounded-sm border border-[#0B1F3A]/20 px-6 py-3.5 text-[13.5px] font-bold text-[#0B1F3A] transition-all hover:bg-[#0B1F3A]/5"
              >
                See the curriculum
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-16 sm:py-20 lg:py-24 scroll-mt-20">
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
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Course Outline</span>
                <h2 className="mt-3 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0B1F3A]">
                  What's covered, session by session
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  9:50 AM – 12:10 PM · 8 modules · Live Q&A included
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 space-y-4">
                {modules.map((item) => (
                  <div
                    key={item.num}
                    className={`flex gap-4 rounded-xl border p-4 ${
                      item.highlight
                        ? 'border-[#0B1F3A]/25 bg-[#0B1F3A]/[0.03]'
                        : 'border-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 pt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-[#0B1F3A]">{item.label}</span>
                        {item.highlight && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0B1F3A]/60" strokeWidth={2} />
                        )}
                      </div>
                      <span className="text-[13px] text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-[13.5px] text-slate-600 leading-[1.8]">
                  <strong className="text-[#0B1F3A]">Module 04, Architecture,</strong> covers service
                  boundaries, the monolith-vs-microservices trade-off, and how the architecture module
                  ties requirement gathering and technology selection into a system that's actually
                  buildable — the same lens we bring to our Architecture Advisory Retainer work.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:sticky lg:top-24"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-6">Webinar details</p>
              <div className="space-y-5">
                {[
                  { icon: Clock,   label: 'Duration',  value: '~2h 20m · live, single session' },
                  { icon: Layers,  label: 'Format',     value: 'Interactive deck — diagrams, code & infra playgrounds' },
                  { icon: Users,   label: 'Closing',    value: 'Career guidance + live Q&A' },
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
              <a
                href={DECK_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-2 rounded-sm bg-[#0B1F3A] py-3.5 text-[13.5px] font-bold text-white transition-all hover:bg-[#173762]"
              >
                Open the Webinar Deck <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <ToolCta
        headline="Ready to open the deck?"
        body="The full session — including the Architecture module, live playgrounds, and diagrams — is hosted as an interactive standalone deck."
        ctas={[
          { label: 'Open the Webinar Deck', href: DECK_URL, primary: true },
          { label: 'Talk to us', href: '/contact', primary: false },
        ]}
      />
    </>
  )
}

export default WebinarPage
