import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument } from 'pdf-lib'
import { ArrowUp, ArrowDown, Trash2, Download } from 'lucide-react'
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
      'name': 'Image to PDF Converter',
      'description': 'Free online tool to combine JPG and PNG images into a single PDF file, in the order you choose. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/image-to-pdf',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Which image formats are supported?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'JPG/JPEG and PNG images. Each image becomes one page in the resulting PDF.' } },
        { '@type': 'Question', 'name': 'Can I reorder the images?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, use the up/down arrows before converting — this controls the page order in the final PDF.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, conversion happens entirely in your browser. Your images are never uploaded anywhere.' } },
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

export default function ImageToPdfPage() {
  usePageSchema()

  const [images, setImages] = useState([]) // [{ file, id, previewUrl }]
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFilesAccepted = (accepted) => {
    setError(null)
    setImages(accepted.map((file, i) => ({ file, id: `${Date.now()}-${i}`, previewUrl: URL.createObjectURL(file) })))
  }

  const move = (idx, dir) => {
    const target = dir === 'up' ? idx - 1 : idx + 1
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setImages(next)
  }

  const remove = (idx) => setImages(images.filter((_, i) => i !== idx))

  const convert = async () => {
    if (images.length === 0) {
      setError('Add at least one image.')
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      const doc = await PDFDocument.create()
      for (const { file } of images) {
        const bytes = await file.arrayBuffer()
        const isPng = file.type === 'image/png'
        const embedded = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes)
        const page = doc.addPage([embedded.width, embedded.height])
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height })
      }
      const outBytes = await doc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'images.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to convert images. Make sure all files are valid JPG or PNG images.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
    setImages([])
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="Image to PDF Converter"
        description="Combine JPG and PNG images into a single PDF, in the order you choose. Runs entirely in your browser."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Image to PDF' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          {images.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <FileUploadZone
                accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                maxSizeMB={20}
                multiple
                maxFiles={30}
                onFilesAccepted={handleFilesAccepted}
                toolLabel="Drag and drop images here or click to upload"
                isProcessing={isProcessing}
                error={error}
                onReset={reset}
              />
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Images ({images.length})</h3>
                <div className="space-y-2">
                  {images.map(({ file, id, previewUrl }, idx) => (
                    <div key={id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                      <img src={previewUrl} alt={file.name} className="h-10 w-10 rounded object-cover flex-none border border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#0B1F3A] truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-none">
                        <button onClick={() => move(idx, 'up')} disabled={idx === 0} className="p-1.5 rounded-md text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-50 disabled:opacity-30 transition-colors">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => move(idx, 'down')} disabled={idx === images.length - 1} className="p-1.5 rounded-md text-slate-400 hover:text-[#0B1F3A] hover:bg-slate-50 disabled:opacity-30 transition-colors">
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
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Browser-Based Advantage
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Convert images to PDF without uploading them anywhere
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Each image becomes one page in the output PDF, sized to match the image's own dimensions. Useful for turning scanned receipts, photos of documents, or a batch of product images into a single shareable PDF.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Image to PDF Questions"
        items={[
          { q: 'Which image formats are supported?', a: 'JPG/JPEG and PNG. Each image becomes one page in the PDF.' },
          { q: 'Can I reorder the images?', a: 'Yes, use the up/down arrows before converting.' },
          { q: 'Is my file uploaded to a server?', a: 'No, conversion happens entirely in your browser.' },
          { q: 'Is there a limit on how many images?', a: 'Up to 30 images per conversion, each up to 20MB.' },
        ]}
      />

      <ToolCta
        headline="Need bulk document processing?"
        body="Beyond image conversion, our custom software handles large-scale document workflows: bulk conversion, OCR extraction, and automation."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
