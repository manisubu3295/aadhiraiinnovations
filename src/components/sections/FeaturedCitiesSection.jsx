import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Container from '../ui/Container'

function FeaturedCitiesSection() {
  const featuredCities = [
    {
      name: 'Salem',
      slug: 'salem',
      description: 'Pharmacy billing software for Salem\'s 50+ pharmacies using Medora+',
    },
    {
      name: 'Trichy',
      slug: 'trichy',
      description: 'Multi-location pharmacy management across Tiruchirappalli',
    },
    {
      name: 'Vellore',
      slug: 'vellore',
      description: 'Medical hub pharmacy operations and billing',
    },
    {
      name: 'Tirunelveli',
      slug: 'tirunelveli',
      description: 'South Tamil Nadu pharmacy software solutions',
    },
    {
      name: 'Erode',
      slug: 'erode',
      description: 'Industrial city pharmacy management and billing',
    },
  ]

  return (
    <section className="bg-slate-50 border-y border-slate-100 py-16 md:py-20 lg:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-[#0B1F3A]" strokeWidth={1.75} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]/60">
              Pharmacy Software by City
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2]">
            Medora+ serving pharmacies across Tamil Nadu.
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl">
            Medora+ is built for and used by pharmacies in major cities across Tamil Nadu.
            Explore how pharmacy billing software works in your city.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featuredCities.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={`/pharmacy-billing-software/${city.slug}`}
                className="group block h-full rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-[#0B1F3A] group-hover:text-[#0B1F3A]/70 transition-colors">
                    {city.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[#0B1F3A]/30 group-hover:text-[#0B1F3A]/60 transition-all group-hover:translate-x-0.5" strokeWidth={1.75} />
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  {city.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-500 mb-4">
            Medora+ serves 15+ cities across Tamil Nadu
          </p>
          <Link
            to="/pharmacy-billing-software/salem"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70 transition-colors"
          >
            View all cities
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

export default FeaturedCitiesSection
