import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Price Per Sq.Ft Calculator', 'description': 'Free price per square foot calculator. Find rate from total price and area, or total price from rate and area.', 'url': 'https://www.aadhiraiinnovations.com/tools/price-per-sqft-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Which area should I use — carpet or built-up?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Always check which area the quoted rate is based on. A rate quoted per built-up sqft will look cheaper than the same property priced per carpet sqft — compare on the same basis when evaluating listings.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PricePerSqftCalculator() {
  const [mode, setMode] = useState('findRate')
  const [price, setPrice] = useState('')
  const [area, setArea] = useState('')
  const [rate, setRate] = useState('')

  const result = mode === 'findRate'
    ? (price !== '' && area !== '' && Number(area) > 0 ? Number(price) / Number(area) : null)
    : (rate !== '' && area !== '' ? Number(rate) * Number(area) : null)

  return (
    <div className="space-y-8">
      <div className="flex gap-3">{[{ k: 'findRate', l: 'Find Rate per Sqft' }, { k: 'findTotal', l: 'Find Total Price' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === 'findRate' ? (
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Total Price (₹)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        ) : (
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rate per Sqft (₹)</label><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        )}
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Area (sqft)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">{mode === 'findRate' ? 'Rate per Sqft' : 'Total Price'}</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result)}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter the values to calculate</p></div>)}
    </div>
  )
}

export default function PricePerSqftCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Price Per Sq.Ft Calculator" description="Find the rate per square foot from a total price, or a total price from a rate." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Price Per Sq.Ft Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PricePerSqftCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Price Per Sq.Ft Questions" items={[{ q: 'Carpet or built-up area?', a: 'Always check which area the rate is based on — compare listings on the same basis.' }]} />
      <ToolCta headline="Need custom software for your real estate business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
