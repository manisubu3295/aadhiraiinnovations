import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import { API_BASE } from '../lib/apiBase'

// The 5 real, currently-promoted custom-scoped systems — same name/tagline/href already written
// for them in HomePage.jsx's `customSoftware` array, kept in sync by hand rather than imported
// from src/data/products.js on purpose: that file's generic-catalog entries include 7 products
// that were deliberately deindexed elsewhere on the site (zero other internal links) plus a
// legacy 'pos' slug that isn't this flagship POS System page. This page should never resurface
// those just because someone forgets to filter for them.
const CUSTOM_SYSTEMS = [
  {
    title: 'ERP Automation',
    tag: 'Custom-built',
    desc: 'Purchase orders, vendor management, and stock control built around how your business actually operates — not a rigid template.',
    href: '/solutions/erp-automation',
  },
  {
    title: 'HR & Inventory',
    tag: 'Combined system',
    desc: 'Employee records, leave, attendance, and payroll alongside stock and purchase orders — one system instead of disconnected tools.',
    href: '/products/hr-inventory',
  },
  {
    title: 'Workforce Manager',
    tag: 'Attendance & payroll',
    desc: 'Biometric attendance, leave management, and shift scheduling with clean payroll data export.',
    href: '/products/workforce-manager',
  },
  {
    title: 'POS System',
    tag: 'Retail billing',
    desc: 'Fast, reliable point-of-sale billing for retail counters — barcode checkout, receipts, and daily sales tracking.',
    href: '/products/pos-system',
  },
  {
    title: 'Transport & Logistics',
    tag: 'Fleet & billing',
    desc: 'Quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, and fleet management for transport companies.',
    href: '/products/transport-logistics',
  },
]

const OFFLINE_TERMS = [
  { key: 'THREE_MONTH', label: '3 mo', months: 3, priceField: 'threeMonthPrice' },
  { key: 'SIX_MONTH', label: '6 mo', months: 6, priceField: 'sixMonthPrice' },
  { key: 'ONE_YEAR', label: '12 mo', months: 12, priceField: 'oneYearPrice' },
]

function formatPrice(value) {
  if (value === undefined || value === null) return null
  return `₹${Number(value).toLocaleString('en-IN')}`
}

/* ─── Shared card chrome (used by the two static price cards below) ────── */
function PriceCardShell({ eyebrow, name, children, highlight }) {
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
      {children}
    </div>
  )
}

function FeatureList({ features, highlight }) {
  return (
    <ul className="space-y-2.5 mb-7 flex-1">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2">
          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 flex-none ${highlight ? 'text-white/50' : 'text-[#0B1F3A]/50'}`} strokeWidth={1.75} />
          <span className={`text-[13px] leading-snug ${highlight ? 'text-white/70' : 'text-slate-600'}`}>{f}</span>
        </li>
      ))}
    </ul>
  )
}

function CtaButton({ label, href, external, highlight }) {
  const className = `mt-auto inline-flex items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold transition-colors ${
    highlight ? 'bg-white text-[#0B1F3A] hover:bg-white/90' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
  }`
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label} <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {label} <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  )
}

/* ─── Medora Offline: the one real interactive "calculator" on this page —
   backed by the same live, admin-configured pricing MedoraOfflinePage.jsx uses, not an
   invented formula. Picking a term shows its real price plus a derived ₹/month figure. ─── */
function MedoraOfflineCard() {
  const [pricing, setPricing] = useState(undefined) // undefined = loading, null = failed to load
  const [term, setTerm] = useState(OFFLINE_TERMS[0].key)

  useEffect(() => {
    fetch(`${API_BASE}/api/offline-license/pricing`)
      .then((r) => r.json())
      .then((data) => setPricing(data.success ? data.pricing : null))
      .catch(() => setPricing(null))
  }, [])

  const active = OFFLINE_TERMS.find((t) => t.key === term)
  const price = pricing ? pricing[active.priceField] : undefined
  const monthlyEquivalent = price ? Math.round(price / active.months) : null

  return (
    <PriceCardShell eyebrow="Offline · One-Time License" name="Medora Offline">
      <div className="mt-1 mb-4 flex gap-1.5">
        {OFFLINE_TERMS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTerm(t.key)}
            className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold transition-colors ${
              term === t.key ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-2xl font-bold mb-1 text-[#0B1F3A]">
        {pricing === undefined ? '···' : price ? formatPrice(price) : 'Contact us'}
      </div>
      <p className="text-xs mb-6 text-slate-400">
        {monthlyEquivalent
          ? `≈ ${formatPrice(monthlyEquivalent)}/month equivalent · one-time license, no subscription`
          : 'Free 30-day trial · one-time license'}
      </p>

      <FeatureList
        features={[
          'No internet needed after install',
          'Billing, FEFO inventory, GST toggle',
          'Guided setup available for chains',
        ]}
      />

      <CtaButton label="See Full Plans" href="/products/medora-offline#pricing" />
    </PriceCardShell>
  )
}

/* ─── "Get a ballpark estimate" — the honest version of a calculator for the 5 bespoke-priced
   systems: no invented number, just a short form that becomes a real Lead for follow-up. ──── */
const emptyEstimateForm = { name: '', email: '', phone: '', product: '', teamSize: '', locations: '', message: '' }

function EstimateForm() {
  const [formData, setFormData] = useState(emptyEstimateForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: 'idle', message: '' })
    try {
      const response = await fetch(`${API_BASE}/api/pricing-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit your request.')
      }
      setStatus({ type: 'success', message: result.message })
      setFormData(emptyEstimateForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to submit your request. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]'
  const labelClass = 'flex flex-col gap-1.5 text-[13px] font-medium text-slate-600'

  if (status.type === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" strokeWidth={1.75} />
        <p className="mt-3 text-sm font-medium text-emerald-800">{status.message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Which system?
          <select name="product" value={formData.product} onChange={handleChange} required className={inputClass}>
            <option value="" disabled>Select a system</option>
            {CUSTOM_SYSTEMS.map((s) => (
              <option key={s.title} value={s.title}>{s.title}</option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </label>
        <label className={labelClass}>
          Team size (approx.)
          <input type="text" name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="e.g. 15 staff" className={inputClass} />
        </label>
        <label className={labelClass}>
          Number of locations
          <input type="text" name="locations" value={formData.locations} onChange={handleChange} placeholder="e.g. 2" className={inputClass} />
        </label>
        <label className={labelClass}>
          Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
        </label>
        <label className={labelClass}>
          Phone (optional)
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
        </label>
      </div>
      <label className={`mt-4 block ${labelClass}`}>
        Anything specific we should know? (optional)
        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className={inputClass} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded-sm bg-[#0B1F3A] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173762] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? 'Submitting…' : 'Get a ballpark estimate'}
      </button>
      {status.type === 'error' && (
        <p className="mt-3 text-sm text-red-600" role="status">{status.message}</p>
      )}
    </form>
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
            <PriceCardShell eyebrow="Cloud · AI-Powered" name="Medora+">
              <div className="text-2xl font-bold mb-1 text-[#0B1F3A]">₹5,000–₹12,000/mo</div>
              <p className="text-xs mb-6 text-slate-400">
                ₹5,000 for a single location, up to ₹12,000+ for multi-location chains — exact pricing
                depends on your setup. Free 30-day trial.
              </p>
              <FeatureList
                features={[
                  'AI-powered billing & GST compliance',
                  'Real-time stock & expiry intelligence',
                  'Offline-first with cloud sync',
                  'Multi-user, role-based access',
                ]}
              />
              <CtaButton label="Explore Medora+" href="/products/medora-plus" />
            </PriceCardShell>

            <MedoraOfflineCard />

            <PriceCardShell eyebrow="Cloud · Multi-Tenant" name="Aadhirai Billing" highlight>
              <div className="text-2xl font-bold mb-1 text-white">Free</div>
              <p className="text-xs mb-6 text-white/50">Self-signup · your own isolated database</p>
              <FeatureList
                features={[
                  'Barcode & QR billing',
                  'GST-compliant invoicing',
                  'Dual stock tracking',
                  'Role-based staff access',
                ]}
                highlight
              />
              <CtaButton
                label="Create Free Account"
                href="https://billing.aadhiraiinnovations.com/login"
                external
                highlight
              />
            </PriceCardShell>
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
            {CUSTOM_SYSTEMS.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <h3 className="text-base font-semibold text-[#0B1F3A] mb-2">{product.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{product.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[12.5px] font-medium text-slate-400">{product.tag}</span>
                  <Link
                    to={product.href}
                    className="flex items-center gap-1 text-[12.5px] font-semibold text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Ballpark estimate form ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="mt-16 md:mt-20"
          >
            <div className="mb-6 max-w-2xl">
              <h3 className="text-xl font-semibold tracking-tight text-[#0B1F3A]">
                Not ready to talk yet? Get a ballpark estimate.
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                A few quick details and we'll follow up with a scoped estimate — not a generated number,
                a real one from someone who'll actually build it.
              </p>
            </div>
            <EstimateForm />
          </motion.div>
        </Container>
      </section>

      <FinalCtaSection />
    </>
  )
}
