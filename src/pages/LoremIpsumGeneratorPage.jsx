import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Lorem Ipsum Generator',
      'description': 'Free online Lorem Ipsum placeholder text generator. Generate paragraphs, sentences, or words of classic dummy text.',
      'url': 'https://www.aadhiraiinnovations.com/tools/lorem-ipsum-generator',
      'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What is Lorem Ipsum?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Classic placeholder text derived from a Latin text by Cicero, used by designers and developers to fill layouts before real content is ready.' } },
        { '@type': 'Question', 'name': 'Can I generate a specific number of paragraphs?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, choose paragraphs, sentences, or words, and set how many you need.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function generateSentence(minWords = 6, maxWords = 14) {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords))
  const words = Array.from({ length: count }, randomWord)
  const sentence = words.join(' ')
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

function generateParagraph(sentences = 5) {
  return Array.from({ length: sentences }, () => generateSentence()).join(' ')
}

const UNITS = [
  { key: 'paragraphs', label: 'Paragraphs' },
  { key: 'sentences', label: 'Sentences' },
  { key: 'words', label: 'Words' },
]

function LoremIpsumTool() {
  const [unit, setUnit] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [seed, setSeed] = useState(0)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const output = useMemo(() => {
    if (unit === 'words') return Array.from({ length: count }, randomWord).join(' ')
    if (unit === 'sentences') return Array.from({ length: count }, () => generateSentence()).join(' ')
    return Array.from({ length: count }, () => generateParagraph()).join('\n\n')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed intentionally forces regeneration
  }, [unit, count, seed])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Unit</label>
          <div className="flex flex-wrap gap-2">
            {UNITS.map((u) => (
              <button key={u.key} type="button" onClick={() => setUnit(u.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${unit === u.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'}`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-28">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Count</label>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
        <button onClick={() => setSeed((s) => s + 1)} className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#173762] transition-colors">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </button>
      </div>

      <motion.div key={seed} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        className="rounded-xl border border-slate-200 bg-slate-50 p-5 max-h-80 overflow-y-auto text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {output}
      </motion.div>

      <button onClick={copy} className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
        <Copy className="h-4 w-4" />
        {copyFeedback ? 'Copied!' : 'Copy Text'}
      </button>
    </div>
  )
}

export default function LoremIpsumGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero
        title="Lorem Ipsum Generator"
        description="Generate paragraphs, sentences, or words of classic Lorem Ipsum placeholder text."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Lorem Ipsum Generator' }]}
        badge="Free Tool"
      />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <LoremIpsumTool />
            </div>
          </motion.div>
        </Container>
      </section>
      <ToolFaqSection
        title="Lorem Ipsum Questions"
        items={[
          { q: 'What is Lorem Ipsum?', a: 'Classic Latin-derived placeholder text used to fill layouts before real content is ready.' },
          { q: 'Can I generate a specific amount?', a: 'Yes, choose paragraphs, sentences, or words, and set the count.' },
        ]}
      />
      <ToolCta
        headline="Need real content and copywriting for your site?"
        body="Aadhirai Innovations builds complete websites and content systems — not just placeholder pages."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
