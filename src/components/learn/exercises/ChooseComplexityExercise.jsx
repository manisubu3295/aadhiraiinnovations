import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ChooseComplexityExercise({
  scenario,
  question,
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

  return (
    <div className="space-y-6">
      {/* Scenario */}
      {scenario && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-slate-100 rounded-lg border border-slate-200"
        >
          <p className="text-sm uppercase tracking-widest font-semibold text-slate-600 mb-2">
            Scenario
          </p>
          <p className="text-base text-slate-900">{scenario}</p>
        </motion.div>
      )}

      {/* Question */}
      <p className="text-lg font-semibold text-[#0B1F3A]">{question}</p>

      {/* Options as pill buttons */}
      <div className="flex flex-wrap gap-3">
        {options.map(option => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !submitted && setSelectedOption(option)}
            disabled={submitted}
            className={`px-6 py-3 rounded-full font-bold text-lg border-2 transition-all ${
              selectedOption === option
                ? submitted
                  ? isCorrect
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-red-500 bg-red-500 text-white'
                  : 'border-blue-500 bg-blue-500 text-white'
                : submitted && option === expectedAnswer
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
            } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
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

      {/* Result indicator */}
      {submitted && (
        <div
          className={`text-center py-3 rounded-lg text-sm font-semibold ${
            isCorrect
              ? 'bg-green-100 text-green-900'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {isCorrect ? '✓ Correct!' : '✗ Not quite. Check the feedback below.'}
        </div>
      )}
    </div>
  )
}
