import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { RotateCcw } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import FileUploadZone from '../components/tools/FileUploadZone'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Excel to CSV Converter', 'description': 'Free Excel to CSV and CSV to Excel converter, entirely in your browser.', 'url': 'https://www.aadhiraiinnovations.com/tools/excel-csv-converter', 'applicationCategory': 'ProductivityApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'Which sheet is used for Excel to CSV?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Only the first sheet in the workbook is converted.' } },
      { '@type': 'Question', 'name': 'Is my file uploaded anywhere?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'No, conversion happens entirely in your browser.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

function ExcelCsvConverter() {
  const [mode, setMode] = useState('excelToCsv')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')

  async function handleFileAccepted(accepted) {
    setFileName(accepted.name); setError(null); setIsProcessing(true)
    try {
      if (mode === 'excelToCsv') {
        const buffer = await accepted.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (accepted.name.replace(/\.(xlsx|xls)$/i, '') || 'converted') + '.csv'; a.click()
      } else {
        const text = await accepted.text()
        const workbook = XLSX.utils.book_new()
        const sheet = XLSX.utils.aoa_to_sheet(text.split('\n').map((line) => line.split(',')))
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1')
        const wbBytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
        const blob = new Blob([wbBytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (accepted.name.replace(/\.csv$/i, '') || 'converted') + '.xlsx'; a.click()
      }
    } catch { setError('Failed to convert this file.') } finally { setIsProcessing(false) }
  }
  const reset = () => { setFileName(''); setError(null) }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">{[{ k: 'excelToCsv', l: 'Excel → CSV' }, { k: 'csvToExcel', l: 'CSV → Excel' }].map((m) => (<button key={m.k} onClick={() => { setMode(m.k); reset() }} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${mode === m.k ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{m.l}</button>))}</div>
      <FileUploadZone
        key={mode}
        accept={mode === 'excelToCsv' ? { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] } : { 'text/csv': ['.csv'] }}
        maxSizeMB={20}
        onFileAccepted={handleFileAccepted}
        toolLabel={mode === 'excelToCsv' ? 'Drag and drop an Excel file here or click to upload' : 'Drag and drop a CSV file here or click to upload'}
        isProcessing={isProcessing}
        fileName={fileName}
        error={error}
        onReset={reset}
      />
      {error && <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1F3A]"><RotateCcw className="h-3.5 w-3.5" />Try again</button>}
    </div>
  )
}

export default function ExcelCsvConverterPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Excel ⇄ CSV Converter" description="Convert Excel to CSV and CSV to Excel, entirely in your browser." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Excel ⇄ CSV Converter' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><ExcelCsvConverter /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Excel/CSV Converter Questions" items={[
        { q: 'Which sheet is used?', a: 'Only the first sheet in the workbook.' },
        { q: 'Is my file uploaded anywhere?', a: 'No, conversion happens entirely in your browser.' },
      ]} />
      <ToolCta headline="Need bulk data processing?" body="Aadhirai Innovations builds custom software for large-scale data automation and processing." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
