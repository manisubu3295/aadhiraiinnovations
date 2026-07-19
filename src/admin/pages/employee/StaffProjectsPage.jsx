import { useEffect, useState } from 'react'
import { api } from '../../api'
import { StatusBadge } from '../ProjectsPage'

export default function StaffProjectsPage() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/employee/projects').then((data) => setProjects(data.projects)).catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0B1F3A]">Projects</h1>

      {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-slate-400">
                  No projects yet.
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
