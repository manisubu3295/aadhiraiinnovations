import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CodeBlock from '../CodeBlock'

export default function FixTheBugExercise({ problem, code, hint, expectedFix, onSubmit }) {
  const [studentCode, setStudentCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const handleSubmit = () => {
    const correct = studentCode.includes(expectedFix)
    setIsCorrect(correct)
    setSubmitted(true)
    onSubmit(correct)
  }

  const handleReset = () => {
    setStudentCode('')
    setSubmitted(false)
    setIsCorrect(null)
  }

  return (
    <div className="space-y-5">
      {/* Problem */}
      {problem && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Problem
          </p>
          <p className="text-[14px] text-slate-700">{problem}</p>
        </div>
      )}

      {/* Buggy code */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Buggy Code
        </p>
        <CodeBlock code={code} />
      </div>

      {/* Hint toggle */}
      {hint && (
        <div>
          <button
            onClick={() => setShowHint(v => !v)}
            className="text-xs font-semibold text-slate-500 hover:text-[#0B1F3A] transition-colors"
          >
            {showHint ? 'Hide hint ↑' : 'Show hint ↓'}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-[13px] text-slate-600">{hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Input */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Your Fix
        </p>
        <textarea
          value={studentCode}
          onChange={e => !submitted && setStudentCode(e.target.value)}
          disabled={submitted}
          placeholder="Write the corrected line or expression..."
          rows={3}
          className={`
            w-full rounded-lg border px-4 py-3 font-mono text-sm leading-relaxed resize-none
            focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 transition-colors
            ${submitted
              ? isCorrect
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-red-300 bg-red-50 text-red-800'
              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
            }
            ${submitted ? 'cursor-default' : ''}
          `}
        />
      </div>

      {/* Actions */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!studentCode.trim()}
          className="w-full py-2.5 rounded-lg bg-[#0B1F3A] text-sm font-semibold text-white hover:bg-[#173762] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Fix
        </button>
      ) : (
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
