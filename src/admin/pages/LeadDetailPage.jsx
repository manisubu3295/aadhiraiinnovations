import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'

const STATUSES = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'QUALIFIED', 'WON', 'LOST']

function toDatetimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const emptyCallForm = {
  calledAt: toDatetimeLocal(new Date()),
  durationMinutes: '',
  notes: '',
  followUpNeeded: false,
  followUpAt: '',
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [assignableUsers, setAssignableUsers] = useState([])
  const [error, setError] = useState('')
  const [savingField, setSavingField] = useState('')
  const [converting, setConverting] = useState(false)

  const [callForm, setCallForm] = useState(emptyCallForm)
  const [loggingCall, setLoggingCall] = useState(false)
  const [callError, setCallError] = useState('')

  function load() {
    api.get(`/admin/leads/${id}`).then((data) => setLead(data.lead)).catch((err) => setError(err.message))
  }

  useEffect(load, [id])
  useEffect(() => {
    api.get('/tickets/assignable-users').then((data) => setAssignableUsers(data.users)).catch(() => {})
  }, [])

  async function updateField(field, value) {
    setSavingField(field)
    setError('')
    try {
      const data = await api.put(`/admin/leads/${id}`, { [field]: value })
      setLead((prev) => ({ ...prev, ...data.lead }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingField('')
    }
  }

  async function handleConvert() {
    if (!confirm(`Convert "${lead.name}" to a client? This creates a new client record.`)) return
    setConverting(true)
    setError('')
    try {
      const data = await api.post(`/admin/leads/${id}/convert`, {})
      navigate(`/admin/clients`, { state: { newClientId: data.client.id } })
    } catch (err) {
      setError(err.message)
      setConverting(false)
    }
  }

  async function handleLogCall(e) {
    e.preventDefault()
    if (!callForm.notes.trim()) return
    setLoggingCall(true)
    setCallError('')
    try {
      await api.post(`/admin/leads/${id}/calls`, {
        calledAt: new Date(callForm.calledAt).toISOString(),
        durationMinutes: callForm.durationMinutes || undefined,
        notes: callForm.notes,
        followUpNeeded: callForm.followUpNeeded,
        followUpAt: callForm.followUpNeeded && callForm.followUpAt ? new Date(callForm.followUpAt).toISOString() : undefined,
      })
      setCallForm(emptyCallForm)
      load()
    } catch (err) {
      setCallError(err.message)
    } finally {
      setLoggingCall(false)
    }
  }

  async function handleMarkDone(callId) {
    try {
      await api.put(`/admin/leads/${id}/calls/${callId}`, { followUpDone: true })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !lead) {
    return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
  }
  if (!lead) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <Link to="/admin/leads" className="text-sm text-[#0B1F3A] hover:underline">← All leads</Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-[#0B1F3A] break-words">{lead.name}</h1>
          <div className="mt-1 text-sm text-slate-500">
            {lead.company || 'No company'} · created {formatDateTime(lead.createdAt)}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <select
            value={lead.status}
            disabled={savingField === 'status'}
            onChange={(e) => updateField('status', e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          {lead.status !== 'WON' && (
            <button
              onClick={handleConvert}
              disabled={converting}
              className="rounded-md bg-[#0B1F3A] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
            >
              {converting ? 'Converting…' : 'Convert to client'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <span>Assigned to:</span>
        <select
          value={lead.assignedTo?.id || ''}
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

      <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:text-sm">
        <div><span className="text-slate-500">Email:</span> {lead.email || '—'}</div>
        <div><span className="text-slate-500">Phone:</span> {lead.phone || '—'}</div>
        <div><span className="text-slate-500">Source:</span> {lead.source || '—'}</div>
        <div><span className="text-slate-500">Last contacted:</span> {formatDateTime(lead.lastContactedAt)}</div>
        {lead.nextFollowUpAt && (
          <div className="sm:col-span-2">
            <span className="text-slate-500">Next follow-up:</span>{' '}
            <span className={new Date(lead.nextFollowUpAt) < new Date() ? 'font-medium text-red-600' : ''}>
              {formatDateTime(lead.nextFollowUpAt)}
            </span>
          </div>
        )}
        {lead.notes && (
          <div className="sm:col-span-2">
            <span className="text-slate-500">Notes:</span> <span className="whitespace-pre-wrap">{lead.notes}</span>
          </div>
        )}
      </div>

      <h2 className="mt-6 text-sm font-semibold text-slate-800">Call history</h2>
      <div className="mt-2 space-y-3">
        {lead.calls.map((call) => (
          <div key={call.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                {formatDateTime(call.calledAt)} · {call.createdBy?.name}
                {call.durationMinutes ? ` · ${call.durationMinutes} min` : ''}
              </span>
              {call.followUpNeeded && (
                <span className={call.followUpDone ? 'text-emerald-600' : 'text-amber-600'}>
                  {call.followUpDone ? 'Follow-up done' : `Follow-up due ${formatDateTime(call.followUpAt)}`}
                </span>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{call.notes}</p>
            {call.followUpNeeded && !call.followUpDone && (
              <button
                onClick={() => handleMarkDone(call.id)}
                className="mt-2 text-xs font-medium text-[#0B1F3A] hover:underline"
              >
                Mark follow-up done
              </button>
            )}
          </div>
        ))}
        {lead.calls.length === 0 && <div className="text-sm text-slate-400">No calls logged yet.</div>}
      </div>

      <form onSubmit={handleLogCall} className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Log a call</h2>
        {callError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{callError}</div>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">When</label>
            <input
              type="datetime-local"
              value={callForm.calledAt}
              onChange={(e) => setCallForm({ ...callForm, calledAt: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</label>
            <input
              type="number"
              min="0"
              value={callForm.durationMinutes}
              onChange={(e) => setCallForm({ ...callForm, durationMinutes: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Notes / minutes of the call</label>
          <textarea
            required
            rows={3}
            value={callForm.notes}
            onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={callForm.followUpNeeded}
            onChange={(e) => setCallForm({ ...callForm, followUpNeeded: e.target.checked })}
            className="rounded border-slate-300"
          />
          Needs a follow-up
        </label>
        {callForm.followUpNeeded && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Follow-up date/time</label>
            <input
              type="datetime-local"
              required
              value={callForm.followUpAt}
              onChange={(e) => setCallForm({ ...callForm, followUpAt: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:max-w-xs"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loggingCall}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {loggingCall ? 'Saving…' : 'Log call'}
        </button>
      </form>
    </div>
  )
}
