import indiaLocations from './indiaLocations.js'

// 16 hand-written, genuinely unique pharmacy-software city pages already live in
// src/components/sections/LocalSEOPageTemplate.jsx — these always win over anything this module
// would otherwise generate for the same place, so good existing content never gets clobbered.
export const CURATED_SLUGS = new Set([
  'peravurani', 'pattukottai', 'thanjavur', 'aranthangi', 'pudukkottai', 'alangudi',
  'salem', 'trichy', 'tirunelveli', 'erode', 'visakhapatnam', 'kancheepuram', 'vellore',
  'nagercoil', 'thoothukudi', 'dindigul',
])

// A few dataset district names differ enough from their curated counterpart (official name vs.
// common name/spelling) that they wouldn't naturally collide as slugs, which would otherwise
// produce two separate pages about the same real place. Maps the dataset's computed slug ->
// the curated slug that should actually serve that district.
export const CURATED_ALIASES = {
  kanchipuram: 'kancheepuram', // dataset "Kanchipuram" vs curated "Kancheepuram"
  tiruchirappalli: 'trichy',   // dataset official name vs curated common name "Trichy"
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

// slug -> { district, state, stateSlug, neighboringDistricts } — used by LocalSEOPage.jsx's
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
