import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'
import OutcomeTag from '../components/ui/OutcomeTag'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import ClientsSection from '../components/sections/ClientsSection'
import caseStudies from '../data/caseStudies'

// study.product.href is normally an internal route (react-router Link) — but a case study about
// a delivered website (rather than one of our own products) links out to the live site itself,
// which needs a real <a>, not client-side routing.
function isExternalHref(href) {
  return /^https?:\/\//i.test(href)
}

function CaseStudyRow({ study, dark }) {
  // contactName is optional (a company-level account with no named person) — fall back to the
  // client name as the primary attribution rather than rendering a blank name line, and drop the
  // "role · client" line down to just the location so it doesn't read as "· Client · Client".
  const attributionName = study.contactName || study.client
  const detailParts = study.contactName ? [study.role, study.client].filter(Boolean) : []
  const attributionDetail = [detailParts.join(' · '), study.location].filter(Boolean).join(', ')

  return (
    <section id={study.slug} className={dark ? 'bg-[#0B1F3A] py-20 md:py-24' : 'bg-white py-20 md:py-24'}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left: framing */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <span
              className={`text-[10.5px] font-bold uppercase tracking-[0.26em] block mb-4 ${
                dark ? 'text-white/38' : 'text-[#0B1F3A]/38'
              }`}
            >
              {study.industry} · {study.client}
            </span>
            <h2
              className={`text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-[1.25] mb-5 ${
                dark ? 'text-white' : 'text-[#0B1F3A]'
              }`}
            >
              {study.headline}
            </h2>
            <p className={`text-[15px] leading-[1.85] mb-7 ${dark ? 'text-white/55' : 'text-slate-600'}`}>
              {study.summary}
            </p>
            {study.product && (
              isExternalHref(study.product.href) ? (
                <a
                  href={study.product.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex items-center gap-2 text-[13.5px] font-semibold border-b-2 pb-0.5 transition-colors ${
                    dark
                      ? 'text-white border-white/25 hover:border-white'
                      : 'text-[#0B1F3A] border-[#0B1F3A]/18 hover:border-[#0B1F3A]'
                  }`}
                >
                  {study.product.name}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </a>
              ) : (
                <Link
                  to={study.product.href}
                  className={`group inline-flex items-center gap-2 text-[13.5px] font-semibold border-b-2 pb-0.5 transition-colors ${
                    dark
                      ? 'text-white border-white/25 hover:border-white'
                      : 'text-[#0B1F3A] border-[#0B1F3A]/18 hover:border-[#0B1F3A]'
                  }`}
                >
                  {study.product.name}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </Link>
              )
            )}
          </motion.div>

          {/* Right: quote */}
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5">
              <OutcomeTag label={study.outcome} dark={dark} />
            </div>
            <blockquote
              className={`text-[18px] md:text-[20px] font-medium leading-[1.65] tracking-[-0.01em] ${
                dark ? 'text-white/75' : 'text-[#0B1F3A]/72'
              }`}
            >
              &ldquo;{study.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5">
              <div
                className={`h-10 w-10 flex-none rounded-full flex items-center justify-center ${
                  dark ? 'bg-white/10' : 'bg-[#0B1F3A]'
                }`}
              >
                <span className={`text-[13px] font-bold ${dark ? 'text-white/70' : 'text-white'}`}>
                  {study.initial}
                </span>
              </div>
              <div>
                <div className={`text-[13.5px] font-semibold ${dark ? 'text-white' : 'text-[#0B1F3A]'}`}>
                  {attributionName}
                </div>
                <div className={`mt-0.5 text-[12px] ${dark ? 'text-white/40' : 'text-[#0B1F3A]/45'}`}>
                  {attributionDetail}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  )
}

export default function CaseStudiesPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
        <PatternBackground />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Case Studies</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0B1F3A] sm:text-5xl leading-[1.12]">
              Results, in our clients' own words.
            </h1>
            <p className="mt-5 text-base text-slate-600 md:text-lg leading-relaxed">
              We work with a small number of clients at a time. Here's what they told us, unedited.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Case studies ──────────────────────────────────────────────── */}
      {caseStudies.map((study, i) => (
        <CaseStudyRow key={study.slug} study={study} dark={i % 2 === 1} />
      ))}

      {/* ── Full client roster (incl. clients not quoted above) ───────── */}
      <ClientsSection bg="bg-white" />

      {/* ── Closing note ──────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-14">
        <Container>
          <p className="max-w-2xl text-sm text-slate-500 leading-relaxed">
            We keep this page short on purpose — every story here is a real client, quoted directly, not a
            composite or a sample. As more clients agree to be featured, we'll add them here.
          </p>
        </Container>
      </section>

      <FinalCtaSection />
    </>
  )
}
