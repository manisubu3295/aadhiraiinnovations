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
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Format Converter', 'description': 'Free online image format converter. Convert between PNG, JPG, and WebP right in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/image-format-converter', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What formats can I convert between?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Upload a PNG, JPG, or WebP image, and convert it to any of the other two formats.' } },
      { '@type': 'Question', 'name': 'Will converting to JPG lose transparency?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes — JPG doesn\'t support transparency, so any transparent areas are filled with white. PNG and WebP both preserve transparency.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const FORMATS = [{ key: 'image/png', label: 'PNG', ext: '.png' }, { key: 'image/jpeg', label: 'JPG', ext: '.jpg' }, { key: 'image/webp', label: 'WebP', ext: '.webp' }]

function convertImage(file, mime) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (mime === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => { URL.revokeObjectURL(objectUrl); blob ? resolve(blob) : reject(new Error('Conversion failed')) }, mime, 0.92)
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Could not load image')) }
    img.src = objectUrl
  })
}

function ImageFormatConverter() {
  const [file, setFile] = useState(null)
  const [targetFormat, setTargetFormat] = useState('image/png')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileAccepted = (accepted) => { setFile(accepted); setResult(null); setError(null) }

  async function runConvert() {
    if (!file) return
    setIsProcessing(true); setError(null)
    try {
      const blob = await convertImage(file, targetFormat)
      setResult({ blob, url: URL.createObjectURL(blob) })
    } catch { setError('Failed to convert this image.') } finally { setIsProcessing(false) }
  }

  const download = () => {
    if (!result) return
    const ext = FORMATS.find((f) => f.key === targetFormat).ext
    const a = document.createElement('a')
    a.href = result.url
    a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'converted') + ext
    a.click()
  }
  const reset = () => { setFile(null); setResult(null); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }} maxSizeMB={25} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop an image here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">Selected: <strong className="text-[#0B1F3A]">{file.name}</strong></p>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Convert To</label>
        <div className="flex gap-3">{FORMATS.map((f) => (<button key={f.key} onClick={() => { setTargetFormat(f.key); setResult(null) }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${targetFormat === f.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150 hover:text-[#0B1F3A]'}`}>{f.label}</button>))}</div>
      </div>

      <button onClick={runConvert} disabled={isProcessing} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#0B1F3A] text-white hover:bg-[#173762] transition-colors disabled:opacity-50">{isProcessing ? 'Converting…' : 'Convert Image'}</button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden"><img src={result.url} alt="Converted preview" className="w-full max-h-64 object-contain bg-slate-50" /></div>
          <div className="flex gap-3">
            <button onClick={download} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] transition-all"><Download className="h-4 w-4" />Download {FORMATS.find((f) => f.key === targetFormat).label}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />New Image</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function ImageFormatConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Image Format Converter" description="Convert between PNG, JPG, and WebP, right in your browser. No upload to any server." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Image Format Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ImageFormatConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Image Format Converter Questions" items={[
        { q: 'What formats can I convert between?', a: 'PNG, JPG, and WebP — any of the three to any other.' },
        { q: 'Will converting to JPG lose transparency?', a: 'Yes, transparent areas are filled with white since JPG doesn\'t support transparency.' },
      ]} />
      <ToolCta headline="Need bulk image processing?" body="Aadhirai Innovations builds custom software for large-scale document and image automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
