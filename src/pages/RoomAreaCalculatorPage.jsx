import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Room Area & Perimeter Calculator', 'description': 'Free multi-room area and perimeter calculator — a quick floor plan takeoff tool.', 'url': 'https://www.aadhiraiinnovations.com/tools/room-area-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is this useful for?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Add every room on a floor plan with its length and width, and get a running total of area (for flooring/tiling) and perimeter (for skirting/wall length) across the whole floor.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

let nextId = 1
function RoomAreaCalculator() {
  const [rooms, setRooms] = useState([{ id: nextId++, name: '', length: '', width: '' }])

  function updateRoom(id, key, value) { setRooms((r) => r.map((room) => (room.id === id ? { ...room, [key]: value } : room))) }
  function addRoom() { setRooms((r) => [...r, { id: nextId++, name: '', length: '', width: '' }]) }
  function removeRoom(id) { setRooms((r) => r.filter((room) => room.id !== id)) }

  const computed = rooms.map((r) => ({ ...r, area: (Number(r.length) || 0) * (Number(r.width) || 0), perimeter: 2 * ((Number(r.length) || 0) + (Number(r.width) || 0)) }))
  const totalArea = computed.reduce((s, r) => s + r.area, 0)
  const totalPerimeter = computed.reduce((s, r) => s + r.perimeter, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {rooms.map((room, i) => (
          <div key={room.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] items-end">
            <div><label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Room {i + 1} Name</label><input value={room.name} onChange={(e) => updateRoom(room.id, 'name', e.target.value)} placeholder="e.g. Bedroom 1" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Length (m)</label><input type="number" value={room.length} onChange={(e) => updateRoom(room.id, 'length', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Width (m)</label><input type="number" value={room.width} onChange={(e) => updateRoom(room.id, 'width', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <button onClick={() => removeRoom(room.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={addRoom} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-[#0B1F3A] hover:bg-slate-150"><Plus className="h-3.5 w-3.5" />Add Room</button>

      {totalArea > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Total Area</span><span className="text-lg font-bold text-[#0B1F3A]">{totalArea.toFixed(2)} m²</span></div>
          <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Total Perimeter</span><span className="font-medium text-slate-700">{totalPerimeter.toFixed(2)} m</span></div>
        </motion.div>
      )}
    </div>
  )
}

export default function RoomAreaCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Room Area & Perimeter Calculator" description="Add every room on a floor plan and get a running total area and perimeter takeoff." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Room Area & Perimeter Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><RoomAreaCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Room Area Calculator Questions" items={[{ q: 'What is this useful for?', a: 'A quick floor-plan takeoff — total area for flooring/tiling and total perimeter for skirting/walls across the whole floor.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
