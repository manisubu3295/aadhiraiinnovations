import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatDate } from '../format'
import { StatusBadge } from './ProjectsPage'
import Modal from '../components/Modal'
import Avatar from '../components/Avatar'
import { useAuth } from '../AuthContext'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const emptyForm = { clientId: '', subject: '', description: '', priority: 'MEDIUM', projectId: '', assignedToId: '', ccEmails: '' }

function FormSection({ label, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h3>
      {children}
    </div>
  )
}

export default function TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [projectId, setProjectId] = useState('')
  const [clientId, setClientId] = useState('')
  // Defaults to on — landing on this page should show what's actionable for me, not the
  // whole company's ticket history. CLOSED is also hidden by default (see load()/backend).
  const [myOpenOnly, setMyOpenOnly] = useState(true)

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [assignableUsers, setAssignableUsers] = useState([])
  const [formProjects, setFormProjects] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function load() {
    const params = new URLSearchParams()
    if (myOpenOnly) params.set('mine', '1')
    // Leaving status unset (rather than sending "" ) is what makes the backend apply its
    // "hide CLOSED" default — an explicit status pick (including CLOSED) always wins.
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (projectId) params.set('projectId', projectId)
    if (clientId) params.set('clientId', clientId)
    api
      .get(`/tickets${params.toString() ? `?${params}` : ''}`)
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [status, priority, projectId, clientId, myOpenOnly])
  useEffect(() => {
    api.get('/employee/clients').then((data) => setClients(data.clients)).catch(() => {})
    api.get('/employee/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  // "My open issues" on is the default baseline, so it alone shouldn't count as an active
  // filter — only turning it *off*, or narrowing with another control, does.
  const hasActiveFilters = Boolean(status || priority || projectId || clientId || !myOpenOnly)
  function clearFilters() {
    setStatus('')
    setPriority('')
    setProjectId('')
    setClientId('')
    setMyOpenOnly(true)
  }

  function openAdd() {
    setForm(emptyForm)
    setFiles([])
    setFormError('')
    setFormProjects([])
    setModalOpen(true)
    if (!assignableUsers.length) {
      api.get('/tickets/assignable-users').then((data) => setAssignableUsers(data.users)).catch(() => {})
    }
  }

  function handleClientChange(newClientId) {
    setForm({ ...form, clientId: newClientId, projectId: '' })
    setFormProjects(newClientId ? projects.filter((p) => p.clientId === newClientId) : [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.set(key, value)
      })
      files.forEach((f) => fd.append('attachments', f))
      await api.postForm('/tickets', fd)
      setModalOpen(false)
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
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Support tickets</h1>
        <button
          onClick={openAdd}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90"
        >
          New ticket
        </button>
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
          My open issues
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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
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
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-slate-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-3 text-xs text-slate-400">{tickets.length} ticket{tickets.length === 1 ? '' : 's'}</div>

      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned to</th>
              <th className="px-4 py-3 font-medium">Opened</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/tickets/${t.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                    {t.ticketNumber}
                  </Link>
                  <div className="text-slate-500">{t.subject}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{t.client?.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.project?.name || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-slate-600">
                  {t.assignedTo ? (
                    <span className="inline-flex items-center gap-2">
                      <Avatar name={t.assignedTo.name} />
                      {t.assignedTo.id === user?.id ? 'You' : t.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  {hasActiveFilters ? 'No tickets match these filters.' : 'No tickets yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <Modal open={modalOpen} title="New ticket" onClose={() => setModalOpen(false)} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</div>}

          <FormSection label="Summary">
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="A short summary of the issue"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </FormSection>

          <FormSection label="Description">
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Steps to reproduce, expected vs. actual behaviour, etc."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
            />
          </FormSection>

          <FormSection label="Attachments">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-sm text-slate-500"
            />
            {files.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">{files.length} file{files.length === 1 ? '' : 's'} selected</p>
            )}
          </FormSection>

          <FormSection label="Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
                <select
                  required
                  value={form.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Project (optional)</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  disabled={!form.clientId}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">None</option>
                  {formProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Assign to (optional)</label>
                <select
                  value={form.assignedToId}
                  onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">Unassigned</option>
                  {assignableUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">CC emails (optional)</label>
                <input
                  value={form.ccEmails}
                  onChange={(e) => setForm({ ...form, ccEmails: e.target.value })}
                  placeholder="comma-separated, e.g. manager@client.com"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                />
              </div>
            </div>
          </FormSection>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create ticket'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
