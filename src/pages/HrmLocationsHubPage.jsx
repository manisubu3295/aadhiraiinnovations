import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MapPin, ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container'
import { states } from '../data/hrmLocationSlugs.js'

function HrmLocationsHubPage() {
  const totalDistricts = states.reduce((sum, s) => sum + s.districts.length, 0)

  return (
    <article className="bg-white">
      <Helmet>
        <title>HRM Software Across India — All States &amp; Districts | Aadhirai Innovations</title>
        <meta
          name="description"
          content={`HR & Inventory HRM software availability across ${states.length} Indian states/UTs and ${totalDistricts} districts. Employee records, attendance, payroll, and inventory in one system.`}
        />
        <link rel="canonical" href="https://aadhiraiinnovations.com/hrm-software" />
      </Helmet>

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white py-16 md:py-20 lg:py-24">
        <Container className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>All of India</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl leading-[1.1]">
              HRM Software Across India
            </h1>
            <p className="mb-6 max-w-2xl text-xl text-slate-600">
              HR &amp; Inventory availability across {states.length} states/UTs and {totalDistricts} districts.
            </p>
            <p className="max-w-2xl text-[16px] text-slate-700 leading-[1.8]">
              Employee records, leave and attendance, payroll data, and real-time inventory — one system for
              growing Indian businesses, wherever your team is located. Browse your state below to find HRM
              software details for your specific district.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((s, i) => (
              <motion.div
                key={s.stateSlug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.4 }}
              >
                <Link
                  to={`/hrm-software/state/${s.stateSlug}`}
                  className="group flex h-full items-center justify-between rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div>
                    <h2 className="text-sm font-semibold text-[#0B1F3A] group-hover:text-[#0B1F3A]/70 transition-colors">
                      {s.state}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">{s.districts.length} districts</p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-none text-[#0B1F3A]/30 group-hover:text-[#0B1F3A]/60 transition-all group-hover:translate-x-0.5" strokeWidth={1.75} />
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </article>
  )
}

export default HrmLocationsHubPage
