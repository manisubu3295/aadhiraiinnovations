import { motion } from 'framer-motion'
// import { Pill, ShoppingCart, Workflow } from 'lucide-react'
import placeholder1 from '../../assets/images/placeholder-1.svg';
import placeholder2 from '../../assets/images/placeholder-2.svg';
import placeholder3 from '../../assets/images/placeholder-3.svg';
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const industrySlides = [
  {
    id: 'industry-1',
    caption: 'Pharmacy Operations',
    image: placeholder1,
    description: 'GST billing, stock tracking, expiry alerts, and regulatory compliance',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50/80',
  },
  {
    id: 'industry-2',
    caption: 'SME Retail Systems',
    image: placeholder2,
    description: 'Point-of-sale, inventory management, and multi-location support',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50/80',
  },
  {
    id: 'industry-3',
    caption: 'ERP Automation',
    image: placeholder3,
    description: 'Process workflows, approval systems, and integrated reporting',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50/80',
  },
]

function IndustriesCarouselSection() {
  return (
    <MotionSection id="industries" className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 py-12 md:py-16 lg:py-20 scroll-mt-24">
      {/* Subtle animated background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(11, 31, 58, 0.1) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="pointer-events-none absolute left-1/3 top-1/4 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <SectionHeading
            eyebrow="Industries / Solutions"
            title="Operational systems tailored by business context"
            description="Representative solution contexts delivered for practical usage."
          />

          {/* Industry badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {industrySlides.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative group"
              >
                <div className={`relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300`}>
                  {/* Top gradient accent */}
                  <motion.div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${industry.color}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />

                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 ${industry.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative">
                    {/* Image */}
                    <motion.div
                      className={`inline-flex rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 mb-3`}
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img src={industry.image} alt={industry.caption} className="h-10 w-10 object-contain" />
                    </motion.div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {industry.caption}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </MotionSection>
  )
}

export default IndustriesCarouselSection
