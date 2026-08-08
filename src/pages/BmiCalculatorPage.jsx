import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'BMI Calculator', 'description': 'Free BMI (Body Mass Index) calculator. Calculate your BMI from height and weight, in metric or imperial units.', 'url': 'https://www.aadhiraiinnovations.com/tools/bmi-calculator', 'applicationCategory': 'HealthApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How is BMI calculated?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'BMI = weight (kg) ÷ height (m)². For imperial units: BMI = 703 × weight (lb) ÷ height (in)².' } },
      { '@type': 'Question', 'name': 'What are the BMI categories?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Below 18.5: Underweight. 18.5–24.9: Normal. 25–29.9: Overweight. 30 and above: Obese. BMI is a general screening tool and doesn\'t account for muscle mass, age, or body composition.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600' }
  return { label: 'Obese', color: 'text-red-600' }
}

function BmiCalculator() {
  const [unit, setUnit] = useState('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const hasInputs = height !== '' && weight !== ''
  const bmi = hasInputs ? (() => {
    const h = Number(height), w = Number(weight)
    return unit === 'metric' ? w / Math.pow(h / 100, 2) : (703 * w) / Math.pow(h, 2)
  })() : null
  const category = bmi ? bmiCategory(bmi) : null

  return (
    <div className="space-y-8">
      <div className="flex gap-3">
        {[{ k: 'metric', l: 'Metric (cm, kg)' }, { k: 'imperial', l: 'Imperial (in, lb)' }].map((u) => (
          <button key={u.k} onClick={() => { setUnit(u.k); setHeight(''); setWeight('') }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${unit === u.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'}`}>{u.l}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Height ({unit === 'metric' ? 'cm' : 'inches'})</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unit === 'metric' ? 'e.g. 170' : 'e.g. 67'} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === 'metric' ? 'e.g. 65' : 'e.g. 143'} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>

      {bmi ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Your BMI</span><span className="text-lg font-bold text-[#0B1F3A]">{bmi.toFixed(1)}</span></div>
          <div className="flex justify-between items-center text-sm pt-2"><span className="text-slate-600">Category</span><span className={`font-semibold ${category.color}`}>{category.label}</span></div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter height and weight to calculate BMI</p></div>)}

      <p className="text-xs text-slate-400">BMI is a general screening measure and doesn't account for muscle mass, bone density, age, or sex. Consult a healthcare provider for a full health assessment.</p>
    </div>
  )
}

export default function BmiCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="BMI Calculator" description="Calculate your Body Mass Index from height and weight, in metric or imperial units." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'BMI Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BmiCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="BMI Calculator Questions" items={[
        { q: 'How is BMI calculated?', a: 'BMI = weight (kg) ÷ height (m)², or 703 × weight (lb) ÷ height (in)² for imperial units.' },
        { q: 'What are the BMI categories?', a: 'Under 18.5: Underweight. 18.5–24.9: Normal. 25–29.9: Overweight. 30+: Obese.' },
      ]} />
      <ToolCta headline="Need custom business software?" body="Aadhirai Innovations builds enterprise software for pharmacy, billing, HR, and transport businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
