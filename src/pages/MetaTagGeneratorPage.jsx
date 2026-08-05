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
      'name': 'Meta Tag Generator',
      'description': 'Free online SEO meta tag generator. Generate title, description, canonical, Open Graph, and Twitter Card tags for any page.',
      'url': 'https://www.aadhiraiinnovations.com/tools/meta-tag-generator',
      'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What tags does this generate?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Title, meta description, meta keywords, canonical link, Open Graph tags (for Facebook/LinkedIn), and Twitter Card tags.' } },
        { '@type': 'Question', 'name': 'Where do I paste this code?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Inside the <head> section of your page\'s HTML.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;')
}

function buildMetaTags({ title, description, keywords, url, image }) {
  const lines = []
  if (title) lines.push(`<title>${title}</title>`)
  if (description) lines.push(`<meta name="description" content="${escapeAttr(description)}">`)
  if (keywords) lines.push(`<meta name="keywords" content="${escapeAttr(keywords)}">`)
  if (url) lines.push(`<link rel="canonical" href="${escapeAttr(url)}">`)
  lines.push('')
  if (title) lines.push(`<meta property="og:title" content="${escapeAttr(title)}">`)
  if (description) lines.push(`<meta property="og:description" content="${escapeAttr(description)}">`)
  if (url) lines.push(`<meta property="og:url" content="${escapeAttr(url)}">`)
  if (image) lines.push(`<meta property="og:image" content="${escapeAttr(image)}">`)
  lines.push('<meta property="og:type" content="website">')
  lines.push('')
  lines.push('<meta name="twitter:card" content="summary_large_image">')
  if (title) lines.push(`<meta name="twitter:title" content="${escapeAttr(title)}">`)
  if (description) lines.push(`<meta name="twitter:description" content="${escapeAttr(description)}">`)
  if (image) lines.push(`<meta name="twitter:image" content="${escapeAttr(image)}">`)
  return lines.join('\n')
}

function MetaTagGeneratorTool() {
  const [fields, setFields] = useState({ title: '', description: '', keywords: '', url: '', image: '' })
  const [copyFeedback, setCopyFeedback] = useState(false)

  const update = (key, value) => setFields((prev) => ({ ...prev, [key]: value }))
  const output = buildMetaTags(fields)
  const hasAny = Object.values(fields).some(Boolean)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page Title</label>
          <input type="text" value={fields.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Pharmacy Billing Software | Aadhirai Innovations"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Meta Description</label>
          <textarea value={fields.description} onChange={(e) => update('description', e.target.value)} rows={2} placeholder="A short, compelling summary of the page (150-160 characters)"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Keywords (optional)</label>
            <input type="text" value={fields.keywords} onChange={(e) => update('keywords', e.target.value)} placeholder="pharmacy software, gst billing"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page URL</label>
            <input type="text" value={fields.url} onChange={(e) => update('url', e.target.value)} placeholder="https://example.com/page"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Share Image URL (optional)</label>
          <input type="text" value={fields.image} onChange={(e) => update('image', e.target.value)} placeholder="https://example.com/share-image.png"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Generated Tags</label>
          <pre className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
          <button onClick={copy} className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
            <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy All Tags'}
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default function MetaTagGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Meta Tag Generator"
        description="Generate title, description, canonical, Open Graph, and Twitter Card tags for any page."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Meta Tag Generator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <MetaTagGeneratorTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Meta Tag Generator Questions"
        items={[
          { q: 'What tags does this generate?', a: 'Title, description, keywords, canonical, Open Graph, and Twitter Card tags.' },
          { q: 'Where do I paste this code?', a: 'Inside the <head> section of your page\'s HTML.' },
          { q: 'What image size works best for social sharing?', a: 'Most platforms prefer at least 1200×630px for Open Graph images.' },
        ]}
      />
      <ToolCta
        headline="Need SEO built into your website from day one?"
        body="Aadhirai Innovations builds custom websites and content systems with technical SEO handled correctly, not bolted on."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
