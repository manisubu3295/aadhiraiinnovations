import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import { formatINR } from '../../../utils/currency'
import { CAPITAL_GAINS, formatMonths } from '../../../data/taxSimulatorConstants'

const ASSET_TYPES = [
  { key: 'equity', label: 'Listed Equity / Equity Mutual Funds (STT paid)', group: 'equity' },
  { key: 'debtMF', label: 'Debt Mutual Funds (bought after 1 Apr 2023)', group: 'other' },
  { key: 'property', label: 'Real Estate / Property', group: 'other' },
  { key: 'gold', label: 'Gold / Other Capital Assets', group: 'other' },
]

const SLAB_RATE_OPTIONS = [0, 5, 10, 15, 20, 25, 30]

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

export default function CapitalGainsTab() {
  const [assetKey, setAssetKey] = useState('equity')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [expenses, setExpenses] = useState('')
  const [holdingMonths, setHoldingMonths] = useState('')
  const [slabRate, setSlabRate] = useState(30)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const asset = ASSET_TYPES.find((a) => a.key === assetKey)
  const hasInputs = purchasePrice !== '' && salePrice !== '' && holdingMonths !== ''

  const result = useMemo(() => {
    if (!hasInputs) return null
    const gain = Number(salePrice) - Number(purchasePrice) - (Number(expenses) || 0)
    const months = Number(holdingMonths)
    const threshold = asset.group === 'equity' ? CAPITAL_GAINS.equity.holdingMonthsForLongTerm : CAPITAL_GAINS.other.holdingMonthsForLongTerm
    const isLongTerm = months >= threshold
    const positiveGain = Math.max(0, gain)

    let taxableGain, rate, tax, exemptionApplied = 0

    if (asset.group === 'equity') {
      if (isLongTerm) {
        exemptionApplied = Math.min(positiveGain, CAPITAL_GAINS.equity.ltcgExemption)
        taxableGain = Math.max(0, positiveGain - CAPITAL_GAINS.equity.ltcgExemption)
        rate = CAPITAL_GAINS.equity.ltcgRate
      } else {
        taxableGain = positiveGain
        rate = CAPITAL_GAINS.equity.stcgRate
      }
    } else {
      if (isLongTerm) {
        taxableGain = positiveGain
        rate = CAPITAL_GAINS.other.ltcgRate
      } else {
        taxableGain = positiveGain
        rate = slabRate
      }
    }
    tax = taxableGain * (rate / 100)

    return { gain, isLongTerm, threshold, taxableGain, rate, tax, exemptionApplied }
  }, [hasInputs, purchasePrice, salePrice, expenses, holdingMonths, assetKey, slabRate, asset])

  const copyResults = async () => {
    if (!result) return
    const text = `Asset: ${asset.label}\nGain: ${formatINR(result.gain)}\nType: ${result.isLongTerm ? 'Long-Term' : 'Short-Term'}\nTaxable Gain: ${formatINR(result.taxableGain)}\nRate: ${result.rate}%\nTax: ${formatINR(result.tax)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => {
    setPurchasePrice(''); setSalePrice(''); setExpenses(''); setHoldingMonths(''); setSlabRate(30)
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Asset Type</label>
        <select value={assetKey} onChange={(e) => setAssetKey(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
          {ASSET_TYPES.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Purchase Price (₹)" value={purchasePrice} onChange={setPurchasePrice} />
        <NumberField label="Sale Price (₹)" value={salePrice} onChange={setSalePrice} />
        <NumberField label="Transfer Expenses / Brokerage (₹)" value={expenses} onChange={setExpenses} hint="Optional — brokerage, stamp duty, legal fees" />
        <NumberField label="Holding Period (months)" value={holdingMonths} onChange={setHoldingMonths} hint={`Long-term if ≥ ${asset.group === 'equity' ? 12 : 24} months`} />
      </div>

      {asset.group === 'other' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Your Income Tax Slab Rate (for short-term gains only)</label>
          <select value={slabRate} onChange={(e) => setSlabRate(Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
            {SLAB_RATE_OPTIONS.map((r) => <option key={r} value={r}>{r}%</option>)}
          </select>
          <p className="mt-1.5 text-[11px] text-slate-400">Short-term gains on property, gold, and debt funds are added to your income and taxed at your slab rate.</p>
        </div>
      )}

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">Tax on Gain</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.tax)}</span>
            </div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Capital Gain</span><span className="font-medium text-slate-700">{formatINR(result.gain)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Gain Type</span><span className="font-medium text-slate-700">{result.isLongTerm ? 'Long-Term (LTCG)' : 'Short-Term (STCG)'} · held {formatMonths(Number(holdingMonths))}</span></div>
            {result.exemptionApplied > 0 && (
              <div className="flex justify-between items-center text-sm"><span className="text-slate-600">LTCG Exemption Applied</span><span className="font-medium text-slate-700">{formatINR(result.exemptionApplied)}</span></div>
            )}
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200"><span className="text-slate-600">Taxable Gain</span><span className="font-medium text-slate-700">{formatINR(result.taxableGain)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Applicable Rate</span><span className="font-medium text-slate-700">{result.rate}%</span></div>
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
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter purchase price, sale price, and holding period to calculate capital gains tax</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          Uses post-Budget 2024 rules (no indexation, 12/24-month holding thresholds). The ₹1,25,000 LTCG exemption on equity applies per financial year across all equity gains combined, not per transaction. Property acquired before 23 July 2024 may qualify for an alternate 20%-with-indexation option — verify with a CA.
        </p>
      </div>
    </div>
  )
}
