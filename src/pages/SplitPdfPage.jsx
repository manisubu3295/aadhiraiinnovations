import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { Scissors } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Split PDF',
      'description': 'Free online tool to split a PDF into multiple files by page range. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/split-pdf',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How do I specify page ranges?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Enter comma-separated ranges like "1-3, 4-6, 7" — each range becomes its own downloaded PDF file.' } },
        { '@type': 'Question', 'name': 'Are all the split files downloaded together?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Each split file downloads individually, one after another — your browser may ask for permission to download multiple files.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, splitting happens entirely in your browser. Your PDF is never uploaded anywhere.' } },
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

// Parses "1-3, 4, 6-8" into [[0,1,2],[3],[5,6,7]] (0-indexed page arrays), clamped to pageCount.
function parseRanges(input, pageCount) {
  const parts = input.split(',').map((p) => p.trim()).filter(Boolean)
  const ranges = []
  for (const part of parts) {
    const match = part.match(/^(\d+)(?:-(\d+))?$/)
    if (!match) continue
    const start = Math.max(1, parseInt(match[1], 10))
    const end = match[2] ? Math.min(pageCount, parseInt(match[2], 10)) : start
    if (start > pageCount || start > end) continue
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i - 1)
    ranges.push(pages)
  }
  return ranges
}

export default function SplitPdfPage() {
  usePageSchema()

  const [pdfBytes, setPdfBytes] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [rangesInput, setRangesInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileAccepted = async (file) => {
    setIsProcessing(true)
    setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPdfBytes(bytes)
      setPageCount(doc.getPageCount())
      setRangesInput('')
    } catch (err) {
      setError('Failed to load PDF. Please try another file.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const split = async () => {
    const ranges = parseRanges(rangesInput, pageCount)
    if (ranges.length === 0) {
      setError('Enter at least one valid page range, e.g. "1-3, 4-6".')
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      for (let i = 0; i < ranges.length; i++) {
        const src = await PDFDocument.load(pdfBytes)
        const out = await PDFDocument.create()
        const copiedPages = await out.copyPages(src, ranges[i])
        copiedPages.forEach((page) => out.addPage(page))
        const outBytes = await out.save()
        const blob = new Blob([outBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `split-part-${i + 1}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        // Small gap between triggered downloads so browsers don't block them as a popup flood.
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    } catch (err) {
      setError('Failed to split PDF.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setPdfBytes(null)
    setPageCount(0)
    setRangesInput('')
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="Split PDF"
        description="Split a PDF into multiple files by page range. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Split PDF' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {!pdfBytes ? (
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-1">{pageCount} pages loaded</h3>
                <p className="text-xs text-slate-500 mb-4">Enter page ranges to split into separate files.</p>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Page Ranges
                </label>
                <input
                  type="text"
                  value={rangesInput}
                  onChange={(e) => setRangesInput(e.target.value)}
                  placeholder={`e.g. 1-3, 4-6, 7 (out of ${pageCount})`}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm bg-white"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Each comma-separated range downloads as its own PDF file.
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={split}
                  disabled={isProcessing || !rangesInput.trim()}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors"
                >
                  <Scissors className="h-5 w-5" />
                  {isProcessing ? 'Splitting...' : 'Split & Download'}
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
              Split PDFs without uploading them anywhere
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Splitting happens entirely in your browser using JavaScript. Specify the page ranges you need — each becomes a separate PDF file, downloaded straight to your device.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Split PDF Questions"
        items={[
          { q: 'How do I specify page ranges?', a: 'Comma-separated ranges like "1-3, 4-6, 7" — each becomes its own downloaded PDF file.' },
          { q: 'Are all the split files downloaded together?', a: 'Each file downloads individually, one after another — your browser may prompt to allow multiple downloads.' },
          { q: 'Is my file uploaded to a server?', a: 'No, splitting happens entirely in your browser.' },
          { q: 'What if a page number is invalid?', a: 'Ranges outside your document\'s page count are ignored — only valid ranges are split.' },
        ]}
      />

      <ToolCta
        headline="Need bulk document processing?"
        body="Beyond splitting, our custom software handles large-scale PDF workflows: bulk conversion, OCR extraction, and document automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
