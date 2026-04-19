import { motion } from 'framer-motion'

export default function PointerVisual({ nodes = [], label = 'list' }) {
  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  }

  const arrowVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: (i) => ({
      opacity: 1,
      scaleX: 1,
      transition: { delay: i * 0.1 + 0.15, duration: 0.3, originX: 0 },
    }),
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Linked list chain */}
      <div className="flex items-center gap-0 flex-wrap justify-center">
        {nodes.map((node, idx) => (
          <div key={node.id || idx} className="flex items-center">
            {/* Node */}
            <motion.div
              custom={idx}
              variants={nodeVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              {/* Node box */}
              <div className="w-16 h-16 flex items-center justify-center font-bold text-lg rounded-md border-2 border-slate-400 bg-white shadow-sm">
                {node.value}
              </div>

              {/* Optional label under node */}
              {node.label && (
                <div className="mt-1 text-xs font-semibold text-slate-500">{node.label}</div>
              )}
            </motion.div>

            {/* Arrow to next node or null terminal */}
            {idx < nodes.length || (idx === nodes.length - 1) ? (
              <motion.svg
                custom={idx}
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
                width="40"
                height="2"
                viewBox="0 0 40 2"
                className="mx-1"
              >
                <line x1="0" y1="1" x2="35" y2="1" stroke="#64748b" strokeWidth="2" />
                <polygon points="38,1 33,0 33,2" fill="#64748b" />
              </motion.svg>
            ) : null}
          </div>
        ))}

        {/* Null terminal */}
        <motion.div
          custom={nodes.length}
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          className="text-sm font-semibold text-slate-500"
        >
          null
        </motion.div>
      </div>

      {/* List name label */}
      <code className="text-sm font-mono bg-slate-100 px-3 py-1 rounded text-[#0B1F3A]">
        {label} ({nodes.length})
      </code>
    </motion.div>
  )
}
