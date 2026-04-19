import { motion } from 'framer-motion'

export default function ContextPanel({
  hint,
  keyInsights,
  commonMistake,
  isExercise,
}) {
  return (
    <div className="h-full flex flex-col overflow-y-auto p-4 lg:p-6 space-y-6">
      {/* Hint — shown prominently on exercise steps */}
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-3 rounded-lg ${
            isExercise
              ? 'bg-blue-100 border border-blue-200'
              : 'bg-slate-100 border border-slate-200'
          }`}
        >
          <p className={`text-sm ${isExercise ? 'text-blue-900' : 'text-slate-700'}`}>
            <span className="font-bold">💡 Hint: </span>
            {hint}
          </p>
        </motion.div>
      )}

      {/* Key Insights */}
      {keyInsights && keyInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
            Key Insights
          </h3>
          <ul className="space-y-1.5">
            {keyInsights.map((insight, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
                className="flex gap-2 text-sm text-slate-700"
              >
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Common Mistake */}
      {commonMistake && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-3 bg-amber-100 border border-amber-200 rounded-lg"
        >
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-amber-700 mb-1">
            ⚠ Common Mistake
          </h3>
          <p className="text-sm text-amber-800">{commonMistake}</p>
        </motion.div>
      )}

      {/* Empty state */}
      {!hint && !keyInsights?.length && !commonMistake && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">No hints for this step</p>
        </div>
      )}
    </div>
  )
}
