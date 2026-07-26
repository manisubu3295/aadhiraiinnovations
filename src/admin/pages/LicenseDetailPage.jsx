import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { formatDateTime } from '../format'

const LICENSE_PLAN_LABELS = { THREE_MONTH: '3 Months', SIX_MONTH: '6 Months', ONE_YEAR: '1 Year' }

export default function LicenseDetailPage() {
  const { id } = useParams()
  const [license, setLicense] = useState(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  function load() {
    api.get(`/licenses/${id}`).then((data) => setLicense(data.license)).catch((err) => setError(err.message))
  }

  useEffect(load, [id])

  async function handleGenerate() {
    setGenerating(true)
    setGenerateError('')
    try {
      const data = await api.post(`/licenses/${id}/generate`, {})
      setLicense(data.license)
    } catch (err) {
      setGenerateError(err.message)
      load()
    } finally {
      setGenerating(false)
    }
  }

  if (error) return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
  if (!license) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div>
      <Link to="/admin/licenses" className="text-sm text-slate-500 hover:text-[#0B1F3A]">
        ← Back to Licenses
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">{license.customerName}</h1>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            license.status === 'FULFILLED'
              ? 'bg-emerald-100 text-emerald-700'
              : license.status === 'FAILED'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {license.status}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-slate-500">Email:</span> {license.email}</div>
          <div><span className="text-slate-500">WhatsApp:</span> {license.whatsapp || '—'}</div>
          <div><span className="text-slate-500">Business:</span> {license.businessName || '—'}</div>
          <div><span className="text-slate-500">Plan:</span> {LICENSE_PLAN_LABELS[license.plan] || license.plan}</div>
          <div><span className="text-slate-500">Machine ID:</span> {license.machineId}</div>
          <div>
            <span className="text-slate-500">Source:</span>{' '}
            {license.lead ? (
              <Link to={`/admin/leads/${license.lead.id}`} className="text-[#0B1F3A] hover:underline">
                {license.lead.name} (Lead)
              </Link>
            ) : (
              'Manually created'
            )}
          </div>
          {license.status === 'FULFILLED' && (
            <>
              <div><span className="text-slate-500">License ID:</span> {license.licenseId || '—'}</div>
              <div><span className="text-slate-500">Issued:</span> {formatDateTime(license.issuedAt)}</div>
              <div><span className="text-slate-500">Expires:</span> {formatDateTime(license.expiresAt)}</div>
            </>
          )}
        </div>

        {license.status === 'FAILED' && license.errorMessage && (
          <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{license.errorMessage}</div>
        )}
        {generateError && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{generateError}</div>}

        {license.status !== 'FULFILLED' && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-4 rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
          >
            {generating ? 'Generating…' : license.status === 'FAILED' ? 'Retry' : 'Generate & Send License'}
          </button>
        )}
      </div>
    </div>
  )
}
