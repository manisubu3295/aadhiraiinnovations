import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CodeBlock from '../CodeBlock'

/**
 * TraceExercise — student traces code execution line by line.
 *
 * Data format:
 * {
 *   prompt: string,
 *   code: string,
 *   steps: [
 *     { line: '1', description: 'n is set to 5', variables: { n: 5 } },
 *     { line: '2', description: 'result = n * ...',  variables: { n: 5, result: '?' } },
 *   ],
 *   blanks: [
 *     { stepIndex: 1, variable: 'result', expectedValue: '120' }
 *   ]
 * }
 */
export default function TraceExercise({ prompt, code, steps, blanks, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState(Object.fromEntries(blanks.map(b => [`${b.stepIndex}-${b.variable}`, ''])))
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState({})

  const activeStep = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1)
  }
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  const handleSubmit = () => {
    const newResults = {}
    let allCorrect = true
    blanks.forEach(b => {
      const key = `${b.stepIndex}-${b.variable}`
      const isCorrect = answers[key].trim() === b.expectedValue
      newResults[key] = isCorrect
      if (!isCorrect) allCorrect = false
    })
    setResults(newResults)
    setSubmitted(true)
    onSubmit(allCorrect)
  }

  const getBlankForStep = (stepIdx, variable) => {
    return blanks.find(b => b.stepIndex === stepIdx && b.variable === variable)
  }

  return (
    <div className="space-y-5">
      {prompt && <p className="text-[15px] text-slate-600">{prompt}</p>}

      {/* Code */}
      <CodeBlock code={code} />

      {/* Step navigator */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Step header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Trace
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Line {activeStep.line}
            </span>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-5 space-y-4"
          >
            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed">{activeStep.description}</p>

            {/* Variable table */}
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-2 border-b border-slate-100">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                  Variable
                </div>
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                  Value
                </div>
              </div>
              {Object.entries(activeStep.variables).map(([varName, value]) => {
                const blank = getBlankForStep(currentStep, varName)
                const key = `${currentStep}-${varName}`

                return (
                  <div key={varName} className="grid grid-cols-2 border-b border-slate-50 last:border-0">
                    <div className="px-4 py-3 font-mono text-sm text-[#0B1F3A] font-semibold">
                      {varName}
                    </div>
                    <div className="px-4 py-2.5">
                      {blank ? (
                        <input
                          type="text"
                          value={answers[key]}
                          onChange={e => !submitted && setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                          disabled={submitted}
                          placeholder="?"
                          className={`
                            w-24 px-2.5 py-1 rounded border font-mono text-sm text-center
                            focus:outline-none transition-colors
                            ${submitted
                              ? results[key]
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                : 'border-red-400 bg-red-50 text-red-800'
                              : 'border-slate-300 bg-white focus:border-[#0B1F3A]/40'
                            }
                          `}
                        />
                      ) : (
                        <span className={`font-mono text-sm ${value === '...' ? 'text-slate-400 italic' : 'text-slate-700'}`}>
                          {value === '...' ? 'not yet set' : String(value)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step navigation */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-[#0B1F3A] text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>

          {/* Progress dots */}
          <div className="flex gap-1 ml-auto">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === currentStep ? 'bg-[#0B1F3A]' : i < currentStep ? 'bg-slate-400' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg bg-[#0B1F3A] text-sm font-semibold text-white hover:bg-[#173762] transition-colors"
        >
          Check Trace
        </button>
      ) : (
        <div className={`text-center text-xs font-semibold py-2 rounded-lg ${
          Object.values(results).every(Boolean) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {Object.values(results).every(Boolean)
            ? 'All values correct — you traced it perfectly'
            : 'Some values were off — review the steps above'}
        </div>
      )}
    </div>
  )
}
