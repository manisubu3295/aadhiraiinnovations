import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
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
      'name': 'Word & Character Counter',
      'description': 'Free online word and character counter. Get live word count, character count, sentence count, and estimated reading time.',
      'url': 'https://www.aadhiraiinnovations.com/tools/word-counter',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is reading time estimated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Based on an average adult reading speed of 200 words per minute.' } },
        { '@type': 'Question', 'name': 'Is my text sent anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, counting happens entirely in your browser using JavaScript.' } },
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

function countStats(text) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0) : 0
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0
  const readingTimeMin = words > 0 ? Math.max(1, Math.round(words / 200)) : 0
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMin }
}

/* ─── Tool ───────────────────────────────────────────────────────────────── */
function WordCounterTool() {
  const [text, setText] = useState('')
  const stats = countStats(text)

  const statItems = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading Time', value: `${stats.readingTimeMin} min` },
  ]

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Type or paste your text here..."
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <div className="text-lg font-bold text-[#0B1F3A]">{item.value}</div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setText('')}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors w-full"
      >
        <RotateCcw className="h-4 w-4" />
        Clear
      </button>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function WordCounterPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Word & Character Counter"
        description="Live word count, character count, sentence count, and estimated reading time as you type."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Word & Character Counter' }]}
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
              <WordCounterTool />
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Word Counter Questions"
        items={[
          { q: 'How is reading time estimated?', a: 'Based on an average adult reading speed of 200 words per minute.' },
          { q: 'Is my text sent anywhere?', a: 'No, counting happens entirely in your browser.' },
          { q: 'How is sentence count calculated?', a: 'By counting sequences ending in ".", "!", or "?" — informal writing without punctuation may undercount.' },
        ]}
      />

      <ToolCta
        headline="Need document automation for your business?"
        body="Aadhirai Innovations builds custom software for content generation, document processing, and business automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
