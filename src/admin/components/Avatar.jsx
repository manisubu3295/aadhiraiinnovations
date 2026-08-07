// Small initials avatar used anywhere we'd otherwise just print a name — ticket assignee,
// activity feed actor, comment author. Color is derived from the name so the same person
// always gets the same color without needing a stored preference.
const COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
]

function colorFor(name) {
  const sum = Array.from(name || '?').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return COLORS[sum % COLORS.length]
}

function initialsFor(name) {
  const parts = (name || '?').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default function Avatar({ name, size = 'sm', className = '' }) {
  const sizeClasses = size === 'md' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-10 w-10 text-sm' : 'h-6 w-6 text-[10px]'
  return (
    <span
      title={name || 'Unassigned'}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClasses} ${colorFor(name)} ${className}`}
    >
      {initialsFor(name)}
    </span>
  )
}
