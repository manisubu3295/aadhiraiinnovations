import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw, AlertTriangle } from 'lucide-react'
import { formatINR } from '../../../utils/currency'
import { HRA } from '../../../data/taxSimulatorConstants'

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

export default function HraExemptionTab() {
  const [basicPlusDA, setBasicPlusDA] = useState('')
  const [hraReceived, setHraReceived] = useState('')
  const [rentPaid, setRentPaid] = useState('')
  const [isMetro, setIsMetro] = useState(true)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = basicPlusDA !== '' && hraReceived !== '' && rentPaid !== ''

  const result = useMemo(() => {
    if (!hasInputs) return null
    const basic = Number(basicPlusDA)
    const hra = Number(hraReceived)
    const rent = Number(rentPaid)

    const byActualHra = hra
    const byRentMinusBasic = Math.max(0, rent - basic * 0.1)
    const byPercentOfBasic = basic * ((isMetro ? HRA.metroPercentOfBasic : HRA.nonMetroPercentOfBasic) / 100)

    const exemption = Math.min(byActualHra, byRentMinusBasic, byPercentOfBasic)
    const taxableHra = Math.max(0, hra - exemption)

    return { byActualHra, byRentMinusBasic, byPercentOfBasic, exemption, taxableHra }
  }, [hasInputs, basicPlusDA, hraReceived, rentPaid, isMetro])

  const copyResults = async () => {
    if (!result) return
    const text = `HRA Received: ${formatINR(Number(hraReceived))}\nHRA Exemption: ${formatINR(result.exemption)}\nTaxable HRA: ${formatINR(result.taxableHra)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const reset = () => { setBasicPlusDA(''); setHraReceived(''); setRentPaid(''); setIsMetro(true) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Basic Salary + DA (Annual)" value={basicPlusDA} onChange={setBasicPlusDA} />
        <NumberField label="HRA Received (Annual)" value={hraReceived} onChange={setHraReceived} />
        <NumberField label="Rent Paid (Annual)" value={rentPaid} onChange={setRentPaid} />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">City Type</label>
          <div className="flex gap-3">
            {[{ v: true, l: 'Metro (Delhi, Mumbai, Kolkata, Chennai)' }, { v: false, l: 'Non-Metro' }].map((opt) => (
              <button
                key={String(opt.v)}
                onClick={() => setIsMetro(opt.v)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${isMetro === opt.v ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-[#0B1F3A]">HRA Exemption (Least of the 3)</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.exemption)}</span>
            </div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">1. Actual HRA Received</span><span className="font-medium text-slate-700">{formatINR(result.byActualHra)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">2. Rent Paid − 10% of Basic</span><span className="font-medium text-slate-700">{formatINR(result.byRentMinusBasic)}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">3. {isMetro ? '50%' : '40%'} of Basic</span><span className="font-medium text-slate-700">{formatINR(result.byPercentOfBasic)}</span></div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200"><span className="text-sm font-medium text-[#0B1F3A]">Taxable HRA</span><span className="text-lg font-bold text-[#0B1F3A]">{formatINR(result.taxableHra)}</span></div>
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
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Enter Basic salary, HRA received, and rent paid to calculate your exemption</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          HRA exemption is only available under the old tax regime, and only if you actually pay rent. Salaried employees under the new regime cannot claim this exemption.
        </p>
      </div>
    </div>
  )
}
