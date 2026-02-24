import { motion } from 'framer-motion'

function HoverCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(11,31,58,0.05)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default HoverCard
