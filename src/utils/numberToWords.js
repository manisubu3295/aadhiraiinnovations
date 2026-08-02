const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return ones ? `${TENS[tens]} ${ONES[ones]}` : TENS[tens]
}

function threeDigitsToWords(n) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  const parts = []
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`)
  if (rest) parts.push(twoDigitsToWords(rest))
  return parts.join(' ')
}

/** Converts a non-negative integer into words using the Indian numbering system (Lakh/Crore). */
export function integerToIndianWords(value) {
  const n = Math.trunc(value)
  if (n === 0) return 'Zero'

  const crore = Math.floor(n / 1e7)
  const lakh = Math.floor((n % 1e7) / 1e5)
  const thousand = Math.floor((n % 1e5) / 1e3)
  const hundred = n % 1e3

  const parts = []
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`)
  if (lakh) parts.push(`${threeDigitsToWords(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigitsToWords(thousand)} Thousand`)
  if (hundred) parts.push(threeDigitsToWords(hundred))

  return parts.join(' ')
}

/** Converts a ₹ amount (rupees + paise) into the words used on invoices/cheques, e.g. "Rupees One Lakh Twenty Three Thousand Only". */
export function amountToIndianWords(amount) {
  const rupees = Math.trunc(Math.abs(amount))
  const paise = Math.round((Math.abs(amount) - rupees) * 100)

  let words = `Rupees ${integerToIndianWords(rupees)}`
  if (paise > 0) words += ` and ${twoDigitsToWords(paise)} Paise`
  words += ' Only'

  return words
}
