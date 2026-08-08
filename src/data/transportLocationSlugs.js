import indiaLocations from './indiaLocations.js'

// Mirrors hrmLocationSlugs.js's mechanics exactly (slugify/collision-resolution), but defines its
// own curated set for the /transport-software/... tree — a district curated for HRM isn't
// necessarily curated for transport & logistics, and the two trees are intentionally independent
// so neither can accidentally clobber the other's content.
//
// 8 hand-written, genuinely unique transport-software city pages live in
// src/components/sections/TransportLocationPageTemplate.jsx — these always win over anything this
// module would otherwise generate for the same place. Weighted toward India's largest freight/
// logistics gateways (major ports + national trucking hubs + industrial belts) rather than HRM's
// general business-hub set, since transport & logistics buyers concentrate around freight corridors.
export const CURATED_SLUGS = new Set([
  'chennai', 'mumbai', 'delhi', 'bengaluru', 'hyderabad', 'kolkata', 'pune', 'coimbatore',
])

// A few dataset district names differ from the curated slug's common name (official name vs.
// common name/spelling) — maps the dataset's computed slug -> the curated slug that should
// actually serve that district. The dataset lists Bengaluru as two separate districts,
// "Bengaluru (Bangalore) Urban" and "... Rural" (slugifying to bengaluru-bangalore-urban/-rural
// since the parenthetical isn't at the end of the string, so cleanLocationName doesn't strip
// it) — only the Urban one (the actual city) is aliased to the curated "bengaluru" page; Rural
// still gets its own generated page. Similarly Delhi's dataset districts are boroughs of the
// NCT, not "Delhi" itself — "New Delhi" is aliased to the curated citywide page.
export const CURATED_ALIASES = {
  'bengaluru-bangalore-urban': 'bengaluru',
  'new-delhi': 'delhi',
}

// Strips a trailing parenthetical alternate/older name, e.g. "Thoothukudi (Tuticorin)" -> "Thoothukudi".
export function cleanLocationName(name) {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

export function slugify(name) {
  return cleanLocationName(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Resolves slug collisions deterministically: first occurrence (dataset order) keeps the bare
// slug, every subsequent collision gets `-{disambiguator}` appended (e.g. two "Aurangabad"
// districts in different states -> "aurangabad" and "aurangabad-bihar").
function resolveCollision(baseSlug, disambiguator, seen) {
  if (!seen.has(baseSlug)) {
    seen.set(baseSlug, true)
    return baseSlug
  }
  const disambiguated = `${baseSlug}-${disambiguator}`
  seen.set(disambiguated, true)
  return disambiguated
}

const seenStateSlugs = new Map()
const seenDistrictSlugs = new Map()

export const states = indiaLocations.map(({ state, districts }) => {
  const stateSlug = resolveCollision(slugify(state), 'state', seenStateSlugs)
  return {
    state: cleanLocationName(state),
    stateSlug,
    districts: districts.map((rawName) => {
      const district = cleanLocationName(rawName)
      const baseSlug = slugify(rawName)
      const districtSlug = resolveCollision(baseSlug, stateSlug, seenDistrictSlugs)
      const finalSlug = CURATED_ALIASES[districtSlug] || districtSlug
      const isCurated = CURATED_SLUGS.has(finalSlug)
      return { district, slug: finalSlug, isCurated }
    }),
  }
})

// slug -> { state, stateSlug, districts: [{district, slug, isCurated}] } — used by the state hub page.
export const stateSlugToInfo = new Map(states.map((s) => [s.stateSlug, s]))

// slug -> { district, state, stateSlug, neighboringDistricts } — used by TransportLocalSEOPage.jsx's
// generator fallback. Only includes districts NOT already served by a curated page.
export const districtSlugToInfo = new Map()
for (const { state, stateSlug, districts } of states) {
  districts.forEach(({ district, slug, isCurated }, i) => {
    if (isCurated) return
    const neighboringDistricts = districts
      .filter((_, j) => j !== i)
      .slice(0, 3)
      .map((d) => d.district)
    districtSlugToInfo.set(slug, { district, state, stateSlug, neighboringDistricts })
  })
}
