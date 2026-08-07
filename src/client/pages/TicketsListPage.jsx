import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../admin/api'
import { formatDate } from '../../admin/format'
import { StatusBadge } from '../../admin/pages/ProjectsPage'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

export default function TicketsListPage() {
  const [tickets, setTickets] = useState([])
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [projectId, setProjectId] = useState('')
  const [myOpenOnly, setMyOpenOnly] = useState(false)

  function load() {
    const params = new URLSearchParams()
    if (myOpenOnly) params.set('mine', '1')
    // Leaving status unset (rather than "") is what makes the backend hide CLOSED by default —
    // an explicit status pick (including CLOSED) always wins.
    if (status) params.set('status', status)
    if (projectId) params.set('projectId', projectId)
    api
      .get(`/client/tickets${params.toString() ? `?${params}` : ''}`)
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [status, projectId, myOpenOnly])
  useEffect(() => {
    api.get('/client/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  const hasActiveFilters = Boolean(status || projectId || myOpenOnly)
  function clearFilters() {
    setStatus('')
    setProjectId('')
    setMyOpenOnly(false)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">My tickets</h1>
        <Link
          to="/portal/tickets/new"
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Raise a ticket
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMyOpenOnly((v) => !v)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            myOpenOnly
              ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          My open tickets
        </button>
        <span className="hidden h-5 w-px bg-slate-200 sm:inline-block" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All except closed</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        {projects.length > 0 && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Opened</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/portal/tickets/${t.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                    {t.ticketNumber}
                  </Link>
                  <div className="text-slate-500">{t.subject}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-slate-600">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  {hasActiveFilters ? 'No tickets match these filters.' : 'No tickets yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
