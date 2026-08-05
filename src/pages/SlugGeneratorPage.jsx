import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Slug Generator',
      'description': 'Free online URL slug generator. Convert any text into a clean, lowercase, hyphenated URL slug instantly.',
      'url': 'https://www.aadhiraiinnovations.com/tools/slug-generator',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is a URL slug?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The readable part of a URL that identifies a page, e.g. "best-pharmacy-software-2026" in aadhiraiinnovations.com/blog/best-pharmacy-software-2026.' } },
        { '@type': 'Question', 'name': 'How are special characters handled?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Non-alphanumeric characters are removed or converted to hyphens, text is lowercased, and repeated hyphens are collapsed into one.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // strip accents (Unicode property escape, no literal combining chars in source)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function SlugGeneratorTool() {
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const slug = input ? slugify(input) : ''

  const copy = async () => {
    if (!slug) return
    try {
      await navigator.clipboard.writeText(slug)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => setInput('')

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Text</label>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Best Pharmacy Software in 2026!"
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Slug</label>
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-mono text-[#0B1F3A] break-all">{slug || '—'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={copy} disabled={!slug} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
          <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Slug'}
        </button>
        <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
          <RotateCcw className="h-4 w-4" />Reset
        </button>
      </div>
    </div>
  )
}

export default function SlugGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Slug Generator"
        description="Convert any text into a clean, lowercase, hyphenated URL slug instantly."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Slug Generator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <SlugGeneratorTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Slug Generator Questions"
        items={[
          { q: 'What is a URL slug?', a: 'The readable identifier part of a URL, e.g. "best-pharmacy-software-2026".' },
          { q: 'How are special characters handled?', a: 'Removed or converted to hyphens; text is lowercased and repeated hyphens collapsed.' },
          { q: 'Is my text sent anywhere?', a: 'No, conversion happens entirely in your browser.' },
        ]}
      />
      <ToolCta
        headline="Need SEO-optimized web pages built?"
        body="Aadhirai Innovations builds custom websites and content systems with clean URLs and technical SEO baked in."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
