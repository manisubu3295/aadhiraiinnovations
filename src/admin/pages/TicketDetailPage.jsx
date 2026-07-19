import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDate } from '../format'
import { StatusBadge } from './ProjectsPage'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

function AttachmentList({ attachments, ticketId }) {
  if (!attachments?.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((a) => (
        <a
          key={a.id}
          href={`/api/tickets/${ticketId}/attachments/${a.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 hover:underline"
        >
          📎 {a.fileName}
        </a>
      ))}
    </div>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [assignableUsers, setAssignableUsers] = useState([])
  const [error, setError] = useState('')
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)
  const [savingField, setSavingField] = useState('')

  function load() {
    api
      .get(`/tickets/${id}`)
      .then((data) => setTicket(data.ticket))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [id])
  useEffect(() => {
    api.get('/tickets/assignable-users').then((data) => setAssignableUsers(data.users)).catch(() => {})
  }, [])

  async function updateField(field, value) {
    setSavingField(field)
    setError('')
    try {
      const data = await api.put(`/tickets/${id}`, { [field]: value })
      setTicket((prev) => ({ ...prev, ...data.ticket }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingField('')
    }
  }

  async function handleReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setError('')
    try {
      const form = new FormData()
      form.set('body', reply)
      files.forEach((f) => form.append('attachments', f))
      await api.postForm(`/tickets/${id}/messages`, form)
      setReply('')
      setFiles([])
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (error && !ticket) {
    return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
  }
  if (!ticket) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <Link to="/admin/tickets" className="text-sm text-[#0B1F3A] hover:underline">← All tickets</Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1F3A]">{ticket.subject}</h1>
          <div className="mt-1 text-sm text-slate-500">
            {ticket.ticketNumber} · {ticket.client?.name} · opened {formatDate(ticket.createdAt)}
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={ticket.status}
            disabled={savingField === 'status'}
            onChange={(e) => updateField('status', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select
            value={ticket.priority}
            disabled={savingField === 'priority'}
            onChange={(e) => updateField('priority', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <span>Assigned to:</span>
        <select
          value={ticket.assignedTo?.id || ''}
          disabled={savingField === 'assignedToId'}
          onChange={(e) => updateField('assignedToId', e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="">Unassigned</option>
          {assignableUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{ticket.createdBy?.name} (client)</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>
          <AttachmentList attachments={ticket.attachments?.filter((a) => !a.messageId)} ticketId={ticket.id} />
        </div>

        {ticket.messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 shadow-sm ${
              m.author.role === 'CLIENT' ? 'border-slate-200 bg-white' : 'border-blue-100 bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{m.author.name} ({m.author.role === 'CLIENT' ? 'client' : 'staff'})</span>
              <span>{formatDate(m.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.body}</p>
            <AttachmentList attachments={m.attachments} ticketId={ticket.id} />
          </div>
        ))}
      </div>

      <form onSubmit={handleReply} className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder="Write a reply…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <div className="mt-2 flex items-center justify-between">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="text-xs text-slate-500"
          />
          <button
            type="submit"
            disabled={sending || !reply.trim()}
            className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
