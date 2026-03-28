import { motion } from 'framer-motion'
import Container from '../ui/Container'

function VideoSection() {
  return (
    <section
      id="video"
      className="bg-white border-t border-slate-100 py-14 md:py-20 lg:py-24 scroll-mt-24"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Overview
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
            How Aadhirai Innovations builds
            pharmacy and enterprise software.
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-xl leading-relaxed">
            A short walkthrough of our engineering philosophy, structured delivery
            approach, and how we build pharmacy software and ERP systems for Indian businesses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/iaJh_rVKiFw"
              title="Aadhirai Innovations overview"
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

export default VideoSection
