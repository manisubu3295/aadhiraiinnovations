import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Down Payment Calculator', 'description': 'Free down payment calculator. Find the down payment and loan amount split for a property purchase.', 'url': 'https://www.aadhiraiinnovations.com/tools/down-payment-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is the minimum down payment for a home loan in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'RBI guidelines require lenders to fund at most 75-90% of property value (Loan-to-Value ratio) depending on the loan amount slab — so a minimum 10-25% down payment is typical, though many buyers pay more.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function DownPaymentCalculator() {
  const [value, setValue] = useState('')
  const [percent, setPercent] = useState(20)
  const hasInputs = value !== '' && Number(value) > 0
  const downPayment = hasInputs ? Number(value) * (percent / 100) : null
  const loanAmount = hasInputs ? Number(value) - downPayment : null
  return (
    <div className="space-y-8">
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Value (₹)</label><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Down Payment: {percent}%</label><input type="range" min="10" max="100" value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full accent-[#0B1F3A]" /></div>
      {downPayment !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Down Payment</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(downPayment)}</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Loan Amount Needed</span><span className="font-medium text-slate-700">{formatINR(loanAmount)}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter property value to calculate down payment</p></div>)}
    </div>
  )
}

export default function DownPaymentCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Down Payment Calculator" description="Find the down payment and loan amount split for a property purchase." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Down Payment Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><DownPaymentCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Down Payment Questions" items={[{ q: 'What is the minimum down payment in India?', a: 'RBI LTV rules mean lenders fund 75-90% of value depending on loan slab, so 10-25% minimum down payment is typical.' }]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
