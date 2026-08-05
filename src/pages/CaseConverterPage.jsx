import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Case Converter',
      'description': 'Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or camelCase instantly.',
      'url': 'https://www.aadhiraiinnovations.com/tools/case-converter',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What case formats are supported?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'UPPERCASE, lowercase, Title Case, Sentence case, and camelCase.' } },
        { '@type': 'Question', 'name': 'Is my text sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, conversion happens entirely in your browser using JavaScript.' } },
      ],
    }
    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webapplication')
    wpScript.text = JSON.stringify(webAppSchema)
    document.head.appendChild(wpScript)
    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-schema', 'faqpage')
    faqScript.text = JSON.stringify(faqSchema)
    document.head.appendChild(faqScript)
    return () => { wpScript.remove(); faqScript.remove() }
  }, [])
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}
function toSentenceCase(str) {
  const lower = str.toLowerCase()
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
}
function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}

const CASES = [
  { key: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { key: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { key: 'title', label: 'Title Case', fn: toTitleCase },
  { key: 'sentence', label: 'Sentence case', fn: toSentenceCase },
  { key: 'camel', label: 'camelCase', fn: toCamelCase },
]

/* ─── Tool ───────────────────────────────────────────────────────────────── */
function CaseConverterTool() {
  const [input, setInput] = useState('')
  const [caseKey, setCaseKey] = useState('title')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const activeCase = CASES.find((c) => c.key === caseKey)
  const output = input ? activeCase.fn(input) : ''

  const copyOutput = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const reset = () => setInput('')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {CASES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCaseKey(c.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              caseKey === c.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="Type or paste text here..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{activeCase.label}</label>
        <textarea
          value={output}
          readOnly
          rows={5}
          placeholder="Result appears here..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={copyOutput}
          disabled={!output}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${
            copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'
          }`}
        >
          <Copy className="h-4 w-4" />
          {copyFeedback ? 'Copied!' : 'Copy Result'}
        </button>
        <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function CaseConverterPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Case Converter"
        description="Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or camelCase instantly."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Case Converter' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <CaseConverterTool />
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Case Converter Questions"
        items={[
          { q: 'What case formats are supported?', a: 'UPPERCASE, lowercase, Title Case, Sentence case, and camelCase.' },
          { q: 'Is my text sent anywhere?', a: 'No, conversion happens entirely in your browser.' },
          { q: 'Does Title Case handle small words like "of" and "the" specially?', a: 'No, every word is capitalized — for editorial-style title casing with exceptions, adjust the result manually.' },
        ]}
      />

      <ToolCta
        headline="Need text processing built into your systems?"
        body="Aadhirai Innovations builds custom software with document generation, data formatting, and text processing built in."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
