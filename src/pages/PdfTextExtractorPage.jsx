import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import { Download, Copy, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PDF Text Extractor', 'description': 'Free online PDF text extractor. Extract all text from a PDF and download it as a .txt file, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/pdf-text-extractor', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Will this work on a scanned PDF?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this extracts embedded text layers only. A scanned image PDF has no text layer, so it needs OCR software instead.' } },
      { '@type': 'Question', 'name': 'Is my PDF uploaded anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, extraction happens entirely in your browser.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function PdfTextExtractor() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  async function handleFileAccepted(accepted) {
    setFile(accepted); setText(''); setError(null); setIsProcessing(true)
    try {
      const arrayBuffer = await accepted.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const content = await page.getTextContent()
        fullText += content.items.map((item) => item.str).join(' ') + '\n\n'
      }
      if (!fullText.trim()) setError('No text found — this may be a scanned/image-only PDF.')
      setText(fullText.trim())
    } catch { setError('Failed to read this PDF. Make sure it\'s a valid, unencrypted file.') } finally { setIsProcessing(false) }
  }

  function download() {
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (file?.name?.replace(/\.pdf$/i, '') || 'extracted') + '.txt'; a.click()
  }
  async function copy() { try { await navigator.clipboard.writeText(text); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }
  const reset = () => { setFile(null); setText(''); setError(null) }

  if (!file) return <FileUploadZone accept={{ 'application/pdf': ['.pdf'] }} maxSizeMB={50} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop a PDF here or click to upload" error={error} onReset={reset} />

  return (
    <div className="space-y-6">
      {isProcessing && <p className="text-sm text-slate-500 text-center py-8">Extracting text…</p>}
      {error && !isProcessing && <p className="text-sm text-red-600">{error}</p>}
      {text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <textarea value={text} readOnly rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm resize-none" />
          <div className="flex gap-3">
            <button onClick={download} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] transition-all"><Download className="h-4 w-4" />Download .txt</button>
            <button onClick={copy} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-150'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy'}</button>
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"><RotateCcw className="h-4 w-4" />New File</button>
          </div>
        </motion.div>
      )}
      {!text && !isProcessing && !error && <button onClick={reset} className="text-sm text-slate-500 hover:text-[#0B1F3A]">Try another file</button>}
    </div>
  )
}

export default function PdfTextExtractorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="PDF Text Extractor" description="Extract all text from a PDF and download it as a .txt file, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PDF Text Extractor' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PdfTextExtractor /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="PDF Text Extractor Questions" items={[
        { q: 'Will this work on a scanned PDF?', a: 'No — it extracts embedded text layers only, not scanned images. Use OCR software for scanned documents.' },
        { q: 'Is my PDF uploaded anywhere?', a: 'No, extraction happens entirely in your browser.' },
      ]} />
      <ToolCta headline="Need bulk document processing?" body="Aadhirai Innovations builds custom software for large-scale document automation and data extraction." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
