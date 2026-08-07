import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../admin/api'
import { formatDate } from '../../admin/format'
import { StatusBadge } from '../../admin/pages/ProjectsPage'
import Avatar from '../../admin/components/Avatar'
import TicketActivityFeed from '../../admin/components/TicketActivityFeed'

function AttachmentList({ attachments, ticketId }) {
  if (!attachments?.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((a) => (
        <a
          key={a.id}
          href={`/api/client/tickets/${ticketId}/attachments/${a.id}`}
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
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('comments')
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)
  const [ccInput, setCcInput] = useState('')
  const [editingCc, setEditingCc] = useState(false)
  const [savingCc, setSavingCc] = useState(false)

  function load() {
    api
      .get(`/client/tickets/${id}`)
      .then((data) => {
        setTicket(data.ticket)
        setCcInput((data.ticket.ccEmails || []).join(', '))
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [id])

  async function handleSaveCc() {
    setSavingCc(true)
    setError('')
    try {
      await api.put(`/client/tickets/${id}/cc-emails`, { ccEmails: ccInput })
      setEditingCc(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingCc(false)
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
      await api.postForm(`/client/tickets/${id}/messages`, form)
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

  return (
    <div>
      <Link to="/portal/tickets" className="text-sm text-[#0B1F3A] hover:underline">← My tickets</Link>

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
              <span>You</span>
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
                      <span>{m.author.role === 'CLIENT' ? 'You' : `${m.author.name} (Aadhirai support)`}</span>
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

              {ticket.status !== 'CLOSED' && (
                <form onSubmit={handleReply} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    placeholder="Write a reply…"
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
                      {sending ? 'Sending…' : 'Send reply'}
                    </button>
                  </div>
                </form>
              )}
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
            <StatusBadge status={ticket.status} />
          </SidebarField>

          <SidebarField label="Priority">
            <StatusBadge status={ticket.priority} />
          </SidebarField>

          <SidebarField label="Assigned to">
            {ticket.assignedTo ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                <Avatar name={ticket.assignedTo.name} />
                {ticket.assignedTo.name}
              </span>
            ) : (
              <span className="text-sm text-slate-400">Unassigned</span>
            )}
          </SidebarField>

          <hr className="border-slate-100" />

          <SidebarField label="Project">
            <span className="text-sm text-slate-700">{ticket.project?.name || '—'}</span>
          </SidebarField>

          <SidebarField label="CC emails">
            {editingCc ? (
              <div className="flex flex-col gap-2">
                <input
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  placeholder="comma-separated, e.g. manager@yourcompany.com"
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCc}
                    disabled={savingCc}
                    className="rounded-md bg-[#0B1F3A] px-3 py-1 text-xs font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
                  >
                    {savingCc ? 'Saving…' : 'Save'}
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

          <SidebarField label="Opened">
            <span className="text-sm text-slate-600">{formatDate(ticket.createdAt)}</span>
          </SidebarField>
        </div>
      </div>
    </div>
  )
}
