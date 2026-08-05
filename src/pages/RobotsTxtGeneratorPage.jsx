import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Robots.txt Generator',
      'description': 'Free online robots.txt generator. Build a robots.txt file with allow/disallow rules and a sitemap reference.',
      'url': 'https://www.aadhiraiinnovations.com/tools/robots-txt-generator',
      'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Where does robots.txt go?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'At the root of your domain — e.g. https://example.com/robots.txt.' } },
        { '@type': 'Question', 'name': 'Does robots.txt guarantee pages won\'t be indexed?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — it asks well-behaved crawlers not to fetch certain paths, but doesn\'t remove already-indexed pages or block all crawlers. Use a noindex meta tag for that.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function buildRobotsTxt({ userAgent, disallow, allow, sitemap, crawlDelay }) {
  const lines = [`User-agent: ${userAgent || '*'}`]
  disallow.split('\n').map((l) => l.trim()).filter(Boolean).forEach((path) => lines.push(`Disallow: ${path}`))
  allow.split('\n').map((l) => l.trim()).filter(Boolean).forEach((path) => lines.push(`Allow: ${path}`))
  if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`)
  if (sitemap) { lines.push(''); lines.push(`Sitemap: ${sitemap}`) }
  return lines.join('\n')
}

function RobotsTxtTool() {
  const [userAgent, setUserAgent] = useState('*')
  const [disallow, setDisallow] = useState('/admin/\n/portal/')
  const [allow, setAllow] = useState('')
  const [sitemap, setSitemap] = useState('')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const output = buildRobotsTxt({ userAgent, disallow, allow, sitemap, crawlDelay })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">User-agent</label>
          <input type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="*"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Crawl-delay (optional, seconds)</label>
          <input type="number" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="e.g. 10"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Disallow (one path per line)</label>
        <textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} rows={3} placeholder="/admin/&#10;/checkout/"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Allow (optional, one path per line)</label>
        <textarea value={allow} onChange={(e) => setAllow(e.target.value)} rows={2} placeholder="/public/"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Sitemap URL (optional)</label>
        <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Generated robots.txt</label>
        <pre className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
        <button onClick={copy} className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
          <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy robots.txt'}
        </button>
      </div>
    </div>
  )
}

export default function RobotsTxtGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Robots.txt Generator"
        description="Build a robots.txt file with allow/disallow rules and a sitemap reference."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Robots.txt Generator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <RobotsTxtTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Robots.txt Questions"
        items={[
          { q: 'Where does robots.txt go?', a: 'At the root of your domain, e.g. https://example.com/robots.txt.' },
          { q: 'Does it guarantee pages won\'t be indexed?', a: 'No — use a noindex meta tag to prevent indexing. robots.txt only guides well-behaved crawlers.' },
          { q: 'Is my data sent anywhere?', a: 'No, the file is generated entirely in your browser.' },
        ]}
      />
      <ToolCta
        headline="Need technical SEO handled correctly?"
        body="Aadhirai Innovations builds custom websites with sitemap generation, structured data, and crawl control built in from day one."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
