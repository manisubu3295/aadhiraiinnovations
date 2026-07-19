import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatMoney } from '../format'
import Modal from '../components/Modal'

const STATUSES = ['PROPOSED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']
const emptyForm = { name: '', clientId: '', description: '', status: 'PROPOSED', billingType: 'MILESTONE', hourlyRate: '', totalValue: '', currency: 'INR' }

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function load() {
    api.get('/admin/projects').then((data) => setProjects(data.projects)).catch((err) => setError(err.message))
    api.get('/admin/clients').then((data) => setClients(data.clients)).catch(() => {})
  }

  useEffect(load, [])

  function openCreate() {
    setForm(emptyForm)
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/projects', {
        ...form,
        totalValue: Number(form.totalValue) || 0,
        hourlyRate: form.billingType === 'HOURLY' ? Number(form.hourlyRate) || 0 : undefined,
      })
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Projects</h1>
        <button
          onClick={openCreate}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          Add project
        </button>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Billing</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium text-right">Paid</th>
              <th className="px-4 py-3 font-medium text-right">Due</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <Link to={`/admin/projects/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{project.client?.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {project.billingType === 'HOURLY' ? `Hourly (${formatMoney(project.hourlyRate, project.currency)}/hr)` : 'Milestone'}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(project.totalValue, project.currency)}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatMoney(project.paid, project.currency)}</td>
                <td className={`px-4 py-3 text-right font-medium ${project.due > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {formatMoney(project.due, project.currency)}
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Add project" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
            <select
              required
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            >
              <option value="" disabled>
                Select a client
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Project name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Billing type</label>
            <select
              value={form.billingType}
              onChange={(e) => setForm({ ...form, billingType: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            >
              <option value="MILESTONE">Milestone-based (fixed price)</option>
              <option value="HOURLY">Hourly (time &amp; materials)</option>
            </select>
          </div>
          {form.billingType === 'HOURLY' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Hourly rate</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Total value{form.billingType === 'HOURLY' ? ' (estimated)' : ''}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.totalValue}
              onChange={(e) => setForm({ ...form, totalValue: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save project'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export function StatusBadge({ status }) {
  const styles = {
    PROPOSED: 'bg-slate-100 text-slate-600',
    ACTIVE: 'bg-blue-100 text-blue-700',
    ON_HOLD: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
    DRAFT: 'bg-slate-100 text-slate-600',
    SENT: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-slate-100 text-slate-500',
    PARTIALLY_PAID: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    OVERDUE: 'bg-red-100 text-red-700',
    PENDING: 'bg-slate-100 text-slate-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REIMBURSED: 'bg-emerald-100 text-emerald-700',
    OPEN: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-500',
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-blue-100 text-blue-700',
    HIGH: 'bg-amber-100 text-amber-700',
    URGENT: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
