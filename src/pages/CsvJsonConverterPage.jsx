import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'CSV to JSON Converter', 'description': 'Free CSV to JSON and JSON to CSV converter, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/csv-json-converter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does this handle quoted CSV fields with commas?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, fields wrapped in double quotes (including escaped "" quotes and embedded commas) are parsed correctly.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function parseCsvLine(line) {
  const fields = []
  let cur = '', inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') inQuotes = false
      else cur += ch
    } else if (ch === '"') inQuotes = true
    else if (ch === ',') { fields.push(cur); cur = '' }
    else cur += ch
  }
  fields.push(cur)
  return fields
}

function csvToJson(csv) {
  const lines = csv.split('\n').filter((l) => l.trim() !== '')
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

function csvField(value) {
  const s = String(value ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function jsonToCsv(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return ''
  const headers = Object.keys(arr[0])
  const lines = [headers.map(csvField).join(',')]
  arr.forEach((row) => lines.push(headers.map((h) => csvField(row[h])).join(',')))
  return lines.join('\n')
}

function CsvJsonConverter() {
  const [mode, setMode] = useState('csvToJson')
  const [input, setInput] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  let output = '', error = ''
  try {
    if (input.trim()) output = mode === 'csvToJson' ? JSON.stringify(csvToJson(input), null, 2) : jsonToCsv(JSON.parse(input))
  } catch { error = mode === 'csvToJson' ? 'Could not parse CSV.' : 'Enter a valid JSON array of objects.' }

  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">{[{ k: 'csvToJson', l: 'CSV → JSON' }, { k: 'jsonToCsv', l: 'JSON → CSV' }].map((m) => (<button key={m.k} onClick={() => { setMode(m.k); setInput('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'csvToJson' ? 'CSV Input' : 'JSON Input (array of objects)'}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'csvToJson' ? 'JSON Output' : 'CSV Output'}</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
    </div>
  )
}

export default function CsvJsonConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="CSV ⇄ JSON Converter" description="Convert CSV to JSON and JSON to CSV, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'CSV ⇄ JSON Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><CsvJsonConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="CSV/JSON Converter Questions" items={[
        { q: 'Does this handle quoted CSV fields with commas?', a: 'Yes, including escaped "" quotes and embedded commas.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
