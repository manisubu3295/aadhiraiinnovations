import { useEffect } from 'react'

// Temporarily overrides the page's <meta name="robots"> to noindex while the calling component
// is mounted (e.g. a soft-404 for an unrecognized location slug), restoring the previous value
// on unmount/navigation-away. Mutates the existing tag in place rather than adding a second one
// via react-helmet, since index.html already ships one static robots tag — two conflicting
// robots tags on the same page is ambiguous for crawlers to resolve.
export function useNoIndex(active) {
  useEffect(() => {
    if (!active) return
    const tag = document.querySelector('meta[name="robots"]')
    if (!tag) return
    const previous = tag.getAttribute('content')
    tag.setAttribute('content', 'noindex')
    return () => tag.setAttribute('content', previous)
  }, [active])
}
