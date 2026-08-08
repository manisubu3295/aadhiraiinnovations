import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { yamlToJson, jsonToYaml } from '../utils/yamlUtils'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'YAML to JSON Converter', 'description': 'Free YAML to JSON and JSON to YAML converter, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/yaml-json-converter', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does this support the full YAML spec?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It covers the common subset used in config files — nested maps, simple lists, and scalar values. Anchors, multi-line strings, and flow-style YAML are not supported.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function YamlJsonConverter() {
  const [mode, setMode] = useState('yamlToJson')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  let output = ''
  try {
    if (input.trim()) output = mode === 'yamlToJson' ? JSON.stringify(yamlToJson(input), null, 2) : jsonToYaml(JSON.parse(input))
    if (error) setError('')
  } catch {
    output = ''
  }
  const hasError = input.trim() !== '' && output === ''

  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[{ k: 'yamlToJson', l: 'YAML → JSON' }, { k: 'jsonToYaml', l: 'JSON → YAML' }].map((m) => (<button key={m.k} onClick={() => { setMode(m.k); setInput('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'yamlToJson' ? 'YAML Input' : 'JSON Input'}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{mode === 'yamlToJson' ? 'JSON Output' : 'YAML Output'}</label><textarea value={output} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm font-mono resize-none" /></div>
      </div>
      {hasError && <p className="text-sm text-red-600">Could not parse the input — check the syntax.</p>}
      <button onClick={copy} disabled={!output} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Output'}</button>
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Supports the common YAML subset (nested maps, simple lists, scalars) — not anchors, multi-line strings, or flow style.</p>
      </div>
    </div>
  )
}

export default function YamlJsonConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="YAML ⇄ JSON Converter" description="Convert YAML to JSON and JSON to YAML, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'YAML ⇄ JSON Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><YamlJsonConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="YAML/JSON Converter Questions" items={[
        { q: 'Does this support the full YAML spec?', a: 'Covers the common config-file subset — nested maps, simple lists, and scalars. No anchors, multi-line strings, or flow style.' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
