import { motion } from 'framer-motion'

export default function ArrayVisual({ elements, highlightIndex, label = 'arr' }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const boxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center gap-6"
    >
      {/* Array boxes */}
      <div className="flex gap-2 items-start">
        {elements.map((value, idx) => (
          <motion.div
            key={idx}
            variants={boxVariants}
            className="flex flex-col items-center"
          >
            {/* Value box */}
            <motion.div
              animate={
                highlightIndex === idx
                  ? {
                      borderColor: '#ea580c',
                      boxShadow: '0 0 0 3px #fed7aa',
                      y: [0, -5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.4, repeat: highlightIndex === idx ? Infinity : 0, repeatDelay: 0.5 }}
              className={`w-16 h-16 flex items-center justify-center font-bold text-lg rounded-md border-2 border-slate-300 bg-white transition-colors ${
                highlightIndex === idx ? 'border-orange-500 bg-orange-50' : 'bg-white'
              }`}
            >
              {value}
            </motion.div>

            {/* Index label */}
            <div className="mt-2 text-sm font-semibold text-slate-600">{idx}</div>
          </motion.div>
        ))}
      </div>

      {/* Array name label */}
      <div className="text-center">
        <code className="text-sm font-mono bg-slate-100 px-3 py-1 rounded text-[#0B1F3A]">
          {label}[{elements.length}]
        </code>
      </div>
    </motion.div>
  )
}
