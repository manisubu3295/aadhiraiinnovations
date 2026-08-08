import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'JavaScript Formatter / Minifier', 'description': 'Free online JavaScript formatter and minifier, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/js-formatter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Is this a full JavaScript parser?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — it uses brace-based indentation for formatting and whitespace/comment stripping for minifying, a lighter-weight approach than a full AST-based tool like Prettier or Terser. Test minified output before using it in production.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function formatJs(code) {
  let indent = 0
  const lines = code.split('\n')
  const out = []
  lines.forEach((rawLine) => {
    let line = rawLine.trim()
    if (!line) return
    const closingFirst = /^[}\])]/.test(line)
    if (closingFirst) indent = Math.max(0, indent - 1)
    out.push('  '.repeat(indent) + line)
    const opens = (line.match(/[{[(]/g) || []).length
    const closes = (line.match(/[}\])]/g) || []).length
    indent = Math.max(0, indent + opens - closes - (closingFirst ? 0 : 0))
  })
  return out.join('\n')
}

function minifyJs(code) {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function JsFormatter() {
  const [mode, setMode] = useState('format')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const output = input.trim() ? (mode === 'format' ? formatJs(input) : minifyJs(input)) : ''
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">{[{ k: 'format', l: 'Format' }, { k: 'minify', l: 'Minify' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Input</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Output</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Uses lightweight brace-based formatting and regex minification, not a full JS parser — verify minified output before using it in production, especially with template literals or regex containing braces.</p>
      </div>
    </div>
  )
}

export default function JsFormatterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="JavaScript Formatter / Minifier" description="Format (beautify) or minify JavaScript, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'JS Formatter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><JsFormatter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="JS Formatter Questions" items={[
        { q: 'Is this a full JavaScript parser?', a: 'No — lightweight brace-based formatting/minification, not AST-based like Prettier or Terser.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
