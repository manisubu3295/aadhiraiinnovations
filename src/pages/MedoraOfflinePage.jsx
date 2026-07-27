import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, MessageCircle, X, Download, CheckCircle2,
  PackageCheck, Receipt, Percent, Users, ShieldCheck, HardDrive, BarChart3,
  WifiOff, Plus, Minus, Building2,
} from 'lucide-react'
import Container from '../components/ui/Container'
import { API_BASE } from '../lib/apiBase'

/* ─── Schema: SoftwareApplication + FAQ ──────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Medora Pharma — Offline Edition',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Windows',
        description:
          'Offline pharmacy management software for India. Runs completely without internet — GST billing, FEFO inventory, and reports, with your data staying on your own computer.',
        areaServed: { '@type': 'Country', name: 'India' },
        offers: { '@type': 'Offer', seller: { '@type': 'Organization', name: 'Aadhirai Innovations' } },
        featureList: [
          'Works fully offline, no internet required',
          'FEFO batch costing inventory',
          'GST-compliant billing & invoicing',
          'Customer & doctor accounts',
          'Staff logins with restricted access',
          'Automatic local backups',
          'Reports',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What is the best offline pharmacy software in India?', acceptedAnswer: { '@type': 'Answer', text: 'Medora Pharma by Aadhirai Innovations is an offline-only pharmacy billing and inventory system built for Indian pharmacies, including Tamil Nadu. It runs entirely on your own Windows computer with GST-compliant billing, no internet dependency, and no monthly server costs.' } },
          { '@type': 'Question', name: 'Does this need internet to run?', acceptedAnswer: { '@type': 'Answer', text: 'No — once installed, it works completely offline. Internet is only needed to download the installer and, once, to activate your license.' } },
          { '@type': 'Question', name: 'Is it GST-compliant for Indian pharmacies?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Medora Pharma generates GST-compliant bills and reports, fully aligned with Indian pharmacy billing requirements — the same way whether you are online or not.' } },
          { '@type': 'Question', name: 'What happens after the free trial?', acceptedAnswer: { '@type': 'Answer', text: 'The app shows a banner with days remaining, then blocks further use until you activate a purchased license — your data is never deleted, you just need to activate to keep working.' } },
          { '@type': 'Question', name: 'Is my data backed up?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the app takes automatic local backups on a schedule you control from Settings.' } },
        ],
      },
    ]
    const scripts = schemas.map((schema) => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-schema', 'medora-offline-page')
      s.text = JSON.stringify(schema)
      document.head.appendChild(s)
      return s
    })
    return () => scripts.forEach((s) => s.remove())
  }, [])
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const features = [
  { icon: PackageCheck, title: 'FEFO Batch Costing Inventory', description: 'First-expiry-first-out batch tracking with accurate costing, so stock rotation and margins are handled automatically.' },
  { icon: Receipt, title: 'Billing & Invoicing', description: 'Fast, familiar billing built for real pharmacy counters — no internet dependency, no lag.' },
  { icon: Percent, title: 'GST', description: 'GST-compliant billing and reports, handled the same way whether you are online or not.' },
  { icon: Users, title: 'Customer & Doctor Accounts', description: 'Track regular customers and prescribing doctors, right from the same offline database.' },
  { icon: ShieldCheck, title: 'Staff Logins, Restricted Access', description: 'Give staff their own logins with only the access they need — you control who can do what.' },
  { icon: HardDrive, title: 'Automatic Local Backups', description: 'Scheduled backups saved locally, on your own computer, on a schedule you control from Settings.' },
  { icon: BarChart3, title: 'Reports', description: 'Sales, stock, and business reports generated from your own local data, no internet required.' },
]

const faqs = [
  { q: 'What is the best offline pharmacy software in India?', a: 'Medora Pharma by Aadhirai Innovations is an offline-only pharmacy billing and inventory system built for Indian pharmacies, including Tamil Nadu. It runs entirely on your own Windows computer with GST-compliant billing, no internet dependency, and no monthly server costs.' },
  { q: 'Is it GST-compliant for Indian pharmacies?', a: 'Yes. Medora Pharma generates GST-compliant bills and reports, fully aligned with Indian pharmacy billing requirements — the same way whether you are online or not.' },
  { q: 'Does this need internet to run?', a: 'No — once installed, it works completely offline. Internet is only needed to download the installer and, once, to activate your license.' },
  { q: 'What happens after the free trial?', a: 'The app shows a banner with days remaining, then blocks further use until you activate a purchased license — your data is never deleted, you just need to activate to keep working.' },
  { q: 'Can I move it to a new computer?', a: 'Contact us with your new computer’s Machine ID and we’ll issue a new license for it.' },
  { q: 'What if I forget my password?', a: 'The app has a built-in password-recovery question set during setup. If that’s also lost, there’s a "Reset All Data" option that wipes the app and lets you set up again from scratch — this does not affect your license/trial status.' },
  { q: 'Is my data backed up?', a: 'Yes, the app takes automatic local backups on a schedule you control from Settings.' },
  { q: 'What happens to my trial/license if I reinstall or reset the app?', a: 'Reinstalling or resetting app data never restarts your free trial or affects your license — both are tracked independently of your data.' },
]

const installSteps = [
  'Download the installer.',
  'Run it — it’s portable, no installation wizard; just double-click to launch (first launch takes ~10-20 seconds while it unpacks, this is normal).',
  'First-run screen: choose "Start Fresh" (new pharmacy) or "Restore from Backup File" (moving from another computer).',
  'Create your admin username, password, and a recovery question (used later if you forget your password).',
  'You’re in — a banner at the top shows your remaining trial days.',
  'To activate a purchased license: click "Activate License" in that banner, copy your Machine ID, and send it to us via the subscribe form below. Once we email your .lic file, import it from that same screen.',
]

// The plan name is the PAID license duration exactly — the 30-day free trial is separate and
// additive (used before purchase, not deducted from it), so a "3 Months" purchase grants a full
// 90 paid days regardless of how much trial time was already used.
const PLANS = [
  { key: 'THREE_MONTH', label: '3 Months', durationLabel: '90 days', priceField: 'threeMonthPrice' },
  { key: 'SIX_MONTH', label: '6 Months', durationLabel: '180 days', priceField: 'sixMonthPrice' },
  { key: 'ONE_YEAR', label: '1 Year', durationLabel: '365 days', priceField: 'oneYearPrice' },
]

// Same functionality regardless of plan duration — shown on every paid card so visitors don't
// have to scroll back up to the Features section to see what they're buying.
const PLAN_INCLUDED_FEATURES = [
  'Billing & invoicing',
  'Inventory management (FEFO)',
  'GST — enable or disable anytime',
  'Full settings control',
]

function formatPrice(value) {
  if (value === null || value === undefined) return null
  return `₹${Number(value).toLocaleString('en-IN')}`
}

/* ─── Sub-components ─────────────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-6 py-5 text-left" aria-expanded={isOpen}>
        <span className="text-sm font-semibold text-[#0B1F3A] leading-snug">{faq.q}</span>
        <span className="mt-0.5 flex-none text-slate-400">{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const emptyTrialForm = { name: '', email: '', whatsapp: '', businessName: '' }

function TrialModal({ downloadUrl, onClose }) {
  const [formData, setFormData] = useState(emptyTrialForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch(`${API_BASE}/api/offline-license/trial-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get('content-type') || ''
      let result = null
      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch {
          result = { success: false, message: text || 'Unexpected server response.' }
        }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit your request.')
      }

      setStatus({ type: 'success', message: result.message })
      // A real anchor click triggers the file download reliably without navigating away
      // (the server's octet-stream response prompts Save As rather than loading a page).
      if (downloadUrl) {
        const link = document.createElement('a')
        link.href = downloadUrl
        link.click()
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to submit your request. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-[#0B1F3A]">Download Free Trial</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-500 leading-relaxed">
            Just a few details so we can follow up if you have questions — no card, no commitment. Your
            download starts right after.
          </p>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            WhatsApp number
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Pharmacy / Business name (optional)
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[#0B1F3A] py-3 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762] disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Get My Download'}
          </button>

          {status.type !== 'idle' && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`} role="status">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

const emptySubscribeForm = { name: '', email: '', whatsapp: '', businessName: '', machineId: '' }

// Loaded once and reused — guards against re-injecting the script on every modal open.
let razorpayScriptPromise = null
function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve()
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = resolve
      script.onerror = () => { razorpayScriptPromise = null; reject(new Error('Could not load the payment form. Check your connection and try again.')) }
      document.body.appendChild(script)
    })
  }
  return razorpayScriptPromise
}

function SubscribeModal({ plan, onClose }) {
  const [formData, setFormData] = useState(emptySubscribeForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch(`${API_BASE}/api/offline-license/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan: plan.key }),
      })

      const contentType = response.headers.get('content-type') || ''
      let result = null
      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch {
          result = { success: false, message: text || 'Unexpected server response.' }
        }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit your request.')
      }

      // Payment configured for this plan — open Razorpay Checkout instead of just showing the
      // "we'll confirm payment manually" message. The checkout success handler below is UX
      // feedback only: the license is actually generated by a server-verified webhook, never
      // by anything the browser reports back, so it never claims the license was just issued.
      if (result.razorpayOrderId) {
        await loadRazorpayCheckout()
        const checkout = new window.Razorpay({
          key: result.razorpayKeyId,
          amount: result.amount,
          currency: result.currency,
          order_id: result.razorpayOrderId,
          name: 'Aadhirai Innovations',
          description: `Medora Offline — ${plan.label}`,
          prefill: { name: formData.name, email: formData.email, contact: formData.whatsapp },
          handler: () => {
            setStatus({ type: 'success', message: "Payment received — we're generating your license now. Check your email in a few minutes." })
            setFormData(emptySubscribeForm)
          },
          modal: {
            ondismiss: () => setStatus({ type: 'idle', message: '' }),
          },
        })
        checkout.open()
        return
      }

      setStatus({ type: 'success', message: result.message })
      setFormData(emptySubscribeForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to submit your request. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-[#0B1F3A]">Subscribe — {plan.label}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            WhatsApp number
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Pharmacy / Business name (optional)
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Machine ID
            <input type="text" name="machineId" value={formData.machineId} onChange={handleChange} required className={inputClass} />
            <span className="text-xs font-normal text-slate-400">
              Open the app, go to the Activate screen, and copy the Machine ID shown there.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[#0B1F3A] py-3 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762] disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>

          {status.type !== 'idle' && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`} role="status">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

const emptyEnterpriseForm = { name: '', email: '', whatsapp: '', businessName: '', message: '' }

function EnterpriseInquiryModal({ onClose }) {
  const [formData, setFormData] = useState(emptyEnterpriseForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch(`${API_BASE}/api/offline-license/enterprise-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get('content-type') || ''
      let result = null
      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch {
          result = { success: false, message: text || 'Unexpected server response.' }
        }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit your request.')
      }

      setStatus({ type: 'success', message: result.message })
      setFormData(emptyEnterpriseForm)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to submit your request. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-[#0B1F3A]">Enterprise / Guided Setup</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-500 leading-relaxed">
            Tell us a bit about your pharmacy and requirements — our team will follow up to scope the engagement and pricing.
          </p>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            WhatsApp number
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Pharmacy / Business name (optional)
            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Tell us about your requirements (optional)
            <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className={inputClass} />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[#0B1F3A] py-3 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762] disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit inquiry'}
          </button>

          {status.type !== 'idle' && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`} role="status">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function MedoraOfflinePage() {
  usePageSchema()
  const [openFaq, setOpenFaq] = useState(0)
  const [pricing, setPricing] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false)
  const [trialModalOpen, setTrialModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    fetch(`${API_BASE}/api/offline-license/pricing`)
      .then((r) => r.json())
      .then((data) => data.success && setPricing(data.pricing))
      .catch(() => {})
  }, [])

  // Lets the header's "Download Medora" link (visible on every page) jump straight into the
  // trial download flow from anywhere on the site, instead of making someone land here and
  // hunt for the button themselves. Waits for pricing to load since the modal needs
  // pricing.downloadUrl; only fires once so it doesn't re-open after the visitor closes it.
  useEffect(() => {
    if (searchParams.get('download') && pricing?.downloadUrl) {
      setTrialModalOpen(true)
      setSearchParams((prev) => {
        prev.delete('download')
        return prev
      }, { replace: true })
    }
  }, [pricing, searchParams, setSearchParams])

  function scrollToPricing() {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
        <Container>
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#0B1F3A]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Offline Pharmacy Software · Tamil Nadu, India</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#0B1F3A] sm:text-5xl lg:text-6xl leading-[1.08]">
              Offline pharmacy software
              <br />
              for India.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
              Medora Pharma runs your pharmacy completely offline — no internet, no monthly server
              costs, your data never leaves your computer. GST-compliant billing and inventory on
              a full Windows desktop system built for Indian pharmacies. Install once and run.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {pricing?.downloadUrl ? (
                <button
                  onClick={() => setTrialModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-7 py-3.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
                >
                  <Download className="h-4 w-4" />
                  Download — Start Free Trial
                </button>
              ) : (
                <button
                  onClick={scrollToPricing}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-7 py-3.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
                >
                  See Plans & Pricing
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {pricing?.downloadUrl && (
                <button
                  onClick={scrollToPricing}
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-7 py-3.5 text-sm font-medium text-[#0B1F3A] tracking-wide transition-colors hover:bg-slate-50"
                >
                  See Plans & Pricing
                </button>
              )}
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-7 py-3.5 text-sm font-medium text-[#0B1F3A] tracking-wide transition-colors hover:bg-slate-50"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {['Fully Offline', 'No Monthly Server Cost', 'Data Stays On Your PC', 'GST-Ready'].map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">What's Included</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
              Everything a pharmacy counter needs, with zero internet dependency.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-5 w-5 text-[#0B1F3A]/60" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0B1F3A] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-white border-t border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Plans & Pricing</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">Start free. Pay only if you keep using it.</h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-relaxed">
              The plans below are <strong className="text-[#0B1F3A]">self-service</strong> — download, activate with your
              Machine ID, and you're running. Your 30-day free trial doesn't count against paid time. If you'd rather have
              our technical team handle installation, data migration, and staff onboarding, see{' '}
              <strong className="text-[#0B1F3A]">Enterprise / Guided Setup</strong> below.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {/* Free Trial — info card, no form */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <WifiOff className="h-5 w-5 text-[#0B1F3A]/60" strokeWidth={1.75} />
              <h3 className="mt-4 text-sm font-semibold text-[#0B1F3A]">Free Trial</h3>
              <div className="mt-2 text-2xl font-bold text-[#0B1F3A]">₹0</div>
              <p className="mt-1 text-xs text-slate-500">30 days</p>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                The trial begins automatically the moment you install and first open the app — no card, no commitment.
              </p>
              {pricing?.downloadUrl ? (
                <button
                  onClick={() => setTrialModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm border border-slate-300 px-4 py-2.5 text-sm font-medium text-[#0B1F3A] transition-colors hover:bg-white"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              ) : (
                <p className="mt-5 text-xs text-slate-400">Download link coming soon — contact us to get started.</p>
              )}
            </div>

            {PLANS.map((plan) => {
              const price = pricing ? pricing[plan.priceField] : undefined
              return (
                <div key={plan.key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#0B1F3A]">{plan.label}</h3>
                  <div className="mt-2 text-2xl font-bold text-[#0B1F3A]">
                    {price ? formatPrice(price) : <span className="text-base font-medium text-slate-400">Contact us</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{plan.durationLabel}</p>
                  {plan.note && <p className="mt-3 text-xs text-slate-400 leading-relaxed">{plan.note}</p>}
                  <ul className="mt-4 space-y-2">
                    {PLAN_INCLUDED_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-none text-[#0B1F3A]/50" strokeWidth={1.75} />
                        <span className="text-xs text-slate-500 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="mt-5 w-full rounded-sm bg-[#0B1F3A] py-2.5 text-sm font-semibold text-white tracking-wide transition-colors hover:bg-[#173762]"
                  >
                    Subscribe
                  </button>
                </div>
              )
            })}

            {/* Enterprise / Guided Setup — scoped engagement, not a fixed self-service plan */}
            <div className="rounded-xl border border-[#0B1F3A]/20 bg-[#0B1F3A] p-6 shadow-sm">
              <Building2 className="h-5 w-5 text-white/60" strokeWidth={1.75} />
              <h3 className="mt-4 text-sm font-semibold text-white">Enterprise / Guided Setup</h3>
              <div className="mt-2 text-lg font-semibold text-white">Custom pricing</div>
              <p className="mt-1 text-xs text-white/50">Scoped to your requirements</p>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                For pharmacies that want our technical team to handle installation, data migration, and staff
                onboarding — implementation is scoped and priced to your specific setup.
              </p>
              <button
                onClick={() => setEnterpriseModalOpen(true)}
                className="mt-5 w-full rounded-sm bg-white py-2.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/90"
              >
                Contact Us
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-slate-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">FAQ</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2]">Common questions about the offline edition.</h2>
            </motion.div>

            <div className="bg-white rounded-xl border border-slate-200 px-6 md:px-8">
              {faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Installation guide ───────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="mb-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Installation Guide</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl leading-[1.2]">Getting started takes a few minutes.</h2>
            {pricing?.installGuideUrl && (
              <a
                href={pricing.installGuideUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:underline"
              >
                <Download className="h-4 w-4" />
                Download the Installation &amp; User Guide (PDF)
              </a>
            )}
          </motion.div>

          <ol className="max-w-2xl space-y-4">
            {installSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-[#0B1F3A]">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-600 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-2xl text-sm text-slate-500">
            For day-to-day usage — creating sales, managing inventory, running reports — see the in-app <strong>User Guide</strong> (Sidebar → User Guide), which has full screenshots and walkthroughs.
          </p>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2]">Ready to run your pharmacy offline?</h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Download and start your free 30-day trial today — no form, no card, no internet required after install.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={scrollToPricing}
                className="inline-flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1F3A] tracking-wide transition-colors hover:bg-white/92"
              >
                See Plans & Pricing
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp India
              </a>
              <a
                href="https://wa.me/6590356479"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-7 py-3.5 text-sm font-medium text-white/75 tracking-wide transition-colors hover:border-white/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Singapore
              </a>
            </div>
            <p className="mt-6 text-xs text-white/30">
              info@aadhiraiinnovations.com · India: +91 85087 16957 · +91 82481 95768 · Singapore: +65 9035 6479 · Peravurani &amp; Chennai, Tamil Nadu
            </p>
          </div>
        </Container>
      </section>

      {selectedPlan && <SubscribeModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
      {enterpriseModalOpen && <EnterpriseInquiryModal onClose={() => setEnterpriseModalOpen(false)} />}
      {trialModalOpen && <TrialModal downloadUrl={pricing?.downloadUrl} onClose={() => setTrialModalOpen(false)} />}
    </>
  )
}
