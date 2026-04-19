import { motion } from 'framer-motion'
import { ExternalLink, Download, Brain, ScanLine, Package, ShieldCheck, BarChart3 } from 'lucide-react'
import Container from '../ui/Container'

const features = [
  {
    icon: Brain,
    label: 'AI-Powered Billing',
    detail: 'Smart billing with anomaly detection and demand forecasting',
  },
  {
    icon: ScanLine,
    label: 'GST-Compliant Billing',
    detail: 'HSN codes · GSTIN validation · Audit-ready records',
  },
  {
    icon: Package,
    label: 'Intelligent Stock Control',
    detail: 'Real-time inventory · Expiry alerts · Auto-reorder signals',
  },
  {
    icon: BarChart3,
    label: 'Business Intelligence',
    detail: 'Sales visibility · Profit reports · Daily performance insights',
  },
  {
    icon: ShieldCheck,
    label: 'Compliance & Audit Ready',
    detail: 'Full audit trail · Role-based access · Offline-first operation',
  },
]

function MedoraSpotlightSection() {
  return (
    <section
      id="products"
      className="relative scroll-mt-24 overflow-hidden bg-[#060e1c] py-20 md:py-24 lg:py-32"
    >
      <div className="absolute inset-0 grid-texture pointer-events-none" />
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.03] blur-3xl"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)' }}
      />

      <Container className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-white/30">
                Flagship Product
              </span>
              <div className="flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-3 py-1">
                <Brain className="h-3 w-3 text-blue-400/60" strokeWidth={1.75} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400/60">
                  AI-Powered
                </span>
              </div>
            </div>

            {/* Product name */}
            <h2 className="font-bold tracking-[-0.04em] text-white leading-none mb-3"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 4.5rem)' }}
            >
              Medora<span className="text-white/22">+</span>
            </h2>

            <p className="text-[13px] uppercase tracking-[0.2em] text-white/24 mb-7">
              AI Pharmacy Management · Built for Indian operations
            </p>

            <p className="text-[15.5px] text-white/45 leading-[1.85] max-w-[42ch] mb-10">
              India's most complete pharmacy management platform — AI-assisted billing,
              intelligent stock control, expiry management, and business insights.
              Works without internet. Syncs when connectivity returns.
            </p>

            {/* Feature list — flat rows, no boxes */}
            <div className="divide-y divide-white/[0.06] mb-10">
              {features.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="flex items-center gap-4 py-3.5">
                  <Icon className="h-4 w-4 text-white/30 flex-none" strokeWidth={1.75} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13.5px] font-semibold text-white/68">{label}</span>
                    <span className="hidden sm:inline text-[12px] text-white/26 ml-3">{detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-sm bg-white px-6 py-3 text-[13px] font-bold tracking-wide text-[#060e1c] transition-all hover:bg-white/92"
              >
                Launch Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="/media/Medora-brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/14 px-6 py-3 text-[13px] font-medium text-white/50 transition-all hover:border-white/28 hover:text-white/80"
              >
                <Download className="h-3.5 w-3.5" />
                Brochure
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/14 px-6 py-3 text-[13px] font-medium text-white/50 transition-all hover:border-white/28 hover:text-white/80"
              >
                Request pilot
              </a>
            </div>
          </motion.div>

          {/* Right: product video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* AI billing signal — above video */}
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 flex-none shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-[12px] font-semibold text-white/55">
                AI billing detects pricing anomalies before every invoice
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
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

            {/* Bottom trust line */}
            <p className="mt-4 text-[11.5px] text-white/24 text-center">
              Used by pharmacies across Tamil Nadu · Offline-first · 10-min setup
            </p>
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

export default MedoraSpotlightSection
