import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw } from 'lucide-react'
import JSZip from 'jszip'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Favicon Generator', 'description': 'Free favicon generator. Upload an image and get all standard favicon sizes as a downloadable zip.', 'url': 'https://www.aadhiraiinnovations.com/tools/favicon-generator', 'applicationCategory': 'DeveloperApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What sizes are generated?', 'acceptedAnswer': { '@type': 'Answer', 'text': '16×16, 32×32, and 48×48 (browser tab icons), 180×180 (Apple touch icon), 192×192 and 512×512 (Android/PWA icons) — all as PNG files in a single zip.' } },
      { '@type': 'Question', 'name': 'Does this generate a .ico file?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, it generates PNG files at each standard size, which every modern browser accepts via <link rel="icon" type="image/png">. A dedicated .ico converter is needed if you specifically require the legacy .ico format.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const SIZES = [16, 32, 48, 180, 192, 512]

function resizeToBlob(img, size) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    canvas.getContext('2d').drawImage(img, 0, 0, size, size)
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

function FaviconGenerator() {
  const [file, setFile] = useState(null)
  const [zipUrl, setZipUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  async function handleFileAccepted(accepted) {
    setFile(accepted); setZipUrl(null); setError(null); setIsProcessing(true)
    try {
      const img = new Image()
      const objectUrl = URL.createObjectURL(accepted)
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = objectUrl })
      const zip = new JSZip()
      for (const size of SIZES) {
        const blob = await resizeToBlob(img, size)
        zip.file(`favicon-${size}x${size}.png`, blob)
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      URL.revokeObjectURL(objectUrl)
      setZipUrl(URL.createObjectURL(zipBlob))
    } catch { setError('Failed to process this image.') } finally { setIsProcessing(false) }
  }

  const download = () => { if (!zipUrl) return; const a = document.createElement('a'); a.href = zipUrl; a.download = 'favicons.zip'; a.click() }
  const reset = () => { setFile(null); setZipUrl(null); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }} maxSizeMB={10} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop a square logo/image here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      {isProcessing && <p className="text-sm text-slate-500 text-center py-8">Generating favicon sizes…</p>}
      {zipUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">Generated {SIZES.length} sizes: {SIZES.map((s) => `${s}×${s}`).join(', ')}</div>
          <div className="flex gap-3">
            <button onClick={download} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] transition-all"><Download className="h-4 w-4" />Download favicons.zip</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />New Image</button>
          </div>
        </motion.div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default function FaviconGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Favicon Generator" description="Upload an image and get all standard favicon sizes as a downloadable zip." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Favicon Generator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><FaviconGenerator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Favicon Generator Questions" items={[
        { q: 'What sizes are generated?', a: '16×16, 32×32, 48×48, 180×180 (Apple touch), 192×192, and 512×512 (Android/PWA) — all as PNGs in a zip.' },
        { q: 'Does this generate a .ico file?', a: 'No, PNG files only — accepted by every modern browser via <link rel="icon" type="image/png">.' },
      ]} />
      <ToolCta headline="Need a website built with everything done right?" body="Aadhirai Innovations builds custom websites and web applications, favicons included." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
