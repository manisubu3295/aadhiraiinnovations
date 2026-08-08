// Shared INR currency formatter — used across the tax simulator's tabs (Income Tax,
// Capital Gains, HRA, Advance Tax), which unlike other one-off tool pages are siblings
// that all need the exact same formatting.
export function formatINR(value, { maximumFractionDigits = 0 } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return '₹ 0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value)
}
