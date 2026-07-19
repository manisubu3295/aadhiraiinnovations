import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import PatternBackground from '../components/ui/PatternBackground'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const nextSteps = [
  'We read it carefully — not a form acknowledgement, an actual read of what you\'ve shared.',
  'We respond within one business day with follow-up questions or a proposal for a 30-minute call.',
  'The call is a conversation, not a pitch. If we\'re not the right fit, we\'ll say so.',
  'If it makes sense to proceed, we\'ll agree on scope and timeline before anything is signed.',
]

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', company: '', role: '', stage: '', service: '', situation: '',
  })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const body = Object.entries(form).map(([k, v]) => `${k}: ${v}`).join('\n')
    window.location.href = `mailto:info@aadhiraiinnovations.com?subject=Enquiry from ${encodeURIComponent(form.name || 'website')}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24 lg:py-28">
        <PatternBackground />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</span>
            <h1
              className="mt-4 font-semibold tracking-[-0.04em] text-[#0B1F3A]"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)' }}
            >
              Let's talk.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[15px] text-slate-500 leading-[1.85]">
              We take a small number of engagements at a time. If you're a CTO or VP Engineering at
              a growth-stage software company, we're happy to have a real conversation about whether we're
              the right fit.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Form + info */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:gap-20 lg:items-start">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {submitted ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#0B1F3A]/40" strokeWidth={1.5} />
                  <p className="mt-4 text-[15px] font-semibold text-[#0B1F3A]">Your enquiry is on its way.</p>
                  <p className="mt-2 text-[13.5px] text-slate-500">We'll respond within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] placeholder-slate-300 outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Company</label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] placeholder-slate-300 outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Role</label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08"
                      >
                        <option value="">Select your role</option>
                        <option>CTO</option>
                        <option>VP Engineering</option>
                        <option>Engineering Manager</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Funding Stage</label>
                      <select
                        name="stage"
                        value={form.stage}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08"
                      >
                        <option value="">Select stage</option>
                        <option>Pre-Series A</option>
                        <option>Series A</option>
                        <option>Series B</option>
                        <option>Series C+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">What would you like to discuss?</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08"
                    >
                      <option value="">Select a service</option>
                      <option>Production Readiness Audit</option>
                      <option>Architecture Advisory Retainer</option>
                      <option>Fixed-Scope Engineering</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Tell us briefly about your current situation</label>
                    <textarea
                      name="situation"
                      value={form.situation}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-[#0B1F3A] placeholder-slate-300 outline-none transition-all focus:border-[#0B1F3A]/30 focus:ring-2 focus:ring-[#0B1F3A]/08 resize-none"
                      placeholder="3–5 sentences about your stack, team size, and what's driving the enquiry."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 rounded-sm bg-[#0B1F3A] px-7 py-[14px] text-[13.5px] font-bold text-white transition-all hover:bg-[#173762] active:scale-[0.985]"
                  >
                    Submit Enquiry
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right: direct contact + what happens next */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="space-y-8 lg:sticky lg:top-24"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-5">Direct contact</p>
                <a
                  href="mailto:info@aadhiraiinnovations.com"
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400 flex-none" strokeWidth={1.75} />
                    <div>
                      <div className="text-[13.5px] font-semibold text-[#0B1F3A]">Email</div>
                      <div className="text-[11.5px] text-slate-400 mt-0.5">info@aadhiraiinnovations.com</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" strokeWidth={1.75} />
                </a>
                <p className="mt-3 text-[12px] text-slate-400">
                  We respond to all enquiries within one business day.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">What happens next</p>
                <div className="space-y-4">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-slate-200 text-[10px] font-bold text-slate-400">
                        {i + 1}
                      </span>
                      <p className="text-[13px] text-slate-500 leading-[1.7]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-[12px] text-slate-400 leading-[1.7]">
                  Not ready to reach out yet? The{' '}
                  <Link to="/services" className="font-semibold text-[#0B1F3A] underline underline-offset-3 hover:opacity-70">
                    Services page
                  </Link>{' '}
                  has full details on scope, methodology, and pricing.
                </p>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>
    </>
  )
}

export default ContactPage
