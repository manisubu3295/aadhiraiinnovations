import { motion } from 'framer-motion'
import { ArrowUpRight, Pill, GraduationCap, Users, BarChart3 } from 'lucide-react'
import Container from '../ui/Container'

const solutions = [
  {
    num: '01',
    category: 'Pharmacy',
    icon: Pill,
    accentColor: '#2563eb',
    accentBg: 'rgba(37,99,235,0.09)',
    title: 'Billing, stock, and daily pharmacy work. All in one place.',
    tags: ['GST billing', 'Expiry alerts', 'Offline-first', 'Audit records'],
    href: '/solutions/pharmacy-software',
  },
  {
    num: '02',
    category: 'School',
    icon: GraduationCap,
    accentColor: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.09)',
    title: 'Attendance, fees, and school operations. Simplified.',
    tags: ['Class attendance', 'Fee collection', 'Staff management', 'Principal reports'],
    href: '#contact',
  },
  {
    num: '03',
    category: 'Workforce',
    icon: Users,
    accentColor: '#047857',
    accentBg: 'rgba(4,120,87,0.09)',
    title: 'Staff time, leave, and schedules. Without spreadsheets.',
    tags: ['Biometric attendance', 'Leave approvals', 'Shift scheduling', 'Payroll data'],
    href: '#contact',
  },
  {
    num: '04',
    category: 'Operations',
    icon: BarChart3,
    accentColor: '#b45309',
    accentBg: 'rgba(180,83,9,0.09)',
    title: 'Orders, inventory, and business control. One system.',
    tags: ['Purchase orders', 'Multi-location stock', 'Daily reports', 'Role-based access'],
    href: '/solutions/erp-automation',
  },
]

function WhatWeBuildSection() {
  return (
    <section id="solutions" className="scroll-mt-24 bg-[#f6f3ec] py-20 md:py-24 lg:py-32">
      <Container>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-18 grid lg:grid-cols-2 gap-8 lg:items-end"
        >
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl lg:text-[3.2rem] leading-[1.06]">
            Less confusion.
            <br />
            More control.
          </h2>
          <p className="text-[15.5px] text-[#0B1F3A]/50 leading-[1.75] max-w-[38ch] lg:pb-1">
            Four areas of daily business work — handled completely, not partially.
          </p>
        </motion.div>

        {/* Solution rows */}
        <div className="divide-y divide-[#0B1F3A]/[0.08]">
          {solutions.map((sol, i) => {
            const Icon = sol.icon
            return (
              <motion.a
                key={sol.category}
                href={sol.href}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group relative flex items-start gap-5 md:gap-8 py-10 md:py-12 -mx-4 px-4 rounded-2xl hover:bg-white/55 transition-all duration-300"
              >
                {/* Large decorative number — background layer */}
                <span
                  className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 text-[7rem] font-black text-[#0B1F3A]/[0.05] leading-none select-none pointer-events-none tracking-[-0.05em]"
                  aria-hidden="true"
                >
                  {sol.num}
                </span>

                {/* Industry icon */}
                <div
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl mt-0.5 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: sol.accentBg }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: sol.accentColor }}
                    strokeWidth={1.75}
                  />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Category label */}
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-[0.22em] block mb-3"
                    style={{ color: sol.accentColor }}
                  >
                    {sol.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-[19px] md:text-[23px] lg:text-[25px] font-semibold text-[#0B1F3A] leading-[1.3] tracking-[-0.025em] transition-colors duration-200 group-hover:text-[#1d3a6b] max-w-2xl">
                    {sol.title}
                  </h3>

                  {/* Tag pills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sol.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-[#0B1F3A]/12 bg-white/80 px-3.5 py-1 text-[12px] font-medium text-[#0B1F3A]/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  className="hidden md:block h-5 w-5 flex-none text-[#0B1F3A]/18 group-hover:text-[#0B1F3A]/60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200 mt-1"
                  strokeWidth={1.75}
                />
              </motion.a>
            )
          })}
        </div>

      </Container>
    </section>
  )
}

export default WhatWeBuildSection
