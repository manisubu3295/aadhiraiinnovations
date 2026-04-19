import { motion } from 'framer-motion'

export default function ConceptBlock({ heading, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3 mb-4">
        <span className="text-3xl flex-shrink-0">💡</span>
        <h3 className="text-2xl font-bold text-[#0B1F3A]">{heading}</h3>
      </div>

      {/* Body with basic markdown-like formatting */}
      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4">
        {body.split('\n\n').map((para, idx) => (
          <p key={idx} className="text-base leading-relaxed whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
