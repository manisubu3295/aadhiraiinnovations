import { motion } from 'framer-motion'
import Container from '../ui/Container'
import regAward from '../../assets/images/reg.PNG'

const testimonials = [
  {
    name: 'Ulaganathan Koothaiyan',
    role: 'Managing Partner & CTO',
    company: 'Ebrain Technologies',
    text: 'Aadhirai Innovations stands out for delivering high-quality software solutions with exceptional value. Their products are competitively priced, their team ensures timely delivery, and they consistently exceed expectations. I have full confidence in their work and will continue to recommend them to my colleagues.',
  },
  {
    name: 'Selvakumar',
    role: 'Owner',
    company: 'Vasantham Pharmacy, Thanjavur',
    text: 'After implementing Medora+, our billing and stock management became significantly more efficient. Tracking medicines and managing inventory is now simple and reliable. It has meaningfully improved our daily pharmacy operations.',
  },
]

function PartnershipsSection() {
  return (
    <section
      id="testimonials"
      className="py-16 md:py-20 lg:py-24 bg-slate-50 border-y border-slate-100 scroll-mt-24"
    >
      <Container>
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-14 flex flex-wrap items-end justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Client Feedback
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-lg leading-[1.2]">
              What clients say about working with us.
            </h2>
          </div>

          {/* Award — compact trust signal */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <img
              src={regAward}
              alt="Nirvayar Perar Yaam Koodam 2026"
              className="h-12 w-auto rounded border border-slate-200 shadow-sm"
            />
            <div className="text-xs text-slate-500 leading-relaxed">
              Nirvayar Perar Yaam Koodam
              <br />
              <span className="font-semibold text-slate-600">2026 Recognition</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="flex flex-col bg-white border border-slate-200 rounded-xl p-8 md:p-10 shadow-sm"
            >
              {/* Opening quote mark — large, typographic */}
              <div
                className="text-5xl font-serif leading-none text-[#0B1F3A]/8 mb-4 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <blockquote className="flex-1 text-[15px] text-slate-600 leading-relaxed">
                {t.text}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-slate-100">
                <div className="text-sm font-semibold text-[#0B1F3A]">{t.name}</div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ''}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default PartnershipsSection
