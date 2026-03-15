
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { User2 } from 'lucide-react'
import regAward from '../../assets/images/reg.PNG'

const testimonials = [
  {
    name: 'Ulaganathan Koothaiyan',
    role: 'Managing Partner & CTO',
    company: 'Ebrain Technologies',
    tag: 'Partner: Ebrain Technologies',
    image: '/media/testimonials/ulag.png', // Replace with actual image path or leave empty for initials
    text: 'Aadhirai Foundation stands out for delivering high-quality software solutions with exceptional value. Their products and services are competitively priced, making them a great choice compared to others in the market. As a client, I am extremely satisfied with their professionalism, technical expertise, and innovative approach. The team ensures timely delivery and consistently exceeds expectations. I have full confidence in their work and will continue to recommend Aadhirai Foundation to my friends and colleagues.'
  },
  {
    name: 'Selvakumar',
    role: 'Owner',
    company: 'Vasantham Pharmacy, Ottankad, Thanjavur',
    tag: 'Medora+ Client',
    image: '/media/testimonials/selva.png', // Replace with actual image path or leave empty for initials
    text: 'After implementing Medora+, our billing and stock management became much more efficient. Tracking medicines and managing inventory is now simple and reliable. It has really helped improve our daily pharmacy operations.'
  }
]

function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [thinking, setThinking] = useState(false)

  useEffect(() => {
    setThinking(true)
    const thinkTimeout = setTimeout(() => {
      setThinking(false)
      const slideTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length)
        setThinking(true)
      }, 3400)
      return () => clearTimeout(slideTimeout)
    }, 600)
    return () => clearTimeout(thinkTimeout)
  }, [index])

  const t = testimonials[index]

  return (
    <div className="relative flex w-full max-w-2xl mx-auto items-center justify-center min-h-[220px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="flex w-full bg-white rounded-2xl border border-slate-200 shadow-[0_4px_16px_rgba(11,31,58,0.06)] px-6 py-6 md:py-7 md:px-8 items-center gap-6"
        >
          {t.image && t.image.trim() !== '' && t.image !== 'none' ? (
            <img src={t.image} alt={t.name} className="h-16 w-16 rounded-full object-cover border-2 border-[#173762]" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[#173762] to-[#3b82f6] text-white">
              <User2 className="h-10 w-10 text-white/80" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[#173762] text-base truncate">{t.name}</span>
              {t.tag && <span className="ml-2 rounded bg-[#173762]/10 px-2 py-0.5 text-xs font-medium text-[#173762]">{t.tag}</span>}
            </div>
            <div className="text-xs text-slate-600 mb-2 truncate">{t.role}{t.company ? `, ${t.company}` : ''}</div>
            <blockquote className="relative text-slate-700 text-[15px] leading-snug">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.18, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute -top-4 left-0 text-4xl text-[#173762] select-none pointer-events-none"
                aria-hidden="true"
              >
                “
              </motion.span>
              {t.text}
            </blockquote>
          </div>
        </motion.div>
      </AnimatePresence>
      {thinking && (
        <motion.div
          key="thinking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1 text-[#173762] text-xs font-semibold bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow"
        >
          <span className="animate-pulse">Thinking...</span>
        </motion.div>
      )}
    </div>
  )
}

function PartnershipsSection() {
  return (
    <section className="py-14 md:py-20 bg-slate-50 border-b border-slate-100">
      <Container className="py-8 md:py-12">
        <SectionHeading
          title="Partnerships & Testimonials"
          description="We are proud to collaborate with industry leaders and deliver exceptional value to our clients."
          centered
        />
        <TestimonialCarousel />

        {/* Awards & Recognition */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <SectionHeading
            title="Awards & Recognition"
            description="Nirvayar Perar Yaam Koodam 2026 Recognition"
            centered
          />
          <img src={regAward} alt="Nirvayar Perar Yaam Koodam 2026 Recognition" className="w-auto max-w-[120px] rounded-md shadow border border-slate-200 p-1 mt-4" />
        </div>
      </Container>
    </section>
  )
}

export default PartnershipsSection
