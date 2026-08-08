import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Excel to PDF Converter', 'description': 'Free online Excel to PDF converter. Convert the first sheet of an Excel file to a simple table PDF, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/excel-to-pdf-converter', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Does this preserve Excel formatting?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No — it renders the first sheet\'s data as a simple text table, not the original cell colors, fonts, or merged cells. For pixel-perfect output, print to PDF directly from Excel.' } },
      { '@type': 'Question', 'name': 'Which sheet gets converted?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Only the first sheet in the workbook.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

async function rowsToPdfBytes(rows) {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const pageWidth = 842, pageHeight = 595 // A4 landscape, points
  const margin = 30, rowHeight = 18, fontSize = 9
  const colCount = Math.max(1, ...rows.map((r) => r.length))
  const colWidth = (pageWidth - margin * 2) / colCount

  let page = doc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  rows.forEach((row, rowIdx) => {
    if (y < margin + rowHeight) { page = doc.addPage([pageWidth, pageHeight]); y = pageHeight - margin }
    const useFont = rowIdx === 0 ? bold : font
    row.forEach((cell, colIdx) => {
      const text = String(cell ?? '').slice(0, 40)
      page.drawText(text, { x: margin + colIdx * colWidth, y: y - rowHeight + 5, size: fontSize, font: useFont, color: rgb(0.05, 0.12, 0.23) })
    })
    y -= rowHeight
  })
  return doc.save()
}

function ExcelToPdfConverter() {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  async function handleFileAccepted(accepted) {
    setFile(accepted); setError(null); setIsProcessing(true)
    try {
      const buffer = await accepted.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
      if (rows.length === 0) throw new Error('empty')
      const pdfBytes = await rowsToPdfBytes(rows)
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob); a.download = (accepted.name.replace(/\.(xlsx|xls)$/i, '') || 'converted') + '.pdf'; a.click()
    } catch { setError('Failed to convert this file. Make sure it\'s a valid Excel (.xlsx/.xls) file.') } finally { setIsProcessing(false) }
  }
  const reset = () => { setFile(null); setError(null) }

  return (
    <div className="space-y-6">
      <FileUploadZone accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }} maxSizeMB={20} onFileAccepted={handleFileAccepted} toolLabel="Drag and drop an Excel file here or click to upload" isProcessing={isProcessing} fileName={file?.name} error={error} onReset={reset} />
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">Renders the first sheet as a simple text table — cell colors, fonts, and merged cells aren't preserved.</p>
      </div>
      {error && <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1F3A]"><RotateCcw className="h-3.5 w-3.5" />Try again</button>}
    </div>
  )
}

export default function ExcelToPdfConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Excel to PDF Converter" description="Convert the first sheet of an Excel file to a simple table PDF, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Excel to PDF Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ExcelToPdfConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Excel to PDF Questions" items={[
        { q: 'Does this preserve Excel formatting?', a: 'No — a simple text table, not the original colors, fonts, or merged cells.' },
        { q: 'Which sheet gets converted?', a: 'Only the first sheet in the workbook.' },
      ]} />
      <ToolCta headline="Need bulk document processing?" body="Aadhirai Innovations builds custom software for large-scale document automation." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
