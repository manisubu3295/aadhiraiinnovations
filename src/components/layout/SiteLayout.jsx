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
  '/learn': {
    title: 'Learn Java DSA & Programming — Free Courses | Aadhirai Innovations',
    description:
      'Free structured learning paths for Java data structures and algorithms. Step-by-step lessons with code examples. Built for beginners and intermediate developers.',
    ogTitle: 'Learn Java DSA Free | Aadhirai Innovations',
    ogDescription:
      'Step-by-step Java DSA courses, free. Arrays, linked lists, stacks, trees and more. Master real-world software engineering concepts.',
    canonical: 'https://www.aadhiraiinnovations.com/learn',
  },
  '/learn/java-dsa': {
    title: 'Java DSA Course — Data Structures & Algorithms with Java | Aadhirai Innovations',
    description:
      'Complete Java DSA course covering arrays, linked lists, stacks, queues, and trees. Free, structured, practical examples in every lesson.',
    ogTitle: 'Java Data Structures & Algorithms Course | Aadhirai Innovations',
    ogDescription:
      'Learn Java DSA from scratch. Structured lessons covering basics to advanced algorithms with practical code examples.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa',
  },
  '/learn/java-dsa/arrays': {
    title: 'Arrays in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master arrays in Java with real-world examples, time complexity analysis, common mistakes, and practice problems. Part of the free Java DSA course.',
    ogTitle: 'Arrays in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn arrays in Java: declaration, traversal, search, sort, time complexity, and practice problems. Foundation for all DSA.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/arrays',
  },
  '/learn/java-dsa/linked-list': {
    title: 'Linked Lists in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master linked lists with singly and doubly linked implementations. Learn nodes, pointers, traversal, reversal, and solve real-world problems efficiently.',
    ogTitle: 'Linked Lists in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn linked lists: nodes, singly vs doubly, insertion, deletion, and reversal. Dynamic data structure for efficient operations.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/linked-list',
  },
  '/learn/java-dsa/stack': {
    title: 'Stacks in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master stacks with LIFO principle. Learn push, pop, real-world applications like balanced parentheses, undo operations, and function call stack.',
    ogTitle: 'Stacks in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn stacks: LIFO, push/pop operations, balanced parentheses, undo/redo, and solving classic problems with O(1) operations.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/stack',
  },
  '/learn/java-dsa/queue': {
    title: 'Queues in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master queues with FIFO principle. Learn enqueue, dequeue, BFS traversal, job scheduling, and real-world queue implementations.',
    ogTitle: 'Queues in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn queues: FIFO, enqueue/dequeue, BFS, job scheduling, and solving problems with O(1) operations. Opposite of stacks.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/queue',
  },
  '/learn/java-dsa/binary-search': {
    title: 'Binary Search in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master binary search with O(log n) complexity. Learn iterative and recursive approaches, find boundaries, and solve variants on sorted arrays.',
    ogTitle: 'Binary Search in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn binary search: O(log n) time, divide-and-conquer strategy, find first/last occurrence, and avoid common off-by-one errors.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/binary-search',
  },
  '/learn/java-dsa/recursion': {
    title: 'Recursion in Java — Complete DSA Guide | Aadhirai Innovations',
    description:
      'Master recursion with base case, recursive case, and call stack visualization. Learn memoization to optimize factorial, Fibonacci, and more.',
    ogTitle: 'Recursion in Java DSA | Aadhirai Innovations',
    ogDescription:
      'Learn recursion: base case, call stack, memoization, and solving divide-and-conquer problems. Foundation for trees, graphs, and backtracking.',
    canonical: 'https://www.aadhiraiinnovations.com/learn/java-dsa/recursion',
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
