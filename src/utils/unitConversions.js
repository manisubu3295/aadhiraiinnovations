/* Conversion factors are all relative to a base unit per category (meter, kilogram, litre, sq. meter).
   Temperature can't use a flat factor (different zero points), so it's handled separately below. */

export const UNIT_CATEGORIES = {
  length: {
    label: 'Length',
    baseUnit: 'm',
    units: {
      mm: { label: 'Millimeters (mm)', toBase: 0.001 },
      cm: { label: 'Centimeters (cm)', toBase: 0.01 },
      m: { label: 'Meters (m)', toBase: 1 },
      km: { label: 'Kilometers (km)', toBase: 1000 },
      in: { label: 'Inches (in)', toBase: 0.0254 },
      ft: { label: 'Feet (ft)', toBase: 0.3048 },
      yd: { label: 'Yards (yd)', toBase: 0.9144 },
      mi: { label: 'Miles (mi)', toBase: 1609.344 },
    },
  },
  weight: {
    label: 'Weight',
    baseUnit: 'kg',
    units: {
      mg: { label: 'Milligrams (mg)', toBase: 0.000001 },
      g: { label: 'Grams (g)', toBase: 0.001 },
      kg: { label: 'Kilograms (kg)', toBase: 1 },
      tonne: { label: 'Tonnes (t)', toBase: 1000 },
      oz: { label: 'Ounces (oz)', toBase: 0.0283495 },
      lb: { label: 'Pounds (lb)', toBase: 0.453592 },
    },
  },
  volume: {
    label: 'Volume',
    baseUnit: 'l',
    units: {
      ml: { label: 'Milliliters (ml)', toBase: 0.001 },
      l: { label: 'Liters (l)', toBase: 1 },
      gal: { label: 'US Gallons (gal)', toBase: 3.78541 },
      qt: { label: 'US Quarts (qt)', toBase: 0.946353 },
      cup: { label: 'US Cups', toBase: 0.236588 },
      flOz: { label: 'US Fluid Ounces (fl oz)', toBase: 0.0295735 },
    },
  },
  area: {
    label: 'Area',
    baseUnit: 'sqm',
    units: {
      sqm: { label: 'Square Meters (m²)', toBase: 1 },
      sqft: { label: 'Square Feet (ft²)', toBase: 0.092903 },
      sqyd: { label: 'Square Yards (yd²)', toBase: 0.836127 },
      acre: { label: 'Acres', toBase: 4046.86 },
      hectare: { label: 'Hectares', toBase: 10000 },
      sqkm: { label: 'Square Kilometers (km²)', toBase: 1000000 },
    },
  },
  temperature: {
    label: 'Temperature',
    units: {
      c: { label: 'Celsius (°C)' },
      f: { label: 'Fahrenheit (°F)' },
      k: { label: 'Kelvin (K)' },
    },
  },
}

function celsiusTo(unit, celsius) {
  if (unit === 'c') return celsius
  if (unit === 'f') return celsius * (9 / 5) + 32
  if (unit === 'k') return celsius + 273.15
  return celsius
}

function toCelsius(unit, value) {
  if (unit === 'c') return value
  if (unit === 'f') return (value - 32) * (5 / 9)
  if (unit === 'k') return value - 273.15
  return value
}

export function convertTemperature(value, fromUnit, toUnit) {
  return celsiusTo(toUnit, toCelsius(fromUnit, value))
}

export function convertUnit(category, value, fromUnit, toUnit) {
  if (category === 'temperature') return convertTemperature(value, fromUnit, toUnit)

  const { units } = UNIT_CATEGORIES[category]
  const baseValue = value * units[fromUnit].toBase
  return baseValue / units[toUnit].toBase
}
