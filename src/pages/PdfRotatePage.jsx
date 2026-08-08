import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument, degrees } from 'pdf-lib'
import { RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PDF Rotate', 'description': 'Free online tool to rotate every page of a PDF by 90, 180, or 270 degrees, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/pdf-rotate', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Can I rotate individual pages differently?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This tool rotates every page by the same angle. For per-page rotation, use the full PDF Editor tool instead.' } },
      { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, rotation happens entirely in your browser.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PdfRotate() {
  const [file, setFile] = useState(null)
  const [angle, setAngle] = useState(90)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileAccepted = (accepted) => { setFile(accepted); setError(null) }

  async function rotate() {
    if (!file) return
    setIsProcessing(true); setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      doc.getPages().forEach((page) => {
        const current = page.getRotation().angle
        page.setRotation(degrees((current + angle) % 360))
      })
      const outBytes = await doc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = (file.name.replace(/\.pdf$/i, '') || 'rotated') + '-rotated.pdf'; a.click()
    } catch { setError('Failed to rotate this PDF. Make sure it\'s a valid, unencrypted file.') } finally { setIsProcessing(false) }
  }
  const reset = () => { setFile(null); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'application/pdf': ['.pdf'] }} maxSizeMB={50} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop a PDF here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">Selected: <strong className="text-[#0B1F3A]">{file.name}</strong></p>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Rotate All Pages By</label>
        <div className="flex gap-3">{[90, 180, 270].map((a) => (<button key={a} onClick={() => setAngle(a)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${angle === a ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{a}°</button>))}</div>
      </div>
      <button onClick={rotate} disabled={isProcessing} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors disabled:opacity-50">{isProcessing ? 'Rotating…' : 'Rotate & Download'}</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1F3A]"><RotateCcw className="h-3.5 w-3.5" />New File</button>
    </div>
  )
}

export default function PdfRotatePage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="PDF Rotate" description="Rotate every page of a PDF by 90, 180, or 270 degrees, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PDF Rotate' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PdfRotate /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="PDF Rotate Questions" items={[
        { q: 'Can I rotate pages individually?', a: 'This rotates every page by the same angle — use the full PDF Editor for per-page rotation.' },
        { q: 'Is my file uploaded anywhere?', a: 'No, rotation happens entirely in your browser.' },
      ]} />
      <ToolCta headline="Need bulk document processing?" body="Aadhirai Innovations builds custom software for large-scale document automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
