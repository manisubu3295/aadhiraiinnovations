import express from 'express'
import geoip from 'geoip-lite'

const router = express.Router()

// geoip-lite (MaxMind GeoLite2-derived) returns ISO 3166-2:IN subdivision codes in `region`
// for Indian IPs. Mapped to the exact state names used by src/data/locationSlugs.js so the
// two stay in sync without needing a second source of truth.
const REGION_CODE_TO_STATE = {
  AN: 'Andaman and Nicobar Islands',
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CH: 'Chandigarh',
  CT: 'Chhattisgarh',
  DN: 'Dadra and Nagar Haveli',
  DD: 'Daman and Diu',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JK: 'Jammu and Kashmir',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  LD: 'Lakshadweep',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PY: 'Puducherry',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TR: 'Tripura',
  UT: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
}

function slugifyState(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Public, unauthenticated — only ever returns a state name derived from the requester's own IP.
router.get('/', (req, res) => {
  const ip = req.ip
  const result = geoip.lookup(ip)
  const state = result && result.country === 'IN' ? REGION_CODE_TO_STATE[result.region] : undefined

  if (!state) {
    return res.json({ success: true, state: null, stateSlug: null })
  }

  res.json({ success: true, state, stateSlug: slugifyState(state) })
})

export default router
