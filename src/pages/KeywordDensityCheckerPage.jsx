import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Keyword Density Checker', 'description': 'Free keyword density checker. Paste your content and see word/phrase frequency and density percentage.', 'url': 'https://www.aadhiraiinnovations.com/tools/keyword-density-checker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a good keyword density?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'There\'s no strict rule, but most SEO guidance suggests 1-2% for a target keyword — enough to signal relevance without "keyword stuffing," which search engines penalize.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'of', 'in', 'on', 'for', 'with', 'was', 'were', 'it', 'this', 'that', 'as', 'at', 'by', 'be', 'from'])

function KeywordDensityChecker() {
  const [text, setText] = useState('')

  const analysis = useMemo(() => {
    const words = text.toLowerCase().match(/[a-z0-9']+/g) || []
    const total = words.length
    const counts = {}
    words.forEach((w) => { if (!STOPWORDS.has(w) && w.length > 2) counts[w] = (counts[w] || 0) + 1 })
    const rows = Object.entries(counts).map(([word, count]) => ({ word, count, density: (count / total) * 100 })).sort((a, b) => b.count - a.count).slice(0, 20)
    return { total, rows }
  }, [text])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Paste Your Content</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your article or page content here..." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
        <p className="mt-1.5 text-[11px] text-slate-400">{analysis.total} words</p>
      </div>

      {analysis.rows.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#0B1F3A] text-white"><th className="px-4 py-2 text-left font-semibold">Word</th><th className="px-4 py-2 text-left font-semibold">Count</th><th className="px-4 py-2 text-left font-semibold">Density</th></tr></thead>
            <tbody className="divide-y divide-slate-200">
              {analysis.rows.map((r, i) => (<tr key={r.word} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}><td className="px-4 py-2 text-slate-700">{r.word}</td><td className="px-4 py-2 text-slate-600">{r.count}</td><td className="px-4 py-2 font-medium text-[#0B1F3A]">{r.density.toFixed(2)}%</td></tr>))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}

export default function KeywordDensityCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Keyword Density Checker" description="Paste your content and see word frequency and density percentage — spot over- or under-optimized keywords." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Keyword Density Checker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><KeywordDensityChecker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Keyword Density Questions" items={[
        { q: 'What is a good keyword density?', a: 'Most SEO guidance suggests 1-2% for a target keyword — enough for relevance without keyword stuffing.' },
      ]} />
      <ToolCta headline="Need SEO built into your website from day one?" body="Aadhirai Innovations builds custom websites and web applications with SEO done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
