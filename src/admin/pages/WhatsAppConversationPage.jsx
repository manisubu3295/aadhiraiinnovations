import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'

const POLL_INTERVAL_MS = 4000

function contactLabel(conversation) {
  return conversation?.client?.name || conversation?.lead?.name || conversation?.contactNumber
}

// Same pattern as TicketDetailPage.jsx's AttachmentList — a plain relative /api/... path, not an
// absolute API_BASE url, since this is served same-origin with the admin app and the browser
// already sends the auth cookie on a normal <img>/<video>/<audio>/<a> resource request.
function mediaUrl(conversationId, messageId) {
  return `/api/whatsapp/conversations/${conversationId}/messages/${messageId}/media`
}

const NON_MEDIA_LABELS = {
  LOCATION: '📍 Location shared',
  CONTACTS: '👤 Contact shared',
  REACTION: '👍 Reacted',
  INTERACTIVE: '[interactive message]',
  OTHER: '[unsupported message type]',
}

function MediaAttachment({ conversation, message }) {
  const { media, messageType } = message
  if (!media) return <p className="mt-2 text-sm italic text-slate-400">{NON_MEDIA_LABELS[messageType] || `[${messageType.toLowerCase()}]`}</p>

  if (media.downloadStatus === 'PENDING' || media.downloadStatus === 'DOWNLOADING') {
    return <p className="mt-2 text-xs italic text-slate-400">Downloading attachment…</p>
  }
  if (media.downloadStatus === 'REJECTED_SIZE') {
    return <p className="mt-2 text-xs italic text-red-500">Attachment too large to download ({Math.round((media.fileSize || 0) / 1024 / 1024)}MB).</p>
  }
  if (media.downloadStatus === 'FAILED') {
    return <p className="mt-2 text-xs italic text-red-500">Couldn't download this attachment.</p>
  }

  const src = mediaUrl(conversation.id, message.id)
  switch (messageType) {
    case 'IMAGE':
    case 'STICKER':
      return <img src={src} alt={media.caption || 'attachment'} className="mt-2 max-w-xs rounded-lg border border-slate-200" />
    case 'VIDEO':
      return <video src={src} controls className="mt-2 max-w-xs rounded-lg border border-slate-200" />
    case 'AUDIO':
      return (
        <div className="mt-2">
          {media.isVoiceNote && <div className="mb-1 text-xs font-medium text-slate-400">🎤 Voice note</div>}
          <audio src={src} controls className="max-w-xs" />
        </div>
      )
    case 'DOCUMENT':
      return (
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 hover:underline"
        >
          📎 {media.originalFilename || 'Document'}
        </a>
      )
    default:
      return null
  }
}

export default function WhatsAppConversationPage() {
  const { id } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [file, setFile] = useState(null)
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
    if (!reply.trim() && !file) return
    setSending(true)
    setError('')
    try {
      if (file) {
        const form = new FormData()
        form.set('file', file)
        if (reply.trim()) form.set('caption', reply.trim())
        await api.postForm(`/whatsapp/conversations/${id}/media`, form)
      } else {
        await api.post(`/whatsapp/conversations/${id}/messages`, { body: reply })
      }
      setReply('')
      setFile(null)
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
            <MediaAttachment conversation={conversation} message={m} />
            {m.body && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.body}</p>}
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
          placeholder={file ? 'Add a caption (optional)…' : 'Write a reply…'}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="max-w-full text-xs text-slate-500"
          />
          <button
            type="submit"
            disabled={sending || (!reply.trim() && !file)}
            className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60 sm:shrink-0"
          >
            {sending ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      </form>
    </div>
  )
}
