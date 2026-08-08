import { motion } from 'framer-motion'

/**
 * FloatingBadge — premium glassmorphism trust badge for dark hero sections.
 *
 * Props:
 *  value          — large primary text ("10+", "AI+")
 *  label          — small uppercase label line
 *  glowColor      — CSS color string for the radial halo behind the badge
 *  valueClassName — extra Tailwind classes applied to the value element
 *  floatAmount    — px to travel on y-axis (negative = up, positive = down)
 *  floatDuration  — full float cycle duration in seconds
 *  delay          — seconds to wait before fade-in AND before float loop starts
 *  className      — absolute positioning classes from parent
 *  pulseLabel     — optional short label rendered with a live pulse-dot indicator (e.g. "GST Ready")
 *  children       — optional extra content rendered inside the badge, below pulseLabel if both given
 */
function FloatingBadge({
  value,
  label,
  glowColor     = 'rgba(147, 197, 253, 0.28)',
  valueClassName = '',
  floatAmount    = -10,
  floatDuration  = 8,
  delay          = 0,
  className      = '',
  pulseLabel,
  children,
}) {
  return (
    /* Outer wrapper — handles fade-in entrance only */
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-10 ${className}`}
    >
      {/* Radial glow halo — sits behind the badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-2xl blur-2xl opacity-60"
        style={{ background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)` }}
      />

      {/* Badge card — handles the continuous float */}
      <motion.div
        animate={{ y: [0, floatAmount, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,            // offset each badge so they never sync
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.22, ease: 'easeOut' },
        }}
        className="relative cursor-default select-none rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.38)] backdrop-blur-md"
      >
        {/* Inner highlight — top edge specular */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
        />

        {/* Value */}
        <div
          className={`text-[1.55rem] font-bold leading-none tracking-tight text-white ${valueClassName}`}
        >
          {value}
        </div>

        {/* Label */}
        <div className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-white/35">
          {label}
        </div>

        {/* Optional pulse-dot indicator line */}
        {pulseLabel && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.85)]" />
            <motion.span
              className="h-1.5 w-1.5 flex-none rounded-full bg-blue-400/40"
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              style={{ marginLeft: '-14px' }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-400/60">
              {pulseLabel}
            </span>
          </div>
        )}

        {/* Optional extra content */}
        {children}
      </motion.div>
    </motion.div>
  )
}

export default FloatingBadge
