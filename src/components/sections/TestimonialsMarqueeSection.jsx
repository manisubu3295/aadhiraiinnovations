import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import OutcomeTag from '../ui/OutcomeTag'
import caseStudies from '../../data/caseStudies'

/* One card in the marquee — a compact version of CaseStudiesPage.jsx's CaseStudyRow, same
   attribution fallback (company-only entries show the client name, not a blank line) so the
   homepage teaser and the full case study read as the same content, not two different sources. */
function TestimonialCard({ study }) {
  const attributionName = study.contactName || study.client
  const detailParts = study.contactName ? [study.role, study.client].filter(Boolean) : []
  const attributionDetail = [detailParts.join(' · '), study.location].filter(Boolean).join(', ')

  return (
    <Link
      to={`/case-studies#${study.slug}`}
      className="group flex w-[380px] flex-none flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_28px_rgba(11,31,58,0.05)] transition-shadow hover:shadow-[0_16px_36px_rgba(11,31,58,0.09)]"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <OutcomeTag label={study.outcome} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{study.industry}</span>
      </div>

      <blockquote className="flex-1 text-[15px] leading-[1.75] text-slate-600 line-clamp-4">
        &ldquo;{study.quote}&rdquo;
      </blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#0B1F3A]">
          <span className="text-[12px] font-bold text-white">{study.initial}</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-[#0B1F3A]">{attributionName}</div>
          <div className="truncate text-[11.5px] text-slate-400">{attributionDetail}</div>
        </div>
        <ArrowUpRight className="ml-auto h-3.5 w-3.5 flex-none text-slate-300 transition-colors group-hover:text-[#0B1F3A]" strokeWidth={2} />
      </div>
    </Link>
  )
}

export default function TestimonialsMarqueeSection() {
  return (
    <section className="border-b border-slate-100 bg-white py-16 md:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Client Results
          </span>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 leading-relaxed">
            What clients say after they've actually used it — real case studies, not a demo pitch.
          </p>
          <Link
            to="/case-studies"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
          >
            See every case study <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </Container>

      {/* Full-bleed marquee — deliberately outside Container so cards visibly enter/exit past the
          viewport edges rather than stopping at the centered column, with a mask-image fade so
          that exit/entry reads as intentional rather than a hard clip. The list is rendered twice
          back-to-back so `.animate-marquee`'s translateX(-50%) loops seamlessly. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex w-max gap-6 px-6 animate-marquee">
          {[...caseStudies, ...caseStudies].map((study, i) => (
            <TestimonialCard key={`${study.slug}-${i}`} study={study} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
