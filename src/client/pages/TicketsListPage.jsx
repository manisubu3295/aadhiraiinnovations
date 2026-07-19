import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../admin/api'
import { formatDate } from '../../admin/format'
import { StatusBadge } from '../../admin/pages/ProjectsPage'

export default function TicketsListPage() {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/client/tickets')
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message))
  }, [])

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

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                  No tickets yet.
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
