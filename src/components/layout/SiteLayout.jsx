import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

/* ─── Per-route SEO config ────────────────────────────────────────────
   All title/description/og values are set here in one place.
   SiteLayout watches pathname and applies the matching config on mount.
──────────────────────────────────────────────────────────────────────── */
const SEO = {
  '/': {
    title: 'Pharmacy Software Tamil Nadu — Medora+ & Medora Offline | Aadhirai Innovations',
    description:
      'GST-compliant pharmacy billing software for Tamil Nadu pharmacies — Peravurani, Pattukkottai, Thanjavur, Pudukkottai, Trichy, Aranthangi and beyond. Offline-first, AI stock forecasting. We also build custom business software and backend engineering.',
    ogTitle: 'Pharmacy Software for Tamil Nadu | Aadhirai Innovations',
    ogDescription:
      'Medora+ and Medora Offline — GST-ready billing, expiry alerts, and offline-first pharmacy management, built for Tamil Nadu pharmacies. Custom software and backend engineering also available.',
    canonical: 'https://www.aadhiraiinnovations.com/',
  },
  '/services': {
    title: 'Services — Backend Architecture Engagements | Aadhirai Innovations',
    description:
      'Production Readiness Audit (₹4–6 lakh, 3 weeks), Architecture Advisory Retainer, and Fixed-Scope Engineering for Series A and B software companies.',
    ogTitle: 'Services | Aadhirai Innovations',
    ogDescription:
      'Three ways to engage: Production Readiness Audit, Architecture Advisory Retainer, Fixed-Scope Engineering. Backend architecture specialists for growth-stage companies.',
    canonical: 'https://www.aadhiraiinnovations.com/services',
  },
  '/about': {
    title: 'About Aadhirai Innovations — Backend Architecture Specialists',
    description:
      'Aadhirai Innovations was founded to help funded Indian startups build backend infrastructure that scales. Senior architect with enterprise-grade financial systems experience.',
    ogTitle: 'About | Aadhirai Innovations',
    ogDescription:
      'Senior backend architecture for funded Indian startups. Founded by Arthi Manikandan. Senior architect with 8+ years experience in high-availability systems.',
    canonical: 'https://www.aadhiraiinnovations.com/about',
  },
  '/contact': {
    title: 'Contact Aadhirai Innovations — Book a Production Readiness Audit',
    description:
      'Get in touch with Aadhirai Innovations to discuss a Production Readiness Audit, Architecture Advisory Retainer, or Fixed-Scope Engineering engagement.',
    ogTitle: 'Contact | Aadhirai Innovations',
    ogDescription:
      'Book a Production Readiness Audit or discuss an architecture engagement. We respond within one business day.',
    canonical: 'https://www.aadhiraiinnovations.com/contact',
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
  '/products/medora-offline': {
    title: 'Offline Pharmacy Billing Software India — Medora Pharma (Windows) | Aadhirai Innovations',
    description:
      'Offline pharmacy management software for India and Tamil Nadu. No internet, no monthly server costs — GST billing, FEFO inventory, and reports run entirely on your own Windows computer. Free 30-day trial.',
    ogTitle: 'Offline Pharmacy Software India — Medora Pharma | Aadhirai Innovations',
    ogDescription:
      'The offline pharmacy billing and inventory system built for Indian pharmacies — GST-compliant, works with zero internet after install, data never leaves your computer. Free trial.',
    canonical: 'https://www.aadhiraiinnovations.com/products/medora-offline',
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
  '/tools': {
    title: 'Free Document Tools Online — PDF & DOCX Utilities | Aadhirai Innovations',
    description:
      'Free online document tools: convert DOCX to PDF, convert PDF to Word, and edit PDF files online. Fast, browser-based tools for offices, students, and businesses.',
    ogTitle: 'Free PDF & Document Tools | Aadhirai Innovations',
    ogDescription:
      'Free browser-based document tools. Convert Word to PDF, PDF to Word, edit PDFs online. No signup required.',
    canonical: 'https://www.aadhiraiinnovations.com/tools',
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
  '/tools/docx-to-pdf-converter': {
    title: 'DOCX to PDF Converter — Convert Word to PDF Online | Aadhirai Innovations',
    description:
      'Free online DOCX to PDF converter. Convert Word documents to PDF in seconds. No signup, no file limit. Works in browser.',
    ogTitle: 'DOCX to PDF Converter Online | Aadhirai Innovations',
    ogDescription:
      'Convert Word documents (.docx) to PDF for free. No account needed. Instant browser-based conversion.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/docx-to-pdf-converter',
  },
  '/tools/pdf-to-docx-converter': {
    title: 'PDF to DOCX Converter — Convert PDF to Word Online | Aadhirai Innovations',
    description:
      'Free online PDF to Word converter. Extract editable text from PDF and get a DOCX file. Works in browser, no signup required.',
    ogTitle: 'PDF to DOCX Converter Online | Aadhirai Innovations',
    ogDescription:
      'Convert PDF to editable Word documents online for free. No account needed. Works for text-based PDFs.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-to-docx-converter',
  },
  '/tools/pdf-editor': {
    title: 'PDF Editor Online — Rotate, Delete & Reorder PDF Pages | Aadhirai Innovations',
    description:
      'Free online PDF editor. Rotate, delete, and reorder PDF pages in your browser. No account required. Download edited PDF instantly.',
    ogTitle: 'Free PDF Editor Online | Aadhirai Innovations',
    ogDescription:
      'Edit PDF pages online for free. Rotate pages, delete pages, reorder pages. Browser-based, no software install.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-editor',
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

<Footer />
    </div>
  )
}

export default SiteLayout
