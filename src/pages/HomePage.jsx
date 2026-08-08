import { motion } from 'framer-motion'
import {
  ArrowRight, Shield, Target, Lock,
  ClipboardList, Brain, PackageCheck, Wifi,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/sections/HeroSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import FeaturedCitiesSection from '../components/sections/FeaturedCitiesSection'
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection'
import Container from '../components/ui/Container'

/* ─── Animation ─────────────────────────────────────────────────────────── */
const fadeUp   = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

/* ─── Data ──────────────────────────────────────────────────────────────── */
const metrics = [
  { value: '10+',   sup: '',      label: 'Custom software\nproducts built' },
  { value: '8+',    sup: 'yrs',   label: 'Software engineering\nexperience' },
]

/* Tier 1 — Pharmacy (primary) */
const pharmacyFeatures = [
  { icon: ClipboardList, title: 'GST-Compliant Billing', desc: 'HSN codes, GSTIN validation, and audit-ready tax breakdowns built in.' },
  { icon: Brain,          title: 'AI Stock Forecasting',  desc: 'Predicts demand, flags slow-moving stock, and recommends reorders.' },
  { icon: PackageCheck,   title: 'Expiry Alerts',          desc: 'Automatic expiry tracking with alerts weeks before medicines expire.' },
  { icon: Wifi,           title: 'Works Fully Offline',    desc: 'Billing, stock, and reports run without internet. Syncs when back online.' },
]

const pharmacyProducts = [
  {
    name: 'Medora+',
    tag: 'Cloud-synced',
    desc: 'AI-powered pharmacy billing and stock intelligence, with automatic cloud backup and multi-branch visibility.',
    href: '/products/medora-plus',
  },
  {
    name: 'Medora Offline',
    tag: 'One-time license',
    desc: 'The same billing and inventory core, fully offline — no internet or subscription required. Free trial available.',
    href: '/products/medora-offline',
  },
]

/* Tier 2 — Custom software (secondary) */
const customSoftware = [
  {
    num: '01',
    title: 'ERP Automation',
    tag: 'Custom-built',
    desc: 'Purchase orders, vendor management, and stock control built around how your business actually operates — not a rigid template.',
    href: '/solutions/erp-automation',
  },
  {
    num: '02',
    title: 'HR & Inventory',
    tag: 'Combined system',
    desc: 'Employee records, leave, attendance, and payroll alongside stock and purchase orders — one system instead of disconnected tools.',
    href: '/products/hr-inventory',
  },
  {
    num: '03',
    title: 'Workforce Manager',
    tag: 'Attendance & payroll',
    desc: 'Biometric attendance, leave management, and shift scheduling with clean payroll data export.',
    href: '/products/workforce-manager',
  },
  {
    num: '04',
    title: 'POS System',
    tag: 'Retail billing',
    desc: 'Fast, reliable point-of-sale billing for retail counters — barcode checkout, receipts, and daily sales tracking.',
    href: '/products/pos-system',
  },
]

/* Tier 3 — Software company / backend engineering (tertiary) */
const engineeringDifferentiators = [
  { icon: Shield,  title: 'Banking-grade rigour', desc: 'Standards from enterprise-grade financial infrastructure, applied to growth-stage engineering problems.' },
  { icon: Target,  title: 'Senior, not junior', desc: 'Direct senior engineering — not work you\'re paying to have someone learn on the job.' },
  { icon: Lock,    title: 'Fixed scope, written deliverables', desc: 'Every engagement produces a document your team keeps, not a vague retainer.' },
]

/* ══════════════════════════════════════════════════════════════════════════
   HomePage
══════════════════════════════════════════════════════════════════════════ */
function HomePage() {
  return (
    <>
      <HeroSection />

      {/* ── Metrics ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A]">
        <Container>
          <div className="mx-auto grid max-w-md grid-cols-2 divide-x divide-white/[0.06]">
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

      {/* ── Handmade software USP — bridges the hero into the product tiers below ───── */}
      <WhyChooseUsSection />

      {/* ══════════════════════════════════════════════════════════════════
          TIER 1 — Pharmacy (primary)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pharmacy" className="py-20 md:py-28 lg:py-32 scroll-mt-20">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-end justify-between gap-8 mb-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Flagship product · Tamil Nadu</span>
                <h2
                  className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                  style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)' }}
                >
                  Medora — pharmacy software
                  <br />
                  built for Indian pharmacies.
                </h2>
              </div>
              <Link
                to="/solutions/pharmacy-software"
                className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-slate-400 hover:text-[#0B1F3A] transition-colors pb-1 border-b border-transparent hover:border-slate-300"
              >
                Full details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 max-w-[62ch] text-[15px] text-slate-500 leading-[1.85]">
              GST-compliant billing, AI stock forecasting, and expiry alerts — built for pharmacies
              from Peravurani and Pattukkottai to Thanjavur, Pudukkottai, Trichy, and beyond. Works fully
              offline, so unreliable connectivity never stops your billing counter.
            </motion.p>

            {/* Feature grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pharmacyFeatures.map((f, i) => (
                <motion.div key={f.title} variants={fadeUp} transition={{ delay: i * 0.06 }}>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                    <f.icon className="h-4.5 w-4.5 text-[#0B1F3A]/60" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-[#0B1F3A]">{f.title}</h3>
                  <p className="mt-2 text-[13px] text-slate-500 leading-[1.7]">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Two product cards */}
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {pharmacyProducts.map((p) => (
                <motion.div key={p.name} variants={fadeUp}>
                  <Link
                    to={p.href}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                  >
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[17px] font-semibold text-[#0B1F3A] group-hover:text-blue-700 transition-colors">{p.name}</h3>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{p.tag}</span>
                    </div>
                    <p className="mt-3 text-[13.5px] text-slate-500 leading-[1.75] flex-1">{p.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0B1F3A]">
                      Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Local city coverage — strengthens local SEO discovery on the homepage itself */}
      <FeaturedCitiesSection />

      {/* ══════════════════════════════════════════════════════════════════
          TIER 2 — Custom software (secondary)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="custom-software" className="py-20 md:py-28 lg:py-32 scroll-mt-20 bg-slate-50">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Custom software</span>
              <h2
                className="mt-3 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
                style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)' }}
              >
                Software built around
                <br />
                how your business runs.
              </h2>
              <p className="mt-5 max-w-[62ch] text-[15px] text-slate-500 leading-[1.85]">
                Beyond pharmacy, we build custom ERP, HR, workforce, and retail systems for
                businesses that have outgrown spreadsheets and off-the-shelf tools.
              </p>
            </motion.div>

            <div className="mt-10">
              {customSoftware.map((s, i) => (
                <motion.div key={s.title} variants={fadeUp} transition={{ delay: i * 0.06 }}>
                  <Link to={s.href} className="group block">
                    <div className="grid grid-cols-[2.5rem_1fr] gap-6 border-t border-slate-200 py-7 transition-all duration-200 hover:pl-2 lg:grid-cols-[2.5rem_1fr_auto] lg:items-center lg:gap-10">
                      <span className="text-[11px] font-black tracking-[0.18em] text-slate-300 pt-1">
                        {s.num}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h3 className="text-[17px] font-semibold text-[#0B1F3A] group-hover:text-blue-700 transition-colors">
                            {s.title}
                          </h3>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 bg-white px-2.5 py-1 rounded-full">
                            {s.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] text-slate-500 leading-[1.75] max-w-[58ch]">
                          {s.desc}
                        </p>
                      </div>
                      <ArrowRight
                        className="hidden lg:block h-4 w-4 text-slate-300 group-hover:text-[#0B1F3A] group-hover:translate-x-1 transition-all"
                        strokeWidth={1.75}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-slate-200" />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TIER 3 — Software company / backend engineering (tertiary)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#050d1a] py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 grid-texture pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:items-start">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/28">
                Also a software company
              </span>
              <h2
                className="mt-5 font-semibold leading-[1.12] tracking-[-0.04em] text-white"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}
              >
                Senior backend engineering
                <br />
                for growth-stage companies.
              </h2>
              <p className="mt-6 text-[14px] text-white/38 leading-[1.85] max-w-[36ch]">
                Production Readiness Audits, architecture advisory, and fixed-scope
                engineering for software companies that need backend infrastructure
                to hold up under real load.
              </p>
              <Link
                to="/services"
                className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-white/40 hover:text-white/80 transition-colors"
              >
                See engineering services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="divide-y divide-white/[0.07]"
            >
              {engineeringDifferentiators.map((d, i) => (
                <motion.div
                  key={d.title}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-5 py-6 first:pt-0"
                >
                  <div className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05]">
                    <d.icon className="h-4.5 w-4.5 text-blue-300/60" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-[14.5px] font-semibold text-white">{d.title}</h3>
                    <p className="mt-2 text-[13px] text-white/40 leading-[1.75]">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
