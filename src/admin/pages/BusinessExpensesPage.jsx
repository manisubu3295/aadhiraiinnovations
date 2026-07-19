import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatMoney, formatDate } from '../format'
import Modal from '../components/Modal'

const CATEGORIES = ['GST', 'SERVER', 'DOMAIN', 'SALARY', 'SOFTWARE', 'OTHER']

const emptyForm = { category: 'OTHER', amount: '', paidOn: '', paidTo: '', description: '' }

function toInputDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : ''
}

export default function BusinessExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function load() {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    api
      .get(`/admin/business-expenses${params.toString() ? `?${params}` : ''}`)
      .then((data) => {
        setExpenses(data.expenses)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [category])

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(exp) {
    setEditing(exp)
    setForm({
      category: exp.category,
      amount: String(exp.amount),
      paidOn: toInputDate(exp.paidOn),
      paidTo: exp.paidTo || '',
      description: exp.description || '',
    })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, paidOn: form.paidOn || undefined }
      if (editing) {
        await api.put(`/admin/business-expenses/${editing.id}`, payload)
      } else {
        await api.post('/admin/business-expenses', payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this expense record?')) return
    try {
      await api.del(`/admin/business-expenses/${id}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Business Expenses</h1>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Add expense
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-700">
            {category ? `Total — ${category}` : 'Total going out'}
          </h2>
          <span className="text-sm font-semibold text-red-600">{formatMoney(total)}</span>
        </div>
      </div>

      <div className="mt-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
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
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Paid to</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(exp.paidOn)}</td>
                <td className="px-4 py-3 text-slate-600">{exp.category}</td>
                <td className="px-4 py-3 text-slate-600">{exp.paidTo || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{exp.description || '—'}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">{formatMoney(exp.amount)}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(exp)} className="text-[#0B1F3A] hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No expenses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit expense' : 'Add expense'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date paid</label>
            <input
              type="date"
              value={form.paidOn}
              onChange={(e) => setForm({ ...form, paidOn: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Paid to (vendor / employee)</label>
            <input
              type="text"
              value={form.paidTo}
              onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
              placeholder="e.g. AWS, GoDaddy, Ramesh Kumar"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. July server hosting"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add expense'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
