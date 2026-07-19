import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatDate } from '../format'

export default function TimesheetsAdminPage() {
  const [timesheets, setTimesheets] = useState([])
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [userId, setUserId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/users').then((data) => setUsers(data.users)).catch(() => {})
    api.get('/admin/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  function load() {
    const params = new URLSearchParams()
    if (userId) params.set('userId', userId)
    if (projectId) params.set('projectId', projectId)
    api
      .get(`/admin/timesheets${params.toString() ? `?${params}` : ''}`)
      .then((data) => setTimesheets(data.timesheets))
      .catch((err) => setError(err.message))
  }

  useEffect(load, [userId, projectId])

  const totalHours = timesheets.reduce((sum, t) => sum + (Number(t.hours) || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Timesheets</h1>

      <div className="mt-4 flex gap-3">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        >
          <option value="">All employees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Billable</th>
              <th className="px-4 py-3 font-medium text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">{t.user?.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.project?.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.taskDescription}</td>
                <td className="px-4 py-3 text-slate-600">{t.billable ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right text-slate-600">{Number(t.hours).toFixed(2)}</td>
              </tr>
            ))}
            {timesheets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No timesheet entries yet.
                </td>
              </tr>
            )}
          </tbody>
          {timesheets.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <td className="px-4 py-3" colSpan={5}>
                  Total
                </td>
                <td className="px-4 py-3 text-right">{totalHours.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
        </div>
      </div>
    </div>
  )
}
