import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CodeBlock from '../CodeBlock'

export default function WorkedSampleBlock({ heading, code, steps, result }) {
  const [currentStep, setCurrentStep] = useState(-1)

  const hasSteps = steps?.length > 0
  const atEnd = currentStep === steps.length - 1

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1)
  }
  const handlePrev = () => {
    if (currentStep > -1) setCurrentStep(s => s - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Header bar */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#0B1F3A]">{heading}</h3>
        {hasSteps && (
          <span className="text-xs font-medium text-slate-400 tabular-nums">
            {currentStep === -1 ? `${steps.length} steps` : `Step ${currentStep + 1} of ${steps.length}`}
          </span>
        )}
      </div>

      {/* Body: code left, explanation right */}
      <div className="grid lg:grid-cols-2">
        {/* Code */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-100 p-6">
          <CodeBlock code={code} />
        </div>

        {/* Steps panel */}
        <div className="p-6 flex flex-col min-h-[200px]">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentStep === -1 ? (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] text-slate-400 italic"
                >
                  Click Next Step to walk through the code.
                </motion.p>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Line {steps[currentStep].line}
                  </p>
                  <p className="text-[15px] leading-[1.7] text-slate-700">
                    {steps[currentStep].explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result */}
          <AnimatePresence>
            {atEnd && result && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Output
                </span>
                <code className="text-sm font-mono text-[#0B1F3A]">{result}</code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={handlePrev}
              disabled={currentStep === -1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={atEnd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
