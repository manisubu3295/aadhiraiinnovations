import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, MapPin, Layers, Rocket, TrendingUp } from 'lucide-react'
import MotionSection from '../ui/MotionSection'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    icon: Search,
    title: 'Understand',
    description: 'Study operational flow, billing model, reporting needs, and bottlenecks.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    details: ['Stakeholder interviews', 'Process mapping', 'Pain point analysis']
  },
  {
    icon: MapPin,
    title: 'Map',
    description: 'Map current processes and identify inefficiencies before design decisions.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    details: ['Workflow documentation', 'Bottleneck identification', 'Efficiency metrics']
  },
  {
    icon: Layers,
    title: 'Architect',
    description: 'Define system architecture for scale, team readiness, and long-term maintainability.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    details: ['System design', 'Scalability planning', 'Tech stack selection']
  },
  {
    icon: Rocket,
    title: 'Build in Phases',
    description: 'Execute controlled rollouts with documented milestones and release checkpoints.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    details: ['Iterative development', 'Milestone tracking', 'Quality assurance']
  },
  {
    icon: TrendingUp,
    title: 'Support & Improve',
    description: 'Monitor usage patterns, refine workflows, and improve continuously post go-live.',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    details: ['Performance monitoring', 'User feedback loop', 'Continuous optimization']
  },
]

function ResearchApproachSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)
  const shouldReduceMotion = useReducedMotion()

  // Auto-progress through steps
  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  return (
    <MotionSection id="approach" className="relative border-y border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 py-12 md:py-16 lg:py-20 scroll-mt-24 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(11, 31, 58, 0.08) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Research-Driven Delivery"
          title="A proven methodology for complex systems"
          description="Five-phase approach that transforms operational challenges into reliable software solutions."
        />

        <div className="relative mt-10 md:mt-14">
          {/* Desktop: Horizontal timeline */}
          <div className="hidden lg:block">
            {/* Connection line */}
            <div className="relative mb-16">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 rounded-full -translate-y-1/2" />
              
              {/* Animated progress line */}
              <motion.div
                className="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2"
                style={{
                  background: `linear-gradient(to right, ${steps[activeStep]?.color})`
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((activeStep + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              />

              {/* Animated pulse along the line */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)'
                  }}
                  animate={{
                    left: `${((activeStep + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                />
              )}

              {/* Step indicators */}
              <div className="relative flex justify-between items-center">
                {steps.map((step, index) => {
                  const isActive = activeStep >= index
                  const isCurrent = activeStep === index
                  const isHovered = hoveredStep === index
                  
                  return (
                    <motion.button
                      key={step.title}
                      onClick={() => setActiveStep(index)}
                      onMouseEnter={() => setHoveredStep(index)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Icon container */}
                      <motion.div
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive ? step.bgColor : 'bg-slate-100'
                        }`}
                        style={{
                          boxShadow: isCurrent ? '0 10px 40px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                        animate={{
                          rotate: isCurrent ? [0, -5, 5, 0] : 0,
                        }}
                        transition={{
                          rotate: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        {(() => {
                          const StepIcon = step.icon
                          return (
                            <StepIcon 
                              className={`w-7 h-7 transition-colors duration-300 ${
                                isActive ? step.iconColor : 'text-slate-400'
                              }`} 
                              strokeWidth={2.5}
                            />
                          )
                        })()}

                        {/* Pulse ring effect for current step */}
                        {isCurrent && !shouldReduceMotion && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2"
                            style={{ borderColor: steps[activeStep]?.iconColor }}
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Step number */}
                      <motion.div
                        className={`absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                          isActive 
                            ? 'bg-gradient-to-br ' + step.color + ' text-white' 
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        {index + 1}
                      </motion.div>

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl"
                        >
                          {step.title}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Active step content card */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-2xl border-2 ${steps[activeStep].borderColor} bg-white p-8 shadow-xl`}
            >
              {/* Gradient accent */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${steps[activeStep].color}`}
              />

              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${steps[activeStep].bgColor} flex items-center justify-center`}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {(() => {
                      const ActiveIcon = steps[activeStep].icon
                      return <ActiveIcon className={`w-10 h-10 ${steps[activeStep].iconColor}`} strokeWidth={2} />
                    })()}
                  </motion.div>
                </div>

                <div className="flex-1">
                  <motion.h3 
                    className="text-2xl font-bold text-slate-900 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {steps[activeStep].title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-slate-600 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {steps[activeStep].description}
                  </motion.p>

                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {steps[activeStep].details.map((detail, i) => (
                      <motion.span
                        key={detail}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${steps[activeStep].bgColor} ${steps[activeStep].iconColor}`}
                      >
                        {detail}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === index ? 'w-8 bg-gradient-to-r ' + steps[activeStep].color : 'w-2 bg-slate-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mobile/Tablet: Vertical timeline */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => {
              const isActive = activeStep === index
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onViewportEnter={() => setActiveStep(index)}
                  className="relative"
                >
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-slate-200 -mb-6" />
                  )}

                  <div 
                    className={`relative rounded-xl border-2 transition-all duration-300 ${
                      isActive 
                        ? `${step.borderColor} bg-white shadow-lg` 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${step.color}`} />
                    )}

                    <div className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <motion.div
                          className={`flex-shrink-0 w-16 h-16 rounded-xl ${step.bgColor} flex items-center justify-center`}
                          animate={isActive ? { rotate: [0, -5, 5, 0] } : {}}
                          transition={{
                            duration: 2,
                            repeat: isActive ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {(() => {
                            const StepIcon = step.icon
                            return <StepIcon className={`w-7 h-7 ${step.iconColor}`} strokeWidth={2.5} />
                          })()}
                          
                          {/* Step number badge */}
                          <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive 
                              ? 'bg-gradient-to-br ' + step.color + ' text-white shadow-md' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {index + 1}
                          </div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {step.description}
                          </p>

                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="flex flex-wrap gap-2 mt-3"
                            >
                              {step.details.map((detail, i) => (
                                <motion.span
                                  key={detail}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${step.bgColor} ${step.iconColor}`}
                                >
                                  {detail}
                                </motion.span>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Container>
    </MotionSection>
  )
}

export default ResearchApproachSection
