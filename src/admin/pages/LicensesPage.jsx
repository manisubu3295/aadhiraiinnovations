import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'
import Modal from '../components/Modal'

const STATUSES = ['PENDING', 'FULFILLED', 'FAILED']
const PLANS = [
  { value: 'THREE_MONTH', label: '3 Months' },
  { value: 'SIX_MONTH', label: '6 Months' },
  { value: 'ONE_YEAR', label: '1 Year' },
]
const LICENSE_PLAN_LABELS = { THREE_MONTH: '3 Months', SIX_MONTH: '6 Months', ONE_YEAR: '1 Year' }

const emptyForm = { customerName: '', email: '', whatsapp: '', businessName: '', machineId: '', plan: 'THREE_MONTH' }

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        status === 'FULFILLED'
          ? 'bg-emerald-100 text-emerald-700'
          : status === 'FAILED'
          ? 'bg-red-100 text-red-700'
          : 'bg-amber-100 text-amber-700'
      }`}
    >
      {status}
    </span>
  )
}

function PaymentBadge({ paymentStatus }) {
  if (paymentStatus === 'UNPAID') return <span className="text-xs text-slate-400">—</span>
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {paymentStatus === 'PAID' ? 'Paid' : 'Payment failed'}
    </span>
  )
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function load() {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    api
      .get(`/licenses${params.toString() ? `?${params}` : ''}`)
      .then((data) => setLicenses(data.licenses))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [status])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await api.post('/licenses', form)
      setModalOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Licenses</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          New license request
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Machine ID</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/licenses/${license.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                      {license.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{license.email}</td>
                  <td className="px-4 py-3 text-slate-600">{license.machineId}</td>
                  <td className="px-4 py-3 text-slate-600">{LICENSE_PLAN_LABELS[license.plan] || license.plan}</td>
                  <td className="px-4 py-3"><StatusBadge status={license.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge paymentStatus={license.paymentStatus} /></td>
                  <td className="px-4 py-3 text-slate-600">
                    {license.lead ? (
                      <Link to={`/admin/leads/${license.lead.id}`} className="text-[#0B1F3A] hover:underline">
                        {license.lead.name}
                      </Link>
                    ) : (
                      <span className="text-slate-400">Manual</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(license.createdAt)}</td>
                </tr>
              ))}
              {licenses.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                    No license requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="New license request" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Customer name</label>
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp (optional)</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Business name (optional)</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Machine ID</label>
              <input
                required
                value={form.machineId}
                onChange={(e) => setForm({ ...form, machineId: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Plan</label>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              >
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Create license request'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
