import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatINR } from '../../../utils/currency'
import {
  NEW_REGIME, OLD_REGIME, DEDUCTION_CAPS, CESS_RATE,
  taxFromSlabs, surchargeFor, applyRebate87A,
} from '../../../data/taxSimulatorConstants'

const AGE_GROUPS = [
  { key: 'below60', label: 'Below 60' },
  { key: 'senior', label: '60–79 (Senior Citizen)' },
  { key: 'superSenior', label: '80+ (Super Senior)' },
]

function oldRegimeSlabsFor(ageGroup) {
  if (ageGroup === 'senior') return OLD_REGIME.slabsSeniorCitizen
  if (ageGroup === 'superSenior') return OLD_REGIME.slabsSuperSeniorCitizen
  return OLD_REGIME.slabs
}

function computeRegimeTax({ taxableIncome, slabs, rebateConfig, isNewRegime }) {
  const baseTax = taxFromSlabs(taxableIncome, slabs)
  const { rebate, taxAfterRebate } = applyRebate87A(taxableIncome, baseTax, rebateConfig)
  const surcharge = surchargeFor(taxableIncome, taxAfterRebate, isNewRegime)
  const cess = (taxAfterRebate + surcharge) * (CESS_RATE / 100)
  const totalTax = taxAfterRebate + surcharge + cess
  return { baseTax, rebate, taxAfterRebate, surcharge, cess, totalTax }
}

function NumberField({ label, value, onChange, placeholder = '0', hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
      />
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

export default function IncomeTaxTab() {
  const [grossIncome, setGrossIncome] = useState('')
  const [ageGroup, setAgeGroup] = useState('below60')
  const [employerNps, setEmployerNps] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Old-regime-only deductions
  const [section80C, setSection80C] = useState('')
  const [section80DSelf, setSection80DSelf] = useState('')
  const [section80DParents, setSection80DParents] = useState('')
  const [parentsSenior, setParentsSenior] = useState(false)
  const [section80CCD1B, setSection80CCD1B] = useState('')
  const [homeLoanInterest, setHomeLoanInterest] = useState('')
  const [educationLoanInterest, setEducationLoanInterest] = useState('')
  const [donations80G, setDonations80G] = useState('')
  const [savingsInterest, setSavingsInterest] = useState('')
  const [hraExemption, setHraExemption] = useState('')

  const hasIncome = grossIncome !== '' && Number(grossIncome) > 0

  const result = useMemo(() => {
    if (!hasIncome) return null
    const gross = Number(grossIncome)
    const empNps = Number(employerNps) || 0

    // ── New regime ──
    const newTaxable = Math.max(0, gross - NEW_REGIME.standardDeduction - empNps)
    const newResult = computeRegimeTax({
      taxableIncome: newTaxable,
      slabs: NEW_REGIME.slabs,
      rebateConfig: NEW_REGIME.rebate87A,
      isNewRegime: true,
    })

    // ── Old regime ──
    const cappedC = Math.min(Number(section80C) || 0, DEDUCTION_CAPS.section80C)
    const selfD80Cap = ageGroup === 'below60' ? DEDUCTION_CAPS.section80D_self : DEDUCTION_CAPS.section80D_selfSenior
    const cappedD80Self = Math.min(Number(section80DSelf) || 0, selfD80Cap)
    const parentsD80Cap = parentsSenior ? DEDUCTION_CAPS.section80D_parentsSenior : DEDUCTION_CAPS.section80D_parents
    const cappedD80Parents = Math.min(Number(section80DParents) || 0, parentsD80Cap)
    const cappedCCD1B = Math.min(Number(section80CCD1B) || 0, DEDUCTION_CAPS.section80CCD1B)
    const cappedHomeLoan = Math.min(Number(homeLoanInterest) || 0, DEDUCTION_CAPS.section24b)
    const eduLoan = Number(educationLoanInterest) || 0 // no cap
    const donations = Number(donations80G) || 0 // no cap (simplified — actual 80G varies 50%/100%)
    const savingsCap = ageGroup === 'below60' ? DEDUCTION_CAPS.section80TTA : DEDUCTION_CAPS.section80TTB
    const cappedSavings = Math.min(Number(savingsInterest) || 0, savingsCap)
    const hra = Number(hraExemption) || 0

    const totalDeductions = cappedC + cappedD80Self + cappedD80Parents + cappedCCD1B +
      cappedHomeLoan + eduLoan + donations + cappedSavings + hra

    const oldTaxable = Math.max(0, gross - OLD_REGIME.standardDeduction - empNps - totalDeductions)
    const oldResult = computeRegimeTax({
      taxableIncome: oldTaxable,
      slabs: oldRegimeSlabsFor(ageGroup),
      rebateConfig: OLD_REGIME.rebate87A,
      isNewRegime: false,
    })

    const cheaper = newResult.totalTax <= oldResult.totalTax ? 'new' : 'old'
    const savings = Math.abs(newResult.totalTax - oldResult.totalTax)

    return { newTaxable, oldTaxable, newResult, oldResult, cheaper, savings, totalDeductions }
  }, [
    hasIncome, grossIncome, employerNps, ageGroup, section80C, section80DSelf, section80DParents,
    parentsSenior, section80CCD1B, homeLoanInterest, educationLoanInterest, donations80G,
    savingsInterest, hraExemption,
  ])

  const copyResults = async () => {
    if (!result) return
    const text = `Gross Income: ${formatINR(Number(grossIncome))}\n\nNew Regime — Taxable: ${formatINR(result.newTaxable)}, Tax Payable: ${formatINR(result.newResult.totalTax)}\nOld Regime — Taxable: ${formatINR(result.oldTaxable)}, Tax Payable: ${formatINR(result.oldResult.totalTax)}\n\nCheaper regime: ${result.cheaper === 'new' ? 'New Regime' : 'Old Regime'} (saves ${formatINR(result.savings)})`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => {
    setGrossIncome(''); setEmployerNps(''); setSection80C(''); setSection80DSelf('')
    setSection80DParents(''); setParentsSenior(false); setSection80CCD1B('')
    setHomeLoanInterest(''); setEducationLoanInterest(''); setDonations80G('')
    setSavingsInterest(''); setHraExemption('')
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Gross Annual Income (₹)" value={grossIncome} onChange={setGrossIncome} placeholder="e.g. 1200000" hint="Salary + other taxable income, before any deductions" />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Age Group</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
            {AGE_GROUPS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </div>
      </div>

      <NumberField label="Employer NPS Contribution — 80CCD(2), optional" value={employerNps} onChange={setEmployerNps} hint="Deductible under both regimes; typically capped at 14% of Basic+DA" />

      <div className="rounded-xl border border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Old Regime Deductions <span className="font-normal normal-case text-slate-400">(ignored under the new regime)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Section 80C (₹1.5L cap)" value={section80C} onChange={setSection80C} hint="ELSS, PPF, LIC, principal repayment, etc." />
          <NumberField label="Section 80CCD(1B) — NPS self (₹50k cap)" value={section80CCD1B} onChange={setSection80CCD1B} />
          <NumberField label="80D — Self/Family Health Insurance" value={section80DSelf} onChange={setSection80DSelf} hint={ageGroup === 'below60' ? 'Cap ₹25,000' : 'Cap ₹50,000 (senior)'} />
          <div>
            <NumberField label="80D — Parents' Health Insurance" value={section80DParents} onChange={setSection80DParents} hint={parentsSenior ? 'Cap ₹50,000 (senior parents)' : 'Cap ₹25,000'} />
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <input type="checkbox" checked={parentsSenior} onChange={(e) => setParentsSenior(e.target.checked)} className="rounded border-slate-300" />
              Parents are senior citizens
            </label>
          </div>
          <NumberField label="Section 24(b) — Home Loan Interest" value={homeLoanInterest} onChange={setHomeLoanInterest} hint="Self-occupied property, cap ₹2,00,000" />
          <NumberField label="Section 80E — Education Loan Interest" value={educationLoanInterest} onChange={setEducationLoanInterest} hint="No upper cap" />
          <NumberField label="Section 80G — Donations" value={donations80G} onChange={setDonations80G} hint="Simplified as 100% deductible — actual eligibility varies 50%/100%" />
          <NumberField label={ageGroup === 'below60' ? 'Section 80TTA — Savings Interest' : 'Section 80TTB — Interest Income'} value={savingsInterest} onChange={setSavingsInterest} hint={ageGroup === 'below60' ? 'Cap ₹10,000' : 'Cap ₹50,000 (senior)'} />
          <NumberField label="HRA Exemption" value={hraExemption} onChange={setHraExemption} hint="From the HRA Exemption tab, or enter manually" />
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'new', label: 'New Regime', taxable: result.newTaxable, r: result.newResult },
              { key: 'old', label: 'Old Regime', taxable: result.oldTaxable, r: result.oldResult },
            ].map(({ key, label, taxable, r }) => (
              <div key={key} className={`rounded-xl border p-5 space-y-2.5 ${result.cheaper === key ? 'border-[#0B1F3A] bg-[#0B1F3A]/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0B1F3A]">{label}</span>
                  {result.cheaper === key && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Cheaper
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-xs text-slate-500"><span>Taxable Income</span><span className="font-medium text-slate-700">{formatINR(taxable)}</span></div>
                <div className="flex justify-between text-xs text-slate-500"><span>Tax (post rebate)</span><span className="font-medium text-slate-700">{formatINR(r.taxAfterRebate)}</span></div>
                {r.surcharge > 0 && <div className="flex justify-between text-xs text-slate-500"><span>Surcharge</span><span className="font-medium text-slate-700">{formatINR(r.surcharge)}</span></div>}
                <div className="flex justify-between text-xs text-slate-500"><span>Health & Education Cess (4%)</span><span className="font-medium text-slate-700">{formatINR(r.cess)}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-sm font-medium text-[#0B1F3A]">Total Tax Payable</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(r.totalTax)}</span></div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[#0B1F3A]/5 px-4 py-3 border border-[#0B1F3A]/10 text-sm text-[#0B1F3A]">
            The <strong>{result.cheaper === 'new' ? 'New Regime' : 'Old Regime'}</strong> saves you{' '}
            <strong>{formatINR(result.savings)}</strong> compared to the other regime, based on the figures entered.
          </div>

          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}>
              <Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}
            </button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors">
              <RotateCcw className="h-4 w-4" />Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter your gross annual income to compare both regimes</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Uses standard FY 2025-26 slab rates, deduction caps, and marginal relief rules as a reference estimate — it does not account for every exemption or your complete financial picture. Verify with the Income Tax e-filing portal or a CA before filing.
        </p>
      </div>
    </div>
  )
}
