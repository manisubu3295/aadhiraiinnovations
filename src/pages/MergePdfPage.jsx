import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { ArrowUp, ArrowDown, Trash2, Download, FileText } from 'lucide-react'
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
      'name': 'Merge PDF',
      'description': 'Free online tool to merge multiple PDF files into one, in the order you choose. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/merge-pdf',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'How many PDFs can I merge at once?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'You can select up to 20 PDF files at once. Reorder them before merging using the up/down arrows.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No. Merging happens entirely in your browser using JavaScript — your files never leave your device.' } },
        { '@type': 'Question', 'name': 'Can I change the order of pages?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'You can change the order the files are merged in using the up/down arrows, which controls the order pages appear in the final PDF.' } },
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

function formatBytes(bytes) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

export default function MergePdfPage() {
  usePageSchema()

  const [files, setFiles] = useState([]) // [{ file, id }]
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFilesAccepted = (accepted) => {
    setError(null)
    setFiles(accepted.map((file, i) => ({ file, id: `${Date.now()}-${i}` })))
  }

  const move = (idx, dir) => {
    const target = dir === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= files.length) return
    const next = [...files]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setFiles(next)
  }

  const remove = (idx) => setFiles(files.filter((_, i) => i !== idx))

  const merge = async () => {
    if (files.length < 2) {
      setError('Add at least 2 PDF files to merge.')
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      const merged = await PDFDocument.create()
      for (const { file } of files) {
        const bytes = await file.arrayBuffer()
        const src = await PDFDocument.load(bytes)
        const copiedPages = await merged.copyPages(src, src.getPageIndices())
        copiedPages.forEach((page) => merged.addPage(page))
      }
      const mergedBytes = await merged.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to merge PDFs. Make sure all files are valid, unencrypted PDFs.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setFiles([])
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="Merge PDF"
        description="Combine multiple PDF files into one, in the order you choose. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Merge PDF' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {files.length === 0 ? (
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
                multiple
                maxFiles={20}
                onFilesAccepted={handleFilesAccepted}
                toolLabel="Drag and drop 2+ PDF files here or click to upload"
                isProcessing={isProcessing}
                error={error}
                onReset={reset}
              />
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Files to merge ({files.length})</h3>
                <div className="space-y-2">
                  {files.map(({ file, id }, idx) => (
                    <div key={id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                      <FileText className="h-4 w-4 text-slate-400 flex-none" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#0B1F3A] truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-none">
                        <button onClick={() => move(idx, 'up')} disabled={idx === 0} className="p-1.5 rounded-md text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-50 disabled:opacity-30 transition-colors">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => move(idx, 'down')} disabled={idx === files.length - 1} className="p-1.5 rounded-md text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-50 disabled:opacity-30 transition-colors">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button onClick={() => remove(idx)} className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={merge}
                  disabled={isProcessing || files.length < 2}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  {isProcessing ? 'Merging...' : 'Merge & Download'}
                </button>
                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="px-7 py-3.5 rounded-lg border border-slate-300 text-[#0B1F3A] font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Start Over
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
              Merge PDFs without uploading them anywhere
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                This tool runs entirely in your browser using JavaScript — your PDF files are never uploaded to any server. Select your files, put them in the order you want, and the merge happens locally on your device before downloading the result.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Merge PDF Questions"
        items={[
          { q: 'How many PDFs can I merge at once?', a: 'Up to 20 PDF files. Reorder them before merging with the up/down arrows.' },
          { q: 'Is my file uploaded to a server?', a: 'No — merging happens entirely in your browser. Files never leave your device.' },
          { q: 'Can I change the order?', a: 'Yes, use the up/down arrows to control the order files are merged in.' },
          { q: 'What if a file is password-protected?', a: 'Encrypted/password-protected PDFs can\'t be merged here — remove the password first, or use the PDF Editor to prepare the file.' },
        ]}
      />

      <ToolCta
        headline="Need bulk document processing?"
        body="Beyond merging, our custom software handles large-scale PDF workflows: bulk conversion, OCR extraction, and document automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
