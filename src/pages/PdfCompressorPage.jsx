import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import { Download, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org', '@type': 'WebApplication',
      'name': 'PDF Compressor',
      'description': 'Free online PDF compressor. Reduce PDF file size by re-rendering pages at a lower image quality, entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/pdf-compressor',
      'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How does this compress a PDF?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Each page is re-rendered as a JPEG image at the quality level you choose, then rebuilt into a new PDF. This works best on scanned or image-heavy PDFs.' } },
        { '@type': 'Question', 'name': 'Will the text still be selectable after compression?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this method converts every page to an image, so the output PDF is no longer text-searchable or selectable. If you need to keep selectable text, don\'t use this tool.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, compression happens entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

export default function PdfCompressorPage() {
  usePageSchema()

  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(0.6)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null) // { originalSize, compressedSize, blob }

  const handleFileAccepted = (f) => {
    setFile(f)
    setResult(null)
    setError(null)
  }

  const compress = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const srcDoc = await pdfjsLib.getDocument({ data: bytes }).promise
      const outDoc = await PDFDocument.create()

      for (let i = 1; i <= srcDoc.numPages; i++) {
        const page = await srcDoc.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise

        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality)
        const jpegBytes = await (await fetch(jpegDataUrl)).arrayBuffer()
        const embedded = await outDoc.embedJpg(jpegBytes)
        const outPage = outDoc.addPage([viewport.width, viewport.height])
        outPage.drawImage(embedded, { x: 0, y: 0, width: viewport.width, height: viewport.height })
      }

      const outBytes = await outDoc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      setResult({ originalSize: file.size, compressedSize: blob.size, blob })
    } catch (err) {
      setError('Failed to compress PDF. Make sure the file is a valid, unencrypted PDF.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const download = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'compressed.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => { setFile(null); setResult(null); setError(null) }

  return (
    <>
      <ToolPageHero
        title="PDF Compressor"
        description="Reduce PDF file size by re-rendering pages at a lower image quality — best for scanned or image-heavy PDFs. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PDF Compressor' }]}
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-medium text-[#0B1F3A] mb-1">{file.name}</p>
                <p className="text-xs text-slate-400 mb-5">{formatBytes(file.size)}</p>

                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range" min="0.2" max="0.9" step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[#0B1F3A]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Smaller file</span>
                  <span>Higher quality</span>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Original</span>
                    <span className="font-medium text-slate-700">{formatBytes(result.originalSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Compressed</span>
                    <span className="font-semibold text-green-700">{formatBytes(result.compressedSize)}</span>
                  </div>
                  <div className="mt-2 text-xs text-green-700">
                    {result.compressedSize < result.originalSize
                      ? `${Math.round((1 - result.compressedSize / result.originalSize) * 100)}% smaller`
                      : 'This file didn\'t shrink further at this quality — try a lower quality setting.'}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 justify-center">
                {result ? (
                  <button onClick={download} className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] transition-colors">
                    <Download className="h-5 w-5" />
                    Download Compressed PDF
                  </button>
                ) : (
                  <button onClick={compress} disabled={isProcessing} className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors">
                    {isProcessing ? 'Compressing...' : 'Compress PDF'}
                  </button>
                )}
                <button onClick={reset} disabled={isProcessing} className="px-7 py-3.5 rounded-lg border border-slate-300 text-[#0B1F3A] font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors">
                  Upload Different File
                </button>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  This converts every page to an image, so the output PDF is no longer text-searchable or selectable. Best for scanned documents; don't use it on text PDFs you need to keep selectable.
                </p>
              </div>
            </div>
          )}
        </Container>
      </section>

      <ToolFaqSection
        title="PDF Compressor Questions"
        items={[
          { q: 'How does this compress a PDF?', a: 'Each page is re-rendered as a JPEG at your chosen quality, then rebuilt into a new PDF — most effective on scanned or image-heavy PDFs.' },
          { q: 'Will text still be selectable?', a: 'No, output pages are images. Don\'t use this on text PDFs you need to keep searchable/selectable.' },
          { q: 'Is my file uploaded to a server?', a: 'No, everything happens in your browser.' },
        ]}
      />

      <ToolCta
        headline="Need bulk document processing?"
        body="Beyond compression, our custom software handles large-scale PDF workflows: bulk conversion, OCR extraction, and document automation."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
