import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, ShieldCheck, CloudCog, MonitorSmartphone } from 'lucide-react'
import Container from '../ui/Container'
import PatternBackground from '../ui/PatternBackground'
import { itemReveal, staggerContainer } from '../../lib/motion'

const proofItems = [
  { label: 'Offline-first', icon: ShieldCheck },
  { label: 'SaaS-ready', icon: CloudCog },
  { label: 'Hybrid desktop + web', icon: MonitorSmartphone },
]

function HeroSection() {
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="relative overflow-hidden border-b border-slate-100 py-16 text-white md:py-20 lg:py-24">
      {videoFailed ? (
        <div className="absolute inset-0">
          {/* TODO: Replace /public/media/intro-poster.svg with final hero poster image. */}
          <img src="/media/intro-poster.svg" alt="Hero fallback background" className="h-full w-full object-cover" />
        </div>
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/intro-poster.svg"
          onError={() => setVideoFailed(true)}
        >
          {/* TODO: Replace /public/media/hero.mp4 with final hero background video. */}
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[#0B1F3A]/78" />
      <PatternBackground />
      <div className="pointer-events-none absolute -left-24 top-[-180px] h-[360px] w-[360px] rounded-full bg-[#0B1F3A]/30 blur-3xl" />
      <Container className="relative">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.p
            variants={itemReveal}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
          >
            AADHIRAI INNOVATIONS
          </motion.p>

          <motion.h1
            variants={itemReveal}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Enterprise-Grade SaaS & Business Systems Built for Real Operations.
          </motion.h1>

          <motion.p
            variants={itemReveal}
            className="mt-5 md:mt-6 max-w-3xl text-base text-slate-100 sm:text-lg"
          >
            Aadhirai Innovations builds scalable SaaS platforms and hybrid business systems for Tamil Nadu SMEs,
            pharmacies, and growing businesses — engineered with enterprise delivery discipline.
          </motion.p>

          <motion.div
            variants={itemReveal}
            className="mt-6 md:mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-[#0B1F3A] transition-colors hover:bg-slate-100"
            >
              Discuss Your Business
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#build"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Explore Solutions
            </a>
            <a
              href="#video"
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-white"
            >
              <PlayCircle className="h-4 w-4" />
              Scroll to video
            </a>
          </motion.div>

          <motion.ul variants={itemReveal} className="mt-7 md:mt-8 flex flex-wrap gap-3">
            {proofItems.map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur"
              >
                <item.icon className="h-4 w-4 text-white" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  )
}

export default HeroSection
