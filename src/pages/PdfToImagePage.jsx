import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import { Download } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'PDF to Image Converter',
      'description': 'Free online tool to convert each page of a PDF into a PNG image. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/pdf-to-image',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What image format do I get?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Each PDF page is exported as a PNG image, downloaded one at a time.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, rendering happens entirely in your browser using PDF.js. Your file is never uploaded anywhere.' } },
        { '@type': 'Question', 'name': 'What resolution are the images?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Pages are rendered at 2x scale for good print/zoom quality — high enough for most document and sharing purposes.' } },
      ],
    }
    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webapplication')
    wpScript.text = JSON.stringify(webAppSchema)
    document.head.appendChild(wpScript)
    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-schema', 'faqpage')
    faqScript.text = JSON.stringify(faqSchema)
    document.head.appendChild(faqScript)
    return () => { wpScript.remove(); faqScript.remove() }
  }, [])
}

export default function PdfToImagePage() {
  usePageSchema()

  const [pdfDoc, setPdfDoc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileAccepted = async (file) => {
    setIsProcessing(true)
    setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise
      setPdfDoc(doc)
      setFileName(file.name.replace(/\.pdf$/i, ''))
    } catch (err) {
      setError('Failed to load PDF. Please try another file.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const convert = async () => {
    if (!pdfDoc) return
    setIsProcessing(true)
    setError(null)
    try {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}-page-${i}.png`
        a.click()
        URL.revokeObjectURL(url)
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    } catch (err) {
      setError('Failed to convert PDF pages to images.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setPdfDoc(null)
    setFileName('')
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="PDF to Image Converter"
        description="Convert each page of a PDF into a PNG image. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PDF to Image' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {!pdfDoc ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-1">{pdfDoc.numPages} pages loaded</h3>
                <p className="text-xs text-slate-500">Each page will download as a separate PNG image.</p>
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={convert}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  {isProcessing ? 'Converting...' : 'Convert & Download'}
                </button>
                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="px-7 py-3.5 rounded-lg border border-slate-300 text-[#0B1F3A] font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Upload Different File
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Browser-Based Advantage</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Convert PDF pages to images without uploading them anywhere
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Each page is rendered directly in your browser using PDF.js and exported as a PNG at 2x scale for clean quality. Useful for pulling a diagram, chart, or single page out of a PDF to share as an image.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="PDF to Image Questions"
        items={[
          { q: 'What image format do I get?', a: 'PNG, one file per page, downloaded one at a time.' },
          { q: 'Is my file uploaded to a server?', a: 'No, rendering happens entirely in your browser using PDF.js.' },
          { q: 'What resolution are the images?', a: 'Pages render at 2x scale for good quality — high enough for most sharing and printing needs.' },
          { q: 'Can I convert just one page?', a: 'This tool converts all pages. To extract a single page first, use Split PDF, then convert the result here.' },
        ]}
      />

      <ToolCta
        headline="Need bulk document processing?"
        body="Beyond page conversion, our custom software handles large-scale document workflows: bulk conversion, OCR extraction, and automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
