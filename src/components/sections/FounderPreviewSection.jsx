import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const founderPhoto = '/media/founder.PNG'

function FounderPreviewSection() {
  return (
    <MotionSection id="founder" className="border-y border-slate-100 bg-slate-50/40 py-12 md:py-16 lg:py-20 scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Founder"
          title="Leadership with delivery discipline"
          description="A focused technology practice led by real implementation experience."
        />

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="group mt-8 md:mt-10 grid gap-6 md:gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_34px_rgba(11,31,58,0.07)] md:grid-cols-[300px_1fr] md:items-center"
        >
          <img
            src={founderPhoto}
            alt="Founder portrait"
            className="mx-auto h-[320px] w-[260px] rounded-2xl border border-slate-200 object-cover shadow-[0_10px_24px_rgba(11,31,58,0.08)] transition-transform duration-400 group-hover:scale-[1.02]"
          />

          <div>
            <h3 className="text-2xl font-semibold text-[#0B1F3A]">Founder’s Note</h3>
            <p className="mt-3 md:mt-4 text-slate-600">
              I founded Aadhirai Innovations with a simple principle — build systems that work in real business
              environments. Enterprise and banking-grade exposure shaped our approach to clarity, reliability, and
              long-term value.
            </p>
            <Link
              to="/founder"
              className="mt-5 md:mt-6 inline-flex items-center gap-2 rounded-md bg-[#0B1F3A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#173762]"
            >
              Read Founder’s Note
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>
      </Container>
    </MotionSection>
  )
}

export default FounderPreviewSection
