import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'

function contactLabel(conversation) {
  return conversation.client?.name || conversation.lead?.name || conversation.contactNumber
}

export default function WhatsAppInboxPage() {
  const [conversations, setConversations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  function load() {
    api
      .get('/whatsapp/conversations')
      .then((data) => setConversations(data.conversations))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">WhatsApp</h1>
      <p className="mt-1 text-sm text-slate-500">Conversations with whoever messages your connected WhatsApp number.</p>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Last message</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Unread</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/whatsapp/${c.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                      {contactLabel(c)}
                    </Link>
                    <div className="text-slate-500">{c.contactNumber}</div>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-slate-600">{c.lastMessagePreview || '—'}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDateTime(c.lastMessageAt)}</td>
                  <td className="px-4 py-3">
                    {c.unreadCount > 0 && (
                      <span className="rounded-full bg-[#0B1F3A] px-2 py-0.5 text-xs font-medium text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {conversations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No WhatsApp conversations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
