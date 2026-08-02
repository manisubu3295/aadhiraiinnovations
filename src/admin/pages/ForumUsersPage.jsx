import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatDate } from '../format'

const PAGE_SIZE = 25

export default function ForumUsersPage() {
  const [forumUsers, setForumUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [error, setError] = useState('')

  function load() {
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (q) params.set('q', q)
    api
      .get(`/admin/forum/users?${params.toString()}`)
      .then((data) => {
        setForumUsers(data.forumUsers)
        setTotal(data.total)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(load, [page, q])

  async function toggleBan(forumUser) {
    const nextStatus = forumUser.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
    if (!confirm(nextStatus === 'BANNED' ? `Ban ${forumUser.name}? They will no longer be able to log in or post.` : `Unban ${forumUser.name}?`)) return
    try {
      await api.put(`/admin/forum/users/${forumUser.id}`, { status: nextStatus })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">Forum Users</h1>
        <input
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value) }}
          placeholder="Search name or email…"
          className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Questions</th>
                <th className="px-4 py-3 font-medium">Answers</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {forumUsers.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {u.name}
                    {u.linkedUser && (
                      <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700" title={`Linked to client login: ${u.linkedUser.username}`}>
                        Client: {u.linkedUser.username}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'BANNED' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u._count.questions}</td>
                  <td className="px-4 py-3 text-slate-600">{u._count.answers}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleBan(u)} className={u.status === 'BANNED' ? 'text-emerald-600 hover:underline' : 'text-red-600 hover:underline'}>
                      {u.status === 'BANNED' ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
              {forumUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">No forum users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
