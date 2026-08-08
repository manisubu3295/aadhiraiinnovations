import { useState } from 'react'

// No accounts on the public /tools page, so favorites are scoped to this browser via
// localStorage rather than a server-side user record.
const STORAGE_KEY = 'aadhirai:favorite-tools'

function readStoredFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

export function useFavoriteTools() {
  const [favorites, setFavorites] = useState(readStoredFavorites)

  function toggleFavorite(href) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // localStorage unavailable (private browsing, quota) — favorites just won't persist
      }
      return next
    })
  }

  return { favorites, toggleFavorite, isFavorite: (href) => favorites.has(href) }
}
