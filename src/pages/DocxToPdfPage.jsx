import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import mammoth from 'mammoth'
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
      'name': 'DOCX to PDF Converter',
      'description': 'Free online DOCX to PDF converter. Convert Word documents to PDF in seconds. No signup, no file limit. Works in browser.',
      'url': 'https://www.aadhiraiinnovations.com/tools/docx-to-pdf-converter',
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
          'name': 'What is DOCX to PDF converter?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A DOCX to PDF converter is a tool that transforms Word documents (.docx) into PDF format. PDFs are more universally compatible, preserve formatting across devices, and are harder to edit than Word documents.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why convert DOCX to PDF?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Convert to PDF for sharing professional documents, creating resumes, submitting applications, storing contracts, and ensuring consistent formatting across different devices and operating systems.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is the conversion fast?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, conversion happens in seconds in your browser. There\'s no waiting for email or server processing. Your file is processed locally on your device.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What about formatting and fonts?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Basic formatting is preserved. Text, colors, and layout are generally maintained. However, very complex Word formatting (advanced table layouts, special fonts, embedded objects) may not convert perfectly.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my document secure?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, your document is processed in your browser and never uploaded to our servers. It remains completely private and secure on your device.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What file formats are supported?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'This converter supports DOCX (modern Word format, .docx extension). If you have an older DOC file, convert it to DOCX in Microsoft Word first, then use this tool.',
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

export default function DocxToPdfPage() {
  usePageSchema()

  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileAccepted = async (file) => {
    setIsProcessing(true)
    setError(null)
    setFileName(file.name)
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB')

    try {
      const arrayBuffer = await file.arrayBuffer()

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer })
      const htmlContent = result.value

      // Create a new window for print-to-PDF
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (!printWindow) {
        setError('Pop-up blocked. Please allow pop-ups to continue.')
        setIsProcessing(false)
        return
      }

      // Write HTML to the new window with print styles
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${file.name.replace('.docx', '')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
              color: #333;
            }
            @media print {
              body {
                margin: 0;
              }
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `)
      printWindow.document.close()

      // Trigger print dialog
      setTimeout(() => {
        printWindow.print()
      }, 500)

      // Set result with special flag for print workflow
      setResult({
        fileName: file.name.replace('.docx', '.pdf'),
        downloadUrl: '__print_workflow__',
      })
    } catch (err) {
      setError('Failed to convert document. Please check the file format and try again.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setFileName('')
    setFileSize('')
    setResult(null)
    setError(null)
  }

  return (
    <>
      <ToolPageHero
        title="DOCX to PDF Converter"
        description="Convert Word documents to PDF instantly. Preserve formatting, maintain fonts, and create sharable PDFs. No signup required."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'DOCX to PDF Converter' },
        ]}
        badge="Free Tool"
      />

      {/* ── Tool Section ───────────────────────────────────────────────────– */}
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <FileUploadZone
              accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
              maxSizeMB={50}
              onFileAccepted={handleFileAccepted}
              toolLabel="Drag and drop your DOCX file here or click to upload"
              isProcessing={isProcessing}
              result={result}
              error={error}
              fileName={fileName}
              fileSize={fileSize}
              onReset={reset}
            />

            {result && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>How to save as PDF:</strong> In the print dialog that opened, select "Print to File" or "Save as PDF" as your printer, then click "Print" or "Save".
                </p>
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* ── Quality Note ───────────────────────────────────────────────────– */}
      <section className="bg-amber-50 border-b border-amber-200 py-6">
        <Container>
          <div className="rounded-lg border border-amber-300 bg-white p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> This converter works best for documents with standard formatting (text, images, basic tables). Complex layouts, special fonts, or advanced Word features may not convert perfectly. For high-fidelity conversion of complex documents, server-side processing is recommended.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Why Convert ────────────────────────────────────────────────────– */}
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
                Why Convert to PDF
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-10">
              When and why you should convert DOCX to PDF
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Professional Documents',
                  description: 'Resumes, cover letters, and proposals look better and more polished in PDF format.',
                },
                {
                  title: 'Legal Contracts',
                  description: 'PDFs are legally recognized and preserve the exact formatting for signature and archival.',
                },
                {
                  title: 'Invoices & Quotes',
                  description: 'Send professional invoices that cannot be accidentally edited by recipients.',
                },
                {
                  title: 'Form Submissions',
                  description: 'Many applications require PDF format for consistent display across different systems.',
                },
                {
                  title: 'Archive & Storage',
                  description: 'PDFs are more stable for long-term storage and less prone to corruption from software updates.',
                },
                {
                  title: 'Cross-Platform Sharing',
                  description: 'PDFs look identical on Windows, Mac, Linux, and mobile devices without formatting issues.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────– */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
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
                How Conversion Works
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-10">
              The conversion process, explained
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Upload Your DOCX',
                  description: 'Select or drag your Word document (.docx file) into the converter. The file stays on your device.',
                },
                {
                  step: '2',
                  title: 'Convert to HTML',
                  description: 'The converter reads the DOCX file structure and extracts text, formatting, and images as HTML.',
                },
                {
                  step: '3',
                  title: 'Print to PDF',
                  description: 'A print dialog opens showing your document. Choose "Save as PDF" and print to create your PDF file.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="text-4xl font-bold text-slate-200 mb-4 leading-none">{item.step}</div>
                  <h3 className="font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Related Tools ──────────────────────────────────────────────────– */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-semibold text-[#0B1F3A] mb-6">Related Tools</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/tools/pdf-to-docx-converter"
                className="rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all"
              >
                <h4 className="font-medium text-[#0B1F3A] mb-1">PDF to DOCX Converter</h4>
                <p className="text-xs text-slate-500">Convert PDF to editable Word documents</p>
              </a>

              <a
                href="/tools/pdf-editor"
                className="rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all"
              >
                <h4 className="font-medium text-[#0B1F3A] mb-1">PDF Editor</h4>
                <p className="text-xs text-slate-500">Rotate, delete, and reorder PDF pages</p>
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────– */}
      <ToolFaqSection
        title="DOCX to PDF Questions"
        items={[
          {
            q: 'What is DOCX to PDF converter?',
            a: 'A DOCX to PDF converter transforms Word documents into PDF format. PDFs are more universally compatible, preserve formatting across devices, and are harder to edit than Word documents.',
          },
          {
            q: 'Why convert DOCX to PDF?',
            a: 'Convert to PDF for sharing professional documents, creating resumes, submitting applications, storing contracts, and ensuring consistent formatting across devices.',
          },
          {
            q: 'Is the conversion fast?',
            a: 'Yes, conversion happens in seconds in your browser. There\'s no waiting for email or server processing. Your file is processed locally on your device.',
          },
          {
            q: 'What about formatting and fonts?',
            a: 'Basic formatting is preserved. Text, colors, and layout are generally maintained. However, very complex formatting may not convert perfectly.',
          },
          {
            q: 'Is my document secure?',
            a: 'Yes, your document is processed in your browser and never uploaded to our servers. It remains completely private and secure.',
          },
          {
            q: 'What file formats are supported?',
            a: 'This converter supports DOCX (modern Word format, .docx extension). Convert older DOC files to DOCX in Word first, then use this tool.',
          },
        ]}
      />

      {/* ── CTA ────────────────────────────────────────────────────────────– */}
      <ToolCta
        headline="Need bulk document conversion?"
        body="Processing dozens of documents? Aadhirai Innovations builds custom automation for large-scale document workflows: batch conversion, data extraction, and document management systems."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
