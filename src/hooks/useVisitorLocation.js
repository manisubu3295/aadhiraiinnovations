import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/apiBase'

// Best-effort IP-based state detection for personalizing copy (e.g. hero headline).
// Starts as null (render neutral/default copy immediately, no loading state) and upgrades
// once/if the lookup resolves. Fails silently — a slow or broken /api/geo call must never
// block or flash content, since this is a nice-to-have, not a requirement.
export function useVisitorLocation() {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE}/api/geo`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.state) {
          setLocation({ state: data.state, stateSlug: data.stateSlug })
        }
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  return location
}
