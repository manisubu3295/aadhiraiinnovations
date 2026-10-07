import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import clients from '../../data/clients'

/* Client roster grid — every business we've delivered for, plus engagements launching soon.
   Data lives in src/data/clients.js (separate from caseStudies.js: no quotes here, just what we
   built). Cards with a case study link to it; delivered websites link out to the live site. */

function StatusBadge({ status }) {
  const live = status === 'live'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
        live ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {live ? 'Live' : 'Coming soon'}
    </span>
  )
}

// "https://www.example.com/" -> "example.com" for display
function displayDomain(url) {
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')
}

const linkClass =
  'group/link inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B1F3A]/70 transition-colors hover:text-[#0B1F3A]'
const arrowClass =
  'h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5'

/* Card is a plain container (not one big link) so a client can carry both a case-study link and
   a live-website link without nesting anchors. */
function ClientCard({ client }) {
  const meta = [client.industry, client.location].filter(Boolean).join(' · ')
  const hasLinks = client.caseStudy || client.url

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(11,31,58,0.04)] transition-all hover:border-slate-300 hover:shadow-[0_14px_32px_rgba(11,31,58,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#0B1F3A]">
          <span className="text-[15px] font-bold text-white">{client.name.charAt(0)}</span>
        </div>
        <StatusBadge status={client.status} />
      </div>

      <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-[#0B1F3A]">{client.name}</h3>
      {meta && <p className="mt-1 text-[12px] text-slate-400">{meta}</p>}

      <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
        {client.delivered.map((item) => (
          <li
            key={item}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11.5px] font-medium text-slate-600"
          >
            {item}
          </li>
        ))}
      </ul>

      {hasLinks && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
          {client.url && (
            <a href={client.url} target="_blank" rel="noreferrer" className={linkClass}>
              {displayDomain(client.url)}
              <ArrowUpRight className={arrowClass} strokeWidth={2} />
            </a>
          )}
          {client.caseStudy && (
            <Link to={`/case-studies#${client.caseStudy}`} className={linkClass}>
              Read case study
              <ArrowRight className={arrowClass} strokeWidth={2} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function ClientsSection({ bg = 'bg-slate-50' }) {
  return (
    <section id="clients" className={`${bg} border-b border-slate-100 py-20 md:py-24 scroll-mt-20`}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Our clients</span>
            <h2
              className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
              style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)' }}
            >
              Businesses running on
              <br />
              what we've built.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[14.5px] leading-[1.8] text-slate-500">
            Clinics, pharmacies, retailers, transport operators, and technology companies — across
            Tamil Nadu and Singapore. Software, websites, and SEO, delivered and supported by the same team.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <ClientCard client={client} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
