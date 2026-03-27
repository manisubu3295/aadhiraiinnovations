import { motion } from 'framer-motion'
import { PackageCheck, Building2, Workflow, Brain, Shield, MonitorCog, Database, ArrowRight } from 'lucide-react'
import Container from '../ui/Container'

/* ─── Visual diagrams ──────────────────────────────────────────────── */

function BillingFlowDiagram() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-7 md:p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-5">
        System Flow
      </div>
      <div className="flex items-center gap-2 mb-5">
        {[
          { label: 'Scan & Bill', sub: 'AI anomaly detection' },
          { label: 'Stock Control', sub: 'Predictive alerts' },
          { label: 'Compliance', sub: 'Auto audit trail' },
        ].map((step, i, arr) => (
          <div key={step.label} className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm">
              <div className="text-[11px] font-semibold text-[#0B1F3A] leading-tight">{step.label}</div>
              <div className="mt-0.5 text-[10px] text-slate-400 leading-tight">{step.sub}</div>
            </div>
            {i < arr.length - 1 && (
              <div className="text-slate-300 text-xs flex-none">→</div>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['GST-compliant', 'Real-time stock', 'Expiry alerts', 'Audit-ready'].map(tag => (
          <div key={tag} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-[#0B1F3A]/60 text-center">
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}

function AIPipelineDiagram() {
  const nodes = [
    { label: 'Data Ingestion', sub: 'Sales · Stock · Billing events' },
    { label: 'AI Processing', sub: 'Pattern recognition · Forecasting · Decision support', highlight: true },
    { label: 'Intelligence Output', sub: 'Alerts · Insights · Automated decisions' },
  ]
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-7 md:p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/32 mb-5">
        AI Pipeline
      </div>
      <div className="space-y-2 mb-5">
        {nodes.map((node, i, arr) => (
          <div key={node.label}>
            <div className={`rounded-lg border px-4 py-3 ${node.highlight ? 'border-white/18 bg-white/10' : 'border-white/8 bg-white/4'}`}>
              <div className={`text-[11px] font-semibold ${node.highlight ? 'text-white' : 'text-white/58'}`}>
                {node.label}
              </div>
              <div className="text-[10px] text-white/28 mt-0.5">{node.sub}</div>
            </div>
            {i < arr.length - 1 && (
              <div className="flex justify-center py-1 text-white/15 text-[10px]">↓</div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {['40% less stock-outs', 'Auto-insights', 'Adaptive reports', 'AI routing'].map(chip => (
          <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/40">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

function SaaSArchDiagram() {
  const layers = [
    { label: 'Client Interface', tag: 'Multi-tenant UI' },
    { label: 'API & Business Logic', tag: 'REST / WebSockets' },
    { label: 'AI Analytics Engine', tag: 'Intelligence layer', accent: true },
    { label: 'Data Layer', tag: 'Tenant isolation' },
    { label: 'Infrastructure', tag: 'Cloud-optional' },
  ]
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-7 md:p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-5">
        Platform Architecture
      </div>
      <div className="space-y-1.5">
        {layers.map(layer => (
          <div
            key={layer.label}
            className={`flex items-center justify-between rounded-md px-4 py-2.5 border ${
              layer.accent ? 'border-[#0B1F3A]/16 bg-[#0B1F3A]/5' : 'border-slate-200 bg-white'
            }`}
          >
            <span className={`text-[11px] font-semibold ${layer.accent ? 'text-[#0B1F3A]' : 'text-[#0B1F3A]/62'}`}>
              {layer.label}
            </span>
            <span className={`text-[10px] ${layer.accent ? 'text-[#0B1F3A]/42' : 'text-slate-400'}`}>
              {layer.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowDiagram() {
  return (
    <div className="rounded-xl border border-white/8 bg-white/5 p-7 md:p-8">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/32 mb-5">
        AI Workflow Routing
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-col gap-2 flex-1">
          {['Manual entry', 'Form input', 'API event'].map(inp => (
            <div key={inp} className="rounded-md border border-white/8 bg-white/4 px-3 py-2 text-[10px] text-white/38 text-center">
              {inp}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-white/15 text-[10px]">→</div>
          <div className="rounded-lg border border-white/18 bg-white/10 px-3 py-2.5 text-center">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider">AI</div>
            <div className="text-[9px] text-white/28 mt-0.5">Router</div>
          </div>
          <div className="text-white/15 text-[10px]">→</div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {['Auto-approve', 'Flag review', 'Escalate'].map(out => (
            <div key={out} className="rounded-md border border-white/8 bg-white/4 px-3 py-2 text-[10px] text-white/38 text-center">
              {out}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {['60–80% less manual work', 'Full audit trail', 'Zero bottlenecks'].map(chip => (
          <span key={chip} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/36">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Data ─────────────────────────────────────────────────────────── */

const mainSolutions = [
  {
    tag: 'Core Platform',
    title: 'Intelligent Billing & Inventory',
    description: 'End-to-end operational platform with AI anomaly detection, predictive expiry alerts, and compliance-ready transaction management.',
    Visual: BillingFlowDiagram,
    icon: PackageCheck,
    dark: false,
  },
  {
    tag: 'AI Intelligence',
    title: 'AI-Powered Analytics & Forecasting',
    description: 'Embedded AI layer that turns operational data into demand forecasts, anomaly alerts, and adaptive business insights.',
    Visual: AIPipelineDiagram,
    icon: Brain,
    dark: true,
  },
  {
    tag: 'SaaS Platform',
    title: 'Multi-Tenant SaaS Architecture',
    description: 'Scalable, AI-integrated multi-tenant platforms built for thousands of clients with intelligent analytics and subscription management.',
    Visual: SaaSArchDiagram,
    icon: Building2,
    dark: false,
  },
  {
    tag: 'Automation',
    title: 'Workflow Intelligence & Automation',
    description: 'AI-assisted routing that eliminates manual overhead, routes decisions intelligently, and surfaces operational bottlenecks in real time.',
    Visual: WorkflowDiagram,
    icon: Workflow,
    dark: true,
  },
]

const additionalCapabilities = [
  { icon: Shield, title: 'Secure Access Architecture' },
  { icon: MonitorCog, title: 'Hybrid Desktop + Web' },
  { icon: Database, title: 'Cloud-Optional Intelligence' },
]

/* ─── Component ─────────────────────────────────────────────────────── */

function WhatWeBuildSection() {
  return (
    <section id="build" className="scroll-mt-24">
      {/* Section header */}
      <div className="border-t border-slate-100 bg-white py-14 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                What We Build
              </span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl lg:text-5xl leading-[1.15]">
              AI-integrated systems built
              <br />
              for serious operations.
            </h2>
          </motion.div>
        </Container>
      </div>

      {/* Alternating solution blocks */}
      {mainSolutions.map((solution, index) => {
        const { Visual } = solution
        return (
          <motion.div
            key={solution.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className={`border-t py-14 md:py-20 ${
              solution.dark ? 'bg-[#0B1F3A] border-white/5' : 'bg-white border-slate-100'
            }`}
          >
            <Container>
              <div
                className={`grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Text */}
                <div>
                  <div
                    className={`inline-flex items-center mb-5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                      solution.dark ? 'bg-white/8 text-white/50' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {solution.tag}
                  </div>
                  <h3
                    className={`text-2xl font-semibold tracking-tight leading-[1.25] sm:text-3xl ${
                      solution.dark ? 'text-white' : 'text-[#0B1F3A]'
                    }`}
                  >
                    {solution.title}
                  </h3>
                  <p
                    className={`mt-4 text-base leading-relaxed ${
                      solution.dark ? 'text-white/50' : 'text-slate-500'
                    }`}
                  >
                    {solution.description}
                  </p>
                  <a
                    href="#contact"
                    className={`mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors group ${
                      solution.dark ? 'text-white/45 hover:text-white' : 'text-[#0B1F3A]/45 hover:text-[#0B1F3A]'
                    }`}
                  >
                    Discuss this solution
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>

                {/* Visual diagram */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <Visual />
                </motion.div>
              </div>
            </Container>
          </motion.div>
        )
      })}

      {/* Additional capabilities */}
      <div className="border-t border-slate-100 bg-slate-50 py-12 md:py-14">
        <Container>
          <div className="flex flex-wrap items-center gap-8 sm:gap-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 flex-none">
              Also includes
            </span>
            {additionalCapabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex-none rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
                  <cap.icon className="h-4 w-4 text-[#0B1F3A]/65" strokeWidth={1.75} />
                </div>
                <span className="text-sm font-medium text-[#0B1F3A]/70">{cap.title}</span>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

export default WhatWeBuildSection
