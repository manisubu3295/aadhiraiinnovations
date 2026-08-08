import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { markdownToHtml, htmlToMarkdown } from '../utils/markdownUtils'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Markdown to HTML Converter', 'description': 'Free Markdown to HTML and HTML to Markdown converter, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/markdown-html-converter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What Markdown syntax is supported?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Headings, bold, italic, inline code, code blocks, links, images, and ordered/unordered lists — the most common subset, not the full CommonMark spec.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function MarkdownHtmlConverter() {
  const [mode, setMode] = useState('mdToHtml')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const output = input.trim() ? (mode === 'mdToHtml' ? markdownToHtml(input) : htmlToMarkdown(input)) : ''
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[{ k: 'mdToHtml', l: 'Markdown → HTML' }, { k: 'htmlToMd', l: 'HTML → Markdown' }].map((m) => (<button key={m.k} onClick={() => { setMode(m.k); setInput('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'mdToHtml' ? 'Markdown Input' : 'HTML Input'}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'mdToHtml' ? 'HTML Output' : 'Markdown Output'}</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
    </div>
  )
}

export default function MarkdownHtmlConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Markdown ⇄ HTML Converter" description="Convert Markdown to HTML and HTML to Markdown, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Markdown ⇄ HTML Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><MarkdownHtmlConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Markdown/HTML Converter Questions" items={[
        { q: 'What Markdown syntax is supported?', a: 'Headings, bold, italic, inline code, code blocks, links, images, and lists — the common subset.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
