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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Freelance Rate Calculator', 'description': 'Free freelance/consulting rate calculator. Work out the hourly or day rate you need to charge based on your income goal, expenses, and billable hours.', 'url': 'https://www.aadhiraiinnovations.com/tools/freelance-rate-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How do I calculate my freelance hourly rate?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Add your target annual take-home income to your annual business expenses, then divide by your total billable hours per year (billable hours per week × weeks worked per year). Not all working hours are billable — admin, marketing, and downtime reduce the billable total.' } },
      { '@type': 'Question', 'name': 'What counts as a "billable hour"?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Only time spent on client-chargeable work. Time spent on invoicing, proposals, and finding new clients is real work but isn\'t billable — most freelancers can bill only 20-30 hours of a 40-hour week.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function FreelanceRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState('25')
  const [weeksPerYear, setWeeksPerYear] = useState('48')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = desiredIncome !== '' && expenses !== '' && billableHoursPerWeek !== '' && weeksPerYear !== ''
  const result = hasInputs ? (() => {
    const totalNeeded = Number(desiredIncome) + Number(expenses)
    const totalHours = Number(billableHoursPerWeek) * Number(weeksPerYear)
    const hourlyRate = totalHours > 0 ? totalNeeded / totalHours : 0
    return { totalNeeded, totalHours, hourlyRate, dayRate: hourlyRate * 8 }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Desired Annual Income: ${formatINR(Number(desiredIncome))}\nAnnual Business Expenses: ${formatINR(Number(expenses))}\nBillable Hours/Year: ${result.totalHours}\nHourly Rate: ${formatINR(result.hourlyRate)}\nDay Rate (8hr): ${formatINR(result.dayRate)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setDesiredIncome(''); setExpenses(''); setBillableHoursPerWeek('25'); setWeeksPerYear('48') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Desired Annual Take-Home (₹)</label><input type="number" value={desiredIncome} onChange={(e) => setDesiredIncome(e.target.value)} placeholder="e.g. 1200000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Annual Business Expenses (₹)</label><input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="e.g. 100000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Billable Hours / Week</label><input type="number" value={billableHoursPerWeek} onChange={(e) => setBillableHoursPerWeek(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Weeks Worked / Year</label><input type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Hourly Rate to Charge</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.hourlyRate)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Day Rate (8-hour day)</span><span className="font-medium text-slate-700">{formatINR(result.dayRate)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Total Billable Hours / Year</span><span className="font-medium text-slate-700">{result.totalHours}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Fill in the fields above to find the rate you need to charge</p></div>)}
    </div>
  )
}

export default function FreelanceRateCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Freelance Rate Calculator" description="Work out the hourly or day rate you need to charge, based on your income goal, expenses, and billable hours." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Freelance Rate Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><FreelanceRateCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Freelance Rate Questions" items={[
        { q: 'How do I calculate my freelance hourly rate?', a: '(Desired income + business expenses) ÷ total billable hours per year.' },
        { q: 'What counts as a billable hour?', a: 'Only client-chargeable work — most freelancers can only bill 20-30 hours of a 40-hour week.' },
      ]} />
      <ToolCta headline="Need invoicing built for how freelancers actually bill?" body="Aadhirai Innovations' Invoice/Quotation Builder makes it easy to send professional invoices in minutes." ctas={[{ label: 'Try Invoice Builder', href: '/document-builder', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
