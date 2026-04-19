import { motion } from 'framer-motion'

export default function ConceptBlock({ heading, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative pl-5"
    >
      {/* Left accent rule */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#0B1F3A] rounded-full" />

      <h3 className="text-xl font-semibold tracking-tight text-[#0B1F3A] mb-3">
        {heading}
      </h3>

      <div className="space-y-3 text-[15px] leading-[1.75] text-slate-600">
        {body.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </motion.div>
  )
}
