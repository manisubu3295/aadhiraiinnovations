import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CodeBlock from '../CodeBlock'

export default function WorkedSampleBlock({ heading, code, steps, result }) {
  const [currentStep, setCurrentStep] = useState(-1)
  const hasSteps = steps && steps.length > 0
  const showResult = currentStep === steps.length - 1

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h3 className="text-2xl font-bold text-[#0B1F3A] mb-6">{heading}</h3>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code block */}
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">
            Code
          </p>
          <CodeBlock code={code} />
        </div>

        {/* Explanation and navigation */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">
            Step-by-step
          </p>

          {/* Step explanation */}
          <div className="flex-1">
            {currentStep === -1 ? (
              <div className="text-slate-500 italic text-sm leading-relaxed">
                Click "Next Step" to begin walking through the code.
              </div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {hasSteps && (
                  <>
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      Line {steps[currentStep].line}
                    </p>
                    <p className="text-base leading-relaxed text-slate-700">
                      {steps[currentStep].explanation}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Result (shown after all steps) */}
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 border border-green-200 rounded"
            >
              <p className="text-sm font-semibold text-green-900 mb-1">Result:</p>
              <code className="text-sm font-mono text-green-800">{result}</code>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === -1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Step counter */}
          {hasSteps && (
            <p className="text-xs text-slate-400 mt-3">
              {currentStep === -1 ? 'Start' : `Step ${currentStep + 1} of ${steps.length}`}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
