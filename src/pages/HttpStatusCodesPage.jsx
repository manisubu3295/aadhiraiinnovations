import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import httpStatusCodes from '../data/httpStatusCodes'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'HTTP Status Code Reference', 'description': 'A searchable reference of common HTTP status codes and what they mean.', 'url': 'https://www.aadhiraiinnovations.com/tools/http-status-codes', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Is this every HTTP status code?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It covers the ones developers encounter day to day. Rarely-used WebDAV and experimental codes are omitted for clarity.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function HttpStatusCodes() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return httpStatusCodes
    return httpStatusCodes.filter((c) => String(c.code).includes(q) || c.text.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code or name — e.g. 404, timeout" className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
        {filtered.map((c) => (
          <div key={c.code} className="rounded-lg border border-slate-200 p-4 flex gap-4">
            <span className="flex-none w-14 text-lg font-bold text-[#0B1F3A]">{c.code}</span>
            <div><p className="text-sm font-semibold text-[#0B1F3A]">{c.text}</p><p className="text-xs text-slate-500 mt-0.5">{c.desc}</p></div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No matching status codes.</p>}
      </motion.div>
    </div>
  )
}

export default function HttpStatusCodesPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="HTTP Status Code Reference" description="A searchable reference of common HTTP status codes and what they mean." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'HTTP Status Codes' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><HttpStatusCodes /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="HTTP Status Code Questions" items={[
        { q: 'Is this every HTTP status code?', a: 'It covers the ones developers encounter day to day — rare WebDAV/experimental codes are omitted.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
