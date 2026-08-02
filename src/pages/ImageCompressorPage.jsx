import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw } from 'lucide-react'
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
      'name': 'Image Compressor',
      'description': 'Free online image compressor. Reduce JPEG and PNG file size in your browser without losing noticeable quality.',
      'url': 'https://www.aadhiraiinnovations.com/tools/image-compressor',
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.aadhiraiinnovations.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://www.aadhiraiinnovations.com/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Image Compressor', 'item': 'https://www.aadhiraiinnovations.com/tools/image-compressor' },
      ],
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How much can this reduce my image size by?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'It depends on the source image and quality setting, but typical photos compress 50–80% smaller at the default quality with no visible difference at normal viewing size.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What image formats are supported?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'You can upload JPEG, PNG, or WebP images. The compressed output is saved as JPEG, which gives the best size reduction for photos.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my image uploaded to a server?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. Compression happens entirely in your browser using the Canvas API — your image is never uploaded anywhere.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why compress images before uploading them?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Smaller images load faster on websites, take up less storage, and are quicker to send over email or WhatsApp — especially useful for product photos, documents, and web content.',
          },
        },
      ],
    }

    const scripts = [
      ['webapplication', webAppSchema],
      ['breadcrumblist', breadcrumbSchema],
      ['faqpage', faqSchema],
    ].map(([key, data]) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.setAttribute('data-schema', key)
      el.text = JSON.stringify(data)
      document.head.appendChild(el)
      return el
    })

    return () => scripts.forEach((el) => el.remove())
  }, [])
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function compressImage(file, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl)
          if (blob) resolve(blob)
          else reject(new Error('Compression failed'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load image'))
    }
    img.src = objectUrl
  })
}

/* ─── Compressor ─────────────────────────────────────────────────────────── */
function ImageCompressor() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(0.7)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null) // { blob, url }
  const [previewUrl, setPreviewUrl] = useState(null)

  const runCompression = async (targetFile, targetQuality) => {
    setIsProcessing(true)
    setError(null)
    try {
      const blob = await compressImage(targetFile, targetQuality)
      const url = URL.createObjectURL(blob)
      setResult({ blob, url })
    } catch {
      setError('Failed to compress this image. Please try another file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileAccepted = async (accepted) => {
    setFile(accepted)
    setPreviewUrl(URL.createObjectURL(accepted))
    setResult(null)
    await runCompression(accepted, quality)
  }

  const handleQualityChange = async (value) => {
    setQuality(value)
    if (file) await runCompression(file, value)
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = (file?.name?.replace(/\.[^.]+$/, '') || 'compressed') + '.jpg'
    a.click()
  }

  const reset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  const reduction = file && result ? Math.max(0, Math.round((1 - result.blob.size / file.size) * 100)) : 0

  if (!file) {
    return (
      <FileUploadZone
        accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }}
        maxSizeMB={25}
        onFileAccepted={handleFileAccepted}
        toolLabel="Drag and drop an image here or click to upload"
        error={error}
        onReset={reset}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 flex justify-between">
            <span>Original</span>
            <span>{formatBytes(file.size)}</span>
          </div>
          <img src={previewUrl} alt="Original" className="w-full h-48 object-cover" />
        </div>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 flex justify-between">
            <span>Compressed</span>
            <span>{result ? formatBytes(result.blob.size) : '…'}</span>
          </div>
          {result ? (
            <img src={result.url} alt="Compressed" className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-sm text-slate-400">
              {isProcessing ? 'Compressing…' : ''}
            </div>
          )}
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
          {reduction}% smaller — {formatBytes(file.size)} → {formatBytes(result.blob.size)}
        </motion.div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Quality: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => handleQualityChange(Number(e.target.value))}
          className="w-full accent-[#0B1F3A]"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          onClick={download}
          disabled={!result || isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Download className="h-4 w-4" />
          Download Compressed Image
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-150 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          New Image
        </button>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function ImageCompressorPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="Image Compressor"
        description="Reduce JPEG, PNG, and WebP file size right in your browser. Adjustable quality, instant preview, no upload to any server."
        breadcrumbItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Image Compressor' },
        ]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <ImageCompressor />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Why Compress
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              Why compress images before sharing or uploading?
            </h2>

            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                Modern phone cameras produce photos several megabytes in size — far more detail than most screens need. A large product photo, prescription scan, or document image slows down page loads, eats storage, and can fail to send over email or WhatsApp when file size limits are hit.
              </p>
              <p>
                This tool re-encodes your image at an adjustable JPEG quality level using the browser's built-in Canvas API — drag the slider and watch the size and preview update instantly. Nothing is uploaded; the entire process runs on your device.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="Image Compressor Questions"
        items={[
          {
            q: 'How much can this reduce my image size by?',
            a: 'Typical photos compress 50–80% smaller at the default quality with no visible difference at normal viewing size.',
          },
          {
            q: 'What image formats are supported?',
            a: 'Upload JPEG, PNG, or WebP. The compressed output is saved as JPEG for the best size reduction.',
          },
          {
            q: 'Is my image uploaded to a server?',
            a: 'No, compression happens entirely in your browser using the Canvas API.',
          },
          {
            q: 'Why compress images before uploading?',
            a: 'Smaller images load faster on websites, use less storage, and send more reliably over email or WhatsApp.',
          },
        ]}
      />

      <ToolCta
        headline="Need bulk document and image processing?"
        body="Aadhirai Innovations builds custom software for large-scale document and image automation — from compression pipelines to OCR extraction."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
