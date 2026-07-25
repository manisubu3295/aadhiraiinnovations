import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

function triggerSummary(flow) {
  if (flow.triggerType === 'KEYWORD') {
    return flow.triggerKeywords?.length ? `Keywords: ${flow.triggerKeywords.join(', ')}` : 'Keywords: (none set)'
  }
  return 'Any message'
}

export default function ChatFlowsPage() {
  const [flows, setFlows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [togglingId, setTogglingId] = useState('')
  const navigate = useNavigate()

  function load() {
    api
      .get('/whatsapp/flows')
      .then((data) => setFlows(data.flows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleCreate() {
    const name = window.prompt('Flow name (e.g. "New enquiry bot")')
    if (!name?.trim()) return
    setCreating(true)
    setError('')
    try {
      const data = await api.post('/whatsapp/flows', { name: name.trim() })
      navigate(`/admin/whatsapp/flows/${data.flow.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function toggleActive(flow) {
    setTogglingId(flow.id)
    setError('')
    try {
      await api.put(`/whatsapp/flows/${flow.id}/active`, { isActive: !flow.isActive })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setTogglingId('')
    }
  }

  if (loading) return <div className="text-slate-400">Loading…</div>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1F3A]">Chatbot flows</h1>
          <p className="mt-1 text-sm text-slate-500">Automated WhatsApp replies for your conversations.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {creating ? 'Creating…' : 'New flow'}
        </button>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Trigger</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {flows.map((f) => (
                <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/whatsapp/flows/${f.id}`} className="font-medium text-[#0B1F3A] hover:underline">
                      {f.name}
                    </Link>
                    {f.archivedAt && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Archived</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{triggerSummary(f)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        f.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {f.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleActive(f)}
                      disabled={togglingId === f.id || Boolean(f.archivedAt)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-60"
                    >
                      {togglingId === f.id ? 'Saving…' : f.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {flows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No flows yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
