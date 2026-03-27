import { motion } from 'framer-motion'
import { ExternalLink, Download, Brain, PackageCheck, Database, Cloud } from 'lucide-react'
import Container from '../ui/Container'

const featureGrid = [
  {
    icon: Brain,
    title: 'AI Forecasting',
    sub: 'Demand prediction · Stock optimisation',
  },
  {
    icon: PackageCheck,
    title: 'Smart Billing',
    sub: 'GST-compliant · Anomaly detection',
  },
  {
    icon: Database,
    title: 'Inventory Control',
    sub: 'Batch tracking · Expiry alerts',
  },
  {
    icon: Cloud,
    title: 'Cloud Intelligence',
    sub: 'Optional sync · Central analytics',
  },
]

function MedoraSpotlightSection() {
  return (
    <section id="products" className="relative scroll-mt-24 overflow-hidden bg-[#060e1c] py-16 md:py-20 lg:py-24">
      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture pointer-events-none" />

      {/* Subtle glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:items-center">

          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-10 bg-white/18" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                Flagship Product
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Medora<span className="text-white/35">+</span>
            </h2>
            <p className="mt-2 text-sm uppercase tracking-widest text-white/30">
              AI-Powered Pharmacy Intelligence Platform
            </p>

            {/* AI badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
              <Brain className="h-3.5 w-3.5 text-white/45" strokeWidth={1.75} />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
                AI Intelligence Layer Included
              </span>
            </div>

            <p className="mt-6 max-w-lg text-base text-white/50 leading-relaxed">
              Billing, inventory, compliance, and AI forecasting — tightly integrated, offline-first, and production-ready.
            </p>

            {/* Feature 2×2 grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {featureGrid.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="rounded-xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-md border border-white/10 bg-white/8 flex items-center justify-center flex-none">
                        <Icon className="h-3.5 w-3.5 text-white/55" strokeWidth={1.75} />
                      </div>
                      <span className="text-[12px] font-semibold text-white/80">{feature.title}</span>
                    </div>
                    <p className="text-[10px] text-white/32 leading-relaxed">{feature.sub}</p>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-sm bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#060e1c] transition-all hover:bg-white/92"
              >
                Launch Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="/media/Medora-brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/16 px-6 py-3 text-sm font-medium tracking-wide text-white/62 transition-all hover:border-white/32 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                View Brochure
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/16 px-6 py-3 text-sm font-medium tracking-wide text-white/62 transition-all hover:border-white/32 hover:text-white"
              >
                Request Pilot
              </a>
            </div>
          </motion.div>

          {/* Right: video */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-hidden rounded-xl border border-white/8 shadow-2xl">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/Cac-96pbNq0?si=Cl7BEZAgmz9WTrjZ"
                  title="Medora+ walkthrough"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

export default MedoraSpotlightSection
