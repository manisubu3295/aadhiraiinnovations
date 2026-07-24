import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'
import { StatusBadge } from './ProjectsPage'
import Modal from '../components/Modal'

const STATUSES = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'QUALIFIED', 'WON', 'LOST']

const emptyForm = { name: '', company: '', email: '', phone: '', source: '', notes: '' }

function isOverdue(nextFollowUpAt) {
  return nextFollowUpAt && new Date(nextFollowUpAt) < new Date()
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [dueLeads, setDueLeads] = useState([])
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
      .get(`/admin/leads${params.toString() ? `?${params}` : ''}`)
      .then((data) => setLeads(data.leads))
      .catch((err) => setError(err.message))
  }

  function loadDue() {
    api.get('/admin/leads?dueFollowUps=true').then((data) => setDueLeads(data.leads)).catch(() => {})
  }

  useEffect(load, [status])
  useEffect(loadDue, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await api.post('/admin/leads', form)
      setModalOpen(false)
      setForm(emptyForm)
      load()
      loadDue()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Leads</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Add lead
        </button>
      </div>

      {dueLeads.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-800">Follow-ups due ({dueLeads.length})</h2>
          <ul className="mt-2 space-y-1">
            {dueLeads.map((lead) => (
              <li key={lead.id} className="text-sm">
                <Link to={`/admin/leads/${lead.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                  {lead.name}
                </Link>
                <span className={`ml-2 ${isOverdue(lead.nextFollowUpAt) ? 'text-red-600' : 'text-amber-700'}`}>
                  {isOverdue(lead.nextFollowUpAt) ? 'overdue' : 'due'} — {formatDateTime(lead.nextFollowUpAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assigned to</th>
                <th className="px-4 py-3 font-medium">Last contacted</th>
                <th className="px-4 py-3 font-medium">Next follow-up</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/leads/${lead.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lead.company || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{lead.assignedTo?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(lead.lastContactedAt)}</td>
                  <td className={`px-4 py-3 ${isOverdue(lead.nextFollowUpAt) ? 'font-medium text-red-600' : 'text-slate-600'}`}>
                    {formatDateTime(lead.nextFollowUpAt)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Add lead" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Source (optional)</label>
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="Referral, website, cold call…"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Add lead'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
