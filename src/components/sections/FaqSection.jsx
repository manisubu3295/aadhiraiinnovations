import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Container from '../ui/Container'

const faqs = [
  {
    q: 'What pharmacy management software do you offer?',
    a: 'We offer Medora+, an AI-powered pharmacy management system built for Indian pharmacies. It includes GST-compliant billing, real-time inventory management, AI-driven stock forecasting, medicine expiry alerts, and optional cloud sync. It works offline and is designed specifically for the Indian pharmacy environment.',
  },
  {
    q: 'Is Medora+ GST-compliant for Indian pharmacies?',
    a: 'Yes. Medora+ is fully GST-compliant and handles HSN codes, GSTIN validation, tax breakdowns, and audit-ready transaction records. It is designed around Indian pharmacy billing requirements and is used by pharmacies across Tamil Nadu.',
  },
  {
    q: 'Does the pharmacy software work without an internet connection?',
    a: 'Yes. Medora+ is built offline-first — all core operations including billing, inventory, and reporting work without internet. Cloud sync happens automatically when connectivity is available. This makes it reliable for pharmacies in areas with inconsistent internet access.',
  },
  {
    q: 'Do you build ERP systems for Indian SMEs?',
    a: 'Yes. We design and build custom ERP systems and workflow automation platforms for Indian small and mid-sized businesses. Our ERP solutions cover inventory management, multi-location operations, AI-powered analytics, and process automation — delivered in structured phases.',
  },
  {
    q: 'Where is Aadhirai Innovations based, and which areas do you serve?',
    a: 'We are based in Peravurani and Chennai, Tamil Nadu, India. We serve pharmacies and businesses across Tamil Nadu, India, and internationally including Singapore. Our software is used by clients across Thanjavur district, Chennai, and other cities.',
  },
]

/* Inject FAQ schema on mount, clean up on unmount */
function useFaqSchema() {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'faq-homepage')
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.head.querySelector('script[data-schema="faq-homepage"]')?.remove()
    }
  }, [])
}

function FaqItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="border-b border-slate-100 last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-[#0B1F3A] leading-snug sm:text-base">
          {faq.q}
        </span>
        <span className="mt-0.5 flex-none text-slate-400">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FaqSection() {
  useFaqSchema()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section
      id="faq"
      className="bg-slate-50 border-y border-slate-100 py-14 md:py-20 lg:py-24 scroll-mt-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:items-start">

          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Common Questions
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Questions about our pharmacy software & ERP systems.
            </h2>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              Everything you need to know about Medora+, our ERP systems, and how we work with Indian businesses.
            </p>
          </motion.div>

          {/* Right: accordion */}
          <div className="bg-white rounded-xl border border-slate-200 px-6 md:px-8">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>

        </div>
      </Container>
    </section>
  )
}

export default FaqSection
