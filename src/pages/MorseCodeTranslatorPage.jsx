import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import morseCode, { morseToChar } from '../data/morseCode'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Morse Code Translator', 'description': 'Free Morse code translator. Convert text to Morse code and back, instantly, in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/morse-code-translator', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is Morse code separated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Letters within a word are separated by a single space, and words are separated by a forward slash ( / ), the standard convention for typed Morse code.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function textToMorse(text) {
  return text.toUpperCase().split(' ').map((word) =>
    word.split('').map((ch) => morseCode[ch] || '').filter(Boolean).join(' ')
  ).join(' / ')
}

function morseToText(morse) {
  return morse.trim().split(' / ').map((word) =>
    word.trim().split(/\s+/).map((code) => morseToChar[code] || '').join('')
  ).join(' ')
}

function MorseCodeTranslator() {
  const [text, setText] = useState('')
  const [morse, setMorse] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')

  function copy(value, key) {
    navigator.clipboard.writeText(value).then(() => { setCopyFeedback(key); setTimeout(() => setCopyFeedback(''), 2000) }).catch(() => {})
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Text</label>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setMorse('') }} rows={3} placeholder="Type text to convert to Morse code" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
      </div>
      {text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-3">
          <p className="text-sm font-mono text-[#0B1F3A] break-all">{textToMorse(text)}</p>
          <button onClick={() => copy(textToMorse(text), 'toMorse')} className="flex-none text-slate-400 hover:text-[#0B1F3A]"><Copy className="h-4 w-4" /></button>
        </motion.div>
      )}
      {copyFeedback === 'toMorse' && <p className="text-xs text-green-600">Copied!</p>}

      <div className="h-px bg-slate-100" />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Morse Code</label>
        <textarea value={morse} onChange={(e) => { setMorse(e.target.value); setText('') }} rows={3} placeholder="Type Morse code (letters space-separated, / between words) to convert to text" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm font-mono resize-none" />
      </div>
      {morse && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-start justify-between gap-3">
          <p className="text-sm text-[#0B1F3A]">{morseToText(morse)}</p>
          <button onClick={() => copy(morseToText(morse), 'toText')} className="flex-none text-slate-400 hover:text-[#0B1F3A]"><Copy className="h-4 w-4" /></button>
        </motion.div>
      )}
      {copyFeedback === 'toText' && <p className="text-xs text-green-600">Copied!</p>}
    </div>
  )
}

export default function MorseCodeTranslatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Morse Code Translator" description="Convert text to Morse code and back, instantly." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Morse Code Translator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><MorseCodeTranslator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Morse Code Questions" items={[
        { q: 'How is Morse code separated?', a: 'Letters are space-separated, and words are separated by " / ".' },
      ]} />
      <ToolCta headline="Need custom software built right?" body="Aadhirai Innovations builds enterprise software and backend systems for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
