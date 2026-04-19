import { useState } from 'react'
import { motion } from 'framer-motion'
import CodeBlock from '../CodeBlock'

export default function PredictOutputExercise({
  prompt,
  code,
  options,
  expectedAnswer,
  onSubmit,
}) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedOption === null) return
    setSubmitted(true)
    onSubmit(selectedOption)
  }

  const isCorrect = selectedOption === expectedAnswer
  const isAttempted = submitted

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <p className="text-lg font-medium text-[#0B1F3A]">{prompt}</p>

      {/* Code block */}
      <CodeBlock code={code} />

      {/* Options */}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option, idx) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !submitted && setSelectedOption(option)}
            disabled={submitted}
            className={`p-4 rounded-lg font-semibold text-lg border-2 transition-all ${
              selectedOption === option
                ? isAttempted
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-red-500 bg-red-50 text-red-900'
                  : 'border-blue-500 bg-blue-50 text-blue-900'
                : isAttempted && option === expectedAnswer
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
            } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="block text-sm font-semibold mb-1 uppercase tracking-wide text-opacity-70">
              {String.fromCharCode(65 + idx)}
            </span>
            {option}
          </motion.button>
        ))}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full py-3 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer
        </button>
      )}

      {/* Submitted indicator */}
      {submitted && (
        <div className={`text-center py-2 rounded-lg text-sm font-semibold ${
          isCorrect
            ? 'bg-green-100 text-green-900'
            : 'bg-amber-100 text-amber-900'
        }`}>
          {isCorrect ? '✓ Correct!' : '✗ Not quite. Check the feedback below.'}
        </div>
      )}
    </div>
  )
}
