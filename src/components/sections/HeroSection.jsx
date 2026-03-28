import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Brain, Package, Building2, Workflow } from 'lucide-react'
import Container from '../ui/Container'
import HeroIntelligenceAnimation from '../ui/HeroIntelligenceAnimation'

/* ─── Animation variants ────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Data ──────────────────────────────────────────────────── */
const capabilities = [
  {
    icon: Brain,
    title: 'AI Pharmacy Intelligence',
    desc: 'Predictive stock · expiry · demand forecasting',
  },
  {
    icon: Package,
    title: 'Intelligent Billing & Inventory',
    desc: 'Anomaly detection · real-time tracking · GST',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant SaaS',
    desc: 'AI analytics · subscription tiers · scalable',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    desc: 'AI routing · decision support · 60–80% less overhead',
  },
]

/* ─── Component ─────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#050d1a] min-h-screen flex items-center text-white noise-overlay">
      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture pointer-events-none" />

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/80 via-transparent to-transparent pointer-events-none" />

      {/* Ambient glow — top-left */}
      <div
        className="pointer-events-none absolute -left-60 -top-60 h-[640px] w-[640px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />
      {/* Ambient glow — bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />
      {/* Ambient glow — center top */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full opacity-[0.035] blur-3xl"
        style={{ background: 'radial-gradient(ellipse, #1e3a8a, transparent 70%)' }}
      />

      <Container className="relative z-10 py-20 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid w-full gap-14 lg:grid-cols-[1fr_1.08fr] lg:gap-16 xl:gap-24">

          {/* ── LEFT: Copy ──────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="flex flex-col justify-center lg:py-20"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
              <div className="h-px w-10 bg-white/20" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/38">
                Pharmacy Software · ERP · Business Automation · Tamil Nadu, India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-bold leading-[1.05] tracking-[-0.028em]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              <span className="text-gradient-ai">AI-powered</span> pharmacy software
              <br />
              & ERP systems built for India —
              <br />
              <span className="text-white/38">pharmacies, retail & enterprise.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-sm text-[15px] leading-[1.75] text-white/42"
            >
              We design and deploy AI-integrated, enterprise-grade platforms
              for pharmacies, retail operations, and businesses that demand
              intelligence, reliability, and scale.
            </motion.p>

            {/* Capabilities grid — 2×2 */}
            <motion.div variants={fadeUp} className="mt-9 grid grid-cols-2 gap-2">
              {capabilities.map((cap) => {
                const Icon = cap.icon
                return (
                  <div
                    key={cap.title}
                    className="glass-dark glass-dark-hover flex items-start gap-3 rounded-xl px-4 py-3.5"
                  >
                    <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-white/[0.07]">
                      <Icon className="h-3.5 w-3.5 text-white/50" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold leading-tight text-white/80">
                        {cap.title}
                      </div>
                      <div className="mt-0.5 text-[10.5px] leading-relaxed text-white/28">
                        {cap.desc}
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-7 py-4 text-sm font-bold tracking-wide text-[#050d1a] shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_32px_rgba(0,0,0,0.35)] transition-all hover:bg-white/94 hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#build"
                className="inline-flex items-center gap-2 rounded-sm border border-white/14 px-7 py-4 text-sm font-medium tracking-wide text-white/55 transition-all hover:border-white/28 hover:text-white/90"
              >
                Explore Systems
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={fadeUp}
              className="mt-11 flex flex-wrap gap-8 border-t border-white/[0.07] pt-9"
            >
              {[
                { val: '10+', label: 'Years engineering' },
                { val: 'AI+', label: 'Integrated intelligence' },
                { val: 'SaaS', label: 'Multi-tenant ready' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xl font-extrabold tracking-tight text-white">{m.val}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/28">
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Intelligence Animation ────────────────── */}
          <div className="relative flex items-center justify-center lg:py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[520px] mx-auto"
            >
              <HeroIntelligenceAnimation />

              {/* Floating product badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 rounded-xl border border-white/[0.1] bg-[#080f1d]/90 backdrop-blur-sm px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.07] flex items-center justify-center flex-none">
                    <Brain className="h-4 w-4 text-white/50" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-white/80 leading-tight">Medora+ · AI Billing</div>
                    <div className="mt-0.5 text-[10px] text-white/30">GST-compliant · Offline-first</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                    <span className="text-[10px] font-semibold text-emerald-400">Live</span>
                  </div>
                </div>
              </motion.div>

              {/* Top-left metric chip */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-10 left-4 rounded-lg border border-white/[0.09] bg-[#080f1d]/80 backdrop-blur-sm px-3 py-2"
              >
                <div className="text-[17px] font-extrabold leading-none text-white">10+</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/30">Years building</div>
              </motion.div>

              {/* Top-right metric chip */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-10 right-4 rounded-lg border border-white/[0.09] bg-[#080f1d]/80 backdrop-blur-sm px-3 py-2 text-right"
              >
                <div className="text-[17px] font-extrabold leading-none text-white">AI+</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/30">Intelligence</div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </Container>

      {/* Scroll cue */}
      <motion.a
        href="#capabilities"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 hover:text-white/65 transition-colors"
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
