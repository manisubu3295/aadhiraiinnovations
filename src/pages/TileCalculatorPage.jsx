import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Tile Calculator', 'description': 'Free tile calculator. Find the number of tiles and boxes needed for a room, including wastage.', 'url': 'https://www.aadhiraiinnovations.com/tools/tile-calculator', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'How much wastage should I allow for tiles?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A common allowance is 10% for cutting and breakage, higher (15%) for diagonal layouts or rooms with many corners.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function TileCalculator() {
  const [roomArea, setRoomArea] = useState('')
  const [tileLength, setTileLength] = useState('')
  const [tileWidth, setTileWidth] = useState('')
  const [tilesPerBox, setTilesPerBox] = useState('')
  const [wastage, setWastage] = useState(10)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const hasInputs = roomArea !== '' && tileLength !== '' && tileWidth !== ''
  const result = hasInputs ? (() => {
    const tileAreaM2 = (Number(tileLength) / 1000) * (Number(tileWidth) / 1000)
    const baseTiles = Number(roomArea) / tileAreaM2
    const tiles = Math.ceil(baseTiles * (1 + Number(wastage) / 100))
    const boxes = tilesPerBox ? Math.ceil(tiles / Number(tilesPerBox)) : null
    return { tileAreaM2, tiles, boxes }
  })() : null

  const copyResults = async () => {
    if (!result) return
    const text = `Room Area: ${roomArea} m²\nTile Size: ${tileLength}×${tileWidth}mm\nTiles Needed: ${result.tiles}${result.boxes ? `\nBoxes Needed: ${result.boxes}` : ''}`
    try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) }
  }
  const reset = () => { setRoomArea(''); setTileLength(''); setTileWidth(''); setTilesPerBox(''); setWastage(10) }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Room Area (m²)</label><input type="number" value={roomArea} onChange={(e) => setRoomArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Wastage (%)</label><input type="number" value={wastage} onChange={(e) => setWastage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tile Length (mm)</label><input type="number" value={tileLength} onChange={(e) => setTileLength(e.target.value)} placeholder="e.g. 600" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tile Width (mm)</label><input type="number" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} placeholder="e.g. 600" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tiles per Box (optional)</label><input type="number" value={tilesPerBox} onChange={(e) => setTilesPerBox(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" /></div>
      </div>

      {result ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 bg-white rounded-lg px-4 py-3"><span className="text-sm font-medium text-[#0B1F3A]">Tiles Needed</span><span className="text-lg font-bold text-[#0B1F3A]">{result.tiles}</span></div>
            {result.boxes !== null && <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Boxes Needed</span><span className="font-medium text-slate-700">{result.boxes}</span></div>}
            <div className="flex justify-between items-center text-sm"><span className="text-slate-600">Tile Area</span><span className="font-medium text-slate-700">{result.tileAreaM2.toFixed(4)} m² each</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={copyResults} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Results'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </motion.div>
      ) : (<div className="text-center py-8 text-slate-400"><p className="text-sm">Enter room area and tile size to calculate tiles needed</p></div>)}
    </div>
  )
}

export default function TileCalculatorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Tile Calculator" description="Find the number of tiles and boxes needed for a room, including a wastage allowance." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Tile Calculator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><TileCalculator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Tile Calculator Questions" items={[{ q: 'How much wastage should I allow?', a: '10% is common; use 15% for diagonal layouts or rooms with many corners.' }]} />
      <ToolCta headline="Need custom software for your construction business?" body="Aadhirai Innovations builds custom ERP and project management software for construction and engineering companies." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
