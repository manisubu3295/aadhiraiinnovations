import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import products from '../data/products'

const OTHER_PRODUCTS = products.filter((p) => p.slug !== 'billing' && p.slug !== 'medora')

function PriceCard({ eyebrow, name, price, priceNote, features, ctaLabel, ctaHref, external, highlight }) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-7 ${
        highlight ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-[0_20px_48px_rgba(11,31,58,0.18)]' : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <span className={`text-[10.5px] font-bold uppercase tracking-[0.2em] mb-4 ${highlight ? 'text-white/50' : 'text-slate-400'}`}>
        {eyebrow}
      </span>
      <h3 className={`text-lg font-semibold mb-1 ${highlight ? 'text-white' : 'text-[#0B1F3A]'}`}>{name}</h3>
      <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-white' : 'text-[#0B1F3A]'}`}>{price}</div>
      <p className={`text-xs mb-6 ${highlight ? 'text-white/50' : 'text-slate-400'}`}>{priceNote}</p>

      {features && (
        <ul className="space-y-2.5 mb-7 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 flex-none ${highlight ? 'text-white/50' : 'text-[#0B1F3A]/50'}`} strokeWidth={1.75} />
              <span className={`text-[13px] leading-snug ${highlight ? 'text-white/70' : 'text-slate-600'}`}>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {external ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noreferrer"
          className={`mt-auto inline-flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold transition-colors ${
            highlight ? 'bg-white text-[#0B1F3A] hover:bg-white/90' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
          }`}
        >
          {ctaLabel}
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </a>
      ) : (
        <Link
          to={ctaHref}
          className={`mt-auto inline-flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold transition-colors ${
            highlight ? 'bg-white text-[#0B1F3A] hover:bg-white/90' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
          }`}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      )}
    </div>
  )
}

export default function PricingPage() {
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pricing</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0B1F3A] sm:text-5xl leading-[1.12]">
              Straightforward pricing for our software.
              <br />
              Scoped pricing for everything else.
            </h1>
            <p className="mt-5 text-base text-slate-600 md:text-lg leading-relaxed">
              Medora+, Medora Offline, and Aadhirai Billing are self-service products with public pricing.
              Our other systems are built and priced around what each business actually needs.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Core product pricing ─────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 pb-20 md:pb-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <PriceCard
              eyebrow="Cloud · AI-Powered"
              name="Medora+"
              price="₹5,000–₹12,000/mo"
              priceNote="Single location to multi-location chains · Free 30-day trial"
              features={[
                'AI-powered billing & GST compliance',
                'Real-time stock & expiry intelligence',
                'Offline-first with cloud sync',
                'Multi-user, role-based access',
              ]}
              ctaLabel="Explore Medora+"
              ctaHref="/products/medora-plus"
            />
            <PriceCard
              eyebrow="Offline · One-Time License"
              name="Medora Offline"
              price="Live plans"
              priceNote="3, 6, or 12-month licenses · Free 30-day trial · Enterprise setup available"
              features={[
                'No internet needed after install',
                'Billing, FEFO inventory, GST toggle',
                'Guided setup available for chains',
                'Pricing shown live on the product page',
              ]}
              ctaLabel="See Plans & Pricing"
              ctaHref="/products/medora-offline#pricing"
            />
            <PriceCard
              eyebrow="Cloud · Multi-Tenant"
              name="Aadhirai Billing"
              price="Free"
              priceNote="Self-signup · your own isolated database"
              features={[
                'Barcode & QR billing',
                'GST-compliant invoicing',
                'Dual stock tracking',
                'Role-based staff access',
              ]}
              ctaLabel="Create Free Account"
              ctaHref="https://billing.aadhiraiinnovations.com/login"
              external
              highlight
            />
          </div>
        </Container>
      </section>

      {/* ── Consulting pricing pointer ───────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-12">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Looking for consulting, audit, or architecture engagement pricing?
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
            >
              See Services pricing
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Custom-scoped products ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Other Systems
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Custom-scoped pricing
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-relaxed">
              These systems are built around each client's requirements, so we don't publish a fixed price —
              tell us what you need and we'll scope it.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OTHER_PRODUCTS.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <h3 className="text-base font-semibold text-[#0B1F3A] mb-2">{product.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{product.tagline}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[12.5px] font-medium text-slate-400">Custom scoped pricing</span>
                  <Link
                    to="/contact"
                    className="flex items-center gap-1 text-[12.5px] font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
                  >
                    Talk to us
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCtaSection />
    </>
  )
}
