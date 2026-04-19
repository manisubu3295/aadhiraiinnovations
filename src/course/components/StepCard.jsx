import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function StepCard({
  step,
  isFirstStep,
  canProceed,
  onNextClick,
  children,
}) {
  return (
    <motion.div
      initial={isFirstStep ? { opacity: 1, y: 0 } : { opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full space-y-8"
    >
      {/* Step badge + heading */}
      <div className="space-y-3">
        <div className="inline-block">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            <span>{step.badge?.split(' ')[0]} {step.badge?.split(' ')[1]}</span>
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-[#0B1F3A]">
          {step.heading}
        </h2>
        {step.subheading && (
          <p className="text-lg text-slate-600">{step.subheading}</p>
        )}
      </div>

      {/* Step content */}
      <div>{children}</div>

      {/* Next button */}
      <div className="pt-4 flex justify-center">
        <motion.button
          whileHover={canProceed ? { scale: 1.05 } : {}}
          whileTap={canProceed ? { scale: 0.95 } : {}}
          onClick={onNextClick}
          disabled={!canProceed}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold 
            transition-all duration-150
            ${
              canProceed
                ? 'bg-[#0B1F3A] text-white hover:bg-[#173762] cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          Next Step
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
