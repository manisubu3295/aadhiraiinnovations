import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FillInCodeExercise({
  prompt,
  codeTemplate,
  blanks,
  hint,
  onSubmit,
}) {
  const [blankValues, setBlankValues] = useState(
    Object.fromEntries(blanks.map(b => [b.id, '']))
  )
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleChange = (blankId, value) => {
    setBlankValues(prev => ({ ...prev, [blankId]: value }))
  }

  const handleSubmit = () => {
    const allCorrect = blanks.every(
      blank => blankValues[blank.id].trim() === blank.expectedValue
    )

    setSubmitted(true)
    setFeedback(allCorrect)
    onSubmit(allCorrect)
  }

  const handleReset = () => {
    setBlankValues(Object.fromEntries(blanks.map(b => [b.id, ''])))
    setSubmitted(false)
    setFeedback(null)
  }

  // Render code template with input blanks
  const renderCode = () => {
    let result = codeTemplate
    blanks.forEach(blank => {
      const inputId = `blank-${blank.id}`
      const inputValue = blankValues[blank.id]
      const isCorrect = submitted && inputValue.trim() === blank.expectedValue

      result = result.replace(
        '___',
        `<input
          type="text"
          id="${inputId}"
          value="${inputValue}"
          onChange={(e) => window.__handleBlankChange('${blank.id}', e.target.value)}
          placeholder="___"
          class="px-2 py-1 border-b-2 ${
            submitted
              ? isCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
              : 'border-slate-300 focus:border-blue-500'
          } font-mono text-sm focus:outline-none ${submitted ? 'cursor-not-allowed' : ''}"
          disabled="${submitted}"
        />`
      )
    })
    return result
  }

  // Inject handler into window for the rendered code
  window.__handleBlankChange = handleChange

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <p className="text-lg font-medium text-[#0B1F3A]">{prompt}</p>

      {/* Code template with blanks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto"
      >
        {codeTemplate.split('\n').map((line, idx) => {
          let renderedLine = line
          let hasBlank = false

          blanks.forEach(blank => {
            if (line.includes('___')) {
              hasBlank = true
              const blankId = blank.id
              const value = blankValues[blankId]
              const isCorrect = submitted && value.trim() === blank.expectedValue

              renderedLine = renderedLine.replace(
                '___',
                <input
                  key={blankId}
                  type="text"
                  value={value}
                  onChange={e => handleChange(blankId, e.target.value)}
                  onBlur={e => handleChange(blankId, e.target.value.trim())}
                  placeholder="___"
                  disabled={submitted}
                  className={`px-2 py-1 border-b-2 font-mono text-sm bg-slate-800 text-slate-100 focus:outline-none w-16 ${
                    submitted
                      ? isCorrect
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-slate-500 focus:border-blue-400'
                  }`}
                />
              )
            }
          })

          return (
            <div key={idx} className="flex">
              <span className="text-slate-500 mr-4 select-none w-8">{idx + 1}</span>
              <span>{renderedLine}</span>
            </div>
          )
        })}
      </motion.div>

      {/* Simpler code display version */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto">
        {codeTemplate.split('\n').map((line, idx) => {
          let displayLine = line
          blanks.forEach(blank => {
            displayLine = displayLine.replace('___', `[${blank.id}]`)
          })
          return (
            <div key={idx}>
              <span className="text-slate-500">{idx + 1}</span> {displayLine}
            </div>
          )
        })}
      </div>

      {/* Input fields for each blank */}
      <div className="space-y-3">
        {blanks.map(blank => (
          <motion.div
            key={blank.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <label className="text-sm font-semibold text-slate-700 w-20">
              Blank {blank.id}:
            </label>
            <input
              type="text"
              value={blankValues[blank.id]}
              onChange={e => !submitted && handleChange(blank.id, e.target.value)}
              disabled={submitted}
              placeholder="Type answer..."
              className={`flex-1 px-4 py-2 rounded-lg border-2 font-mono text-sm transition-colors ${
                submitted
                  ? blankValues[blank.id].trim() === blank.expectedValue
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:outline-none'
              } ${submitted ? 'cursor-not-allowed' : ''}`}
            />
          </motion.div>
        ))}
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

      {/* Submit / Reset buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg bg-[#0B1F3A] text-white font-semibold hover:bg-[#173762] transition-colors"
          >
            Check Answer
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
          className={`text-center py-2 rounded-lg text-sm font-semibold ${
            feedback
              ? 'bg-green-100 text-green-900'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {feedback ? '✓ All correct!' : '✗ Check your answers above.'}
        </div>
      )}
    </div>
  )
}
