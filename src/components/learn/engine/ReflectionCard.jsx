import { motion } from 'framer-motion'

export default function ReflectionCard({ heading, keyInsights, rememberedPattern }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl bg-[#0B1F3A] overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-1">
          Lesson Complete
        </p>
        <h3 className="text-xl font-semibold text-white">{heading}</h3>
      </div>

      {/* Insights */}
      <div className="px-8 py-6 space-y-3">
        {keyInsights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.04 + idx * 0.05 }}
            className="flex items-start gap-3"
          >
            <svg
              className="h-4 w-4 flex-shrink-0 mt-[3px] text-emerald-400"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8.5l3.5 3.5 6.5-7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-[14px] leading-[1.65] text-white/80">{insight}</p>
          </motion.div>
        ))}
      </div>

      {/* Pattern footer */}
      {rememberedPattern && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="border-t border-white/10 px-8 py-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2">
            Remember this
          </p>
          <p className="text-sm italic text-white/70 leading-relaxed">
            "{rememberedPattern}"
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
