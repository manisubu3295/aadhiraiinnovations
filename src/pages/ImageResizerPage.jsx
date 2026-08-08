import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Resizer', 'description': 'Free online image resizer. Resize an image to exact dimensions or a percentage, right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/image-resizer', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does resizing keep the aspect ratio?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, by default width and height are locked to the original aspect ratio — enter one dimension and the other is calculated automatically. You can unlock it to stretch the image to exact dimensions.' } },
      { '@type': 'Question', 'name': 'Is my image uploaded anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, resizing happens entirely in your browser using the Canvas API.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function resizeImage(file, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => { URL.revokeObjectURL(objectUrl); blob ? resolve(blob) : reject(new Error('Resize failed')) }, file.type || 'image/png', 0.92)
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not load image')) }
    img.src = objectUrl
  })
}

function ImageResizer() {
  const [file, setFile] = useState(null)
  const [original, setOriginal] = useState(null) // { width, height }
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lockRatio, setLockRatio] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileAccepted = (accepted) => {
    setFile(accepted); setResult(null); setError(null)
    const img = new Image()
    img.onload = () => { setOriginal({ width: img.width, height: img.height }); setWidth(String(img.width)); setHeight(String(img.height)) }
    img.src = URL.createObjectURL(accepted)
  }

  function onWidthChange(v) {
    setWidth(v)
    if (lockRatio && original && v) setHeight(String(Math.round((Number(v) / original.width) * original.height)))
  }
  function onHeightChange(v) {
    setHeight(v)
    if (lockRatio && original && v) setWidth(String(Math.round((Number(v) / original.height) * original.width)))
  }

  async function runResize() {
    if (!file || !width || !height) return
    setIsProcessing(true); setError(null)
    try {
      const blob = await resizeImage(file, Number(width), Number(height))
      setResult({ blob, url: URL.createObjectURL(blob) })
    } catch { setError('Failed to resize this image.') } finally { setIsProcessing(false) }
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'resized') + '-resized' + (file?.name?.match(/\.[^.]+$/)?.[0] || '.png')
    a.click()
  }
  const reset = () => { setFile(null); setOriginal(null); setWidth(''); setHeight(''); setResult(null); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }} maxSizeMB={25} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop an image here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      {original && <p className="text-xs text-slate-400">Original: {original.width} × {original.height}px</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Width (px)</label><input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
        <div><label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Height (px)</label><input type="number" value={height} onChange={(e) => onHeightChange(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" /></div>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="rounded border-slate-300" />Lock aspect ratio</label>

      <button onClick={runResize} disabled={isProcessing || !width || !height} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors disabled:opacity-50">{isProcessing ? 'Resizing…' : 'Resize Image'}</button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden"><img src={result.url} alt="Resized preview" className="w-full max-h-64 object-contain bg-slate-50" /></div>
          <div className="flex gap-3">
            <button onClick={download} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] transition-all"><Download className="h-4 w-4" />Download Resized Image</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />New Image</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function ImageResizerPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Image Resizer" description="Resize an image to exact dimensions, right in your browser. No upload to any server." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Image Resizer' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ImageResizer /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Image Resizer Questions" items={[
        { q: 'Does resizing keep the aspect ratio?', a: 'Yes by default — enter one dimension and the other is calculated. Unlock to stretch to exact dimensions.' },
        { q: 'Is my image uploaded anywhere?', a: 'No, resizing happens entirely in your browser.' },
      ]} />
      <ToolCta headline="Need bulk image processing?" body="Aadhirai Innovations builds custom software for large-scale document and image automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
