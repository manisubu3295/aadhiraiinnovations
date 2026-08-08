import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Readability Score Checker', 'description': 'Free readability score checker. Get the Flesch Reading Ease score for any text, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/readability-checker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the Flesch Reading Ease score calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Score = 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words). Higher scores (90-100) mean very easy to read; lower scores (0-30) mean very difficult, college-graduate level text.' } },
      { '@type': 'Question', 'name': 'How accurate is the syllable count?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This uses a vowel-group heuristic (counting groups of consecutive vowels per word), which is a close approximation but not a dictionary-perfect syllable count.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  const groups = w.match(/[aeiouy]+/g) || []
  let count = groups.length
  if (w.endsWith('e') && count > 1) count -= 1
  return Math.max(1, count)
}

function scoreLabel(score) {
  if (score >= 90) return 'Very Easy (5th grade)'
  if (score >= 70) return 'Easy (7th grade)'
  if (score >= 60) return 'Standard (8th-9th grade)'
  if (score >= 50) return 'Fairly Difficult (high school)'
  if (score >= 30) return 'Difficult (college level)'
  return 'Very Difficult (college graduate)'
}

function ReadabilityChecker() {
  const [text, setText] = useState('')

  const result = useMemo(() => {
    const sentences = (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0)
    const words = (text.match(/[a-zA-Z']+/g) || [])
    if (words.length === 0 || sentences === 0) return null
    const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
    const score = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)
    return { score: Math.max(0, Math.min(100, score)), words: words.length, sentences, syllables }
  }, [text])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Paste Your Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your content here to check readability..." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Flesch Reading Ease</span><span className="text-lg font-bold text-[#0B1F3A]">{result.score.toFixed(1)}</span></div>
          <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Reading Level</span><span className="font-medium text-slate-700">{scoreLabel(result.score)}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Words / Sentences / Syllables</span><span className="font-medium text-slate-700">{result.words} / {result.sentences} / {result.syllables}</span></div>
        </motion.div>
      )}
    </div>
  )
}

export default function ReadabilityCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Readability Score Checker" description="Get the Flesch Reading Ease score for any text, right in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Readability Score Checker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ReadabilityChecker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Readability Checker Questions" items={[
        { q: 'How is the score calculated?', a: 'Flesch Reading Ease = 206.835 − 1.015×(words/sentences) − 84.6×(syllables/words).' },
        { q: 'How accurate is the syllable count?', a: 'Uses a vowel-group heuristic — a close approximation, not a dictionary-perfect count.' },
      ]} />
      <ToolCta headline="Need content and SEO built into your website?" body="Aadhirai Innovations builds custom websites and web applications with content strategy in mind." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
