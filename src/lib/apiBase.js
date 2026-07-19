// Set at build time via the VITE_API_BASE_URL env var when the frontend is deployed
// separately from the API (e.g. the marketing site on one host, this Express server
// on another). Leave unset for same-origin deployments — requests stay relative.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
