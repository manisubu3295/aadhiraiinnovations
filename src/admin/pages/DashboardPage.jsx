import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatMoney } from '../format'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/dashboard/summary')
      .then((data) => setSummary(data.summary))
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (!summary) return <div className="text-sm text-slate-500">Loading…</div>

  const cards = [
    { label: 'Total invoiced', value: formatMoney(summary.totalInvoiced) },
    { label: 'Total paid', value: formatMoney(summary.totalPaid) },
    { label: 'Total due', value: formatMoney(summary.totalDue) },
    { label: 'Active projects', value: summary.activeProjects },
    { label: 'Overdue invoices', value: summary.overdueInvoices },
    { label: 'Clients', value: summary.totalClients },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[#0B1F3A]">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
