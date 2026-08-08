import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'HTML Formatter / Minifier', 'description': 'Free online HTML formatter and minifier, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/html-formatter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does formatting validate my HTML?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, it re-indents based on tag nesting but doesn\'t check for invalid or unclosed tags.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

function formatHtml(html) {
  const tokens = html.replace(/>\s*</g, '><').match(/<[^>]+>|[^<]+/g) || []
  let indent = 0
  const lines = []
  tokens.forEach((token) => {
    const trimmed = token.trim()
    if (!trimmed) return
    if (/^<\/\w/.test(trimmed)) {
      indent = Math.max(0, indent - 1)
      lines.push('  '.repeat(indent) + trimmed)
    } else if (/^<\w/.test(trimmed)) {
      lines.push('  '.repeat(indent) + trimmed)
      const tagName = trimmed.match(/^<(\w+)/)?.[1]?.toLowerCase()
      if (!trimmed.endsWith('/>') && tagName && !VOID_TAGS.has(tagName)) indent++
    } else {
      lines.push('  '.repeat(indent) + trimmed)
    }
  })
  return lines.join('\n')
}

function minifyHtml(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()
}

function HtmlFormatter() {
  const [mode, setMode] = useState('format')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const output = input.trim() ? (mode === 'format' ? formatHtml(input) : minifyHtml(input)) : ''
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">{[{ k: 'format', l: 'Format' }, { k: 'minify', l: 'Minify' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Input</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Output</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
    </div>
  )
}

export default function HtmlFormatterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="HTML Formatter / Minifier" description="Format (beautify) or minify HTML, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'HTML Formatter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><HtmlFormatter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="HTML Formatter Questions" items={[
        { q: 'Does formatting validate my HTML?', a: 'No, it re-indents based on tag nesting but doesn\'t check for invalid or unclosed tags.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
