import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../admin/api'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

function FormSection({ label, hint, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h3>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export default function NewTicketPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [projectId, setProjectId] = useState('')
  const [ccEmails, setCcEmails] = useState('')
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/client/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const form = new FormData()
      form.set('subject', subject)
      form.set('description', description)
      form.set('priority', priority)
      if (projectId) form.set('projectId', projectId)
      if (ccEmails) form.set('ccEmails', ccEmails)
      files.forEach((f) => form.append('attachments', f))
      const data = await api.postForm('/client/tickets', form)
      navigate(`/portal/tickets/${data.ticket.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Raise a ticket</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormSection label="Summary">
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="A short summary of the issue"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </FormSection>

        <FormSection label="Description">
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Include as much detail as you can."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
          />
        </FormSection>

        <FormSection label="Attachments" hint="Screenshots or files that help explain the issue (optional).">
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {projects.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Related project (optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">None</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">CC emails (optional)</label>
              <input
                value={ccEmails}
                onChange={(e) => setCcEmails(e.target.value)}
                placeholder="comma-separated, e.g. manager@yourcompany.com"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
              />
              <p className="mt-1 text-xs text-slate-400">These people will be copied on ticket updates.</p>
            </div>
          </div>
        </FormSection>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit ticket'}
        </button>
      </form>
    </div>
  )
}
