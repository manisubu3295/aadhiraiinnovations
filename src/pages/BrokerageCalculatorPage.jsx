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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Real Estate Brokerage Calculator', 'description': 'Free real estate brokerage/commission calculator for a property sale or rental.', 'url': 'https://www.aadhiraiinnovations.com/tools/brokerage-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the typical real estate brokerage in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Commonly 1-2% of the sale value for resale property transactions, and around one month\'s rent for rental transactions — but rates are negotiable and vary by city and agent.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function BrokerageCalculator() {
  const [saleValue, setSaleValue] = useState('')
  const [percent, setPercent] = useState('1')
  const [split, setSplit] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = saleValue !== '' && percent !== ''
  const brokerage = hasInputs ? Number(saleValue) * (Number(percent) / 100) : null
  const copyResults = async () => { if (brokerage === null) return; try { await navigator.clipboard.writeText(`Sale Value: ${formatINR(Number(saleValue))}\nBrokerage (${percent}%): ${formatINR(brokerage)}${split ? `\nEach Party Pays: ${formatINR(brokerage / 2)}` : ''}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setSaleValue(''); setPercent('1'); setSplit(false) }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Sale/Rental Value (₹)</label><input type="number" value={saleValue} onChange={(e) => setSaleValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Brokerage (%)</label><input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} className="rounded border-slate-300" />Split between buyer and seller</label>
      {brokerage !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Brokerage</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(brokerage)}</span></div>
            {split && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Each Party Pays</span><span className="font-medium text-slate-700">{formatINR(brokerage / 2)}</span></div>}
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter sale value and brokerage % to calculate commission</p></div>)}
    </div>
  )
}

export default function BrokerageCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Real Estate Brokerage Calculator" description="Calculate agent commission on a property sale or rental value." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Brokerage Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BrokerageCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Brokerage Questions" items={[{ q: 'What is typical brokerage in India?', a: '1-2% of sale value for resale, or ~1 month\'s rent for rentals — negotiable and city-dependent.' }]} />
      <ToolCta headline="Need custom software for your real estate business?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
