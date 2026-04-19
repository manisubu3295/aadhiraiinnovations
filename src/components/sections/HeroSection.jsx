import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Pill, GraduationCap, Users, ShoppingBag } from 'lucide-react'
import Container from '../ui/Container'
import HeroIntelligenceAnimation from '../ui/HeroIntelligenceAnimation'
import FloatingBadge from '../ui/FloatingBadge'

/* ─── Animation variants ────────────────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.92, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
const industries = [
  { icon: Pill,           label: 'Pharmacy'  },
  { icon: GraduationCap, label: 'School'    },
  { icon: Users,          label: 'Workforce' },
  { icon: ShoppingBag,    label: 'Retail'    },
]

/* ─── Component ─────────────────────────────────────────────────────────── */
function HeroSection() {
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
            className="flex flex-col justify-center lg:py-24"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="mb-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
                <span className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-blue-400/70" />
                Founder-led · Serving globally
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-semibold leading-[1.04] tracking-[-0.04em] text-white"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.1rem)' }}
            >
              Software built for
              <br />
              <span className="text-gradient-ai">pharmacies, schools,</span>
              <br />
              and growing businesses.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[42ch] text-[15px] leading-[1.9] text-white/44"
            >
              Manage billing, stock, staff, and daily operations in one place —
              so your business runs with fewer mistakes and better control.
            </motion.p>

            {/* Industry chips */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
              {industries.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2"
                >
                  <Icon className="h-3.5 w-3.5 text-white/35" strokeWidth={1.75} />
                  <span className="text-[12px] font-medium tracking-wide text-white/52">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="#solutions"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-7 py-[14px] text-[13.5px] font-bold tracking-[0.01em] text-[#050d1a] shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_36px_rgba(0,0,0,0.42)] transition-all hover:bg-white/93 hover:shadow-[0_8px_48px_rgba(0,0,0,0.52)] active:scale-[0.985]"
              >
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="text-[13px] font-medium text-white/38 underline underline-offset-[5px] decoration-white/16 transition-all hover:text-white/68 hover:decoration-white/38"
              >
                Talk to us
              </a>
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

              {/* ── Badge 1: 10+ Years Building ── upper-left corner ─────── */}
              <FloatingBadge
                value="10+"
                label="Years Building"
                glowColor="rgba(147, 197, 253, 0.25)"
                floatAmount={-10}
                floatDuration={8}
                delay={1.4}
                className="top-6 -left-2 lg:-left-6 hidden md:block"
              />

              {/* ── Badge 2: AI+ Intelligence ── lower-right corner ──────── */}
              <FloatingBadge
                value="AI+"
                label="Intelligence"
                glowColor="rgba(167, 139, 250, 0.22)"
                valueClassName="text-gradient-ai"
                floatAmount={10}
                floatDuration={10}
                delay={1.9}
                className="bottom-10 -right-2 lg:-right-6 hidden md:block"
              >
                {/* Live pulse indicator */}
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.85)]" />
                  <motion.span
                    className="h-1.5 w-1.5 flex-none rounded-full bg-blue-400/40"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                    style={{ marginLeft: '-14px' }}    /* overlap with the solid dot */
                  />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-400/60">
                    Active
                  </span>
                </div>
              </FloatingBadge>

            </motion.div>
          </div>

        </div>
      </Container>

      {/* Scroll cue */}
      <motion.a
        href="#capabilities"
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
