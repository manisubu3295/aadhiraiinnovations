import { useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

/* ─── Geometry ────────────────────────────────────────────────────────── */
const TO_RAD = Math.PI / 180
function polar(r, deg) {
  const a = deg * TO_RAD
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}

/* ─── Layout constants ────────────────────────────────────────────────── */
const C       = 260   // SVG center (viewBox 520×520)
const R_INNER = 112   // inner orbit radius
const R_OUTER = 192   // outer orbit radius

// Slightly non-uniform spacing — avoids perfect mechanical feel
const INNER_BASE  = [0, 86, 174, 261]
const OUTER_BASE  = [18, 78, 138, 198, 258, 318]
const INNER_SIZES = [5.5, 4.5, 5.5, 4.5]
const OUTER_SIZES = [4,   3,   3.5, 4,   3,   3.5]

// Connection definitions
const IO_CONN = [[0, 0], [1, 1], [2, 3], [3, 5]]  // inner → outer
const II_CONN = [[0, 2], [1, 3]]                    // inner → inner (cross)

/* ─── Pre-calculated grid dots ────────────────────────────────────────── */
// Computed once outside component — never re-runs
const GRID_DOTS = (() => {
  const out = []
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const x = 14 + col * 41
      const y = 14 + row * 41
      if (Math.hypot(x - C, y - C) < 230) {
        out.push({ x, y, id: `${row}-${col}` })
      }
    }
  }
  return out
})()

// Tick-mark crosses just outside the inner orbit (at 45° diagonals)
const TICK_MARKS = [45, 135, 225, 315].map(a => polar(R_INNER + 8, a))

/* ─── Initial node positions (before first frame) ────────────────────── */
const INIT_STATE = {
  inner:   INNER_BASE.map(a => polar(R_INNER, a)),
  outer:   OUTER_BASE.map(a => polar(R_OUTER, a)),
  elapsed: 0,
}

/* ═══════════════════════════════════════════════════════════════════════
   HeroIntelligenceAnimation
   ─────────────────────────────────────────────────────────────────────
   Premium SVG animation representing AI, systems architecture, and
   automated intelligence. Designed for dark navy hero sections.

   HOW IT WORKS:
   • useAnimationFrame updates node XY positions every frame (60fps)
     based on elapsed time — no CSS @keyframes, no jitter
   • Inner orbit: 4 nodes, 24-second clockwise revolution
   • Outer orbit: 6 nodes, 40-second counter-clockwise revolution
   • Connection lines (center→inner, inner→outer, inner×inner) oscillate
     opacity sinusoidally — each on independent period/offset so they
     never all peak or dip together
   • 2 data-pulse dots travel along center→inner lines and fade in/out
     at the extremes of their path
   • Framer Motion handles the core pulse ring + rotating tick ring
   • All timing periods are non-harmonic to prevent repeating patterns

   INTEGRATION:
     import HeroIntelligenceAnimation from '@/components/ui/HeroIntelligenceAnimation'
     // Place inside the right column of the hero section grid
     <div className="flex items-center justify-center lg:justify-end">
       <HeroIntelligenceAnimation />
     </div>
═══════════════════════════════════════════════════════════════════════ */
export function HeroIntelligenceAnimation() {
  const t0 = useRef(null)
  const [{ inner, outer, elapsed }, setState] = useState(INIT_STATE)

  useAnimationFrame((ts) => {
    if (t0.current === null) t0.current = ts
    const e = (ts - t0.current) / 1000          // seconds since mount

    const dI =  (e / 24) * 360                   // inner: 24s/rev clockwise
    const dO = -(e / 40) * 360                   // outer: 40s/rev counter-CW

    setState({
      inner:   INNER_BASE.map(a => polar(R_INNER, a + dI)),
      outer:   OUTER_BASE.map(a => polar(R_OUTER, a + dO)),
      elapsed: e,
    })
  })

  /* Sinusoidal opacity oscillator — returns value between lo and hi */
  const osc = (period, offset, lo, hi) => {
    const v = (Math.sin(2 * Math.PI * (elapsed / period + offset)) + 1) / 2
    return lo + v * (hi - lo)
  }

  /* Data pulse: fraction 0→1 along a line, looping at given period */
  const frac = (period, offset) => ((elapsed / period + offset) % 1 + 1) % 1

  /* Pulse dot fades in over first 10% of travel, out over last 20% */
  const pulseAlpha = (f) =>
    f < 0.1 ? (f / 0.1) * 0.6 : f > 0.8 ? ((1 - f) / 0.2) * 0.6 : 0.6

  const p0 = frac(3.2, 0)
  const p1 = frac(4.1, 0.5)

  return (
    <div
      className="relative w-full select-none pointer-events-none"
      style={{ aspectRatio: '1 / 1', maxWidth: 520 }}
    >
      <svg
        viewBox="0 0 520 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          {/* Radial glow behind the entire field */}
          <radialGradient id="igAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(30,58,138,0.24)" />
            <stop offset="60%"  stopColor="rgba(30,58,138,0.08)" />
            <stop offset="100%" stopColor="rgba(30,58,138,0)"    />
          </radialGradient>

          {/* Soft clip so dots don't bleed outside the circle */}
          <clipPath id="igClip">
            <circle cx={C} cy={C} r={230} />
          </clipPath>
        </defs>

        {/* ── Ambient glow field ─────────────────────────────────────── */}
        <circle cx={C} cy={C} r={230} fill="url(#igAmbient)" />

        {/* ── Background grid dots ───────────────────────────────────── */}
        <g clipPath="url(#igClip)">
          {GRID_DOTS.map(d => (
            <circle key={d.id} cx={d.x} cy={d.y} r={0.85}
              fill="white" fillOpacity={0.045}
            />
          ))}
        </g>

        {/* ── Orbit rings ────────────────────────────────────────────── */}
        {/* Mid ring between core and inner orbit */}
        <circle cx={C} cy={C} r={58}
          fill="none" stroke="white" strokeOpacity={0.04} strokeWidth={0.5}
        />
        {/* Inner orbit ring */}
        <circle cx={C} cy={C} r={R_INNER}
          fill="none" stroke="white" strokeOpacity={0.055}
          strokeWidth={0.75} strokeDasharray="3 9"
        />
        {/* Outer orbit ring */}
        <circle cx={C} cy={C} r={R_OUTER}
          fill="none" stroke="white" strokeOpacity={0.038}
          strokeWidth={0.75} strokeDasharray="2 13"
        />

        {/* ── Tick-mark crosses at 45° diagonals ────────────────────── */}
        {TICK_MARKS.map((t, i) => (
          <g key={`tk${i}`}>
            <line x1={t.x - 3.5} y1={t.y} x2={t.x + 3.5} y2={t.y}
              stroke="white" strokeOpacity={0.13} strokeWidth={0.5}
            />
            <line x1={t.x} y1={t.y - 3.5} x2={t.x} y2={t.y + 3.5}
              stroke="white" strokeOpacity={0.13} strokeWidth={0.5}
            />
          </g>
        ))}

        {/* ── Connection lines ───────────────────────────────────────── */}

        {/* Center → each inner node */}
        {inner.map((n, i) => (
          <line key={`ci${i}`}
            x1={C} y1={C} x2={n.x} y2={n.y}
            stroke="white" strokeWidth={0.75}
            strokeOpacity={osc(6.5, i * 0.25, 0.03, 0.15)}
          />
        ))}

        {/* Inner → outer (blue-tinted — represent external data channels) */}
        {IO_CONN.map(([ii, oi], i) => (
          <line key={`io${i}`}
            x1={inner[ii].x} y1={inner[ii].y}
            x2={outer[oi].x} y2={outer[oi].y}
            stroke="#93c5fd" strokeWidth={0.6}
            strokeOpacity={osc(9.5, i * 0.28, 0.02, 0.1)}
          />
        ))}

        {/* Inner → inner (cross-connections between opposite nodes) */}
        {II_CONN.map(([a, b], i) => (
          <line key={`ii${i}`}
            x1={inner[a].x} y1={inner[a].y}
            x2={inner[b].x} y2={inner[b].y}
            stroke="white" strokeWidth={0.5}
            strokeOpacity={osc(12, i * 0.5, 0.02, 0.08)}
          />
        ))}

        {/* ── Data-pulse dots (travel center → inner node) ───────────── */}
        <circle
          cx={C + (inner[0].x - C) * p0}
          cy={C + (inner[0].y - C) * p0}
          r={1.8} fill="white" opacity={pulseAlpha(p0)}
        />
        <circle
          cx={C + (inner[2].x - C) * p1}
          cy={C + (inner[2].y - C) * p1}
          r={1.8} fill="white" opacity={pulseAlpha(p1)}
        />

        {/* ── Outer nodes ────────────────────────────────────────────── */}
        {outer.map((n, i) => (
          <g key={`on${i}`}>
            {/* Outer halo ring */}
            <circle cx={n.x} cy={n.y} r={10}
              fill="none" stroke="white" strokeOpacity={0.04} strokeWidth={0.5}
            />
            {/* Node body */}
            <circle cx={n.x} cy={n.y} r={OUTER_SIZES[i]}
              fill="rgba(255,255,255,0.07)"
              stroke="white" strokeOpacity={0.17} strokeWidth={0.75}
            />
          </g>
        ))}

        {/* ── Inner nodes ────────────────────────────────────────────── */}
        {inner.map((n, i) => (
          <g key={`in${i}`}>
            {/* Outer halo */}
            <circle cx={n.x} cy={n.y} r={INNER_SIZES[i] + 7}
              fill="none" stroke="white" strokeOpacity={0.045} strokeWidth={0.5}
            />
            {/* Activity pulse on nodes 0 and 2 */}
            {i % 2 === 0 && (
              <motion.circle cx={n.x} cy={n.y} r={INNER_SIZES[i] + 2}
                fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={0.5}
                animate={{ r: [INNER_SIZES[i] + 2, INNER_SIZES[i] + 14], opacity: [0.25, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 1.4,
                  repeatDelay: 4.5,
                }}
              />
            )}
            {/* Node body */}
            <circle cx={n.x} cy={n.y} r={INNER_SIZES[i]}
              fill="rgba(255,255,255,0.1)"
              stroke="white" strokeOpacity={0.28} strokeWidth={0.75}
            />
            {/* Node center highlight */}
            <circle cx={n.x} cy={n.y} r={INNER_SIZES[i] * 0.38}
              fill="white" fillOpacity={0.65}
            />
          </g>
        ))}

        {/* ── Central core ───────────────────────────────────────────── */}

        {/* Expanding pulse ring — wave 1 */}
        <motion.circle cx={C} cy={C} r={28}
          fill="none" stroke="rgba(147,197,253,0.2)" strokeWidth={1}
          animate={{ r: [28, 54], opacity: [0.55, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.8 }}
        />
        {/* Expanding pulse ring — wave 2 (delayed) */}
        <motion.circle cx={C} cy={C} r={28}
          fill="none" stroke="rgba(147,197,253,0.12)" strokeWidth={0.75}
          animate={{ r: [28, 54], opacity: [0.4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeOut', delay: 2.25, repeatDelay: 0.8 }}
        />

        {/* Rotating precision tick ring */}
        <motion.circle cx={C} cy={C} r={34}
          fill="none" stroke="white" strokeOpacity={0.1}
          strokeWidth={0.75} strokeDasharray="1.5 5.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${C}px ${C}px` }}
        />

        {/* Core outer ring */}
        <circle cx={C} cy={C} r={22}
          fill="rgba(255,255,255,0.025)"
          stroke="white" strokeOpacity={0.2} strokeWidth={0.75}
        />

        {/* Core inner glow */}
        <circle cx={C} cy={C} r={11} fill="rgba(147,197,253,0.1)" />

        {/* Core bright dot */}
        <circle cx={C} cy={C} r={6.5} fill="white" fillOpacity={0.88} />

        {/* Core specular highlight */}
        <circle cx={C - 1.5} cy={C - 1.5} r={2} fill="white" fillOpacity={0.5} />
      </svg>
    </div>
  )
}

export default HeroIntelligenceAnimation
