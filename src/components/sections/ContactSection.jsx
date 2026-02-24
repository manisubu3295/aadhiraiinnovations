import { useState } from 'react'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    city: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send enquiry.')
      }

      setStatus({ type: 'success', message: 'Enquiry sent successfully. We will contact you shortly.' })
      setFormData({ name: '', company: '', city: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send enquiry. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MotionSection className="pb-16 sm:pb-20">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Discuss your operational requirements"
          description="Share your process context and business goals."
        />

        <div className="mt-8 md:mt-10 grid gap-6 md:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(11,31,58,0.06)]">
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
                Company
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]"
                />
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]"
              />
            </label>
            <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-700">
              Message
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 outline-none transition-colors focus:border-[#0B1F3A]"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 md:mt-5 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
            >
              {isSubmitting ? 'Sending...' : 'Send Enquiry'}
            </button>

            {status.type !== 'idle' && (
              <p
                className={`mt-3 text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}
                role="status"
              >
                {status.message}
              </p>
            )}
          </form>

          <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-[#0B1F3A]">Contact Channels</h3>
            <ul className="mt-3 md:mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
                <a href="https://wa.me/918508716957" target="_blank" rel="noreferrer" className="min-w-0 break-words hover:text-[#0B1F3A]">
                  WhatsApp (India): +91 8508716957
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
                <a href="https://wa.me/6590356479" target="_blank" rel="noreferrer" className="min-w-0 break-words hover:text-[#0B1F3A]">
                  WhatsApp (Singapore): +65 90356479
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
                <a href="mailto:maniubu3295@gmail.com" className="min-w-0 break-all hover:text-[#0B1F3A]">maniubu3295@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B1F3A]" />
                <span className="min-w-0 break-words">Peravurani & Chennai, Tamil Nadu, India</span>
              </li>
            </ul>
          </aside>
        </div>
      </Container>
    </MotionSection>
  )
}

export default ContactSection
