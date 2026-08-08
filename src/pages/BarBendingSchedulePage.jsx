import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Copy, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import {
  SHAPES, STANDARD_DIAMETERS, cuttingLengthMm, unitWeightKgPerM,
} from '../data/barBendingConstants'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Bar Bending Schedule (BBS) Calculator',
      'description': 'Free Bar Bending Schedule calculator for civil engineers and contractors. Calculate cutting length and steel weight for straight bars, L-bends, U-bends, stirrups, and cranked bars, with a per-diameter weight summary.',
      'url': 'https://www.aadhiraiinnovations.com/tools/bar-bending-schedule',
      'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How is cutting length calculated in a Bar Bending Schedule?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Cutting length is the sum of a bar\'s straight segments, adjusted for bends: subtract a bend deduction (2d per 90° bend, using the standard IS 2502 convention) since the outer measured length is longer than the bar\'s actual center-line length at a bend. Hooks (9d per 135° hook) and crank allowances (extra length = height × (cosec θ − cot θ)) are added where relevant.' } },
        { '@type': 'Question', 'name': 'How is steel weight calculated from cutting length?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Unit weight (kg/m) = diameter² ÷ 162, the standard IS 1786 formula. Total weight = cutting length (m) × number of bars × unit weight.' } },
        { '@type': 'Question', 'name': 'Do these formulas match what my engineer uses?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'These are the most widely taught IS 2502-based conventions in Indian civil engineering practice, but bend deduction and hook length conventions vary slightly by institution and site standard — always confirm with your structural engineer\'s specification before ordering steel.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const FIELD_LABELS = {
  straight: { a: 'Length (mm)' },
  lbend: { a: 'Leg A (mm)', b: 'Leg B (mm)' },
  ubend: { a: 'Leg A (mm)', b: 'Bottom B (mm)', c: 'Leg C (mm)' },
  stirrup: { a: 'Width (mm)', b: 'Depth (mm)' },
  cranked: { a: 'Straight A (mm)', b: 'Straight B (mm)', h: 'Vertical Rise at Crank (mm)', angle: 'Crank Angle', cranks: 'Number of Cranks' },
}

let nextId = 1
function emptyRow() {
  return { id: nextId++, member: '', shape: 'straight', dia: 12, count: 1, a: '', b: '', c: '', h: '', angle: 45, cranks: 1 }
}

function BarBendingSchedule() {
  const [rows, setRows] = useState([])
  const [draft, setDraft] = useState(emptyRow())
  const [copyFeedback, setCopyFeedback] = useState(false)

  const shapeConfig = SHAPES.find((s) => s.key === draft.shape)

  function updateDraft(key, value) { setDraft((d) => ({ ...d, [key]: value })) }

  function addRow() {
    setRows((r) => [...r, draft])
    setDraft(emptyRow())
  }
  function removeRow(id) { setRows((r) => r.filter((row) => row.id !== id)) }

  const computed = useMemo(() => rows.map((row) => {
    const cl = cuttingLengthMm(row)
    const totalLengthM = (cl / 1000) * (Number(row.count) || 0)
    const unitWt = unitWeightKgPerM(Number(row.dia) || 0)
    const totalWt = totalLengthM * unitWt
    return { ...row, cuttingLengthMm: cl, totalLengthM, unitWt, totalWt }
  }), [rows])

  const byDiameter = useMemo(() => {
    const map = {}
    computed.forEach((r) => { map[r.dia] = (map[r.dia] || 0) + r.totalWt })
    return Object.entries(map).map(([dia, weight]) => ({ dia, weight })).sort((a, b) => a.dia - b.dia)
  }, [computed])

  const grandTotal = computed.reduce((sum, r) => sum + r.totalWt, 0)

  function copySummary() {
    const lines = computed.map((r, i) => `${i + 1}. ${r.member || 'Bar'} — ${SHAPES.find((s) => s.key === r.shape).label}, ⌀${r.dia}mm × ${r.count} — Cutting Length ${r.cuttingLengthMm.toFixed(0)}mm — ${r.totalWt.toFixed(2)}kg`)
    const summaryLines = byDiameter.map((d) => `⌀${d.dia}mm: ${d.weight.toFixed(2)} kg`)
    const text = [...lines, '', 'Summary by Diameter:', ...summaryLines, '', `Grand Total: ${grandTotal.toFixed(2)} kg (${(grandTotal / 1000).toFixed(3)} tonnes)`].join('\n')
    navigator.clipboard.writeText(text).then(() => { setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) }).catch(() => {})
  }

  return (
    <div className="space-y-10">
      {/* Add bar form */}
      <div className="rounded-xl border border-slate-200 p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add a Bar</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Member (optional)</label><input type="text" value={draft.member} onChange={(e) => updateDraft('member', e.target.value)} placeholder="e.g. Footing F1" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Shape</label>
            <select value={draft.shape} onChange={(e) => updateDraft('shape', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
              {SHAPES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Diameter (mm)</label>
            <select value={draft.dia} onChange={(e) => updateDraft('dia', Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
              {STANDARD_DIAMETERS.map((d) => <option key={d} value={d}>{d} mm</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Bars</label><input type="number" min="1" value={draft.count} onChange={(e) => updateDraft('count', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>

          {shapeConfig.fields.filter((f) => f !== 'angle' && f !== 'cranks').map((f) => (
            <div key={f}><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{FIELD_LABELS[draft.shape][f]}</label><input type="number" value={draft[f]} onChange={(e) => updateDraft(f, e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
          ))}
          {shapeConfig.fields.includes('angle') && (
            <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Crank Angle</label>
              <select value={draft.angle} onChange={(e) => updateDraft('angle', Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
                {[30, 45, 60].map((a) => <option key={a} value={a}>{a}°</option>)}
              </select>
            </div>
          )}
          {shapeConfig.fields.includes('cranks') && (
            <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of Cranks</label>
              <select value={draft.cranks} onChange={(e) => updateDraft('cranks', Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white">
                {[1, 2].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
        <button onClick={addRow} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors"><Plus className="h-4 w-4" />Add Bar</button>
      </div>

      {/* Table */}
      {computed.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0B1F3A] text-white">
                  <th className="px-4 py-2.5 text-left font-semibold">#</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Member</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Shape</th>
                  <th className="px-4 py-2.5 text-left font-semibold">⌀ (mm)</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Count</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Cutting Length</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Total Length</th>
                  <th className="px-4 py-2.5 text-left font-semibold">Total Wt (kg)</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {computed.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-2.5 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-2.5 text-slate-700">{r.member || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{SHAPES.find((s) => s.key === r.shape).label}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.dia}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.count}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.cuttingLengthMm.toFixed(0)} mm</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.totalLengthM.toFixed(2)} m</td>
                    <td className="px-4 py-2.5 font-semibold text-[#0B1F3A]">{r.totalWt.toFixed(2)}</td>
                    <td className="px-4 py-2.5"><button onClick={() => removeRow(r.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <p className="text-sm font-medium text-[#0B1F3A] mb-2">Summary by Diameter</p>
            {byDiameter.map((d) => (
              <div key={d.dia} className="flex justify-between items-center text-sm"><span className="text-slate-600">⌀{d.dia}mm</span><span className="font-medium text-slate-700">{d.weight.toFixed(2)} kg</span></div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200"><span className="text-sm font-medium text-[#0B1F3A]">Grand Total</span><span className="text-lg font-bold text-[#0B1F3A]">{grandTotal.toFixed(2)} kg ({(grandTotal / 1000).toFixed(3)} t)</span></div>
          </div>

          <button onClick={copySummary} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-150'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Full Schedule'}</button>
        </motion.div>
      ) : (
        <div className="text-center py-8 text-slate-400"><p className="text-sm">Add your first bar above to build the schedule</p></div>
      )}

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Uses standard IS 2502-based conventions (90° bend deduction 2d, 135° hook length 9d, crank extra = height × (cosec θ − cot θ), unit weight = d²/162). Bend/hook conventions vary slightly by institution and site standard — verify against your structural engineer's specification before ordering steel.</p>
      </div>
    </div>
  )
}

export default function BarBendingSchedulePage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Bar Bending Schedule (BBS) Calculator" description="Calculate cutting length and steel weight for straight bars, L-bends, U-bends, stirrups, and cranked bars — with a full per-diameter weight summary." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Bar Bending Schedule' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><BarBendingSchedule /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Bar Bending Schedule Questions" items={[
        { q: 'How is cutting length calculated?', a: 'Sum of straight segments minus bend deductions (2d per 90° bend), plus hooks (9d per 135° hook) and crank allowances where relevant.' },
        { q: 'How is steel weight calculated?', a: 'Unit weight (kg/m) = diameter² ÷ 162. Total weight = cutting length (m) × bar count × unit weight.' },
        { q: 'Do these formulas match what my engineer uses?', a: 'These are the most widely taught IS 2502-based conventions, but always confirm with your structural engineer\'s specification before ordering steel.' },
      ]} />
      <ToolCta headline="Need custom software for construction or project management?" body="Aadhirai Innovations builds custom business software and backend systems for growing companies, including construction and project-based businesses." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
