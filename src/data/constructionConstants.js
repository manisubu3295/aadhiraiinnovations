// Standard reference values used across the Construction & Real Estate tool batch.
// Widely-cited industry defaults — actual material yield, coverage, and regional unit
// sizes vary by brand/manufacturer/state; every calculator built on this file carries its
// own disclaimer pointing back to that.

// Wet-to-dry volume conversion for concrete/mortar mixes (accounts for voids between dry
// aggregate particles that get filled once water is added) — the standard multiplier used
// throughout Indian civil engineering practice.
export const DRY_VOLUME_FACTOR = 1.54
export const PLASTER_DRY_FACTOR = 1.33 // plaster mixes use a lower factor than structural concrete

export const CEMENT_DENSITY_KG_PER_M3 = 1440
export const CEMENT_BAG_KG = 50
export const CEMENT_BAG_M3 = CEMENT_BAG_KG / CEMENT_DENSITY_KG_PER_M3 // ≈ 0.0347 m³/bag

// Nominal mix ratios (cement : sand : aggregate) by grade — pre-IS-10262-revision ratios,
// still the standard reference for small/residential works.
export const CONCRETE_MIX_RATIOS = [
  { grade: 'M10', ratio: [1, 3, 6] },
  { grade: 'M15', ratio: [1, 2, 4] },
  { grade: 'M20', ratio: [1, 1.5, 3] },
  { grade: 'M25', ratio: [1, 1, 2] },
]

export const MORTAR_RATIOS = ['1:3', '1:4', '1:5', '1:6']

// Standard unit sizes, in metres, brick/block INCLUDING a typical mortar joint.
export const BRICK_SIZE_M = { l: 0.2, w: 0.1, h: 0.1 } // 190x90x90mm brick + 10mm joint
export const AAC_BLOCK_SIZE_M = { l: 0.6, w: 0.2, h: 0.1 } // 600x200x100mm, common size

export const PAINT_COVERAGE_SQFT_PER_LITER = 120 // per coat, emulsion paint, typical
export const WALLPAPER_ROLL_COVERAGE_M2 = 5.3 // standard 0.53m x 10m roll

// Land area units, expressed as a multiplier of 1 square foot. Bigha/kanal/marla/ground/
// guntha vary meaningfully by state — these use the most commonly cited conventions
// (UP/Bihar "pucca" bigha, Punjab/Haryana kanal-marla, Tamil Nadu ground) and are a
// starting reference only; always confirm the local convention for a real transaction.
export const LAND_AREA_UNITS = [
  { key: 'sqft', label: 'Square Feet', toSqft: 1 },
  { key: 'sqyard', label: 'Square Yard', toSqft: 9 },
  { key: 'sqm', label: 'Square Metre', toSqft: 10.7639 },
  { key: 'acre', label: 'Acre', toSqft: 43560 },
  { key: 'hectare', label: 'Hectare', toSqft: 107639 },
  { key: 'cent', label: 'Cent', toSqft: 435.6 },
  { key: 'ground', label: 'Ground (Tamil Nadu)', toSqft: 2400 },
  { key: 'guntha', label: 'Guntha', toSqft: 1089 },
  { key: 'bigha', label: 'Bigha (pucca, UP/Bihar convention)', toSqft: 27225 },
  { key: 'marla', label: 'Marla (Punjab/Haryana convention)', toSqft: 272.25 },
  { key: 'kanal', label: 'Kanal (Punjab/Haryana convention)', toSqft: 5445 },
]

export const CONSTRUCTION_COST_PRESETS = [
  { key: 'basic', label: 'Basic (₹/sqft)', rate: 1500 },
  { key: 'standard', label: 'Standard (₹/sqft)', rate: 2000 },
  { key: 'premium', label: 'Premium (₹/sqft)', rate: 2800 },
]
