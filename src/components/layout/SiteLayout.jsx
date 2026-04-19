import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

/* ─── Per-route SEO config ────────────────────────────────────────────
   All title/description/og values are set here in one place.
   SiteLayout watches pathname and applies the matching config on mount.
──────────────────────────────────────────────────────────────────────── */
const SEO = {
  '/': {
    title: 'Pharmacy Software & ERP Systems India | Aadhirai Innovations',
    description:
      'AI-powered pharmacy billing software, ERP, and business automation for Indian pharmacies and SMEs. GST-compliant. Offline-first. Tamil Nadu-based, serving India & globally.',
    ogTitle: 'Pharmacy Software & Business Automation | Aadhirai Innovations',
    ogDescription:
      'GST-compliant pharmacy billing, AI inventory forecasting, and custom ERP for Indian businesses. Trusted by pharmacies and SMEs across Tamil Nadu.',
    canonical: 'https://www.aadhiraiinnovations.com/',
  },
  '/solutions/pharmacy-software': {
    title: 'Pharmacy Management Software India — Medora+ | Aadhirai Innovations',
    description:
      'GST-compliant pharmacy billing software with AI stock forecasting, expiry alerts, and offline-first architecture. Built for Indian pharmacies. Free demo available.',
    ogTitle: 'Medora+ Pharmacy Management Software India | Aadhirai Innovations',
    ogDescription:
      "India's AI-powered pharmacy management system. Billing, stock control, expiry alerts, GST compliance. Demo available.",
    canonical: 'https://www.aadhiraiinnovations.com/solutions/pharmacy-software',
  },
  '/solutions/erp-automation': {
    title: 'ERP & Business Automation Software for Indian SMEs | Aadhirai Innovations',
    description:
      'Affordable ERP systems and workflow automation for small and mid-sized businesses in India. AI analytics, inventory control. Built in Tamil Nadu.',
    ogTitle: 'ERP & Business Automation for Indian SMEs | Aadhirai Innovations',
    ogDescription:
      'Custom ERP and workflow automation built for Indian SMEs. AI-powered analytics, offline-first, GST-ready.',
    canonical: 'https://www.aadhiraiinnovations.com/solutions/erp-automation',
  },
  '/products/medora-plus': {
    title: 'Medora+ — AI Pharmacy Management Software India | Aadhirai Innovations',
    description:
      "Medora+ is India's AI-powered pharmacy management system. Billing, stock control, expiry tracking, GST compliance, and cloud sync. Demo available.",
    ogTitle: 'Medora+ Pharmacy Software | Aadhirai Innovations',
    ogDescription:
      'Complete pharmacy management: GST billing, AI forecasting, expiry alerts, offline operation with cloud sync. Built for Indian pharmacies.',
    canonical: 'https://www.aadhiraiinnovations.com/products/medora-plus',
  },
  '/founder': {
    title: 'Founder | Aadhirai Innovations — Enterprise Software Company, Tamil Nadu',
    description:
      'Manikandan Subramaniyan, founder of Aadhirai Innovations. 10+ years building pharmacy software, ERP systems, and enterprise automation for Indian businesses.',
    ogTitle: 'Founder | Aadhirai Innovations',
    ogDescription:
      'Building reliable pharmacy software and enterprise systems for India. 10+ years of engineering experience from Tamil Nadu.',
    canonical: 'https://www.aadhiraiinnovations.com/founder',
  },
  '/tools/gst-calculator': {
    title: 'GST Calculator India — Add & Remove GST Online | Aadhirai Innovations',
    description:
      'Free GST calculator for India. Calculate GST inclusive/exclusive prices, CGST + SGST for intra-state and IGST for inter-state transactions. Supports all GST rates: 0%, 3%, 5%, 12%, 18%, 28%.',
    ogTitle: 'GST Calculator India — CGST, SGST & IGST | Aadhirai Innovations',
    ogDescription:
      'Instantly calculate GST in India. Add GST or remove GST from any price. Get CGST, SGST, and IGST breakdowns for all GST slabs.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/gst-calculator',
  },
}

const DEFAULT_SEO = SEO['/']

function applySEO(config) {
  const { title, description, ogTitle, ogDescription, canonical } = config

  document.title = title

  const setMeta = (sel, content) => {
    document.querySelector(sel)?.setAttribute('content', content)
  }
  const setLink = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.rel = rel
      document.head.appendChild(el)
    }
    el.href = href
  }

  setMeta('meta[name="description"]', description)
  setMeta('meta[property="og:title"]', ogTitle)
  setMeta('meta[property="og:description"]', ogDescription)
  setMeta('meta[property="og:url"]', canonical)
  setMeta('meta[name="twitter:title"]', ogTitle)
  setMeta('meta[name="twitter:description"]', ogDescription)
  setLink('canonical', canonical)
}

function SiteLayout() {
  const { pathname, hash } = useLocation()

  /* Scroll to hash anchor or page top on navigation */
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  /* Apply per-route SEO meta */
  useEffect(() => {
    const config = SEO[pathname] ?? DEFAULT_SEO
    applySEO(config)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white text-[#0B1F3A]">
      <Header />
      <main>
        <Outlet />
      </main>

      {/* Persistent WhatsApp button */}
      <a
        href="https://wa.me/918508716957"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Aadhirai Innovations on WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.3} />
      </a>

      <Footer />
    </div>
  )
}

export default SiteLayout
