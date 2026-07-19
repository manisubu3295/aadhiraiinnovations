import { useState } from 'react'
import { api } from '../api'
import Modal from './Modal'

const METHODS = ['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'OTHER']

export default function RecordPaymentModal({ open, onClose, projectId, invoiceId, onSaved }) {
  const [form, setForm] = useState({ amount: '', paidOn: '', method: 'BANK_TRANSFER', reference: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/payments', {
        projectId,
        invoiceId,
        amount: Number(form.amount),
        paidOn: form.paidOn || undefined,
        method: form.method,
        reference: form.reference,
        notes: form.notes,
      })
      setForm({ amount: '', paidOn: '', method: 'BANK_TRANSFER', reference: '', notes: '' })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Record payment" onClose={onClose}>
      {error && <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={form.paidOn}
            onChange={(e) => setForm({ ...form, paidOn: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Method</label>
          <select
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Reference</label>
          <input
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Record payment'}
        </button>
      </form>
    </Modal>
  )
}
