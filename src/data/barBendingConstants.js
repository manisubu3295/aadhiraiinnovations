// Standard IS 2502-based reference values used across the Indian civil engineering / BBS
// (Bar Bending Schedule) practice. Conventions vary slightly by institution/reference —
// these are the most widely taught defaults, used by BarBendingSchedulePage.jsx.

// Unit weight of a TMT/rebar, per running metre, from its diameter in mm (IS 1786).
export function unitWeightKgPerM(diaMm) {
  return (diaMm * diaMm) / 162
}

// Standard hook length at a bar end (135° hook), expressed as a multiple of diameter.
export const HOOK_LENGTH_MULTIPLIER = 9

// Bend deduction per 90° bend, in multiples of diameter (used for L-bends, U-bends, and
// the corner bends of a rectangular stirrup).
export const BEND_DEDUCTION_90 = 2

// Extra length added for an inclined (cranked) segment vs. its horizontal projection,
// per bend, as a function of the vertical rise `h` and the crank angle θ from horizontal:
// extra = h × (cosec θ − cot θ). Matches the commonly cited 0.42d (45°), 0.27d (30°),
// and 0.58d (60°) constants when h = d.
export function crankExtraLength(heightMm, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return heightMm * (1 / Math.sin(rad) - 1 / Math.tan(rad))
}

export const STANDARD_DIAMETERS = [6, 8, 10, 12, 16, 20, 25, 28, 32, 36, 40]

export const SHAPES = [
  { key: 'straight', label: 'Straight Bar', fields: ['a'] },
  { key: 'lbend', label: 'L-Bend (1 bend, 90°)', fields: ['a', 'b'] },
  { key: 'ubend', label: 'U-Bend / Open Stirrup (2 bends, 90°)', fields: ['a', 'b', 'c'] },
  { key: 'stirrup', label: 'Rectangular Stirrup (closed, with hooks)', fields: ['a', 'b'] },
  { key: 'cranked', label: 'Cranked / Bent-Up Bar', fields: ['a', 'b', 'h', 'angle', 'cranks'] },
]

export function cuttingLengthMm(row) {
  const A = Number(row.a) || 0, B = Number(row.b) || 0, C = Number(row.c) || 0
  const d = Number(row.dia) || 0
  switch (row.shape) {
    case 'straight':
      return A
    case 'lbend':
      return A + B - BEND_DEDUCTION_90 * d
    case 'ubend':
      return A + B + C - 2 * BEND_DEDUCTION_90 * d
    case 'stirrup': {
      const hookLength = HOOK_LENGTH_MULTIPLIER * d
      return 2 * (A + B) + 2 * hookLength - 3 * BEND_DEDUCTION_90 * d
    }
    case 'cranked': {
      const h = Number(row.h) || 0
      const angle = Number(row.angle) || 45
      const cranks = Number(row.cranks) || 1
      return A + B + cranks * crankExtraLength(h, angle)
    }
    default:
      return 0
  }
}
