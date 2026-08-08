import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, ArrowLeft, MessageCircle, Home, Compass } from 'lucide-react'
import Container from '../components/ui/Container'
import { useNoIndex } from '../hooks/useNoIndex.js'

/* ─── Quick links — the flagship products plus the other places a lost
   visitor is most likely trying to reach ─────────────────────────────── */
const QUICK_LINKS = [
  { label: 'Medora+ Pharmacy Software', desc: 'AI-powered pharmacy management, cloud-synced', href: '/products/medora-plus' },
  { label: 'Aadhirai Billing', desc: 'Multi-tenant billing & inventory — free signup', href: '/products/billing' },
  { label: 'HR & Inventory', desc: 'HRM software with payroll, attendance & inventory', href: '/products/hr-inventory' },
  { label: 'Transport & Logistics', desc: 'Quotation-to-invoice, live GPS driver tracking', href: '/products/transport-logistics' },
  { label: 'Free Tools', desc: 'GST calculator, PDF tools, and more — no signup', href: '/tools' },
  { label: 'Blog', desc: 'Guides on pharmacy operations, GST, and business software', href: '/blog' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

function NotFoundPage() {
  // Any URL that lands here is, by definition, not a real page — tell crawlers directly
  // instead of letting them index a "page not found" body under whatever URL was requested.
  useNoIndex(true)

  return (
    <>
      <Helmet>
        <title>Page Not Found | Aadhirai Innovations</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore our pharmacy software, HR & Inventory, billing, and transport & logistics products instead." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-24 md:py-28 lg:py-32">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div variants={fadeUp} className="mb-8 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
                <Compass className="h-3.5 w-3.5" strokeWidth={1.75} />
                Lost your way?
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-bold text-white leading-[1.02] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}
            >
              404
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-[17px] md:text-[19px] text-white/48 leading-[1.7]"
            >
              This page doesn't exist — it may have moved, been renamed, or the link you followed
              was mistyped. Here's how to get back on track.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-7 py-[13px] text-[13px] font-bold tracking-wide text-[#060e1c] transition-all hover:bg-white/93"
              >
                <Home className="h-4 w-4" />
                Back to Home
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/14 px-7 py-[13px] text-[13px] font-medium text-white/55 transition-all hover:border-white/30 hover:text-white/82"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to us
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── Quick links ──────────────────────────────────────────────────── */}
      <section className="bg-[#f6f3ec] py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-[#0B1F3A]/38 block mb-5 text-center">
              Where you might be headed
            </span>
            <h2
              className="text-center font-semibold tracking-[-0.03em] text-[#0B1F3A] leading-[1.15] mb-12"
              style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}
            >
              Or jump straight to one of these.
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to={link.href}
                  className="group flex h-full flex-col justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
                >
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0B1F3A] mb-2">{link.label}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{link.desc}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-[#0B1F3A]/60 group-hover:text-[#0B1F3A] transition-colors">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0B1F3A]/50 hover:text-[#0B1F3A] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              Or just go back to the homepage
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

export default NotFoundPage
