import { motion } from 'framer-motion';
import { Briefcase, ShieldCheck, Zap, Headset, Wrench } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const features = [
  {
    icon: Briefcase,
    title: 'Industry-Focused Solutions',
    description:
      'Software designed specifically for real business workflows such as pharmacies, retail businesses, and SMEs.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-Level Engineering',
    description:
      'Built using modern architecture to ensure reliability, security, and scalability.',
  },
  {
    icon: Zap,
    title: 'Fast Implementation',
    description:
      'Quick onboarding with installation, system setup, and staff training.',
  },
  {
    icon: Headset,
    title: 'Reliable Support',
    description:
      'Continuous support and assistance to ensure smooth business operations.',
  },
  {
    icon: Wrench,
    title: 'Custom Software Development',
    description:
      'Ability to build tailored enterprise software solutions for unique business needs.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading
          title="Why Choose Aadhirai Innovations"
          centered
        />
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.13,
              },
            },
          }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,31,61,0.06)] p-6 flex flex-col items-start transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
              whileHover={{ scale: 1.035, boxShadow: '0 6px 24px rgba(31,168,162,0.10)' }}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              {/* Gradient border glow on hover */}
              <span
                className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
                style={{
                  background: 'linear-gradient(120deg, #1FA8A2 0%, #6EE7B7 50%, #38BDF8 100%)',
                  filter: 'blur(12px)',
                }}
              />
              <div className="relative z-10 w-full">
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-[#F3F7FA] text-[#1FA8A2] group-hover:bg-[#E6F7F6] group-hover:text-[#0F1F3D] transition-colors">
                  <feature.icon className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-semibold text-[#0F1F3D] mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
