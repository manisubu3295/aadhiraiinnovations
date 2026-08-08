import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import JSZip from 'jszip'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PPT to PDF Converter', 'description': 'Free online PowerPoint to PDF converter. Extracts the text from each slide and lays it out as a PDF page, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/ppt-to-pdf-converter', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does this preserve slide design, images, and layout?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — this is a text-focused converter, like the site\'s DOCX-to-PDF tool. It extracts each slide\'s text and lays it out as a simple PDF page. For pixel-perfect output with images and design intact, export to PDF directly from PowerPoint.' } },
      { '@type': 'Question', 'name': 'What file formats are accepted?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Modern .pptx files only (PowerPoint 2007 and later). The older binary .ppt format isn\'t supported.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function decodeXmlEntities(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

function extractSlideText(xml) {
  const matches = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)]
  return matches.map((m) => decodeXmlEntities(m[1])).filter(Boolean)
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) { lines.push(current); current = word }
    else current = test
  })
  if (current) lines.push(current)
  return lines
}

async function slidesToPdfBytes(slides) {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const pageWidth = 792, pageHeight = 612 // A4 landscape-ish, points
  const margin = 50

  slides.forEach((lines, idx) => {
    const page = doc.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin
    page.drawText(`Slide ${idx + 1}`, { x: margin, y, size: 10, font, color: rgb(0.6, 0.6, 0.6) })
    y -= 30
    lines.forEach((line, i) => {
      const useFont = i === 0 ? bold : font
      const size = i === 0 ? 20 : 13
      const wrapped = wrapText(line, useFont, size, pageWidth - margin * 2)
      wrapped.forEach((wLine) => {
        if (y < margin) return
        page.drawText(wLine, { x: margin, y, size, font: useFont, color: rgb(0.05, 0.12, 0.23) })
        y -= size + 10
      })
      y -= 6
    })
  })
  return doc.save()
}

function PptToPdfConverter() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')

  async function handleFileAccepted(accepted) {
    setFileName(accepted.name); setError(null); setIsProcessing(true)
    try {
      const zip = await JSZip.loadAsync(await accepted.arrayBuffer())
      const slideFiles = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
        .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))

      if (slideFiles.length === 0) throw new Error('no slides')

      const slides = []
      for (const name of slideFiles) {
        const xml = await zip.files[name].async('text')
        slides.push(extractSlideText(xml))
      }

      const pdfBytes = await slidesToPdfBytes(slides)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = (accepted.name.replace(/\.pptx$/i, '') || 'converted') + '.pdf'; a.click()
    } catch { setError('Failed to convert this file. Make sure it\'s a valid .pptx file.') } finally { setIsProcessing(false) }
  }
  const reset = () => { setFileName(''); setError(null) }

  return (
    <div className="space-y-6">
      <FileUploadZone accept={{ 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] }} maxSizeMB={30} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop a .pptx file here or click to upload" isProcessing={isProcessing} fileName={fileName} error={error} onReset={reset} />
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Text-focused conversion, like the site's DOCX-to-PDF tool — extracts each slide's text into a simple PDF page. Images, design, and layout aren't preserved. Only modern .pptx files are supported.</p>
      </div>
      {error && <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1F3A]"><RotateCcw className="h-3.5 w-3.5" />Try again</button>}
    </div>
  )
}

export default function PptToPdfConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="PPT to PDF Converter" description="Extract the text from each slide of a PowerPoint file and lay it out as a PDF, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'PPT to PDF Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><PptToPdfConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="PPT to PDF Questions" items={[
        { q: 'Does this preserve slide design and images?', a: 'No — text-focused, like the DOCX-to-PDF tool. Export from PowerPoint directly for pixel-perfect output.' },
        { q: 'What formats are accepted?', a: 'Modern .pptx files only — the older binary .ppt format isn\'t supported.' },
      ]} />
      <ToolCta headline="Need bulk document processing?" body="Aadhirai Innovations builds custom software for large-scale document automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
