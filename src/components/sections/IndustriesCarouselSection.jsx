import { motion } from 'framer-motion'
import Container from '../ui/Container'

const industries = [
  {
    id: 'pharmacy',
    caption: 'Pharmacy Operations',
    description:
      'AI-powered demand forecasting, GST-compliant billing, intelligent expiry prediction, and real-time stock analytics — purpose-built for pharmacy operations.',
  },
  {
    id: 'retail',
    caption: 'Retail Operations',
    description:
      'AI-powered point-of-sale, intelligent inventory management, multi-location visibility, and supplier analytics for demanding retail operations.',
  },
  {
    id: 'erp',
    caption: 'ERP & Process Automation',
    description:
      'AI-driven workflow automation, intelligent approval routing, predictive reporting, and operational analytics — eliminating manual overhead at enterprise scale.',
  },
]

function IndustriesCarouselSection() {
  return (
    <section
      id="industries"
      className="border-y border-slate-100 bg-slate-50 py-14 md:py-20 lg:py-24 scroll-mt-24"
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-slate-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Industries & Solutions
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl max-w-xl leading-[1.2]">
            AI-powered systems for
            <br />
            every demanding industry.
          </h2>
        </motion.div>

        {/* Industry cards — clean, no rainbow accents */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="group flex flex-col bg-white border border-slate-200 rounded-xl p-7 md:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              {/* Number indicator */}
              <div className="text-3xl font-bold text-slate-100 mb-4 leading-none select-none">
                0{index + 1}
              </div>
              <h3 className="text-base font-semibold text-[#0B1F3A] mb-2.5">
                {industry.caption}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default IndustriesCarouselSection
