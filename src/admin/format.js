export function formatMoney(value, currency = 'INR') {
  const num = Number(value) || 0
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(num)
  } catch {
    return num.toFixed(2)
  }
}

export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}
