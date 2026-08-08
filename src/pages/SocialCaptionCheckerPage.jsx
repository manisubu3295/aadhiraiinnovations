import { useEffect, useState } from 'react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { motion } from 'framer-motion'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Social Caption Length Checker', 'description': 'Free social media caption length checker. Check your caption against X/Twitter, Instagram, LinkedIn, and Facebook character limits.', 'url': 'https://www.aadhiraiinnovations.com/tools/social-caption-checker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What are the character limits for each platform?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'X/Twitter: 280 characters. Instagram caption: 2,200 (only ~125 shown before "more"). LinkedIn post: 3,000 (~210 shown before "see more"). Facebook post: 63,206 (~477 shown before truncation).' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const PLATFORMS = [
  { key: 'x', label: 'X / Twitter', limit: 280, preview: 280 },
  { key: 'instagram', label: 'Instagram', limit: 2200, preview: 125 },
  { key: 'linkedin', label: 'LinkedIn', limit: 3000, preview: 210 },
  { key: 'facebook', label: 'Facebook', limit: 63206, preview: 477 },
]

function SocialCaptionChecker() {
  const [text, setText] = useState('')
  const len = text.length

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Your Caption</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Write your caption here..." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
        <p className="mt-1.5 text-[11px] text-slate-400">{len} characters</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {PLATFORMS.map((p) => {
          const overLimit = len > p.limit
          const overPreview = len > p.preview
          return (
            <div key={p.key} className="rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-center mb-2"><span className="text-sm font-semibold text-[#0B1F3A]">{p.label}</span><span className={`text-xs font-medium ${overLimit ? 'text-red-600' : 'text-slate-500'}`}>{len} / {p.limit.toLocaleString()}</span></div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${overLimit ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (len / p.limit) * 100)}%` }} /></div>
              {overPreview && !overLimit && <p className="mt-1.5 text-[11px] text-amber-600">Will be truncated to "…more" after ~{p.preview} characters</p>}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default function SocialCaptionCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Social Caption Length Checker" description="Check your caption against X/Twitter, Instagram, LinkedIn, and Facebook character limits, all at once." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Social Caption Length Checker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SocialCaptionChecker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Social Caption Checker Questions" items={[
        { q: 'What are the limits per platform?', a: 'X/Twitter: 280. Instagram: 2,200 (~125 shown). LinkedIn: 3,000 (~210 shown). Facebook: 63,206 (~477 shown).' },
      ]} />
      <ToolCta headline="Need marketing tools built into your business?" body="Aadhirai Innovations builds custom websites and web applications for growing businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
