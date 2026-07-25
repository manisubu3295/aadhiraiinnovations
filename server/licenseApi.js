import { getSettings } from './settings.js'

// Internal LicensePlan enum values -> the external API's expected plan codes (its contract:
// "plan": "3mo" | "6mo" | "1y").
export const PLAN_API_KEYS = {
  THREE_MONTH: '3mo',
  SIX_MONTH: '6mo',
  ONE_YEAR: '1y',
}

// The only place that talks to the external, separately-deployed license-generation service —
// never call this from the frontend (the API key must stay server-side). See the "Deploying the
// license-generation API" section of the offline-license build spec for the service contract.
export async function generateLicense({ machineId, plan, customerName }) {
  const settings = await getSettings()
  if (!settings.licenseApiUrl || !settings.licenseApiKey) {
    throw new Error('License API is not configured yet — set it up on the Settings page.')
  }

  const response = await fetch(`${settings.licenseApiUrl.replace(/\/$/, '')}/generate-license`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.licenseApiKey,
    },
    body: JSON.stringify({ machineId, plan, customerName }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.success) {
    throw new Error(data?.error || `License API request failed (${response.status}).`)
  }
  return data // { success, fileContents, licenseId, planTier, issuedAt, expiresAt }
}
