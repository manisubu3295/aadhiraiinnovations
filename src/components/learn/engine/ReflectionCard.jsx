import { motion } from 'framer-motion'

export default function ReflectionCard({ heading, keyInsights, rememberedPattern }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-lg bg-gradient-to-br from-[#0B1F3A] to-[#173762] p-8 text-white"
    >
      <h3 className="text-2xl font-bold mb-6">{heading}</h3>

      {/* Key Insights */}
      <div className="space-y-3 mb-8">
        {keyInsights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + idx * 0.05 }}
            className="flex gap-3 items-start"
          >
            <span className="text-green-400 font-bold text-lg flex-shrink-0">✓</span>
            <span className="text-base leading-relaxed text-white/90">{insight}</span>
          </motion.div>
        ))}
      </div>

      {/* Remembered Pattern */}
      {rememberedPattern && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 pt-6 border-t border-white/20"
        >
          <p className="text-sm uppercase tracking-widest font-semibold text-white/60 mb-2">
            Pattern to Remember
          </p>
          <p className="text-lg italic leading-relaxed text-white">
            "{rememberedPattern}"
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
