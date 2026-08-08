import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Rule of 72 Calculator', 'description': 'Free Rule of 72 calculator. Quickly estimate how many years it takes to double an investment at a given rate of return, or the rate needed to double it in a given time.', 'url': 'https://www.aadhiraiinnovations.com/tools/rule-of-72-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the Rule of 72?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A quick mental-math shortcut to estimate how long an investment takes to double: Years to Double ≈ 72 ÷ Annual Return Rate (%). It\'s an approximation, most accurate for rates between roughly 6% and 10%.' } },
      { '@type': 'Question', 'name': 'How accurate is the Rule of 72?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It\'s an approximation of the exact compound-interest doubling time. For very high or very low rates, the actual doubling time (from ln(2)/ln(1+r)) diverges slightly — use a full compound interest calculator for precision.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RuleOf72Calculator() {
  const [mode, setMode] = useState('rate') // 'rate' = have rate, find years | 'years' = have years, find rate
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('')

  const exactYears = rate !== '' ? Math.log(2) / Math.log(1 + Number(rate) / 100) : null

  return (
    <div className="space-y-8">
      <div className="flex gap-3">
        {[{ k: 'rate', l: 'I know the rate' }, { k: 'years', l: 'I know the years' }].map((m) => (
          <button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'}`}>{m.l}</button>
        ))}
      </div>

      {mode === 'rate' ? (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual Return Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 8" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years to Double</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 9" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
        </div>
      )}

      {mode === 'rate' && rate !== '' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Years to Double (Rule of 72)</span><span className="text-lg font-bold text-[#0B1F3A]">{(72 / Number(rate)).toFixed(1)} years</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Exact (compound-interest) doubling time</span><span className="font-medium text-slate-700">{exactYears.toFixed(1)} years</span></div>
        </motion.div>
      )}
      {mode === 'years' && years !== '' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex justify-between items-center pb-3 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Rate Needed to Double in {years} Years</span><span className="text-lg font-bold text-[#0B1F3A]">{(72 / Number(years)).toFixed(2)}%</span></div>
        </motion.div>
      )}

      {!((mode === 'rate' && rate !== '') || (mode === 'years' && years !== '')) && (
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter a rate or a target number of years</p></div>
      )}
    </div>
  )
}

export default function RuleOf72CalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Rule of 72 Calculator" description="Quickly estimate how long an investment takes to double — or the return rate needed to double it in a given time." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Rule of 72 Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RuleOf72Calculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Rule of 72 Questions" items={[
        { q: 'What is the Rule of 72?', a: 'A shortcut: Years to Double ≈ 72 ÷ Annual Return Rate (%), most accurate for rates between 6% and 10%.' },
        { q: 'How accurate is the Rule of 72?', a: 'It\'s an approximation — the exact doubling time is ln(2)/ln(1+r), shown alongside the estimate here.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
