import { motion } from 'framer-motion'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

function VideoSection() {
  return (
    <MotionSection id="video" className="border-y border-slate-100 bg-slate-50/40 py-12 md:py-16 lg:py-20 scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Overview"
          title="Company and delivery overview"
          description="A short walkthrough of Aadhirai Innovations' direction and implementation philosophy."
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mt-8 md:mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_38px_rgba(11,31,58,0.08)]"
        >
          <div className="aspect-video overflow-hidden rounded-xl">
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

          <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-3 pt-4">
            <p className="text-sm text-slate-600">A concise walkthrough of company direction and delivery approach.</p>
            <a
              href="https://youtu.be/iaJh_rVKiFw"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-[#0B1F3A] transition-colors hover:bg-slate-50"
            >
              Watch full overview
            </a>
          </div>
        </motion.div>
      </Container>
    </MotionSection>
  )
}

export default VideoSection
