import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
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
      'name': 'Add Page Numbers to PDF',
      'description': 'Free online tool to add page numbers to every page of a PDF. Runs entirely in your browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/pdf-page-numbers',
      'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'Can I choose the starting number and position?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes, set a starting number and choose bottom-left, bottom-center, or bottom-right placement.' } },
        { '@type': 'Question', 'name': 'Is my file uploaded to a server?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, page numbers are added entirely in your browser.' } },
      ],
    }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const POSITIONS = [
  { key: 'left', label: 'Bottom Left' },
  { key: 'center', label: 'Bottom Center' },
  { key: 'right', label: 'Bottom Right' },
]

export default function PdfPageNumbersPage() {
  usePageSchema()

  const [file, setFile] = useState(null)
  const [startNumber, setStartNumber] = useState(1)
  const [position, setPosition] = useState('center')
  const [showTotal, setShowTotal] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFileAccepted = (f) => { setFile(f); setError(null) }

  const apply = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const bytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(bytes)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      const total = pages.length

      pages.forEach((page, idx) => {
        const { width } = page.getSize()
        const num = startNumber + idx
        const label = showTotal ? `${num} / ${startNumber + total - 1}` : `${num}`
        const textWidth = font.widthOfTextAtSize(label, 10)
        let x = 24
        if (position === 'center') x = width / 2 - textWidth / 2
        if (position === 'right') x = width - textWidth - 24
        page.drawText(label, { x, y: 20, size: 10, font, color: rgb(0.35, 0.35, 0.35) })
      })

      const outBytes = await pdfDoc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'numbered.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to add page numbers. Make sure the file is a valid, unencrypted PDF.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => { setFile(null); setError(null) }

  return (
    <>
      <ToolPageHero
        title="Add Page Numbers to PDF"
        description="Add page numbers to every page of a PDF, with a starting number and position of your choice."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Add Page Numbers' }]}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Start At</label>
                    <input type="number" min="1" value={startNumber} onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm" />
                  </div>
                  <label className="flex items-center gap-2.5 mt-6 sm:mt-7">
                    <input type="checkbox" checked={showTotal} onChange={(e) => setShowTotal(e.target.checked)} className="accent-[#0B1F3A]" />
                    <span className="text-sm text-slate-600">Show "X / Total"</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Position</label>
                  <div className="flex flex-wrap gap-2">
                    {POSITIONS.map((p) => (
                      <button key={p.key} type="button" onClick={() => setPosition(p.key)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${position === p.key ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:text-[#0B1F3A]'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 justify-center">
                <button onClick={apply} disabled={isProcessing} className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:opacity-50 transition-colors">
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
        title="Page Numbers Questions"
        items={[
          { q: 'Can I choose the starting number and position?', a: 'Yes, set a starting number and choose bottom-left, bottom-center, or bottom-right.' },
          { q: 'Is my file uploaded to a server?', a: 'No, everything happens in your browser.' },
          { q: 'Can I use Roman numerals or letters?', a: 'Not with this tool — it adds standard numeric page numbers only.' },
        ]}
      />

      <ToolCta
        headline="Need document automation for your business?"
        body="Aadhirai Innovations builds custom software for document generation and business process automation."
        ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false }]}
      />
    </>
  )
}
