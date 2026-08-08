import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { Eraser } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PDF Signature / Stamp Adder', 'description': 'Free online tool to draw or type a signature and add it to a PDF page, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/pdf-signature', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Is this a legally binding e-signature?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this places a visual signature image on the page, with no identity verification, audit trail, or cryptographic signing. For legally binding e-signatures, use a dedicated e-signature service.' } },
      { '@type': 'Question', 'name': 'Is my PDF uploaded anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, everything happens entirely in your browser.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const POSITIONS = [
  { key: 'bottom-right', label: 'Bottom Right' },
  { key: 'bottom-left', label: 'Bottom Left' },
  { key: 'top-right', label: 'Top Right' },
  { key: 'top-left', label: 'Top Left' },
]

function SignaturePad({ canvasRef }) {
  const drawing = useRef(false)

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    const point = e.touches ? e.touches[0] : e
    return { x: point.clientX - rect.left, y: point.clientY - rect.top }
  }
  function start(e) { drawing.current = true; draw(e) }
  function stop() { drawing.current = false; canvasRef.current.getContext('2d').beginPath() }
  function draw(e) {
    if (!drawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e, canvas)
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0B1F3A'
    ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y)
  }

  return <canvas ref={canvasRef} width={400} height={150} className="w-full border border-slate-200 rounded-lg bg-white touch-none" onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
}

function PdfSignature() {
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('draw')
  const [typedName, setTypedName] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [position, setPosition] = useState('bottom-right')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  const handleFileAccepted = (accepted) => { setFile(accepted); setError(null) }

  function clearCanvas() {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  }

  function getSignaturePngBytes() {
    if (mode === 'draw') {
      return new Promise((resolve) => canvasRef.current.toBlob(async (blob) => resolve(new Uint8Array(await blob.arrayBuffer())), 'image/png'))
    }
    const canvas = document.createElement('canvas')
    canvas.width = 400; canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.font = '48px "Caveat", cursive'
    ctx.fillStyle = '#0B1F3A'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedName || 'Signature', 10, 55)
    return new Promise((resolve) => canvas.toBlob(async (blob) => resolve(new Uint8Array(await blob.arrayBuffer())), 'image/png'))
  }

  async function addSignature() {
    if (!file) return
    setIsProcessing(true); setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const pages = doc.getPages()
      const idx = Math.min(Math.max(1, pageNumber), pages.length) - 1
      const page = pages[idx]
      const { width, height } = page.getSize()

      const sigBytes = await getSignaturePngBytes()
      const sigImage = await doc.embedPng(sigBytes)
      const sigDims = sigImage.scaleToFit(150, 60)

      const margin = 30
      const coords = {
        'bottom-right': { x: width - sigDims.width - margin, y: margin },
        'bottom-left': { x: margin, y: margin },
        'top-right': { x: width - sigDims.width - margin, y: height - sigDims.height - margin },
        'top-left': { x: margin, y: height - sigDims.height - margin },
      }[position]

      page.drawImage(sigImage, { x: coords.x, y: coords.y, width: sigDims.width, height: sigDims.height })
      const outBytes = await doc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = (file.name.replace(/\.pdf$/i, '') || 'signed') + '-signed.pdf'; a.click()
    } catch { setError('Failed to add signature. Make sure the PDF is valid and unencrypted.') } finally { setIsProcessing(false) }
  }
  const reset = () => { setFile(null); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'application/pdf': ['.pdf'] }} maxSizeMB={50} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop a PDF here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">Selected: <strong className="text-[#0B1F3A]">{file.name}</strong></p>

      <div className="flex gap-3">{[{ k: 'draw', l: 'Draw Signature' }, { k: 'type', l: 'Type Signature' }].map((m) => (<button key={m.k} onClick={() => setMode(m.k)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>

      {mode === 'draw' ? (
        <div>
          <SignaturePad canvasRef={canvasRef} />
          <button onClick={clearCanvas} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0B1F3A]"><Eraser className="h-3.5 w-3.5" />Clear</button>
        </div>
      ) : (
        <div>
          <input value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Type your name" className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm" />
          {typedName && <p className="mt-3 text-4xl" style={{ fontFamily: '"Caveat", cursive', color: '#0B1F3A' }}>{typedName}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Page Number</label><input type="number" min="1" value={pageNumber} onChange={(e) => setPageNumber(Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Position</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white">{POSITIONS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}</select>
        </div>
      </div>

      <button onClick={addSignature} disabled={isProcessing} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors disabled:opacity-50">{isProcessing ? 'Adding…' : 'Add Signature & Download'}</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={reset} className="block text-sm text-slate-500 hover:text-[#0B1F3A]">New File</button>
    </div>
  )
}

export default function PdfSignaturePage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="PDF Signature / Stamp Adder" description="Draw or type a signature and add it to any page of a PDF, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PDF Signature' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PdfSignature /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="PDF Signature Questions" items={[
        { q: 'Is this legally binding?', a: 'No — it places a visual signature image only, with no identity verification or cryptographic signing. Use a dedicated e-signature service for legal signing.' },
        { q: 'Is my PDF uploaded anywhere?', a: 'No, everything happens entirely in your browser.' },
      ]} />
      <ToolCta headline="Need document workflows built into your business?" body="Aadhirai Innovations builds custom software for large-scale document automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
