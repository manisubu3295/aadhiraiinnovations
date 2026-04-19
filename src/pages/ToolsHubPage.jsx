import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolCta from '../components/tools/ToolCta'
import ToolFaqSection from '../components/tools/ToolFaqSection'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Free Document Tools Online — PDF & DOCX Utilities',
      'description': 'Free online document tools: convert DOCX to PDF, convert PDF to Word, and edit PDF files online. Fast, browser-based tools for offices, students, and businesses.',
      'url': 'https://www.aadhiraiinnovations.com/tools',
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://www.aadhiraiinnovations.com',
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Tools',
            'item': 'https://www.aadhiraiinnovations.com/tools',
          },
        ],
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Are these document tools free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, all our document tools are completely free to use. No signup, no credit card required, no watermarks, and no hidden charges. You can convert, edit, and download your files instantly.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my file safe and private?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, your privacy is our priority. Files are processed in your browser whenever possible (PDF Editor, PDF to DOCX text extraction). Files are not stored on our servers, and we do not track or share your data.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What file formats are supported?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'We support DOCX (Word), PDF, and basic text extraction. Check each tool page for specific format support. For advanced conversions with complex formatting, server-side processing may be needed.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Do I need to install software?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No software installation needed. All tools run in your web browser. They work on Windows, Mac, Linux, and mobile devices.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the file size limit?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Most tools support files up to 50MB. Check individual tool pages for specific limits. Larger files may require server-side processing.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I use these tools on mobile?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, all tools are fully responsive and work on mobile phones and tablets. Simply visit aadhiraiinnovations.com/tools on your mobile browser.',
          },
        },
      ],
    }

    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webpage')
    wpScript.text = JSON.stringify(webPageSchema)
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

const tools = [
  {
    title: 'DOCX to PDF Converter',
    description: 'Convert Word documents to PDF instantly. No formatting loss, fast processing.',
    href: '/tools/docx-to-pdf-converter',
    icon: FileText,
    features: ['Instant conversion', 'Format preservation', 'No signup needed'],
    status: 'Live & Free',
  },
  {
    title: 'PDF to DOCX Converter',
    description: 'Extract text from PDF and create an editable Word document.',
    href: '/tools/pdf-to-docx-converter',
    icon: FileText,
    features: ['Text extraction', 'Editable output', 'Works with digital PDFs'],
    status: 'Live & Free',
  },
  {
    title: 'PDF Editor Online',
    description: 'Rotate pages, delete pages, and reorder your PDF. No software needed.',
    href: '/tools/pdf-editor',
    icon: FileText,
    features: ['Rotate & delete pages', 'Reorder pages', 'Download instantly'],
    status: 'Live & Free',
  },
]

const benefits = [
  {
    title: 'Fast & Reliable',
    description: 'Process documents in seconds without waiting for email confirmations or account setup.',
  },
  {
    title: 'Privacy First',
    description: 'Your files are processed in your browser or securely on our servers. Never stored or shared.',
  },
  {
    title: 'No Signup Required',
    description: 'Use all tools immediately without creating an account, giving passwords, or entering credit card details.',
  },
  {
    title: 'Mobile Friendly',
    description: 'All tools work perfectly on phones and tablets. Access anytime, anywhere.',
  },
]

export default function ToolsHubPage() {
  usePageSchema()

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/60">
                Free Tools
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
              Free Document Tools Online
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Convert, edit, and process documents in your browser. Fast, secure, and completely free. No signup, no watermarks, no limits.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Tool Cards ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Available Tools
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Powerful document utilities, all free
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {tools.map((tool, idx) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0B1F3A]/20 to-transparent" />

                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-[#0B1F3A]/5 flex items-center justify-center group-hover:bg-[#0B1F3A]/10 transition-colors">
                        <Icon className="h-5 w-5 text-[#0B1F3A]" strokeWidth={1.75} />
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-green-100 text-xs font-bold uppercase tracking-wider text-green-700">
                        {tool.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">{tool.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{tool.description}</p>

                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-none" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={tool.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors group/link"
                    >
                      Try Tool
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Why Use Our Tools
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Built for real work, not marketing
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-[#0B1F3A] mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Brand Trust ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-3">
              Built by Aadhirai Innovations
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We're a software company based in Tamil Nadu, India, building enterprise-grade tools for business automation, pharmacy management, and document processing. These free tools reflect our commitment to creating useful, trustworthy, and accessible solutions for professionals, students, and businesses worldwide.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <ToolFaqSection
        title="Common Questions About Our Tools"
        items={[
          {
            q: 'Are these document tools free to use?',
            a: 'Yes, all our document tools are completely free. No signup, no credit card, no hidden charges. You can convert, edit, and download files instantly.',
          },
          {
            q: 'Is my file safe and private?',
            a: 'Yes. Files are processed in your browser whenever possible and never stored on our servers. We do not track or share your data.',
          },
          {
            q: 'What file formats are supported?',
            a: 'We support DOCX (Word), PDF, and text extraction. Check each tool page for specific format support.',
          },
          {
            q: 'Do I need to install software?',
            a: 'No software needed. All tools run in your web browser on Windows, Mac, Linux, and mobile devices.',
          },
          {
            q: 'What is the file size limit?',
            a: 'Most tools support files up to 50MB. Check individual tool pages for specific limits.',
          },
          {
            q: 'Can I use these tools on mobile?',
            a: 'Yes, all tools are fully responsive and work perfectly on mobile phones and tablets.',
          },
        ]}
      />

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <ToolCta
        headline="Need enterprise document workflows?"
        body="Aadhirai Innovations builds custom software for large-scale document automation, business process workflows, and data transformation. From invoice processing to document OCR, we turn documents into data."
        ctas={[
          { label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
