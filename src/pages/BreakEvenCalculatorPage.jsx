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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Break-Even Point Calculator', 'description': 'Free break-even point calculator. Find how many units you need to sell to cover fixed and variable costs.', 'url': 'https://www.aadhiraiinnovations.com/tools/break-even-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the break-even point calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Break-Even Units = Fixed Costs ÷ (Selling Price per Unit − Variable Cost per Unit). Break-Even Revenue = Break-Even Units × Selling Price.' } },
      { '@type': 'Question', 'name': 'What are fixed vs variable costs?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Fixed costs (rent, salaries, insurance) don\'t change with sales volume. Variable costs (raw materials, packaging) scale directly with each unit produced or sold.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('')
  const [price, setPrice] = useState('')
  const [variableCost, setVariableCost] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = fixedCosts !== '' && price !== '' && variableCost !== '' && Number(price) > Number(variableCost)
  const result = hasInputs ? (() => {
    const F = Number(fixedCosts), P = Number(price), V = Number(variableCost)
    const units = F / (P - V)
    return { units, revenue: units * P, contributionMargin: P - V }
  })() : null

  const invalidMargin = price !== '' && variableCost !== '' && Number(price) <= Number(variableCost)

  const copyResults = async () => {
    if (!result) return
    const text = `Fixed Costs: ${formatINR(Number(fixedCosts))}\nSelling Price/Unit: ${formatINR(Number(price))}\nVariable Cost/Unit: ${formatINR(Number(variableCost))}\nBreak-Even Units: ${Math.ceil(result.units)}\nBreak-Even Revenue: ${formatINR(result.revenue)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setFixedCosts(''); setPrice(''); setVariableCost('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Fixed Costs (₹/month)</label><input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} placeholder="e.g. 50000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Selling Price / Unit (₹)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 500" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Variable Cost / Unit (₹)</label><input type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} placeholder="e.g. 200" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {invalidMargin && <p className="text-xs text-red-600">Selling price must be greater than variable cost per unit — otherwise you lose money on every sale, no matter the volume.</p>}

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Break-Even Units</span><span className="text-lg font-bold text-[#0B1F3A]">{Math.ceil(result.units)} units</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Break-Even Revenue</span><span className="font-medium text-slate-700">{formatINR(result.revenue)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Contribution Margin / Unit</span><span className="font-medium text-slate-700">{formatINR(result.contributionMargin)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : !invalidMargin ? (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter fixed costs, price, and variable cost to find your break-even point</p></div>) : null}
    </div>
  )
}

export default function BreakEvenCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Break-Even Point Calculator" description="Find out how many units you need to sell — and how much revenue that takes — to cover your costs." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Break-Even Point Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BreakEvenCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Break-Even Calculator Questions" items={[
        { q: 'How is the break-even point calculated?', a: 'Break-Even Units = Fixed Costs ÷ (Price − Variable Cost per Unit).' },
        { q: 'What are fixed vs variable costs?', a: 'Fixed costs don\'t change with volume (rent, salaries). Variable costs scale per unit (materials, packaging).' },
      ]} />
      <ToolCta headline="Need business planning and reporting built into your software?" body="Aadhirai Innovations builds custom ERP and business automation systems with real-time cost and revenue reporting." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
