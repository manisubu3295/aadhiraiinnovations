import { motion, AnimatePresence } from 'framer-motion'

export default function StackVisual({ elements = [], label = 'stack' }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const boxVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stack visualization — vertical */}
      <div className="flex flex-col-reverse items-center gap-1">
        <AnimatePresence mode="popLayout">
          {elements.map((value, idx) => (
            <motion.div
              key={`${value}-${idx}`}
              variants={boxVariants}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`w-24 h-14 flex items-center justify-center font-bold text-lg rounded-md border-2 transition-colors ${
                idx === elements.length - 1
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {value}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* "TOP" label */}
        {elements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-wide"
          >
            ↑ TOP
          </motion.div>
        )}
      </div>

      {/* Stack name label */}
      <code className="text-sm font-mono bg-slate-100 px-3 py-1 rounded text-[#0B1F3A]">
        {label} ({elements.length})
      </code>

      {/* Info text */}
      {elements.length === 0 && (
        <p className="text-sm text-slate-500 italic">Stack is empty</p>
      )}
    </motion.div>
  )
}
