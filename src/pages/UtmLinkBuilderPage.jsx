import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'UTM Link Builder', 'description': 'Free UTM campaign link builder. Add source, medium, and campaign parameters to any URL for accurate analytics tracking.', 'url': 'https://www.aadhiraiinnovations.com/tools/utm-link-builder', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What are UTM parameters?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Tags added to a URL (utm_source, utm_medium, utm_campaign, etc.) that let Google Analytics and other tools attribute traffic to specific campaigns, channels, and sources.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function UtmLinkBuilder() {
  const [url, setUrl] = useState('')
  const [source, setSource] = useState('')
  const [medium, setMedium] = useState('')
  const [campaign, setCampaign] = useState('')
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const built = url ? (() => {
    try {
      const u = new URL(url)
      if (source) u.searchParams.set('utm_source', source)
      if (medium) u.searchParams.set('utm_medium', medium)
      if (campaign) u.searchParams.set('utm_campaign', campaign)
      if (term) u.searchParams.set('utm_term', term)
      if (content) u.searchParams.set('utm_content', content)
      return u.toString()
    } catch { return null }
  })() : null

  const copy = async () => { if (!built) return; try { await navigator.clipboard.writeText(built); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Website URL</label><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input placeholder="Source (e.g. facebook)" value={source} onChange={(e) => setSource(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Medium (e.g. social)" value={medium} onChange={(e) => setMedium(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Campaign (e.g. diwali_sale)" value={campaign} onChange={(e) => setCampaign(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Term (optional)" value={term} onChange={(e) => setTerm(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Content (optional)" value={content} onChange={(e) => setContent(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm sm:col-span-2" />
      </div>

      {url && (built ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-slate-50 border border-slate-200 p-4 flex items-start justify-between gap-3">
          <p className="text-sm font-mono text-[#0B1F3A] break-all">{built}</p>
          <button onClick={copy} className="flex-none text-slate-400 hover:text-[#0B1F3A]"><Copy className="h-4 w-4" /></button>
        </motion.div>
      ) : <p className="text-sm text-red-600">Enter a valid URL (including https://)</p>)}
      {copyFeedback && <p className="text-xs text-green-600">Copied!</p>}
    </div>
  )
}

export default function UtmLinkBuilderPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="UTM Link Builder" description="Add source, medium, and campaign tracking parameters to any URL, for accurate analytics attribution." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'UTM Link Builder' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><UtmLinkBuilder /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="UTM Link Builder Questions" items={[
        { q: 'What are UTM parameters?', a: 'Tags added to a URL (utm_source, utm_medium, utm_campaign) that let analytics tools attribute traffic to specific campaigns.' },
      ]} />
      <ToolCta headline="Need marketing analytics built into your website?" body="Aadhirai Innovations builds custom websites and web applications with analytics done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
