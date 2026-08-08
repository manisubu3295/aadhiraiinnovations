import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Tip / Split Bill Calculator', 'description': 'Free tip and bill-splitting calculator. Calculate the tip amount and split a bill evenly among any number of people.', 'url': 'https://www.aadhiraiinnovations.com/tools/tip-calculator', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the tip and per-person split calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Tip Amount = Bill × Tip%. Total = Bill + Tip. Per Person = Total ÷ Number of People.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPercent, setTipPercent] = useState(10)
  const [people, setPeople] = useState(1)

  const hasInputs = bill !== '' && Number(bill) > 0
  const result = hasInputs ? (() => {
    const B = Number(bill), tip = B * (tipPercent / 100)
    const total = B + tip
    return { tip, total, perPerson: total / Math.max(1, Number(people)) }
  })() : null

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bill Amount (₹)</label>
        <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="e.g. 1200" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Tip Percentage: {tipPercent}%</label>
        <input type="range" min="0" max="30" value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full accent-[#0B1F3A]" />
        <div className="flex gap-2 mt-3">
          {[5, 10, 15, 20].map((p) => (<button key={p} onClick={() => setTipPercent(p)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${tipPercent === p ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{p}%</button>))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of People</label>
        <div className="flex items-center gap-3">
          <button onClick={() => setPeople((p) => Math.max(1, p - 1))} className="h-9 w-9 rounded-full bg-slate-100 text-[#0B1F3A] font-bold hover:bg-slate-150">−</button>
          <span className="w-10 text-center font-semibold text-[#0B1F3A]">{people}</span>
          <button onClick={() => setPeople((p) => p + 1)} className="h-9 w-9 rounded-full bg-slate-100 text-[#0B1F3A] font-bold hover:bg-slate-150">+</button>
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Per Person</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.perPerson)}</span></div>
          <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Tip Amount</span><span className="font-medium text-slate-700">{formatINR(result.tip)}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Total (Bill + Tip)</span><span className="font-medium text-slate-700">{formatINR(result.total)}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter the bill amount to calculate the tip and split</p></div>)}
    </div>
  )
}

export default function TipCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Tip / Split Bill Calculator" description="Calculate the tip amount and split a bill evenly among any number of people." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Tip / Split Bill Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><TipCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Tip Calculator Questions" items={[
        { q: 'How is the tip and per-person split calculated?', a: 'Tip = Bill × Tip%. Total = Bill + Tip. Per Person = Total ÷ Number of People.' },
      ]} />
      <ToolCta headline="Need billing software for your restaurant or retail business?" body="Aadhirai Innovations builds POS and billing systems for Indian retail and food businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
