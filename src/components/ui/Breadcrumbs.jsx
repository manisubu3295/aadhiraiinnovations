import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items, isDark = false }) {
  const linkColor = isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-[#0B1F3A]'
  const separatorColor = isDark ? 'text-white/30' : 'text-slate-400'
  const currentColor = isDark ? 'text-white/70 font-medium' : 'text-slate-900 font-medium'

  return (
    <nav aria-label="breadcrumbs" className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap text-sm">
        {/* Home */}
        <li>
          <Link to="/" className={`flex items-center gap-2 ${linkColor} transition-colors`}>
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            <ChevronRight className={`h-4 w-4 ${separatorColor}`} />
            {item.href ? (
              <Link to={item.href} className={`${linkColor} transition-colors`}>
                {item.label}
              </Link>
            ) : (
              <span className={currentColor}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>

      {/* Schema markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://aadhiraiinnovations.com',
            },
            ...items.map((item, index) => ({
              '@type': 'ListItem',
              'position': index + 2,
              'name': item.label,
              'item': item.href ? `https://aadhiraiinnovations.com${item.href}` : undefined,
            })).filter(item => item.item),
          ],
        })}
      </script>
    </nav>
  )
}
