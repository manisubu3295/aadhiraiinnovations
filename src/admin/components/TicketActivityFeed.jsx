import { formatDate } from '../format'
import Avatar from './Avatar'

function fmt(value) {
  return value ? String(value).replace('_', ' ') : '—'
}

// One line of human-readable narration per TicketActivity row — mirrors the wording Jira uses
// on its issue "History"/"Activity" tab ("X changed the Status from Y to Z").
function describe(activity) {
  switch (activity.type) {
    case 'CREATED':
      return 'raised this ticket'
    case 'STATUS_CHANGED':
      return (
        <>
          changed status from <b className="font-medium text-slate-700">{fmt(activity.oldValue)}</b> to{' '}
          <b className="font-medium text-slate-700">{fmt(activity.newValue)}</b>
        </>
      )
    case 'PRIORITY_CHANGED':
      return (
        <>
          changed priority from <b className="font-medium text-slate-700">{fmt(activity.oldValue)}</b> to{' '}
          <b className="font-medium text-slate-700">{fmt(activity.newValue)}</b>
        </>
      )
    case 'ASSIGNED':
      if (!activity.oldValue && activity.newValue) {
        return (
          <>
            assigned this to <b className="font-medium text-slate-700">{activity.newValue}</b>
          </>
        )
      }
      if (activity.oldValue && !activity.newValue) {
        return (
          <>
            unassigned this <span className="text-slate-400">(was {activity.oldValue})</span>
          </>
        )
      }
      return (
        <>
          reassigned this from <b className="font-medium text-slate-700">{activity.oldValue}</b> to{' '}
          <b className="font-medium text-slate-700">{activity.newValue}</b>
        </>
      )
    default:
      return 'updated this ticket'
  }
}

export default function TicketActivityFeed({ activities }) {
  if (!activities?.length) {
    return <div className="py-10 text-center text-sm text-slate-400">No activity yet.</div>
  }
  return (
    <ol className="space-y-5">
      {activities.map((a) => (
        <li key={a.id} className="flex items-start gap-3">
          <Avatar name={a.actor?.name} />
          <div className="min-w-0 flex-1 text-sm">
            <p className="text-slate-600">
              <span className="font-medium text-slate-800">{a.actor?.name || 'Someone'}</span> {describe(a)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{formatDate(a.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
