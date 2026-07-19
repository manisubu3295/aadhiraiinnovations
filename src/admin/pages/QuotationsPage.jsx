import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatMoney, formatDate } from '../format'
import { StatusBadge } from './ProjectsPage'

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/quotations')
      .then((data) => setQuotations(data.quotations))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Quotations</h1>
        <Link
          to="/admin/quotations/new"
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          New quotation
        </Link>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <Link to={`/admin/quotations/${q.id}`} className="hover:underline">
                    {q.quotationNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{q.client?.name}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(q.issueDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(q.totals.grandTotal, q.currency)}</td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No quotations yet.
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
