import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, FileCheck2, CheckCircle2 } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'
import { API_BASE } from '../lib/apiBase'
import toolsDirectory from '../data/toolsDirectory'

function ChecklistDownloadForm() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch(`${API_BASE}/api/resources/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, resourceId: 'pharmacy-gst-compliance-checklist' }),
      })

      const contentType = response.headers.get('content-type') || ''
      let result = null
      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        try {
          result = JSON.parse(text)
        } catch {
          result = { success: false, message: text || 'Unexpected server response.' }
        }
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to process your request.')
      }

      setDownloadUrl(result.downloadUrl)
      setStatus({ type: 'success', message: "Sent! We've also emailed you the link." })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (downloadUrl) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-7">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-4" strokeWidth={1.75} />
        <h3 className="text-base font-semibold text-[#0B1F3A] mb-2">Your checklist is ready</h3>
        <p className="text-sm text-slate-500 mb-5">{status.message}</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173762]"
        >
          <Download className="h-4 w-4" />
          Open Checklist
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 md:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[#0B1F3A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#173762] disabled:opacity-60"
      >
        <Download className="h-4 w-4" />
        {isSubmitting ? 'Sending...' : 'Get the Checklist'}
      </button>
      {status.type === 'error' && (
        <p className="mt-3 text-sm text-red-600" role="status">{status.message}</p>
      )}
    </form>
  )
}

export default function ResourcesPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060e1c] py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0 grid-texture pointer-events-none" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-white/60">
                Resources
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
              Free tools and guides, in one place.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Everything we've built to be genuinely useful, whether or not you ever become a customer.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Compliance checklist download ────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <FileCheck2 className="h-8 w-8 text-[#0B1F3A]/60 mb-5" strokeWidth={1.5} />
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-slate-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Free Download
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-4">
                Pharmacy GST &amp; Compliance Checklist
              </h2>
              <p className="text-slate-600 leading-relaxed max-w-md">
                A one-page, self-assessment checklist covering billing, GST, audit readiness, expiry
                management, and operational resilience — useful whether you run manual billing or
                software. Print it, save it as a PDF, or keep it as a reference.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ChecklistDownloadForm />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Free tools ────────────────────────────────────────────────── */}
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
                Free Tools
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
              Tools you can use right now
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 leading-relaxed">
              No signup, no watermarks. Every category, all in one place — or browse{' '}
              <Link to="/tools" className="font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70">
                the full tools directory
              </Link>{' '}
              with search and filters.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolsDirectory.map((group, gIdx) => (
              <motion.div
                key={group.heading}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: gIdx * 0.08 }}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">{group.heading}</h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="group flex items-center justify-between text-[13.5px] text-slate-600 hover:text-[#0B1F3A] transition-colors"
                      >
                        {item.label}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0B1F3A] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <ToolFaqSection
        title="About These Resources"
        items={[
          {
            q: 'Is the compliance checklist specific to my state?',
            a: 'GST rules are national, so the checklist applies across India. It\'s a self-assessment tool, not legal advice — for edge cases, consult a CA.',
          },
          {
            q: 'Do I need to buy anything to use these resources?',
            a: 'No. The free tools and the checklist are free to use with no strings attached. We ask for your name and email on the checklist so we can send you the link and occasionally follow up.',
          },
          {
            q: 'Will I be added to a mailing list?',
            a: "We'll email you the checklist link and may follow up about it — we won't add you to recurring marketing email without asking first.",
          },
        ]}
      />

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <ToolCta
        headline="Need something built for your business?"
        body="If these tools solve part of the problem but not all of it, we build custom software and automation for pharmacies and growing businesses."
        ctas={[
          { label: 'See Our Products', href: '/pricing', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
