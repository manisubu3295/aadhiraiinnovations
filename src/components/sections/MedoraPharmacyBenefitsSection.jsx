import { motion } from 'framer-motion'
import Container from '../ui/Container'

export default function MedoraPharmacyBenefitsSection() {
  return (
    <section className="bg-white border-t border-slate-100 py-14 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Client Testimonial
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B1F3A] sm:text-3xl max-w-xl leading-[1.2]">
            Medora+ in a real pharmacy setting.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl overflow-hidden rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/4vQjlgKnycY"
              title="Medora+ Testimonial"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
