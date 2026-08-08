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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Gratuity Calculator', 'description': 'Free gratuity calculator for India under the Payment of Gratuity Act, 1972. Estimate gratuity payable from last drawn salary and years of service.', 'url': 'https://www.aadhiraiinnovations.com/tools/gratuity-calculator', 'applicationCategory': 'FinanceApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is gratuity calculated in India?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'For employees covered under the Payment of Gratuity Act: Gratuity = (15 × Last Drawn Salary × Years of Service) / 26, where salary means Basic + DA and 26 is the number of working days in a month.' } },
      { '@type': 'Question', 'name': 'What is the minimum service period for gratuity?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Generally 5 years of continuous service, except in cases of death or disablement where the 5-year rule does not apply.' } },
      { '@type': 'Question', 'name': 'Is gratuity taxable?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Gratuity received by government employees is fully exempt. For others, it\'s exempt up to ₹20 lakh (lower of the actual amount, the formula amount, or ₹20L) under Section 10(10).' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function GratuityCalculator() {
  const [salary, setSalary] = useState('')
  const [yearsOfService, setYearsOfService] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = salary !== '' && yearsOfService !== ''
  const result = hasInputs ? (() => {
    const S = Number(salary), Y = Math.round(Number(yearsOfService))
    const gratuity = (15 * S * Y) / 26
    return { gratuity, cappedGratuity: Math.min(gratuity, 2000000) }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Last Drawn Salary (Basic+DA): ${formatINR(Number(salary))}\nYears of Service: ${yearsOfService}\nGratuity Payable: ${formatINR(result.gratuity)}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (err) { console.error(err) }
  }
  const reset = () => { setSalary(''); setYearsOfService('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Last Drawn Salary — Basic + DA (₹/month)</label><input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. 50000" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Years of Service</label><input type="number" value={yearsOfService} onChange={(e) => setYearsOfService(e.target.value)} placeholder="e.g. 8" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Gratuity Payable</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.gratuity)}</span></div>
            <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Tax-Exempt Cap</span><span className="font-medium text-slate-700">{formatINR(2000000)}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter last drawn salary and years of service to calculate gratuity</p></div>)}

      <p className="text-xs text-slate-400">Standard formula under the Payment of Gratuity Act, 1972, for employees covered by the Act. Years of service are rounded to the nearest full year. Verify eligibility (typically 5+ years) with your employer.</p>
    </div>
  )
}

export default function GratuityCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Gratuity Calculator" description="Estimate gratuity payable under the Payment of Gratuity Act, from last drawn salary and years of service." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Gratuity Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><GratuityCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Gratuity Calculator Questions" items={[
        { q: 'How is gratuity calculated in India?', a: 'Gratuity = (15 × Last Drawn Salary × Years of Service) / 26, where salary means Basic + DA.' },
        { q: 'What is the minimum service period for gratuity?', a: 'Generally 5 years of continuous service, except in cases of death or disablement.' },
        { q: 'Is gratuity taxable?', a: 'Exempt up to ₹20 lakh under Section 10(10) for non-government employees; fully exempt for government employees.' },
      ]} />
      <ToolCta headline="Need payroll and compliance built into your business software?" body="Aadhirai Innovations builds custom HR and payroll systems for growing Indian businesses." ctas={[{ label: 'Explore HR & Inventory', href: '/products/hr-inventory', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
