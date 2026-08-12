import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Property Tax Calculator', 'description': 'Free property tax estimate calculator, using the Annual Rental Value (ARV) method.', 'url': 'https://www.aadhiraiinnovations.com/tools/property-tax-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is property tax calculated in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Municipalities use different methods — Annual Rental Value (ARV), Capital Value System (CVS), or Unit Area System (UAS) — each with its own local rates and formulas. This tool gives a simplified ARV-style reference estimate; your municipal corporation\'s actual bill will differ.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PropertyTaxCalculator() {
  const [area, setArea] = useState('')
  const [ratePerSqft, setRatePerSqft] = useState('')
  const [taxPercent, setTaxPercent] = useState('20')
  const [copyFeedback, setCopyFeedback] = useState(false)
  const hasInputs = area !== '' && ratePerSqft !== '' && taxPercent !== ''
  const result = hasInputs ? (() => {
    const arv = Number(area) * Number(ratePerSqft) * 12 // annual rental value from monthly rate/sqft
    const tax = arv * (Number(taxPercent) / 100)
    return { arv, tax }
  })() : null
  const copyResults = async () => { if (!result) return; try { await navigator.clipboard.writeText(`Annual Rental Value: ${formatINR(result.arv)}\nTax Rate: ${taxPercent}%\nEstimated Annual Property Tax: ${formatINR(result.tax)}`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setArea(''); setRatePerSqft(''); setTaxPercent('20') }
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Built-up Area (sqft)</label><input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Monthly Rental Value/Sqft (₹)</label><input type="number" value={ratePerSqft} onChange={(e) => setRatePerSqft(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tax Rate (% of ARV)</label><input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Estimated Annual Property Tax</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.tax)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Annual Rental Value (ARV)</span><span className="font-medium text-slate-700">{formatINR(result.arv)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter area, rental rate, and tax rate to estimate property tax</p></div>)}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">A simplified ARV-style reference — actual property tax depends on your municipal corporation's specific method (ARV/CVS/UAS) and local rates. Check your municipal website for the exact bill.</p>
      </div>
    </div>
  )
}

export default function PropertyTaxCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Property Tax Calculator" description="Get a reference estimate of annual property tax using the Annual Rental Value (ARV) method." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Property Tax Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PropertyTaxCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Property Tax Questions" items={[{ q: 'How is property tax calculated?', a: 'Methods vary by municipality (ARV/CVS/UAS) — this gives a simplified ARV-style reference estimate only.' }]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
