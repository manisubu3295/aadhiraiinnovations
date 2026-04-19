import { motion } from 'framer-motion'
import Container from '../ui/Container'
import regAward from '../../assets/images/reg.PNG'

/* ─── Data ──────────────────────────────────────────────────────────────── */
const testimonials = [
  {
    name:       'Ulaganathan Koothaiyan',
    role:       'Managing Partner & CTO',
    company:    'Ebrain Technologies',
    industry:   'Technology',
    initial:    'U',
    outcome:    'Delivery excellence',
    text:       'Aadhirai Innovations stands out for delivering high-quality software solutions with exceptional value. Their products are competitively priced, their team ensures timely delivery, and they consistently exceed expectations. I have full confidence in their work and will continue to recommend them to my colleagues.',
  },
  {
    name:       'Selvakumar',
    role:       'Owner',
    company:    'Vasantham Pharmacy',
    location:   'Thanjavur',
    industry:   'Pharmacy',
    initial:    'S',
    outcome:    'Operational clarity',
    text:       'After implementing Medora+, our billing and stock management became significantly more efficient. Tracking medicines and managing inventory is now simple and reliable. It has meaningfully improved our daily pharmacy operations.',
  },
]

const trustSignals = [
  'Founder-led on every project',
  '10+ years of delivery experience',
  'Built for real business operations',
]

/* ─── Outcome tag ────────────────────────────────────────────────────────── */
function OutcomeTag({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0B1F3A]/12 bg-[#0B1F3A]/[0.06] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#0B1F3A]/55">
      <span className="h-1.5 w-1.5 rounded-full bg-[#0B1F3A]/35" />
      {label}
    </span>
  )
}

/* ─── Industry tag ───────────────────────────────────────────────────────── */
function IndustryTag({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#0B1F3A]/10 bg-white/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0B1F3A]/40">
      {label}
    </span>
  )
}

/* ─── Section ────────────────────────────────────────────────────────────── */
function PartnershipsSection() {
  const [featured, secondary] = testimonials

  return (
    <section id="testimonials" className="bg-[#f6f3ec] py-20 md:py-24 lg:py-32 scroll-mt-24">
      <Container>

        {/* ── Section header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mb-14 md:mb-18 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.26em] text-[#0B1F3A]/38 block mb-4">
              Client Feedback
            </span>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0B1F3A] sm:text-4xl leading-[1.1]">
              Trusted by businesses
              <br className="hidden sm:block" />
              that run on results.
            </h2>
          </div>

          {/* Award */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-3 self-end rounded-xl border border-[#0B1F3A]/10 bg-white/60 px-4 py-3 backdrop-blur-sm"
          >
            <img
              src={regAward}
              alt="Nirvayar Perar Yaam Koodam 2026"
              className="h-10 w-auto rounded"
            />
            <div>
              <div className="text-[11px] font-semibold text-[#0B1F3A]/58 leading-tight">
                Nirvayar Perar Yaam Koodam
              </div>
              <div className="mt-0.5 text-[10px] text-[#0B1F3A]/35">2026 Recognition</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Featured testimonial ──────────────────────────────────────── */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-16"
        >
          {/* Outcome tag — pre-frames the quote */}
          <div className="mb-6">
            <OutcomeTag label={featured.outcome} />
          </div>

          {/* Decorative large quote glyph */}
          <div
            className="text-[120px] md:text-[160px] font-serif leading-none text-[#0B1F3A]/[0.06] -mb-10 md:-mb-14 select-none pointer-events-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          {/* Quote */}
          <blockquote className="max-w-4xl text-[21px] md:text-[25px] font-medium text-[#0B1F3A]/68 leading-[1.65] tracking-[-0.01em]">
            {featured.text}
          </blockquote>

          {/* Attribution */}
          <figcaption className="mt-8 flex flex-wrap items-center gap-4">
            <div className="h-11 w-11 flex-none rounded-full bg-[#0B1F3A] flex items-center justify-center shadow-[0_4px_16px_rgba(11,31,58,0.2)]">
              <span className="text-[14px] font-bold text-white">{featured.initial}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-semibold text-[#0B1F3A]">{featured.name}</span>
                <IndustryTag label={featured.industry} />
              </div>
              <div className="mt-0.5 text-[12px] text-[#0B1F3A]/45">
                {featured.role} · {featured.company}
              </div>
            </div>
          </figcaption>
        </motion.figure>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px bg-[#0B1F3A]/[0.1] mb-12 md:mb-14" />

        {/* ── Supporting testimonial ────────────────────────────────────── */}
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          {/* Outcome tag */}
          <div className="mb-5">
            <OutcomeTag label={secondary.outcome} />
          </div>

          <blockquote className="text-[16px] text-[#0B1F3A]/62 leading-[1.85]">
            &ldquo;{secondary.text}&rdquo;
          </blockquote>

          <figcaption className="mt-6 flex flex-wrap items-center gap-3">
            <div className="h-9 w-9 flex-none rounded-full bg-[#0B1F3A]/10 flex items-center justify-center">
              <span className="text-[12px] font-bold text-[#0B1F3A]/55">{secondary.initial}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-[#0B1F3A]">{secondary.name}</span>
                <IndustryTag label={secondary.industry} />
              </div>
              <div className="mt-0.5 text-[11px] text-[#0B1F3A]/40">
                {secondary.role} · {secondary.company}
                {secondary.location ? `, ${secondary.location}` : ''}
              </div>
            </div>
          </figcaption>
        </motion.figure>

        {/* ── Trust signals strip ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 pt-10 border-t border-[#0B1F3A]/[0.1] flex flex-wrap gap-3"
        >
          {trustSignals.map((signal, i) => (
            <motion.span
              key={signal}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#0B1F3A]/12 bg-white/50 px-4 py-2 text-[12px] font-medium text-[#0B1F3A]/55"
            >
              <span className="h-1 w-4 rounded-full bg-[#0B1F3A]/25 flex-none" />
              {signal}
            </motion.span>
          ))}
        </motion.div>

      </Container>
    </section>
  )
}

export default PartnershipsSection
