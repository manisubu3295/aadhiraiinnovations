import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

// A single shared offscreen canvas for text measurement — module-level rather than a ref,
// since it holds no component state and creating it isn't a render side effect.
let measureCanvas = null
function measureTextWidth(text, font) {
  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  ctx.font = font
  return ctx.measureText(text).width
}

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Title Tag Pixel-Width Checker', 'description': 'Free title tag checker. See the pixel width of your page title as Google renders it, and whether it will get truncated in search results.', 'url': 'https://www.aadhiraiinnovations.com/tools/title-tag-checker', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Why does Google measure titles in pixels, not characters?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Google truncates titles based on the rendered pixel width of the search results container (roughly 600px on desktop), not a fixed character count — since "iiiii" takes far less space than "WWWWW". This tool estimates that width directly.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const MAX_PX = 600

function TitleTagChecker() {
  const [title, setTitle] = useState('')
  const width = measureTextWidth(title, '20px arial')

  const overLimit = width > MAX_PX

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your page's <title> tag content" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        <p className="mt-1.5 text-[11px] text-slate-400">{title.length} characters · {width.toFixed(0)}px {overLimit && '(likely to be truncated)'}</p>
      </div>

      {title && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-200 p-5">
          <p className="text-[13px] text-[#1a0dab] leading-snug mb-1" style={{ maxWidth: MAX_PX, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'arial' }}>{title}</p>
          <p className="text-xs text-[#006621]">www.example.com</p>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${overLimit ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (width / MAX_PX) * 100)}%` }} /></div>
        </motion.div>
      )}
    </div>
  )
}

export default function TitleTagCheckerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Title Tag Pixel-Width Checker" description="See the pixel width of your page title as Google renders it, and whether it will get truncated in search results." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Title Tag Checker' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><TitleTagChecker /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Title Tag Checker Questions" items={[
        { q: 'Why pixels, not characters?', a: 'Google truncates based on rendered pixel width (~600px on desktop), not a fixed character count, since letter widths vary.' },
      ]} />
      <ToolCta headline="Need SEO built into your website from day one?" body="Aadhirai Innovations builds custom websites and web applications with SEO done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
