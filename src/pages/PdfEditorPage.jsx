import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import { RotateCw, Trash2, Download, ArrowUp, ArrowDown } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

// Set up pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'PDF Editor Online',
      'description': 'Free online PDF editor. Rotate, delete, and reorder PDF pages in your browser. No signup required.',
      'url': 'https://www.aadhiraiinnovations.com/tools/pdf-editor',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is a PDF editor?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A PDF editor is a tool that allows you to modify PDF files. This online PDF editor lets you rotate pages, delete unwanted pages, and reorder pages — all in your browser without installing software.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I rotate PDF pages?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, you can rotate any PDF page by 90 degrees (clockwise or counter-clockwise) using the rotate buttons. The rotation is applied to the page and saved when you download.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do I delete pages from a PDF?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Click on a page thumbnail in the page strip and click the delete button. The page will be removed from your PDF. You can delete multiple pages one at a time.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I reorder PDF pages?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, use the move up and move down buttons to reorder pages. Select a page and click the up/down arrow to change its position in the PDF.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my PDF file safe?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, your PDF is processed entirely in your browser using JavaScript. Your file is never uploaded to our servers, so it remains completely private and secure.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the file size limit?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The recommended file size limit is 50MB. Larger files may slow down your browser. The actual limit depends on your device\'s available memory.',
          },
        },
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

    return () => {
      wpScript.remove()
      faqScript.remove()
    }
  }, [])
}

export default function PdfEditorPage() {
  usePageSchema()

  const [pdfFile, setPdfFile] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPageIdx, setSelectedPageIdx] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const canvasRefs = useRef({})

  const handleFileAccepted = async (file) => {
    setIsProcessing(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()

      setPdfFile(arrayBuffer)
      setPages(Array.from({ length: pageCount }, (_, i) => ({ idx: i, rotations: 0 })))
      setSelectedPageIdx(0)
    } catch (err) {
      setError('Failed to load PDF. Please try another file.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const rotatePage = async (pageIdx, direction) => {
    if (!pdfFile) return

    setIsProcessing(true)

    try {
      const pdfDoc = await PDFDocument.load(pdfFile)
      const page = pdfDoc.getPage(pageIdx)
      const currentRotation = page.getRotation().angle || 0
      const newRotation = direction === 'cw' ? currentRotation + 90 : currentRotation - 90

      page.setRotation((newRotation % 360 + 360) % 360)

      const rotatedPdf = await pdfDoc.save()
      setPdfFile(rotatedPdf)

      setPages(
        pages.map((p, i) =>
          i === pageIdx
            ? { ...p, rotations: (p.rotations + (direction === 'cw' ? 1 : -1)) % 4 }
            : p
        )
      )
    } catch (err) {
      setError('Failed to rotate page')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const deletePage = async (pageIdx) => {
    if (!pdfFile || pages.length === 1) return

    setIsProcessing(true)

    try {
      const pdfDoc = await PDFDocument.load(pdfFile)
      pdfDoc.removePage(pageIdx)

      const updatedPdf = await pdfDoc.save()
      setPdfFile(updatedPdf)

      const newPages = pages.filter((_, i) => i !== pageIdx)
      setPages(newPages)
      setSelectedPageIdx(Math.min(selectedPageIdx || 0, newPages.length - 1))
    } catch (err) {
      setError('Failed to delete page')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const movePage = async (pageIdx, direction) => {
    if (!pdfFile) return

    const targetIdx = direction === 'up' ? pageIdx - 1 : pageIdx + 1
    if (targetIdx < 0 || targetIdx >= pages.length) return

    setIsProcessing(true)

    try {
      const pdfDoc = await PDFDocument.load(pdfFile)
      const pageToMove = pdfDoc.getPage(pageIdx)

      if (direction === 'up') {
        pdfDoc.removePage(pageIdx)
        pdfDoc.insertPage(targetIdx, pageToMove)
      } else {
        pdfDoc.removePage(pageIdx)
        pdfDoc.insertPage(targetIdx, pageToMove)
      }

      const updatedPdf = await pdfDoc.save()
      setPdfFile(updatedPdf)

      const newPages = [...pages]
      ;[newPages[pageIdx], newPages[targetIdx]] = [newPages[targetIdx], newPages[pageIdx]]
      setPages(newPages)
      setSelectedPageIdx(targetIdx)
    } catch (err) {
      setError('Failed to move page')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPdf = async () => {
    if (!pdfFile) return

    try {
      const blob = new Blob([pdfFile], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'edited.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download PDF')
      console.error(err)
    }
  }

  const reset = () => {
    setPdfFile(null)
    setPages([])
    setSelectedPageIdx(null)
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="PDF Editor Online"
        description="Rotate pages, delete pages, reorder your PDF. All in your browser, completely free."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'PDF Editor' },
        ]}
        badge="Free Tool"
      />

      {/* ── Tool Section ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {!pdfFile ? (
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
              />
            </motion.div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Page Preview & Controls */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">
                  Pages ({pages.length})
                </h3>

                {/* Page Thumbnails Strip */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                  {pages.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPageIdx(idx)}
                      disabled={isProcessing}
                      className={`flex-none w-20 h-28 rounded-lg border-2 transition-all ${
                        selectedPageIdx === idx
                          ? 'border-[#0B1F3A] shadow-md'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="w-full h-full bg-white rounded-md flex items-center justify-center text-xs font-semibold text-slate-500">
                        Page {idx + 1}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Page Controls */}
                {selectedPageIdx !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                        Page Actions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => rotatePage(selectedPageIdx, 'cw')}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-sm font-medium hover:bg-[#173762] disabled:opacity-50 transition-colors"
                        >
                          <RotateCw className="h-4 w-4" />
                          Rotate Right
                        </button>

                        <button
                          onClick={() => rotatePage(selectedPageIdx, 'ccw')}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-sm font-medium hover:bg-[#173762] disabled:opacity-50 transition-colors"
                        >
                          <RotateCw className="h-4 w-4" style={{ transform: 'scaleX(-1)' }} />
                          Rotate Left
                        </button>

                        {selectedPageIdx > 0 && (
                          <button
                            onClick={() => movePage(selectedPageIdx, 'up')}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            <ArrowUp className="h-4 w-4" />
                            Move Up
                          </button>
                        )}

                        {selectedPageIdx < pages.length - 1 && (
                          <button
                            onClick={() => movePage(selectedPageIdx, 'down')}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            <ArrowDown className="h-4 w-4" />
                            Move Down
                          </button>
                        )}

                        {pages.length > 1 && (
                          <button
                            onClick={() => deletePage(selectedPageIdx)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Feature Status */}
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                          Available Features
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-green-100 text-xs font-medium text-green-700">
                            ✓ Rotate Pages
                          </span>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-green-100 text-xs font-medium text-green-700">
                            ✓ Delete Pages
                          </span>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-green-100 text-xs font-medium text-green-700">
                            ✓ Reorder Pages
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                          Coming Soon
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                            ⏳ Text Annotations
                          </span>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                            ⏳ Merge PDFs
                          </span>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                            ⏳ Form Filling
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadPdf}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
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

      {/* ── What is PDF Editor ─────────────────────────────────────────────– */}
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Understanding PDF Editing
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              What is a PDF editor?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                A PDF editor is a tool that allows you to modify PDF files after they've been created. Our online PDF editor lets you manipulate the structure and layout of your PDF documents without needing specialized software.
              </p>

              <h3 className="text-lg font-semibold text-[#0B1F3A] mt-6">Common Use Cases</h3>
              <ul className="space-y-2 pl-5">
                <li>
                  <strong>Scanning documents:</strong> Scanned pages often need rotation. This editor lets you fix orientation issues instantly.
                </li>
                <li>
                  <strong>Removing pages:</strong> Delete blank pages, duplicates, or sensitive information from PDFs.
                </li>
                <li>
                  <strong>Rearranging pages:</strong> Reorder pages to match a logical flow or remove unnecessary content.
                </li>
                <li>
                  <strong>Preparing for signatures:</strong> Delete extra pages and arrange your document before sending for signature.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#0B1F3A] mt-6">Browser-Based Advantage</h3>
              <p>
                This editor runs 100% in your browser. Your PDF never leaves your computer — it's never sent to our servers. You get instant editing without uploading, waiting, or installing software.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────– */}
      <ToolFaqSection
        title="PDF Editor Questions"
        items={[
          {
            q: 'What is a PDF editor?',
            a: 'A PDF editor is a tool that allows you to modify PDF files. This online PDF editor lets you rotate pages, delete unwanted pages, and reorder pages — all in your browser without installing software.',
          },
          {
            q: 'Can I rotate PDF pages?',
            a: 'Yes, you can rotate any PDF page by 90 degrees clockwise or counter-clockwise using the rotate buttons. The rotation is applied and saved when you download.',
          },
          {
            q: 'How do I delete pages from a PDF?',
            a: 'Click on a page thumbnail and click the delete button. The page will be removed from your PDF. You can delete multiple pages one at a time.',
          },
          {
            q: 'Can I reorder PDF pages?',
            a: 'Yes, use the move up and move down buttons to reorder pages. Select a page and click the arrow buttons to change its position.',
          },
          {
            q: 'Is my PDF file safe?',
            a: 'Yes, your PDF is processed entirely in your browser. Your file never goes to our servers, so it remains completely private and secure.',
          },
          {
            q: 'What is the file size limit?',
            a: 'The recommended limit is 50MB. Larger files may slow down your browser. The actual limit depends on your device\'s available memory.',
          },
        ]}
      />

      {/* ── CTA ────────────────────────────────────────────────────────────– */}
      <ToolCta
        headline="Need advanced PDF processing?"
        body="Beyond basic editing, our custom software handles large-scale PDF workflows: bulk conversion, OCR extraction, form processing, and document automation. Let us know about your document needs."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
