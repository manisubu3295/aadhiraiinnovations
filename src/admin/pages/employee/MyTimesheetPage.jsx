import { useEffect, useState } from 'react'
import { api } from '../../api'
import { formatDate } from '../../format'

const emptyForm = { projectId: '', date: '', hours: '', taskDescription: '', billable: true }

export default function MyTimesheetPage() {
  const [timesheets, setTimesheets] = useState([])
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function load() {
    api.get('/employee/timesheets').then((data) => setTimesheets(data.timesheets)).catch((err) => setError(err.message))
  }

  useEffect(() => {
    load()
    api.get('/employee/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/employee/timesheets', {
        ...form,
        hours: Number(form.hours) || 0,
        date: form.date || undefined,
      })
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this timesheet entry?')) return
    try {
      await api.del(`/employee/timesheets/${id}`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const totalHours = timesheets.reduce((sum, t) => sum + (Number(t.hours) || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">My Timesheet</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <select
          required
          value={form.projectId}
          onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        >
          <option value="" disabled>
            Select project
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <input
          type="number"
          min="0.25"
          step="0.25"
          required
          placeholder="Hours"
          value={form.hours}
          onChange={(e) => setForm({ ...form, hours: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
        />
        <input
          required
          placeholder="Task description"
          value={form.taskDescription}
          onChange={(e) => setForm({ ...form, taskDescription: e.target.value })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30 lg:col-span-1"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Log hours'}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium text-right">Hours</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {timesheets.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
                <td className="px-4 py-3 text-slate-600">{t.project?.name}</td>
                <td className="px-4 py-3 text-slate-600">{t.taskDescription}</td>
                <td className="px-4 py-3 text-right text-slate-600">{Number(t.hours).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {timesheets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No entries logged yet.
                </td>
              </tr>
            )}
          </tbody>
          {timesheets.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <td className="px-4 py-3" colSpan={3}>
                  Total
                </td>
                <td className="px-4 py-3 text-right">{totalHours.toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
