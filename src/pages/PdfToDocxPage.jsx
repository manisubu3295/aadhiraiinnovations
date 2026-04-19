import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import { Document, Packer, Paragraph, TextRun } from 'docx'
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
      'name': 'PDF to DOCX Converter',
      'description': 'Free online PDF to Word converter. Extract editable text from PDF and get a DOCX file. Works in browser, no signup required.',
      'url': 'https://www.aadhiraiinnovations.com/tools/pdf-to-docx-converter',
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
          'name': 'What is PDF to DOCX converter?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A PDF to DOCX converter extracts text content from a PDF file and creates an editable Word document. This is useful when you need to edit a PDF or repurpose its content.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I edit a scanned PDF?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Scanned PDFs (images) cannot be converted to editable text without OCR. This tool works best with digital PDFs (created from Word, Google Docs, etc.). For scanned documents, consider OCR tools.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Will the formatting be preserved?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'This converter extracts text content and basic structure. Complex formatting like tables, columns, and special layouts may not be preserved. The output is plain text in a Word document.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is this free?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, completely free. No signup, no hidden charges, no watermarks. Convert as many PDFs as you want.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my PDF secure?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, your PDF is processed entirely in your browser using JavaScript. Your file is never uploaded to our servers, so it remains completely private.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What types of PDFs work best?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Digital PDFs (created from Word, Google Docs, or professional software) work best. Scanned PDFs, images, or PDFs with complex layouts may not convert well.',
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

export default function PdfToDocxPage() {
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

      // Validate PDF signature
      const view = new Uint8Array(arrayBuffer)
      const isPdfValid = view[0] === 37 && view[1] === 80 && view[2] === 68 // %PDF
      if (!isPdfValid) {
        setError('❌ This file doesn\'t appear to be a valid PDF. Please check the file format.')
        setIsProcessing(false)
        return
      }

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item) => item.str).join(' ')
          fullText += pageText + '\n\n'
        } catch (pageErr) {
          console.warn(`Failed to extract text from page ${pageNum}:`, pageErr)
        }
      }

      if (!fullText.trim()) {
        setError('📄 No text found in this PDF. It may be a scanned image or protected. Try uploading a digital PDF (created from Word, Google Docs, or similar software).')
        setIsProcessing(false)
        return
      }

      // Create DOCX document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Add title from filename
              new Paragraph({
                text: file.name.replace('.pdf', ''),
                style: 'Heading1',
                spacing: { after: 200 },
              }),
              // Add extracted text
              ...fullText
                .split('\n')
                .filter((line) => line.trim())
                .map(
                  (line) =>
                    new Paragraph({
                      text: line.trim(),
                      spacing: { after: 100 },
                    })
                ),
            ],
          },
        ],
      })

      // Generate DOCX
      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob)
        const docxFileName = file.name.replace('.pdf', '.docx')

        setResult({
          fileName: docxFileName,
          downloadUrl: url,
        })
      }).catch((packErr) => {
        setError('❌ Failed to create Word document. Please try another PDF.')
        console.error('Packer error:', packErr)
      }).finally(() => {
        setIsProcessing(false)
      })
    } catch (err) {
      const errorMsg = err?.message || ''
      console.error('PDF conversion error:', err)

      if (errorMsg.includes('Invalid PDF') || errorMsg.includes('PDF header')) {
        setError('❌ This file doesn\'t appear to be a valid PDF. Please check the file format.')
      } else if (errorMsg.includes('password')) {
        setError('❌ This PDF is password-protected. Please unlock it first and try again.')
      } else if (errorMsg.includes('corrupted') || errorMsg.includes('Invalid')) {
        setError('❌ This PDF file appears to be corrupted. Please try another PDF.')
      } else {
        setError('❌ Failed to process PDF. This may be a scanned image, protected PDF, or unsupported format. Try a digital PDF instead.')
      }
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
        title="PDF to DOCX Converter"
        description="Extract editable text from PDF and create a Word document. Works with digital PDFs. Fast, free, and private."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'PDF to DOCX Converter' },
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
              accept={{ 'application/pdf': ['.pdf'] }}
              maxSizeMB={50}
              onFileAccepted={handleFileAccepted}
              toolLabel="Drag and drop your PDF here or click to upload"
              isProcessing={isProcessing}
              result={result}
              error={error}
              fileName={fileName}
              fileSize={fileSize}
              onReset={reset}
            />
          </motion.div>
        </Container>
      </section>

      {/* ── Limitations Note ───────────────────────────────────────────────– */}
      <section className="bg-amber-50 border-b border-amber-200 py-6">
        <Container>
          <div className="rounded-lg border border-amber-300 bg-white p-4">
            <p className="text-sm text-amber-900 font-semibold mb-2">Important Limitations:</p>
            <ul className="text-sm text-amber-900 space-y-1 pl-5">
              <li>✓ Works best with <strong>digital PDFs</strong> (created from Word, Google Docs, or software)</li>
              <li>✗ Cannot extract text from <strong>scanned PDFs</strong> or image-based PDFs</li>
              <li>✗ Complex formatting (tables, columns, images) will not be preserved</li>
              <li>✓ Output is a plain text Word document with extracted content</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* ── When to Use ────────────────────────────────────────────────────– */}
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
                Use Cases
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-10">
              When should you convert PDF to DOCX?
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: 'Repurposing Content',
                  description: 'Extract text from PDFs and reuse it in new documents, emails, or web content.',
                },
                {
                  title: 'Editing Documents',
                  description: 'Make changes to documents that were delivered as PDFs but need modifications.',
                },
                {
                  title: 'Data Entry',
                  description: 'Extract information from PDFs into structured Word documents for further processing.',
                },
                {
                  title: 'Accessibility',
                  description: 'Convert to Word for better screen reader compatibility and accessibility features.',
                },
                {
                  title: 'Translation',
                  description: 'Extract text to send for translation, then update the Word document.',
                },
                {
                  title: 'Archive Management',
                  description: 'Convert old PDF documents to editable format for long-term archival and retrieval.',
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

      {/* ── PDF Type Explanation ───────────────────────────────────────────– */}
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
                Understanding PDFs
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Digital vs. Scanned PDFs — why it matters
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 space-y-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">Digital PDF ✓ (Works with this converter)</h3>
                <p>
                  Created directly from software (Word, Excel, PowerPoint, Google Docs, Adobe InDesign). Contains actual text data that can be selected and copied. This converter extracts that text into a Word document.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">Scanned PDF ✗ (Doesn't work with this converter)</h3>
                <p>
                  A photograph or image of a paper document. Contains no selectable text data — only image pixels. Converting this requires OCR (Optical Character Recognition) technology, which is not available in this tool.
                </p>
              </div>

              <p className="text-sm text-slate-500 italic">
                Unsure which type you have? Try selecting text in your PDF viewer. If you can select text, it's a digital PDF. If you can't, it's a scanned image.
              </p>
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
                href="/tools/docx-to-pdf-converter"
                className="rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all"
              >
                <h4 className="font-medium text-[#0B1F3A] mb-1">DOCX to PDF Converter</h4>
                <p className="text-xs text-slate-500">Convert Word documents to PDF format</p>
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
        title="PDF to DOCX Questions"
        items={[
          {
            q: 'What is PDF to DOCX converter?',
            a: 'A converter that extracts text content from PDF files and creates an editable Word document. Useful when you need to edit a PDF or repurpose its content.',
          },
          {
            q: 'Can I edit a scanned PDF?',
            a: 'Scanned PDFs are images and cannot be converted without OCR technology. This tool works best with digital PDFs created from Word, Google Docs, or similar software.',
          },
          {
            q: 'Will the formatting be preserved?',
            a: 'This converter extracts text and basic structure. Complex formatting like tables, columns, and special layouts may not be preserved in the output Word document.',
          },
          {
            q: 'Is this free?',
            a: 'Yes, completely free. No signup, no hidden charges, no watermarks. Convert as many PDFs as you want.',
          },
          {
            q: 'Is my PDF secure?',
            a: 'Yes, your PDF is processed in your browser using JavaScript. Your file is never uploaded to our servers, so it remains completely private.',
          },
          {
            q: 'What types of PDFs work best?',
            a: 'Digital PDFs (created from Word, Google Docs, or professional software) work best. Scanned PDFs or images don\'t work well without OCR.',
          },
        ]}
      />

      {/* ── CTA ────────────────────────────────────────────────────────────– */}
      <ToolCta
        headline="Need OCR for scanned documents?"
        body="This tool handles digital PDFs, but if you need to convert scanned images, handwritten notes, or complex layouts, Aadhirai Innovations builds custom OCR and document automation solutions."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Contact Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
