import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Inflation Impact Calculator', 'description': 'Free inflation calculator. See what an amount today will cost in the future, or what a future amount is worth in today\'s money, at a given inflation rate.', 'url': 'https://www.aadhiraiinnovations.com/tools/inflation-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is future cost due to inflation calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Future Value = Present Value × (1 + inflation rate)^years. For example, ₹1,00,000 today at 6% inflation for 10 years becomes ~₹1,79,000.' } },
      { '@type': 'Question', 'name': 'What inflation rate should I use for India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'India\'s long-term average CPI inflation has generally been in the 5-7% range, but it varies year to year — use the RBI\'s current inflation target or your own estimate for planning.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function InflationCalculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState('6')
  const [years, setYears] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = amount !== '' && rate !== '' && years !== ''
  const result = hasInputs ? (() => {
    const A = Number(amount), r = Number(rate) / 100, t = Number(years)
    const futureValue = A * Math.pow(1 + r, t)
    const todaysWorth = A / Math.pow(1 + r, t)
    return { futureValue, todaysWorth }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Amount: ${formatINR(Number(amount))}\nInflation Rate: ${rate}% p.a.\nYears: ${years}\nFuture Cost: ${formatINR(result.futureValue)}\nToday's Equivalent of that Future Amount: ${formatINR(result.todaysWorth)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setAmount(''); setRate('6'); setYears('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Amount Today (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Inflation Rate (% p.a.)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 10" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Future Cost of Today's {formatINR(Number(amount))}</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.futureValue)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">That Same {formatINR(Number(amount))} in {years} Years is Worth (today)</span><span className="font-medium text-slate-700">{formatINR(result.todaysWorth)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter an amount, inflation rate, and years to see its future cost and present-day equivalent</p></div>)}
    </div>
  )
}

export default function InflationCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Inflation Impact Calculator" description="See what an amount today will cost in the future, and what a future amount is really worth today, at a given inflation rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Inflation Impact Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><InflationCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Inflation Calculator Questions" items={[
        { q: 'How is future cost due to inflation calculated?', a: 'Future Value = Present Value × (1 + inflation rate)^years.' },
        { q: 'What inflation rate should I use for India?', a: 'India\'s long-term average has generally been 5-7% — adjust based on your own planning assumptions.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
