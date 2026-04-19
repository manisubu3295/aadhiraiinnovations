import { motion } from 'framer-motion'

export default function FeedbackCard({ variant = 'correct', title, hint, body, reinforcement, suggestion, misconception, onDismiss }) {
  const isCorrect = variant === 'correct'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border-l-4 p-6 ${
        isCorrect
          ? 'border-l-green-500 bg-green-50'
          : 'border-l-amber-500 bg-amber-50'
      }`}
    >
      {/* Title */}
      <h4 className={`text-lg font-semibold mb-2 ${isCorrect ? 'text-green-900' : 'text-amber-900'}`}>
        {title}
      </h4>

      {/* Hint (wrong answers only) */}
      {hint && (
        <p className="text-sm italic text-amber-700 mb-3 font-medium">
          💡 {hint}
        </p>
      )}

      {/* Main feedback body */}
      <p className={`text-base leading-relaxed mb-4 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
        {body}
      </p>

      {/* Reinforcement (correct answers) */}
      {reinforcement && (
        <div className="mt-4 p-3 bg-green-100 rounded border border-green-200">
          <p className="text-sm text-green-900">
            <span className="font-semibold">Key insight:</span> {reinforcement}
          </p>
        </div>
      )}

      {/* Misconception (wrong answers) */}
      {misconception && (
        <div className="mt-4 p-3 bg-amber-100 rounded border border-amber-200">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Common thinking:</span> {misconception}
          </p>
        </div>
      )}

      {/* Suggestion (correct answers) */}
      {suggestion && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Bonus:</span> {suggestion}
          </p>
        </div>
      )}

      {/* Dismiss button */}
      {onDismiss && (
        <div className="mt-4">
          <button
            onClick={onDismiss}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
              isCorrect
                ? 'bg-green-200 text-green-900 hover:bg-green-300'
                : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
            }`}
          >
            Continue →
          </button>
        </div>
      )}
    </motion.div>
  )
}
