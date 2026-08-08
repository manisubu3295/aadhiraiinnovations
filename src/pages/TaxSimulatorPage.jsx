import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, TrendingUp, Home, CalendarClock } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import IncomeTaxTab from '../components/tools/tax-simulator/IncomeTaxTab'
import CapitalGainsTab from '../components/tools/tax-simulator/CapitalGainsTab'
import HraExemptionTab from '../components/tools/tax-simulator/HraExemptionTab'
import AdvanceTaxTab from '../components/tools/tax-simulator/AdvanceTaxTab'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'India Tax Simulator',
      'description': 'Free comprehensive India tax simulator — compare old vs new income tax regime, calculate capital gains tax, HRA exemption, and advance tax installments.',
      'url': 'https://www.aadhiraiinnovations.com/tools/tax-simulator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Which tax regime should I choose — old or new?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'It depends on how many deductions and exemptions you claim. If you have large 80C, 80D, HRA, or home loan interest deductions, the old regime may work out cheaper. If you claim few deductions, the new regime\'s lower slab rates and higher rebate threshold usually win. Use the Income Tax tab to compare both with your actual numbers.' },
        },
        {
          '@type': 'Question',
          'name': 'Are these tax rates always current?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'This simulator uses standard reference rates for FY 2025-26 (AY 2026-27) as announced in Budget 2025 and the July 2024 capital gains changes. Rates, slabs, and thresholds change with each year\'s Finance Act — always verify current figures on the Income Tax e-filing portal or with a CA before filing.' },
        },
        {
          '@type': 'Question',
          'name': 'How is capital gains tax calculated in India?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Gains are classified as short-term or long-term based on holding period — 12 months for listed equity/equity mutual funds, 24 months for property, gold, and other assets. Equity: 20% short-term, 12.5% long-term (over a ₹1.25 lakh yearly exemption). Other assets: taxed at your slab rate if short-term, 12.5% flat if long-term (no indexation).' },
        },
        {
          '@type': 'Question',
          'name': 'What is the HRA exemption formula?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'HRA exemption is the least of: actual HRA received, rent paid minus 10% of Basic+DA, or 50% of Basic+DA (metro cities) / 40% (non-metro). It is only available under the old tax regime.' },
        },
        {
          '@type': 'Question',
          'name': 'Who needs to pay advance tax?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Anyone whose net tax liability (after TDS) for the year exceeds ₹10,000 must pay advance tax in four installments — 15% by June 15, 45% cumulative by September 15, 75% cumulative by December 15, and 100% by March 15. Senior citizens without business income are exempt.' },
        },
      ],
    }
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.aadhiraiinnovations.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.aadhiraiinnovations.com/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'India Tax Simulator', 'item': 'https://www.aadhiraiinnovations.com/tools/tax-simulator' },
      ],
    }
    const scripts = [['webapplication', webAppSchema], ['faqpage', faqSchema], ['breadcrumb', breadcrumbSchema]].map(([name, schema]) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-schema', name)
      el.text = JSON.stringify(schema)
      document.head.appendChild(el)
      return el
    })
    return () => scripts.forEach((el) => el.remove())
  }, [])
}

const TABS = [
  { key: 'income', label: 'Income Tax', icon: Landmark, Component: IncomeTaxTab },
  { key: 'capital-gains', label: 'Capital Gains', icon: TrendingUp, Component: CapitalGainsTab },
  { key: 'hra', label: 'HRA Exemption', icon: Home, Component: HraExemptionTab },
  { key: 'advance-tax', label: 'Advance Tax', icon: CalendarClock, Component: AdvanceTaxTab },
]

export default function TaxSimulatorPage() {
  usePageSchema()
  const [activeTab, setActiveTab] = useState('income')
  const ActiveComponent = TABS.find((t) => t.key === activeTab).Component

  return (
    <>
      <ToolPageHero
        title="India Tax Simulator"
        description="Compare old vs new income tax regime, calculate capital gains tax, HRA exemption, and your advance tax installment schedule — all in one place."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'India Tax Simulator' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <ActiveComponent />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding Indian Income Tax</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Old regime vs new regime — what's the difference?
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                India currently runs two parallel income tax systems. The <strong>new regime</strong> (the default since FY 2023-24) offers lower slab rates and a higher tax-free threshold, but disallows most deductions and exemptions — no 80C, 80D, HRA, or home loan interest. The <strong>old regime</strong> keeps higher slab rates but lets you reduce your taxable income with every deduction you can substantiate.
              </p>
              <p>
                There's no universal answer — a salaried employee with a home loan, HRA, and a full ₹1.5 lakh 80C investment often does better under the old regime, while someone with few deductions usually pays less under the new one. The Income Tax tab above runs both calculations side by side on your actual numbers.
              </p>
            </div>

            <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0B1F3A] text-white">
                    <th className="px-5 py-3 text-left font-semibold">New Regime Slab</th>
                    <th className="px-5 py-3 text-left font-semibold">Rate</th>
                    <th className="px-5 py-3 text-left font-semibold">Old Regime Slab</th>
                    <th className="px-5 py-3 text-left font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    ['₹0 – 4,00,000', '0%', '₹0 – 2,50,000', '0%'],
                    ['₹4,00,000 – 8,00,000', '5%', '₹2,50,000 – 5,00,000', '5%'],
                    ['₹8,00,000 – 12,00,000', '10%', '₹5,00,000 – 10,00,000', '20%'],
                    ['₹12,00,000 – 16,00,000', '15%', 'Above ₹10,00,000', '30%'],
                    ['₹16,00,000 – 20,00,000', '20%', '—', '—'],
                    ['₹20,00,000 – 24,00,000', '25%', '—', '—'],
                    ['Above ₹24,00,000', '30%', '—', '—'],
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {row.map((cell, i) => <td key={i} className="px-5 py-3 text-slate-600">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Tax Simulator Questions"
        items={[
          { q: 'Which tax regime should I choose — old or new?', a: 'It depends on your deductions. Large 80C, 80D, HRA, or home loan interest claims often favor the old regime; fewer deductions usually favor the new one. Compare both with your real numbers using the Income Tax tab.' },
          { q: 'Are these tax rates always current?', a: 'These reflect standard FY 2025-26 reference rates. Rates change every Finance Act — verify current figures on the Income Tax e-filing portal or with a CA before filing.' },
          { q: 'How is capital gains tax calculated?', a: 'Equity: 20% short-term (under 12 months), 12.5% long-term over a ₹1.25L yearly exemption. Other assets: your slab rate if short-term (under 24 months), 12.5% flat if long-term, without indexation.' },
          { q: 'What is the HRA exemption formula?', a: 'The least of: actual HRA received, rent paid minus 10% of Basic+DA, or 50%/40% of Basic+DA for metro/non-metro cities. Old regime only.' },
          { q: 'Who needs to pay advance tax?', a: 'Anyone with net tax liability above ₹10,000 for the year, payable in four installments by June 15, September 15, December 15, and March 15.' },
          { q: 'Does this simulator file my return?', a: 'No — this only estimates your tax position. Returns are filed separately through the Income Tax e-filing portal.' },
        ]}
      />

      <ToolCta
        headline="Need tax and compliance logic built into your business software?"
        body="Aadhirai Innovations builds custom business software with GST, TDS, and compliance logic built in — from pharmacy billing to full ERP, HR, and transport management systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
