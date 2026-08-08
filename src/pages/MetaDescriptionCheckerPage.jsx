import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Meta Description Length Checker', 'description': 'Free meta description checker. Check your meta description length against Google\'s ~155-160 character guideline, with a live search-result preview.', 'url': 'https://www.aadhiraiinnovations.com/tools/meta-description-checker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the ideal meta description length?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Roughly 120-155 characters for desktop search results — Google may truncate longer descriptions, though it sometimes rewrites descriptions entirely regardless of length.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function MetaDescriptionChecker() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const len = description.length
  const status = len === 0 ? null : len < 70 ? 'short' : len <= 155 ? 'good' : 'long'

  return (
    <div className="space-y-6">
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page Title (optional, for preview)</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" /></div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Meta Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm resize-none" />
        <p className={`mt-1.5 text-[11px] font-medium ${status === 'good' ? 'text-green-600' : status === 'long' ? 'text-red-600' : 'text-amber-600'}`}>{len} characters {status === 'short' && '(a bit short — you have room to say more)'}{status === 'good' && '(good length)'}{status === 'long' && '(likely to be truncated in search results)'}</p>
      </div>

      {(title || description) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 p-5">
          <p className="text-[13px] text-[#1a0dab] mb-1">{title || 'Your Page Title'}</p>
          <p className="text-xs text-[#006621] mb-1">www.example.com</p>
          <p className="text-sm text-slate-600">{description.slice(0, 155)}{description.length > 155 && '…'}</p>
        </motion.div>
      )}
    </div>
  )
}

export default function MetaDescriptionCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Meta Description Length Checker" description="Check your meta description length against Google's guideline, with a live search-result preview." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Meta Description Checker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><MetaDescriptionChecker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Meta Description Questions" items={[
        { q: 'What is the ideal length?', a: 'Roughly 120-155 characters for desktop — longer descriptions may get truncated.' },
      ]} />
      <ToolCta headline="Need SEO built into your website from day one?" body="Aadhirai Innovations builds custom websites and web applications with SEO done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
