import { motion } from 'framer-motion'
import { sectionReveal } from '../../lib/motion'

function Reveal({ as = 'div', children, className = '', variants, delay = 0, ...props }) {
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      variants={variants || sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
