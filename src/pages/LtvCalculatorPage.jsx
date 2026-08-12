import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Loan-to-Value (LTV) Calculator', 'description': 'Free LTV calculator. Find the loan-to-value ratio for a property loan.', 'url': 'https://www.aadhiraiinnovations.com/tools/ltv-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is a good LTV ratio?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'RBI caps LTV at 90% for loans up to ₹30 lakh, 80% for ₹30L-75L, and 75% above ₹75L. A lower LTV generally means a lower interest rate and easier approval.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function LtvCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [propertyValue, setPropertyValue] = useState('')
  const hasInputs = loanAmount !== '' && propertyValue !== '' && Number(propertyValue) > 0
  const ltv = hasInputs ? (Number(loanAmount) / Number(propertyValue)) * 100 : null
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loan Amount (₹)</label><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Value (₹)</label><input type="number" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>
      {ltv !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6"><div className="flex justify-between items-center bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Loan-to-Value Ratio</span><span className="text-lg font-bold text-[#0B1F3A]">{ltv.toFixed(1)}%</span></div></motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter loan amount and property value to calculate LTV</p></div>)}
    </div>
  )
}

export default function LtvCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Loan-to-Value (LTV) Calculator" description="Find the loan-to-value ratio for a property loan." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'LTV Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><LtvCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="LTV Questions" items={[{ q: 'What is a good LTV ratio?', a: 'RBI caps LTV at 90% (loans ≤₹30L), 80% (₹30L-75L), 75% (>₹75L). Lower LTV often means better rates.' }]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
