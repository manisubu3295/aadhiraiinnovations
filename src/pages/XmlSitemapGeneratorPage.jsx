import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'XML Sitemap Generator', 'description': 'Free XML sitemap generator. Paste a list of URLs and get a valid sitemap.xml file.', 'url': 'https://www.aadhiraiinnovations.com/tools/xml-sitemap-generator', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is an XML sitemap?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A file listing your site\'s URLs so search engines can discover and crawl them more efficiently. Submit it via Google Search Console.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function buildSitemap(urls, changefreq, priority) {
  const today = new Date().toISOString().split('T')[0]
  const entries = urls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`
}

function XmlSitemapGenerator() {
  const [urlText, setUrlText] = useState('')
  const [changefreq, setChangefreq] = useState('weekly')
  const [priority, setPriority] = useState('0.8')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const urls = urlText.split('\n').map((u) => u.trim()).filter(Boolean)
  const output = urls.length > 0 ? buildSitemap(urls, changefreq, priority) : ''

  const copy = async () => { try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const download = () => {
    const blob = new Blob([output], { type: 'application/xml' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sitemap.xml'; a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">URLs (one per line)</label>
        <textarea value={urlText} onChange={(e) => setUrlText(e.target.value)} rows={6} placeholder={'https://example.com/\nhttps://example.com/about'} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Change Frequency</label>
          <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white">{['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((f) => <option key={f} value={f}>{f}</option>)}</select>
        </div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white">{['1.0', '0.9', '0.8', '0.7', '0.5', '0.3'].map((p) => <option key={p} value={p}>{p}</option>)}</select>
        </div>
      </div>

      {output && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 max-h-64 overflow-auto"><pre className="text-xs font-mono text-[#0B1F3A] whitespace-pre-wrap">{output}</pre></div>
          <div className="flex gap-3">
            <button onClick={copy} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy XML'}</button>
            <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150"><Download className="h-4 w-4" />Download sitemap.xml</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function XmlSitemapGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="XML Sitemap Generator" description="Paste a list of URLs and get a valid sitemap.xml file, ready to submit to search engines." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'XML Sitemap Generator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><XmlSitemapGenerator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="XML Sitemap Questions" items={[
        { q: 'What is an XML sitemap?', a: 'A file listing your site\'s URLs so search engines can discover and crawl them efficiently — submit it via Google Search Console.' },
      ]} />
      <ToolCta headline="Need SEO built into your website from day one?" body="Aadhirai Innovations builds custom websites and web applications with SEO done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
