import { motion } from 'framer-motion'

function MotionSection({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}

export default MotionSection
