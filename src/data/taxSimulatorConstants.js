// Reference tax rules for FY 2025-26 (AY 2026-27), covering the new-regime slabs from
// Budget 2025 and the capital-gains rules from Budget (July) 2024. These are standard
// reference figures — like TDS_SECTIONS in TdsCalculatorPage.jsx, they change with every
// year's Finance Act, so this file (and every calculator built on it) is a starting point,
// not a substitute for verifying current rates on the Income Tax e-filing portal or with a CA.

// ── New tax regime (default regime since FY 2023-24) ──────────────────────────────────
export const NEW_REGIME = {
  slabs: [
    { upTo: 400000, rate: 0 },
    { upTo: 800000, rate: 5 },
    { upTo: 1200000, rate: 10 },
    { upTo: 1600000, rate: 15 },
    { upTo: 2000000, rate: 20 },
    { upTo: 2400000, rate: 25 },
    { upTo: Infinity, rate: 30 },
  ],
  standardDeduction: 75000,
  rebate87A: { thresholdTaxableIncome: 1200000, maxRebate: 60000 }, // full rebate → nil tax up to ₹12L taxable income, with marginal relief above it
  // NPS employer contribution (80CCD(2)) is the only major deduction still allowed under the new regime
  employerNpsCapPercentOfSalary: 14,
}

// ── Old tax regime (optional, deduction-heavy) ─────────────────────────────────────────
export const OLD_REGIME = {
  slabs: [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 5 },
    { upTo: 1000000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ],
  slabsSeniorCitizen: [ // 60-79 years
    { upTo: 300000, rate: 0 },
    { upTo: 500000, rate: 5 },
    { upTo: 1000000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ],
  slabsSuperSeniorCitizen: [ // 80+ years
    { upTo: 500000, rate: 0 },
    { upTo: 1000000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ],
  standardDeduction: 50000,
  rebate87A: { thresholdTaxableIncome: 500000, maxRebate: 12500 },
}

// ── Old-regime deduction caps ───────────────────────────────────────────────────────────
export const DEDUCTION_CAPS = {
  section80C: 150000,           // ELSS, PPF, LIC, principal repayment, etc.
  section80D_self: 25000,       // self/family health insurance (< 60 yrs)
  section80D_selfSenior: 50000, // self/family, self is senior citizen
  section80D_parents: 25000,    // parents' health insurance (< 60 yrs)
  section80D_parentsSenior: 50000,
  section80CCD1B: 50000,        // additional NPS (self-contribution)
  section24b: 200000,           // home loan interest, self-occupied property
  section80TTA: 10000,          // savings account interest, non-senior
  section80TTB: 50000,          // interest income, senior citizen (replaces 80TTA)
  // 80E (education loan interest) and 80G (donations) have no fixed cap — entered directly
}

// ── Surcharge (applies to both regimes on tax before cess; new regime caps at 25%) ─────
export const SURCHARGE_SLABS = [
  { above: 5000000, upTo: 10000000, rate: 10 },
  { above: 10000000, upTo: 20000000, rate: 15 },
  { above: 20000000, upTo: 50000000, rate: 25 },
  { above: 50000000, upTo: Infinity, rate: 37, newRegimeCapRate: 25 }, // new regime caps surcharge at 25% even above ₹5cr
]
export const CESS_RATE = 4 // Health & Education Cess, on (tax + surcharge)

// ── Capital gains (post Budget 2024: unified 12/24-month holding periods) ──────────────
export const CAPITAL_GAINS = {
  equity: {
    holdingMonthsForLongTerm: 12,
    stcgRate: 20,
    ltcgRate: 12.5,
    ltcgExemption: 125000, // per financial year
  },
  other: { // property, gold, debt mutual funds (post 1 Apr 2023), unlisted shares, etc.
    holdingMonthsForLongTerm: 24,
    ltcgRate: 12.5, // flat, without indexation — STCG is taxed at the individual's slab rate
  },
}

// ── HRA exemption ────────────────────────────────────────────────────────────────────────
export const HRA = {
  metroPercentOfBasic: 50,
  nonMetroPercentOfBasic: 40,
}

// ── Advance tax installment schedule ────────────────────────────────────────────────────
export const ADVANCE_TAX_SCHEDULE = [
  { label: 'On or before 15 June', cumulativePercent: 15 },
  { label: 'On or before 15 September', cumulativePercent: 45 },
  { label: 'On or before 15 December', cumulativePercent: 75 },
  { label: 'On or before 15 March', cumulativePercent: 100 },
]

// ── Shared slab-tax calculator ──────────────────────────────────────────────────────────
export function taxFromSlabs(taxableIncome, slabs) {
  if (taxableIncome <= 0) return 0
  let tax = 0
  let lastCap = 0
  for (const slab of slabs) {
    if (taxableIncome <= lastCap) break
    const slabAmount = Math.min(taxableIncome, slab.upTo) - lastCap
    tax += slabAmount * (slab.rate / 100)
    lastCap = slab.upTo
  }
  return tax
}

// ── Surcharge + marginal relief ─────────────────────────────────────────────────────────
export function surchargeFor(taxableIncome, baseTax, isNewRegime) {
  const slab = SURCHARGE_SLABS.find((s) => taxableIncome > s.above && taxableIncome <= s.upTo)
  if (!slab) return 0
  const rate = isNewRegime && slab.newRegimeCapRate !== undefined ? slab.newRegimeCapRate : slab.rate
  const rawSurcharge = baseTax * (rate / 100)

  // Marginal relief: total tax+surcharge can never exceed (tax+surcharge at the threshold)
  // plus the income that crossed the threshold — prevents a ₹1 income increase from causing
  // a jump in tax larger than that ₹1.
  const taxAtThreshold = taxFromSlabs(slab.above, isNewRegime ? NEW_REGIME.slabs : OLD_REGIME.slabs)
  const incomeOverThreshold = taxableIncome - slab.above
  const maxTaxPlusSurcharge = taxAtThreshold + incomeOverThreshold
  if (baseTax + rawSurcharge > maxTaxPlusSurcharge) {
    return Math.max(0, maxTaxPlusSurcharge - baseTax)
  }
  return rawSurcharge
}

// ── Section 87A rebate, with marginal relief above the threshold ───────────────────────
// At exactly `thresholdTaxableIncome`, slab tax equals `maxRebate` by construction (₹60,000
// at ₹12L under the new regime, ₹12,500 at ₹5L under the old regime) — so above the
// threshold, tax payable is capped at (taxable income − threshold), never more than the
// income that crossed the line.
export function applyRebate87A(taxableIncome, baseTax, rebateConfig) {
  const { thresholdTaxableIncome, maxRebate } = rebateConfig
  if (taxableIncome <= thresholdTaxableIncome) {
    const rebate = Math.min(baseTax, maxRebate)
    return { rebate, taxAfterRebate: Math.max(0, baseTax - rebate) }
  }
  const excessIncome = taxableIncome - thresholdTaxableIncome
  if (baseTax > excessIncome) {
    return { rebate: baseTax - excessIncome, taxAfterRebate: excessIncome }
  }
  return { rebate: 0, taxAfterRebate: baseTax }
}

export function formatMonths(months) {
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (remMonths || !years) parts.push(`${remMonths} mo${remMonths !== 1 ? 's' : ''}`)
  return parts.join(' ')
}
