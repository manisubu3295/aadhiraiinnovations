import { motion } from 'framer-motion'
import ArrayVisual from '../visuals/ArrayVisual'
import StackVisual from '../visuals/StackVisual'
import PointerVisual from '../visuals/PointerVisual'

const visualComponents = { ArrayVisual, StackVisual, PointerVisual }

export default function VisualBlock({ component, props = {}, caption }) {
  const Component = visualComponents[component]

  if (!Component) {
    return (
      <div className="text-xs font-mono text-red-400">
        Visual "{component}" not found
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden"
    >
      {/* Visual area */}
      <div className="flex justify-center items-center px-8 py-10">
        <Component {...props} />
      </div>

      {/* Caption */}
      {caption && (
        <div className="border-t border-slate-100 px-8 py-3">
          <p className="text-center text-xs text-slate-400 leading-relaxed">{caption}</p>
        </div>
      )}
    </motion.div>
  )
}
