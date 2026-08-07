import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDate } from '../format'
import Avatar from '../components/Avatar'
import TicketActivityFeed from '../components/TicketActivityFeed'
import { useAuth } from '../AuthContext'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

// Coloring the status/priority <select> itself (instead of pairing a plain select with a
// separate badge) is what makes these read as an editable field rather than a form control —
// same visual language as Jira's issue-view status/priority pickers.
const STATUS_COLORS = {
  OPEN: 'border-blue-200 bg-blue-50 text-blue-700',
  IN_PROGRESS: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  RESOLVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CLOSED: 'border-slate-200 bg-slate-100 text-slate-500',
}
const PRIORITY_COLORS = {
  LOW: 'border-slate-200 bg-slate-50 text-slate-600',
  MEDIUM: 'border-blue-200 bg-blue-50 text-blue-700',
  HIGH: 'border-amber-200 bg-amber-50 text-amber-700',
  URGENT: 'border-red-200 bg-red-50 text-red-700',
}

function ColorSelect({ value, colors, options, onChange, disabled, label }) {
  return (
    <select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full cursor-pointer appearance-none rounded-md border px-3 py-1.5 text-sm font-medium disabled:cursor-wait disabled:opacity-60 ${colors[value] || 'border-slate-200 bg-slate-50 text-slate-600'}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o.replace('_', ' ')}</option>
      ))}
    </select>
  )
}

function AttachmentList({ attachments, ticketId }) {
  if (!attachments?.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-2">
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

function SidebarField({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [assignableUsers, setAssignableUsers] = useState([])
  const [error, setError] = useState('')
  const [tab, setTab] = useState('comments')
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)
  const [savingField, setSavingField] = useState('')
  const [ccInput, setCcInput] = useState('')
  const [editingCc, setEditingCc] = useState(false)

  function load() {
    api
      .get(`/tickets/${id}`)
      .then((data) => {
        setTicket(data.ticket)
        setCcInput((data.ticket.ccEmails || []).join(', '))
      })
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
      await api.put(`/tickets/${id}`, { [field]: value })
      load() // full refetch so the new Activity entry shows up, not just the changed field
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingField('')
    }
  }

  async function handleSaveCc() {
    setSavingField('ccEmails')
    setError('')
    try {
      await api.put(`/tickets/${id}`, { ccEmails: ccInput })
      setEditingCc(false)
      load()
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

  const commentCount = ticket.messages.length
  const activityCount = ticket.activities?.length || 0
  const leadAttachments = ticket.attachments?.filter((a) => !a.messageId)
  const isAssignedToMe = ticket.assignedTo?.id === user?.id

  return (
    <div>
      <Link to="/admin/tickets" className="text-sm text-[#0B1F3A] hover:underline">← All tickets</Link>

      <div className="mt-3 flex flex-col gap-1">
        <div className="text-sm font-medium text-slate-400">{ticket.ticketNumber}</div>
        <h1 className="text-2xl font-semibold text-[#0B1F3A] break-words">{ticket.subject}</h1>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Avatar name={ticket.createdBy?.name} />
                {ticket.createdBy?.name} (reporter)
              </span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>
            <AttachmentList attachments={leadAttachments} ticketId={ticket.id} />
          </div>

          <div className="mt-6 flex gap-6 border-b border-slate-200">
            <button
              onClick={() => setTab('comments')}
              className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                tab === 'comments' ? 'border-[#0B1F3A] text-[#0B1F3A]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Comments {commentCount > 0 && <span className="text-slate-400">({commentCount})</span>}
            </button>
            <button
              onClick={() => setTab('activity')}
              className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                tab === 'activity' ? 'border-[#0B1F3A] text-[#0B1F3A]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Activity {activityCount > 0 && <span className="text-slate-400">({activityCount})</span>}
            </button>
          </div>

          {tab === 'comments' ? (
            <div className="mt-4">
              <div className="space-y-4">
                {ticket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl border p-4 shadow-sm ${
                      m.author.role === 'CLIENT' ? 'border-slate-200 bg-white' : 'border-blue-100 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Avatar name={m.author.name} />
                        {m.author.name} ({m.author.role === 'CLIENT' ? 'client' : 'staff'})
                      </span>
                      <span>{formatDate(m.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.body}</p>
                    <AttachmentList attachments={m.attachments} ticketId={ticket.id} />
                  </div>
                ))}
                {commentCount === 0 && (
                  <div className="py-10 text-center text-sm text-slate-400">No comments yet.</div>
                )}
              </div>

              <form onSubmit={handleReply} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Write a comment…"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                />
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="max-w-full text-xs text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60 sm:shrink-0"
                  >
                    {sending ? 'Sending…' : 'Send comment'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <TicketActivityFeed activities={ticket.activities} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <SidebarField label="Status">
            <ColorSelect
              label="Status"
              value={ticket.status}
              colors={STATUS_COLORS}
              options={STATUSES}
              disabled={savingField === 'status'}
              onChange={(v) => updateField('status', v)}
            />
          </SidebarField>

          <SidebarField label="Priority">
            <ColorSelect
              label="Priority"
              value={ticket.priority}
              colors={PRIORITY_COLORS}
              options={PRIORITIES}
              disabled={savingField === 'priority'}
              onChange={(v) => updateField('priority', v)}
            />
          </SidebarField>

          <SidebarField label="Assignee">
            <div className="flex items-center gap-2">
              <Avatar name={ticket.assignedTo?.name} />
              <select
                value={ticket.assignedTo?.id || ''}
                disabled={savingField === 'assignedToId'}
                onChange={(e) => updateField('assignedToId', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm disabled:opacity-60"
              >
                <option value="">Unassigned</option>
                {assignableUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            {!isAssignedToMe && user && (
              <button
                onClick={() => updateField('assignedToId', user.id)}
                disabled={savingField === 'assignedToId'}
                className="mt-1.5 text-xs font-medium text-[#0B1F3A] hover:underline disabled:opacity-60"
              >
                Assign to me
              </button>
            )}
          </SidebarField>

          <hr className="border-slate-100" />

          <SidebarField label="Reporter">
            <span className="inline-flex items-center gap-2 text-sm text-slate-700">
              <Avatar name={ticket.createdBy?.name} />
              {ticket.createdBy?.name}
            </span>
          </SidebarField>

          <SidebarField label="Client">
            <span className="text-sm text-slate-700">{ticket.client?.name || '—'}</span>
          </SidebarField>

          <SidebarField label="Project">
            {ticket.project ? (
              <Link to={`/admin/projects/${ticket.project.id}`} className="text-sm text-[#0B1F3A] hover:underline">
                {ticket.project.name}
              </Link>
            ) : (
              <span className="text-sm text-slate-400">—</span>
            )}
          </SidebarField>

          <SidebarField label="CC emails">
            {editingCc ? (
              <div className="flex flex-col gap-2">
                <input
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  placeholder="comma-separated, e.g. manager@client.com"
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCc}
                    disabled={savingField === 'ccEmails'}
                    className="rounded-md bg-[#0B1F3A] px-3 py-1 text-xs font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
                  >
                    {savingField === 'ccEmails' ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditingCc(false); setCcInput((ticket.ccEmails || []).join(', ')) }}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingCc(true)}
                className="text-left text-sm text-slate-700 hover:underline"
              >
                {ticket.ccEmails?.length ? ticket.ccEmails.join(', ') : <span className="text-slate-400">None — click to add</span>}
              </button>
            )}
          </SidebarField>

          <hr className="border-slate-100" />

          <SidebarField label="Created">
            <span className="text-sm text-slate-600">{formatDate(ticket.createdAt)}</span>
          </SidebarField>
          <SidebarField label="Last updated">
            <span className="text-sm text-slate-600">{formatDate(ticket.updatedAt)}</span>
          </SidebarField>
          {ticket.resolvedAt && (
            <SidebarField label="Resolved">
              <span className="text-sm text-slate-600">{formatDate(ticket.resolvedAt)}</span>
            </SidebarField>
          )}
          {ticket.closedAt && (
            <SidebarField label="Closed">
              <span className="text-sm text-slate-600">{formatDate(ticket.closedAt)}</span>
            </SidebarField>
          )}
        </div>
      </div>
    </div>
  )
}
