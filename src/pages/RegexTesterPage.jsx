import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Regex Tester',
      'description': 'Free online regular expression tester. Test a regex pattern against sample text, see matches highlighted, and inspect capture groups.',
      'url': 'https://www.aadhiraiinnovations.com/tools/regex-tester',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What regex flavor does this use?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'JavaScript\'s native RegExp engine — the same regex your browser or a Node.js app would use.' } },
        { '@type': 'Question', 'name': 'Is my text sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, matching happens entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RegexTesterTool() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')

  let matches = []
  let error = null
  let highlighted = null

  if (pattern) {
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      matches = [...text.matchAll(re)]

      // Build highlighted preview
      if (text) {
        const parts = []
        let lastIndex = 0
        for (const m of matches) {
          if (m.index > lastIndex) parts.push({ text: text.slice(lastIndex, m.index), match: false })
          parts.push({ text: m[0], match: true })
          lastIndex = m.index + m[0].length
          if (m[0].length === 0) break // avoid infinite loop on zero-length matches
        }
        if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), match: false })
        highlighted = parts
      }
    } catch (err) {
      error = err.message
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pattern</label>
          <div className="flex items-center rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-[#0B1F3A]/20 focus-within:border-[#0B1F3A]">
            <span className="pl-3 text-slate-400 font-mono">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g. \d{3}-\d{4}"
              className="flex-1 px-2 py-3 outline-none text-sm font-mono" />
            <span className="text-slate-400 font-mono">/</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Flags</label>
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gi"
            className="w-24 px-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">Invalid pattern: {error}</p>}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Test String</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Paste text to test against..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono" />
      </div>

      {highlighted && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Preview ({matches.length} match{matches.length !== 1 ? 'es' : ''})</label>
          <div className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono whitespace-pre-wrap break-words">
            {highlighted.map((part, i) => part.match
              ? <mark key={i} className="bg-[#0B1F3A]/15 text-[#0B1F3A] rounded px-0.5">{part.text}</mark>
              : <span key={i}>{part.text}</span>
            )}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Match Details</label>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-600">
                <span className="text-[#0B1F3A] font-semibold">[{i}]</span> "{m[0]}" at index {m.index}
                {m.length > 1 && <span className="text-slate-400"> — groups: {m.slice(1).map((g) => `"${g ?? ''}"`).join(', ')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RegexTesterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Regex Tester"
        description="Test a regular expression against sample text, see matches highlighted, and inspect capture groups."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Regex Tester' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <RegexTesterTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Regex Tester Questions"
        items={[
          { q: 'What regex flavor does this use?', a: 'JavaScript\'s native RegExp engine.' },
          { q: 'Is my text sent anywhere?', a: 'No, matching happens entirely in your browser.' },
          { q: 'What flags are supported?', a: 'Any valid JavaScript regex flags: g, i, m, s, u, y.' },
        ]}
      />
      <ToolCta
        headline="Need custom data validation and processing?"
        body="Aadhirai Innovations builds backend systems with validation, parsing, and data transformation logic built in."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
