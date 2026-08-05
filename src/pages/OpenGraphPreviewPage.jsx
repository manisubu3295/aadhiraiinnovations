import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2 } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Open Graph Preview Tool',
      'description': 'Free online Open Graph preview tool. See how your page will look when shared on Facebook, LinkedIn, or Twitter/X before you publish.',
      'url': 'https://www.aadhiraiinnovations.com/tools/open-graph-preview',
      'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Does this pull data from a live URL?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — enter the title, description, image, and URL manually to preview how they\'d render. It doesn\'t fetch or scrape any live page.' } },
        { '@type': 'Question', 'name': 'Why do different platforms show different previews?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Each platform (Facebook, LinkedIn, Twitter/X) caches and crops your Open Graph image and title slightly differently — this preview is an approximation, not pixel-perfect.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function domainFrom(url) {
  try {
    return new URL(url).hostname.toUpperCase()
  } catch {
    return url ? url.toUpperCase() : 'EXAMPLE.COM'
  }
}

function OpenGraphPreviewTool() {
  const [fields, setFields] = useState({ title: '', description: '', image: '', url: '' })
  const update = (key, value) => setFields((prev) => ({ ...prev, [key]: value }))

  const title = fields.title || 'Your Page Title Goes Here'
  const description = fields.description || 'Your meta description will appear here, usually truncated to one or two lines depending on the platform.'
  const domain = domainFrom(fields.url)

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Title</label>
          <input type="text" value={fields.title} onChange={(e) => update('title', e.target.value)} placeholder="Page title"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
          <textarea value={fields.description} onChange={(e) => update('description', e.target.value)} rows={2} placeholder="Page description"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Image URL</label>
            <input type="text" value={fields.image} onChange={(e) => update('image', e.target.value)} placeholder="https://example.com/image.png"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page URL</label>
            <input type="text" value={fields.url} onChange={(e) => update('url', e.target.value)} placeholder="https://example.com/page"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Preview (Facebook / LinkedIn style)</label>
        <div className="max-w-md rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center overflow-hidden">
            {fields.image ? (
              <img src={fields.image} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            ) : (
              <Globe2 className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
            )}
          </div>
          <div className="p-3 border-t border-slate-200">
            <div className="text-[11px] uppercase text-slate-400">{domain}</div>
            <div className="text-sm font-semibold text-[#0B1F3A] mt-1 line-clamp-1">{title}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</div>
          </div>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 pt-3">Preview (Twitter/X style)</label>
        <div className="max-w-md rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center overflow-hidden">
            {fields.image ? (
              <img src={fields.image} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            ) : (
              <Globe2 className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
            )}
          </div>
          <div className="p-3 border-t border-slate-200">
            <div className="text-sm font-semibold text-[#0B1F3A] line-clamp-1">{title}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</div>
            <div className="text-[11px] text-slate-400 mt-1">{domain}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function OpenGraphPreviewPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Open Graph Preview Tool"
        description="See how your page will look when shared on Facebook, LinkedIn, or Twitter/X before you publish."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Open Graph Preview' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <OpenGraphPreviewTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Open Graph Preview Questions"
        items={[
          { q: 'Does this pull data from a live URL?', a: 'No — enter details manually. It doesn\'t fetch or scrape any live page.' },
          { q: 'Why do platforms show different previews?', a: 'Each platform crops and caches images/titles slightly differently — this is an approximation, not pixel-perfect.' },
          { q: 'Need to generate the actual meta tags?', a: 'Use the Meta Tag Generator to get the copyable HTML for these values.' },
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
