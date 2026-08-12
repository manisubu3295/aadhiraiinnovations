import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { formatINR } from '../utils/currency'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Rent vs Buy Calculator', 'description': 'Free rent vs buy calculator. Compare the total cost of renting against buying a property over a chosen number of years.', 'url': 'https://www.aadhiraiinnovations.com/tools/rent-vs-buy-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is the rent vs buy comparison calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Buying: down payment + EMIs paid + maintenance over the period, minus the equity you\'d have (appreciated property value minus any remaining loan) if you sold at the end. Renting: total rent paid over the same period, with annual escalation. Whichever net cost is lower is shown as cheaper.' } },
      { '@type': 'Question', 'name': 'What does this not account for?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'It doesn\'t factor in income tax benefits on home loan interest/principal, the opportunity cost of investing the down payment elsewhere, or transaction costs (stamp duty, brokerage) — treat this as a starting comparison, not a complete financial plan.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('')
  const [rentEscalation, setRentEscalation] = useState('5')
  const [propertyValue, setPropertyValue] = useState('')
  const [downPaymentPct, setDownPaymentPct] = useState('20')
  const [loanRate, setLoanRate] = useState('8.5')
  const [loanTenure, setLoanTenure] = useState('20')
  const [appreciation, setAppreciation] = useState('7')
  const [maintenancePct, setMaintenancePct] = useState('1')
  const [years, setYears] = useState('10')

  const hasInputs = monthlyRent !== '' && propertyValue !== ''
  const result = hasInputs ? (() => {
    const N = Number(years)
    let totalRentPaid = 0
    for (let y = 0; y < N; y++) totalRentPaid += Number(monthlyRent) * Math.pow(1 + Number(rentEscalation) / 100, y) * 12

    const downPayment = Number(propertyValue) * (Number(downPaymentPct) / 100)
    const loanAmount = Number(propertyValue) - downPayment
    const r = Number(loanRate) / 12 / 100
    const totalN = Number(loanTenure) * 12
    const emi = r > 0 ? (loanAmount * r * Math.pow(1 + r, totalN)) / (Math.pow(1 + r, totalN) - 1) : loanAmount / totalN
    const paymentsMade = Math.min(N * 12, totalN)
    const totalEmiPaid = emi * paymentsMade
    const remainingBalance = paymentsMade >= totalN ? 0 : (loanAmount * (Math.pow(1 + r, totalN) - Math.pow(1 + r, paymentsMade))) / (Math.pow(1 + r, totalN) - 1)
    const totalMaintenance = (Number(maintenancePct) / 100) * Number(propertyValue) * N
    const totalOutflowBuying = downPayment + totalEmiPaid + totalMaintenance
    const endingAssetValue = Number(propertyValue) * Math.pow(1 + Number(appreciation) / 100, N)
    const equity = endingAssetValue - remainingBalance
    const netCostBuying = totalOutflowBuying - equity

    return { totalRentPaid, netCostBuying, emi, endingAssetValue, cheaper: netCostBuying < totalRentPaid ? 'buy' : 'rent' }
  })() : null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Current Monthly Rent (₹)</label><input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Rent Escalation (%/yr)</label><input type="number" value={rentEscalation} onChange={(e) => setRentEscalation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Value (₹)</label><input type="number" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Down Payment (%)</label><input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loan Rate (% p.a.)</label><input type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Loan Tenure (years)</label><input type="number" value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Property Appreciation (%/yr)</label><input type="number" value={appreciation} onChange={(e) => setAppreciation(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Maintenance (%/yr of value)</label><input type="number" value={maintenancePct} onChange={(e) => setMaintenancePct(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Compare Over (years)</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`rounded-xl border p-5 space-y-2 ${result.cheaper === 'buy' ? 'border-[#0B1F3A] bg-[#0B1F3A]/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-sm font-semibold text-[#0B1F3A]">Buying — Net Cost</p>
              <p className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.netCostBuying)}</p>
              <p className="text-xs text-slate-500">EMI: {formatINR(result.emi)}/month · Ending value: {formatINR(result.endingAssetValue)}</p>
            </div>
            <div className={`rounded-xl border p-5 space-y-2 ${result.cheaper === 'rent' ? 'border-[#0B1F3A] bg-[#0B1F3A]/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-sm font-semibold text-[#0B1F3A]">Renting — Total Cost</p>
              <p className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.totalRentPaid)}</p>
              <p className="text-xs text-slate-500">Total rent paid over {years} years, with escalation</p>
            </div>
          </div>
          <div className="rounded-lg bg-[#0B1F3A]/5 px-4 py-3 border border-[#0B1F3A]/10 text-sm text-[#0B1F3A]">
            Based on these numbers, <strong>{result.cheaper === 'buy' ? 'buying' : 'renting'}</strong> works out cheaper over {years} years.
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Fill in the fields above to compare renting vs buying</p></div>)}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Doesn't account for tax benefits on home loan interest/principal, the opportunity cost of investing the down payment elsewhere, or transaction costs like stamp duty and brokerage. Use as a starting comparison, not a complete financial plan.</p>
      </div>
    </div>
  )
}

export default function RentVsBuyCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Rent vs Buy Calculator" description="Compare the total cost of renting against buying a property over a chosen number of years." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Rent vs Buy Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RentVsBuyCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Rent vs Buy Questions" items={[
        { q: 'How is this calculated?', a: 'Buying nets total outflow (down payment + EMIs + maintenance) against ending equity (appreciated value minus any remaining loan). Renting is total rent paid with escalation.' },
        { q: 'What does this not account for?', a: 'Tax benefits, opportunity cost of the down payment, and transaction costs like stamp duty — a starting comparison only.' },
      ]} />
      <ToolCta headline="Need financial calculations built into your software?" body="Aadhirai Innovations builds custom business software with billing, GST, and financial calculations built in." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
