import { useState } from 'react'
import { motion } from 'framer-motion'
import CodeBlock from '../CodeBlock'

export default function FixTheBugExercise({
  problem,
  code,
  hint,
  expectedFix,
  onSubmit,
}) {
  const [studentCode, setStudentCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleSubmit = () => {
    const isCorrect = studentCode.includes(expectedFix)
    setSubmitted(true)
    setFeedback(isCorrect)
    onSubmit(isCorrect)
  }

  const handleReset = () => {
    setStudentCode('')
    setSubmitted(false)
    setFeedback(null)
  }

  return (
    <div className="space-y-6">
      {/* Problem statement */}
      {problem && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm uppercase tracking-widest font-semibold text-red-600 mb-2">
            Problem
          </p>
          <p className="text-base text-red-900">{problem}</p>
        </motion.div>
      )}

      {/* Buggy code */}
      <div>
        <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3">
          Buggy Code
        </p>
        <CodeBlock code={code} />
      </div>

      {/* Hint */}
      {hint && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
        >
          {showHint ? '✓ Hint shown' : '💡 Show hint'}
        </button>
      )}

      {showHint && hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900"
        >
          {hint}
        </motion.div>
      )}

      {/* Student input */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Your Fix:</p>
        <textarea
          value={studentCode}
          onChange={e => !submitted && setStudentCode(e.target.value)}
          disabled={submitted}
          placeholder="Type the corrected code or the line that fixes the bug..."
          className={`w-full p-4 rounded-lg border-2 font-mono text-sm leading-relaxed resize-none focus:outline-none ${
            submitted
              ? feedback
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500'
          } ${submitted ? 'cursor-not-allowed' : ''}`}
          rows={4}
        />
      </div>

      {/* Submit / Reset buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={studentCode.trim() === ''}
            className="flex-1 py-3 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Check Fix
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-lg bg-slate-300 text-slate-900 font-semibold hover:bg-slate-400 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Feedback */}
      {submitted && feedback !== null && (
        <div
          className={`text-center py-3 rounded-lg text-sm font-semibold ${
            feedback
              ? 'bg-green-100 text-green-900'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {feedback
            ? '✓ Great fix!'
            : `✗ Not quite. Your code should include: "${expectedFix}"`}
        </div>
      )}
    </div>
  )
}
