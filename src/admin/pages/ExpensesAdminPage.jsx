import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatMoney, formatDate } from '../format'
import { StatusBadge } from './ProjectsPage'
import Modal from '../components/Modal'

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED']

export default function ExpensesAdminPage() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const [reimbursing, setReimbursing] = useState(null)
  const [reimburseAmount, setReimburseAmount] = useState('')
  const [reimburseSaving, setReimburseSaving] = useState(false)
  const [reimburseError, setReimburseError] = useState('')

  function load() {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    api
      .get(`/admin/expenses${params.toString() ? `?${params}` : ''}`)
      .then((data) => setExpenses(data.expenses))
      .catch((err) => setError(err.message))
  }

  function loadSummary() {
    api
      .get('/admin/expenses/summary')
      .then((data) => setSummary(data.summary))
      .catch(() => {})
  }

  useEffect(load, [status])
  useEffect(loadSummary, [])

  async function updateStatus(id, newStatus) {
    try {
      await api.put(`/admin/expenses/${id}`, { status: newStatus })
      load()
      loadSummary()
    } catch (err) {
      setError(err.message)
    }
  }

  function openReimburse(exp) {
    setReimbursing(exp)
    setReimburseAmount(String(exp.amount))
    setReimburseError('')
  }

  async function handleReimburseSubmit(e) {
    e.preventDefault()
    setReimburseSaving(true)
    setReimburseError('')
    try {
      await api.put(`/admin/expenses/${reimbursing.id}`, {
        status: 'REIMBURSED',
        reimbursedAmount: Number(reimburseAmount) || 0,
      })
      setReimbursing(null)
      load()
      loadSummary()
    } catch (err) {
      setReimburseError(err.message)
    } finally {
      setReimburseSaving(false)
    }
  }

  const totalOwed = summary.reduce((sum, s) => sum + s.owed, 0)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Expense Claims</h1>

      {summary.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-700">What you owe employees</h2>
            <span className="text-sm font-semibold text-amber-600">{formatMoney(totalOwed)}</span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Employee</th>
                <th className="px-4 py-2 font-medium text-right">Owed (approved, unpaid)</th>
                <th className="px-4 py-2 font-medium text-right">Total reimbursed to date</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.userId} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{s.userName}</td>
                  <td className={`px-4 py-2 text-right font-medium ${s.owed > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {formatMoney(s.owed)}
                  </td>
                  <td className="px-4 py-2 text-right text-slate-600">{formatMoney(s.totalReimbursed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div className="mt-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Claimed</th>
              <th className="px-4 py-3 font-medium text-right">Reimbursed</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(exp.expenseDate)}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{exp.user?.name}</td>
                <td className="px-4 py-3 text-slate-600">{exp.category?.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-slate-600">{exp.description}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={exp.status} />
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(exp.amount)}</td>
                <td className="px-4 py-3 text-right">
                  {exp.reimbursedAmount != null ? (
                    <span className={Number(exp.reimbursedAmount) !== Number(exp.amount) ? 'font-medium text-blue-600' : 'text-slate-600'}>
                      {formatMoney(exp.reimbursedAmount)}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {exp.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(exp.id, 'APPROVED')} className="text-emerald-600 hover:underline">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(exp.id, 'REJECTED')} className="text-red-600 hover:underline">
                        Reject
                      </button>
                    </>
                  )}
                  {exp.status === 'APPROVED' && (
                    <button onClick={() => openReimburse(exp)} className="text-[#0B1F3A] hover:underline">
                      Mark reimbursed
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                  No expense claims yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={!!reimbursing} title="Mark reimbursed" onClose={() => setReimbursing(null)}>
        {reimbursing && (
          <form onSubmit={handleReimburseSubmit} className="space-y-4">
            <p className="text-sm text-slate-600">
              {reimbursing.user?.name} claimed <strong>{formatMoney(reimbursing.amount)}</strong> for "{reimbursing.description}".
              Enter what you actually paid them — it can be more or less than the claim.
            </p>
            {reimburseError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{reimburseError}</div>}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Amount paid</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                autoFocus
                value={reimburseAmount}
                onChange={(e) => setReimburseAmount(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
            <button
              type="submit"
              disabled={reimburseSaving}
              className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
            >
              {reimburseSaving ? 'Saving…' : 'Confirm reimbursement'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
