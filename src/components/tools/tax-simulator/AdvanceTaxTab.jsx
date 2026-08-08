import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import { formatINR } from '../../../utils/currency'
import { ADVANCE_TAX_SCHEDULE } from '../../../data/taxSimulatorConstants'

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

export default function AdvanceTaxTab() {
  const [estimatedTax, setEstimatedTax] = useState('')
  const [tdsAlreadyDeducted, setTdsAlreadyDeducted] = useState('')
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = estimatedTax !== '' && Number(estimatedTax) > 0

  const result = useMemo(() => {
    if (!hasInputs) return null
    const total = Number(estimatedTax)
    const tds = Number(tdsAlreadyDeducted) || 0
    const netLiability = Math.max(0, total - tds)

    if (netLiability <= 10000) {
      return { netLiability, exempt: true, installments: [] }
    }

    let previousCumulative = 0
    const installments = ADVANCE_TAX_SCHEDULE.map((slab) => {
      const cumulativeAmount = netLiability * (slab.cumulativePercent / 100)
      const dueThisInstallment = cumulativeAmount - previousCumulative
      previousCumulative = cumulativeAmount
      return { ...slab, cumulativeAmount, dueThisInstallment }
    })

    return { netLiability, exempt: false, installments }
  }, [hasInputs, estimatedTax, tdsAlreadyDeducted])

  const copyResults = async () => {
    if (!result) return
    const text = result.exempt
      ? `Net tax liability: ${formatINR(result.netLiability)} — below ₹10,000, no advance tax required.`
      : `Net Tax Liability: ${formatINR(result.netLiability)}\n\n` + result.installments.map((i) => `${i.label}: ${formatINR(i.dueThisInstallment)} (cumulative ${i.cumulativePercent}% = ${formatINR(i.cumulativeAmount)})`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => { setEstimatedTax(''); setTdsAlreadyDeducted('') }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Estimated Total Tax Liability for the Year (₹)" value={estimatedTax} onChange={setEstimatedTax} hint="Total tax payable for the financial year, from the Income Tax tab or your own estimate" />
        <NumberField label="TDS Already Deducted / Paid (₹)" value={tdsAlreadyDeducted} onChange={setTdsAlreadyDeducted} hint="Optional — TDS deducted by employer or others" />
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          {result.exempt ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
              Net tax liability is {formatINR(result.netLiability)}, which is below the ₹10,000 threshold — no advance tax is required. Pay any balance as self-assessment tax before filing your return.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-[#0B1F3A]">Net Advance Tax Liability</span>
                <span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.netLiability)}</span>
              </div>
              {result.installments.map((i) => (
                <div key={i.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{i.label} <span className="text-slate-400">({i.cumulativePercent}% cumulative)</span></span>
                  <span className="font-medium text-slate-700">{formatINR(i.dueThisInstallment)}</span>
                </div>
              ))}
            </div>
          )}

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
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter your estimated annual tax liability to see the installment schedule</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Does not calculate interest for late or short payment (Sections 234B/234C). Senior citizens without business income are exempt from advance tax entirely. Pay via the Income Tax e-filing portal (Challan 280).
        </p>
      </div>
    </div>
  )
}
