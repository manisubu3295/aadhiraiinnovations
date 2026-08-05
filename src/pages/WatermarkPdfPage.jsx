import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { Download } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'Watermark PDF',
      'description': 'Free online tool to add a diagonal text watermark to every page of a PDF. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/watermark-pdf',
      'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Can I control the watermark appearance?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, you can set the watermark text, opacity, and font size before applying it to every page.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, the watermark is applied entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

export default function WatermarkPdfPage() {
  usePageSchema()

  const [file, setFile] = useState(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.25)
  const [fontSize, setFontSize] = useState(48)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileAccepted = (f) => { setFile(f); setError(null) }

  const applyWatermark = async () => {
    if (!file || !text.trim()) return
    setIsProcessing(true)
    setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const pages = pdfDoc.getPages()

      pages.forEach((page) => {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(45),
        })
      })

      const outBytes = await pdfDoc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'watermarked.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to apply watermark. Make sure the file is a valid, unencrypted PDF.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => { setFile(null); setError(null) }

  return (
    <>
      <ToolPageHero
        title="Watermark PDF"
        description="Add a diagonal text watermark to every page of a PDF. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Watermark PDF' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {!file ? (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto">
              <FileUploadZone
                accept={{ 'application/pdf': ['.pdf'] }}
                maxSizeMB={50}
                onFileAccepted={handleFileAccepted}
                toolLabel="Drag and drop your PDF here or click to upload"
                isProcessing={isProcessing}
                error={error}
                onReset={reset}
              />
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-5">
                <p className="text-sm font-medium text-[#0B1F3A]">{file.name}</p>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Watermark Text</label>
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. CONFIDENTIAL, DRAFT"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Opacity: {Math.round(opacity * 100)}%</label>
                    <input type="range" min="0.1" max="0.6" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[#0B1F3A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Font Size: {fontSize}px</label>
                    <input type="range" min="20" max="90" step="2" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[#0B1F3A]" />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 justify-center">
                <button onClick={applyWatermark} disabled={isProcessing || !text.trim()} className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors">
                  <Download className="h-5 w-5" />
                  {isProcessing ? 'Applying...' : 'Apply & Download'}
                </button>
                <button onClick={reset} disabled={isProcessing} className="px-7 py-3.5 rounded-lg border border-slate-300 text-[#0B1F3A] font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors">
                  Upload Different File
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>

      <ToolFaqSection
        title="Watermark PDF Questions"
        items={[
          { q: 'Can I control the watermark appearance?', a: 'Yes, set the text, opacity, and font size before applying it to every page.' },
          { q: 'Is my file uploaded to a server?', a: 'No, the watermark is applied entirely in your browser.' },
          { q: 'Can I add an image watermark instead of text?', a: 'Not with this tool — it applies a diagonal text watermark only.' },
        ]}
      />

      <ToolCta
        headline="Need document automation for your business?"
        body="Aadhirai Innovations builds custom software for document generation, branding, and business process automation."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
