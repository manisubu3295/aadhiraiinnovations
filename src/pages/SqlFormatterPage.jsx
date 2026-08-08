import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'SQL Formatter', 'description': 'Free online SQL formatter. Beautify SQL queries with keyword capitalization and clause line breaks.', 'url': 'https://www.aadhiraiinnovations.com/tools/sql-formatter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Which SQL dialect does this support?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This is a generic keyword-based formatter that works across MySQL, PostgreSQL, and SQL Server syntax — it doesn\'t validate dialect-specific functions.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const CLAUSE_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'JOIN', 'ON', 'AND', 'OR', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION']

function formatSql(sql) {
  let formatted = sql.replace(/\s+/g, ' ').trim()
  CLAUSE_KEYWORDS.forEach((kw) => {
    const re = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi')
    formatted = formatted.replace(re, `\n${kw}`)
  })
  return formatted.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
}

function SqlFormatter() {
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const output = input.trim() ? formatSql(input) : ''
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Input</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} placeholder="SELECT * FROM users WHERE id = 1" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Formatted Output</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
    </div>
  )
}

export default function SqlFormatterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="SQL Formatter" description="Beautify SQL queries with clause line breaks, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'SQL Formatter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SqlFormatter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="SQL Formatter Questions" items={[
        { q: 'Which SQL dialect does this support?', a: 'A generic keyword-based formatter that works across MySQL, PostgreSQL, and SQL Server syntax.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
