import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'

const POLL_INTERVAL_MS = 4000

function contactLabel(conversation) {
  return conversation?.client?.name || conversation?.lead?.name || conversation?.contactNumber
}

export default function WhatsAppConversationPage() {
  const { id } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  function load() {
    api
      .get(`/whatsapp/conversations/${id}/messages`)
      .then((data) => {
        setConversation(data.conversation)
        setMessages(data.messages)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  useEffect(() => {
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleReply(e) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setError('')
    try {
      await api.post(`/whatsapp/conversations/${id}/messages`, { body: reply })
      setReply('')
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (error && !conversation) {
    return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
  }
  if (loading || !conversation) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <Link to="/admin/whatsapp" className="text-sm text-[#0B1F3A] hover:underline">← All conversations</Link>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A] break-words">{contactLabel(conversation)}</h1>
        <div className="mt-1 text-sm text-slate-500">{conversation.contactNumber}</div>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-4 shadow-sm ${
              m.direction === 'OUTBOUND' ? 'border-blue-100 bg-blue-50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{m.direction === 'OUTBOUND' ? (m.sentByBot ? 'Bot' : 'You') : contactLabel(conversation)}</span>
              <span>{formatDateTime(m.createdAt)}</span>
            </div>
            {m.body ? (
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.body}</p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-400">[{m.messageType.toLowerCase()}]</p>
            )}
            {m.status === 'FAILED' && (
              <div className="mt-2 text-xs font-medium text-red-500">Failed to send</div>
            )}
          </div>
        ))}
        {messages.length === 0 && <div className="text-slate-400">No messages yet.</div>}
      </div>

      <form onSubmit={handleReply} className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder="Write a reply…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <div className="mt-2 flex justify-end">
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
