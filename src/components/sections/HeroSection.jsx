import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Container from '../ui/Container'
import HeroIntelligenceAnimation from '../ui/HeroIntelligenceAnimation'
import FloatingBadge from '../ui/FloatingBadge'
import { useVisitorLocation } from '../../hooks/useVisitorLocation'

const AUTO_ADVANCE_MS = 6000

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.92, ease: [0.22, 1, 0.36, 1] } },
}
const slideTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] }

/* ─── Slides — one per Products-nav item, same design, different product ────
   Slide 0 (Medora+) is the flagship default and keeps the original visitor-location
   personalization; the rest use static India-wide copy. Each slide's primary CTA
   routes to that product's own page so the slider drives traffic to owned SEO pages,
   not straight to an external signup/demo URL. */
function useSlides() {
  const location = useVisitorLocation()
  const eyebrowRegion = location?.state ? `${location.state}, India` : 'India'
  const headlineRegion = location?.state ? `${location.state} pharmacies.` : 'Indian pharmacies.'
  const builtStrip = location?.state ? `${location.state} Built` : 'Pan-India Ready'

  return useMemo(() => [
    {
      key: 'medora-plus',
      dotColor: 'bg-blue-400/70',
      eyebrow: `Pharmacy Software · ${eyebrowRegion}`,
      headline: ['Pharmacy billing software', 'built for', headlineRegion],
      sub: 'Medora+ and Medora Offline give pharmacies from Peravurani to Chennai GST-ready billing, real-time stock, and expiry alerts — online or fully offline. We also build custom business software and backend engineering for growing companies.',
      strip: `GST-Compliant · Offline-First · ${builtStrip}`,
      primaryCta: { label: 'Explore Medora Pharmacy Software', href: '/solutions/pharmacy-software' },
      badges: [
        { value: 'TN', label: 'Tamil Nadu Built', glowColor: 'rgba(147, 197, 253, 0.25)', floatAmount: -10, floatDuration: 8, delay: 1.4, className: 'top-6 -left-2 lg:-left-6 hidden md:block' },
        { value: 'Offline', label: 'Works Without Internet', valueClassName: 'text-gradient-ai', glowColor: 'rgba(167, 139, 250, 0.22)', floatAmount: 10, floatDuration: 10, delay: 1.9, className: 'bottom-10 -right-2 lg:-right-6 hidden md:block', pulseLabel: 'GST Ready' },
      ],
    },
    {
      key: 'medora-offline',
      dotColor: 'bg-indigo-400/70',
      eyebrow: 'Offline Pharmacy Software · India',
      headline: ['Offline pharmacy software', 'built for', 'zero-downtime billing.'],
      sub: 'The same Medora billing and inventory core, fully offline — no internet or monthly subscription. A one-time license, your data never leaves your computer, and a free 30-day trial to try it first.',
      strip: 'One-Time License · No Internet Needed · Free Trial',
      primaryCta: { label: 'Try Medora Offline Free', href: '/products/medora-offline?download=1' },
      badges: [
        { value: 'Offline', label: 'No Internet Needed', valueClassName: 'text-gradient-ai', glowColor: 'rgba(167, 139, 250, 0.22)', floatAmount: -10, floatDuration: 8, delay: 1.4, className: 'top-6 -left-2 lg:-left-6 hidden md:block' },
        { value: '30-Day', label: 'Free Trial', glowColor: 'rgba(147, 197, 253, 0.25)', floatAmount: 10, floatDuration: 10, delay: 1.9, className: 'bottom-10 -right-2 lg:-right-6 hidden md:block', pulseLabel: 'One-Time License' },
      ],
    },
    {
      key: 'billing',
      dotColor: 'bg-red-400/70',
      eyebrow: 'Billing & Inventory Software · India',
      headline: ['Multi-tenant billing software', 'built for', 'every Indian business.'],
      sub: 'Aadhirai Billing gives any retail business its own isolated database, barcode-driven checkout, and GST-compliant invoicing — sign up free and go live in minutes, no manual setup.',
      strip: 'Free Signup · Isolated Database · GST-Compliant',
      primaryCta: { label: 'Create Free Account', href: '/products/billing' },
      badges: [
        { value: 'Free', label: 'Self-Signup', glowColor: 'rgba(185, 28, 28, 0.22)', floatAmount: -10, floatDuration: 8, delay: 1.4, className: 'top-6 -left-2 lg:-left-6 hidden md:block' },
        { value: 'GST', label: 'Compliant Invoicing', valueClassName: 'text-gradient-ai', glowColor: 'rgba(147, 197, 253, 0.25)', floatAmount: 10, floatDuration: 10, delay: 1.9, className: 'bottom-10 -right-2 lg:-right-6 hidden md:block', pulseLabel: 'Isolated DB' },
      ],
    },
    {
      key: 'hr-inventory',
      dotColor: 'bg-emerald-400/70',
      eyebrow: 'HRM Software · India',
      headline: ['HRM software', 'built for', 'growing Indian businesses.'],
      sub: 'HR & Inventory brings employee records, leave, attendance, payroll data, and real-time stock into one system — no more disconnected spreadsheets and tools.',
      strip: 'Payroll-Ready · Multi-Location · Free Demo',
      primaryCta: { label: 'Explore HR & Inventory', href: '/products/hr-inventory' },
      badges: [
        { value: 'HRM', label: 'Payroll + Attendance', glowColor: 'rgba(52, 211, 153, 0.22)', floatAmount: -10, floatDuration: 8, delay: 1.4, className: 'top-6 -left-2 lg:-left-6 hidden md:block' },
        { value: 'Demo', label: 'Try It Free', valueClassName: 'text-gradient-ai', glowColor: 'rgba(167, 139, 250, 0.22)', floatAmount: 10, floatDuration: 10, delay: 1.9, className: 'bottom-10 -right-2 lg:-right-6 hidden md:block', pulseLabel: 'Multi-Location' },
      ],
    },
    {
      key: 'transport-logistics',
      dotColor: 'bg-sky-400/70',
      eyebrow: 'Transport & Logistics Software · India',
      headline: ['Transport & logistics software', 'built for', 'Indian fleet operators.'],
      sub: 'Aadhirai Transport & Logistics converts quotations straight into invoices, tracks every driver live on GPS, and manages your fleet — replacing manual Word/PDF invoicing.',
      strip: 'Live GPS Tracking · Fleet Management · Free Demo',
      primaryCta: { label: 'Explore Transport & Logistics', href: '/products/transport-logistics' },
      badges: [
        { value: 'GPS', label: 'Live Driver Tracking', valueClassName: 'text-gradient-ai', glowColor: 'rgba(29, 78, 216, 0.25)', floatAmount: -10, floatDuration: 8, delay: 1.4, className: 'top-6 -left-2 lg:-left-6 hidden md:block' },
        { value: 'Fleet', label: 'Driver & Vehicle Records', glowColor: 'rgba(147, 197, 253, 0.22)', floatAmount: 10, floatDuration: 10, delay: 1.9, className: 'bottom-10 -right-2 lg:-right-6 hidden md:block', pulseLabel: 'Live Demo' },
      ],
    },
  ], [eyebrowRegion, headlineRegion, builtStrip])
}

function HeroSection() {
  const slides = useSlides()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const slide = slides[index]

  /* Auto-advance, paused on hover so a reading visitor never loses their place mid-sentence */
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [paused, slides.length])

  return (
    <section className="relative overflow-hidden bg-[#050d1a] min-h-screen flex items-center text-white noise-overlay">

      {/* Background layers */}
      <div className="absolute inset-0 grid-texture pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/90 via-transparent to-transparent pointer-events-none" />
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)' }}
      />

      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-[0.055] blur-3xl"
        style={{ background: 'radial-gradient(ellipse, #2563eb, transparent 68%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-48 h-[500px] w-[500px] rounded-full opacity-[0.055] blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-[420px] w-[420px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <Container className="relative z-10 py-24 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16 xl:gap-20">

          {/* ── LEFT: Copy ─────────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex flex-col justify-center lg:py-24"
          >
            {/* Per-product slide — eyebrow, headline, sub, strip, primary CTA all crossfade together */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.key}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={slideTransition}
              >
                {/* Eyebrow */}
                <div className="mb-7">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
                    <span className={`inline-block h-1.5 w-1.5 flex-none rounded-full ${slide.dotColor}`} />
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="font-semibold leading-[1.04] tracking-[-0.04em] text-white"
                  style={{ fontSize: 'clamp(2.6rem, 5vw, 4.1rem)' }}
                >
                  {slide.headline[0]}
                  <br />
                  <span className="text-gradient-ai">{slide.headline[1]}</span>
                  <br />
                  {slide.headline[2]}
                </h1>

                {/* Sub */}
                <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.9] text-white/44">
                  {slide.sub}
                </p>

                {/* Credentials strip */}
                <div className="mt-8 flex items-center gap-5">
                  <div className="h-px flex-1 bg-white/[0.07]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/22">
                    {slide.strip}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href={slide.primaryCta.href}
                    className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-7 py-[14px] text-[13.5px] font-bold tracking-[0.01em] text-[#050d1a] shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_36px_rgba(0,0,0,0.42)] transition-all hover:bg-white/93 hover:shadow-[0_8px_48px_rgba(0,0,0,0.52)] active:scale-[0.985]"
                  >
                    {slide.primaryCta.label}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="https://wa.me/918508716957"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] font-medium text-white/38 underline underline-offset-[5px] decoration-white/16 transition-all hover:text-white/68 hover:decoration-white/38"
                  >
                    Talk to us on WhatsApp
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide dots — jump directly to any product */}
            <motion.div variants={fadeUp} className="mt-7 flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.headline[0]}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-white/70' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </motion.div>

            {/* Tagline — bridges the rotating headline above to every product on this
                same homepage, without touching the H1/sub. */}
            <motion.p variants={fadeUp} className="mt-5 text-[12.5px] italic text-white/26">
              Handmade software for Indian businesses — pharmacy, HR, inventory, and the custom systems in between.
            </motion.p>

            {/* Audience fork — startup engineering leaders land here too, not just product buyers */}
            <motion.div variants={fadeUp} className="mt-6">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/28 transition-colors hover:text-white/56"
              >
                Startup CTO or VP Engineering? See our backend architecture services
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Animation + floating trust badges ────────────────── */}
          <div className="relative flex items-center justify-center lg:py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.91 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[500px] mx-auto"
            >
              <HeroIntelligenceAnimation />

              {slide.badges.map((badge, i) => (
                <FloatingBadge key={`${slide.key}-badge-${i}`} {...badge} />
              ))}
            </motion.div>
          </div>

        </div>
      </Container>

      {/* Scroll cue */}
      <motion.a
        href="#pharmacy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 transition-colors hover:text-white/60"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  )
}

export default HeroSection
