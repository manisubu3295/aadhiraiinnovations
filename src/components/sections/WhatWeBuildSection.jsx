import { Building2, PackageCheck, Workflow, Shield, MonitorCog, Database } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import BookCardPremium from '../ui/BookCardPremium'

// Premium book theme configurations with distinct colors
const themes = {
  navy: {
    // Cover (front)
    coverGradient: 'bg-gradient-to-br from-[#0B1F3A] via-[#1e3a5f] to-[#0B1F3A]',
    coverBorder: 'border-[#0B1F3A]',
    coverIconBg: 'bg-white/10 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    // Inside page
    bgGradient: 'bg-gradient-to-br from-slate-50 to-white',
    borderColor: 'border-slate-200',
    iconBg: 'bg-[#0B1F3A]/10',
    iconColor: 'text-[#0B1F3A]',
    textColor: 'text-[#0B1F3A]',
    descColor: 'text-slate-600',
    labelColor: 'text-slate-500',
    bulletColor: 'text-[#0B1F3A]/60',
    pattern: 'radial-gradient(circle at 20% 50%, rgba(11, 31, 58, 0.15) 0.5px, transparent 0.5px)',
  },
  indigo: {
    coverGradient: 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800',
    coverBorder: 'border-indigo-700',
    coverIconBg: 'bg-white/15 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    bgGradient: 'bg-gradient-to-br from-indigo-50/50 to-white',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    textColor: 'text-slate-900',
    descColor: 'text-slate-600',
    labelColor: 'text-indigo-600',
    bulletColor: 'text-indigo-500',
    pattern: 'repeating-linear-gradient(90deg, rgba(79, 70, 229, 0.08) 0px, transparent 1px, transparent 16px)',
  },
  teal: {
    coverGradient: 'bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800',
    coverBorder: 'border-teal-700',
    coverIconBg: 'bg-white/15 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    bgGradient: 'bg-gradient-to-br from-teal-50/50 to-white',
    borderColor: 'border-teal-200',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    textColor: 'text-slate-900',
    descColor: 'text-slate-600',
    labelColor: 'text-teal-600',
    bulletColor: 'text-teal-500',
    pattern: 'repeating-linear-gradient(45deg, rgba(13, 148, 136, 0.08) 0px, transparent 0px, transparent 12px, rgba(13, 148, 136, 0.08) 12px)',
  },
  cyan: {
    coverGradient: 'bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800',
    coverBorder: 'border-cyan-700',
    coverIconBg: 'bg-white/15 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    bgGradient: 'bg-gradient-to-br from-cyan-50/50 to-white',
    borderColor: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    textColor: 'text-slate-900',
    descColor: 'text-slate-600',
    labelColor: 'text-cyan-600',
    bulletColor: 'text-cyan-500',
    pattern: 'radial-gradient(circle, rgba(8, 145, 178, 0.08) 0.5px, transparent 0.5px)',
  },
  emerald: {
    coverGradient: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800',
    coverBorder: 'border-emerald-700',
    coverIconBg: 'bg-white/15 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    bgGradient: 'bg-gradient-to-br from-emerald-50/50 to-white',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    textColor: 'text-slate-900',
    descColor: 'text-slate-600',
    labelColor: 'text-emerald-600',
    bulletColor: 'text-emerald-500',
    pattern: 'repeating-linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0px, transparent 1px, transparent 14px)',
  },
  slate: {
    coverGradient: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
    coverBorder: 'border-slate-800',
    coverIconBg: 'bg-white/15 backdrop-blur-sm',
    coverIconColor: 'text-white',
    coverTextColor: 'text-white',
    spineColor: 'bg-white/30',
    
    bgGradient: 'bg-gradient-to-br from-slate-50 to-white',
    borderColor: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    textColor: 'text-slate-900',
    descColor: 'text-slate-600',
    labelColor: 'text-slate-600',
    bulletColor: 'text-slate-500',
    pattern: 'linear-gradient(0deg, rgba(71, 85, 105, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(71, 85, 105, 0.08) 1px, transparent 1px)',
  },
}

const solutions = [
  {
    icon: Building2,
    title: 'Subscription SaaS Platforms',
    description: 'Scalable systems designed for multi-tenant growth and operational control.',
    theme: themes.navy,
    includes: [
      'Multi-tenant architecture with data isolation',
      'Subscription billing and tier management',
    ],
    outcomes: [
      'Scale from 10 to 10,000 customers seamlessly',
      'Predictable recurring revenue streams',
    ],
  },
  {
    icon: PackageCheck,
    title: 'Billing & Inventory Systems',
    description: 'Practical transaction and stock workflows designed for daily reliability.',
    theme: themes.indigo,
    includes: [
      'Real-time stock tracking with expiry alerts',
      'GST/tax handling and batch tracking',
    ],
    outcomes: [
      'Eliminate stock discrepancies',
      'Automated compliance for regulated industries',
    ],
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Process automation that reduces manual handoffs and reporting friction.',
    theme: themes.teal,
    includes: [
      'Visual workflow builder for processes',
      'Automated notifications and approvals',
    ],
    outcomes: [
      'Cut manual data entry by 60-80%',
      'Faster approval cycles, fewer errors',
    ],
  },
  {
    icon: Shield,
    title: 'Secure Access Architecture',
    description: 'Role-aware permissions and secure implementation aligned with enterprise practices.',
    theme: themes.cyan,
    includes: [
      'Role-based access control (RBAC)',
      'Audit logging and encrypted data',
    ],
    outcomes: [
      'Meet regulatory requirements (HIPAA, GDPR)',
      'Build customer trust with visible security',
    ],
  },
  {
    icon: MonitorCog,
    title: 'Hybrid Desktop + Web',
    description: 'Operational desktop experience with web visibility for analytics and oversight.',
    theme: themes.emerald,
    includes: [
      'Desktop app for daily operations (offline)',
      'Web dashboard for analytics and reporting',
    ],
    outcomes: [
      'Operations run without internet dependency',
      'Management gets visibility without disruption',
    ],
  },
  {
    icon: Database,
    title: 'Cloud-Optional Deployments',
    description: 'Offline-first core with optional cloud sync based on business readiness.',
    theme: themes.slate,
    includes: [
      'Core functionality runs fully offline',
      'Optional cloud sync for backup',
    ],
    outcomes: [
      'Zero dependency on constant connectivity',
      'Lower ongoing operational costs',
    ],
  },
]

function WhatWeBuildSection() {
  return (
    <Reveal as="section" id="build" className="py-12 md:py-16 lg:py-20 scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="What We Build"
          title="Enterprise SaaS and business systems designed for real teams"
          description="Solutions built for SMEs, pharmacies, and operations-led organizations."
        />

        <div className="mt-8 md:mt-10 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <BookCardPremium
              key={solution.title}
              {...solution}
              delay={index * 0.15}
            />
          ))}
        </div>
      </Container>
    </Reveal>
  )
}

export default WhatWeBuildSection
