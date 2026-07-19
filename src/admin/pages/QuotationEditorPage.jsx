import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { calculateTotals } from '../../../shared/pricing.js'
import DocumentBuilderLayout from '../../business-tools/components/DocumentBuilderLayout'
import LeftPanelSection from '../../business-tools/components/LeftPanelSection'
import ItemTable from '../../business-tools/components/ItemTable'
import PricingSummary from '../../business-tools/components/PricingSummary'
import PrintButton from '../../business-tools/components/PrintButton'
import PrintView from '../../business-tools/components/PrintView'
import DocumentPreview from '../../business-tools/components/DocumentPreview'

const defaultSeller = { businessName: 'Aadhirai Innovations', contactPerson: '', address: '', phone: '', email: '', gst: '' }
const defaultItem = { description: '', quantity: 1, unitPrice: 0, tax: 0 }

export default function QuotationEditorPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [seller, setSeller] = useState(() => {
    try {
      return { ...defaultSeller, ...JSON.parse(localStorage.getItem('adminSellerProfile') || '{}') }
    } catch {
      return defaultSeller
    }
  })
  const [clientId, setClientId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [subject, setSubject] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [billingType, setBillingType] = useState('MILESTONE')
  const [items, setItems] = useState([{ ...defaultItem }])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [quotationNumber, setQuotationNumber] = useState('')
  const [scopeOfWork, setScopeOfWork] = useState('')
  const [outOfScope, setOutOfScope] = useState('')
  const [assumptions, setAssumptions] = useState('')
  const [revisionPolicy, setRevisionPolicy] = useState('')
  const [warrantyPeriod, setWarrantyPeriod] = useState('')
  const [ipOwnership, setIpOwnership] = useState('')
  const [techStack, setTechStack] = useState('')

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/clients').then((data) => setClients(data.clients)).catch(() => {})
    api.get('/admin/projects').then((data) => setProjects(data.projects)).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('adminSellerProfile', JSON.stringify(seller))
  }, [seller])

  useEffect(() => {
    if (isNew) return
    api
      .get(`/admin/quotations/${id}`)
      .then(({ quotation }) => {
        setClientId(quotation.clientId)
        setProjectId(quotation.projectId || '')
        setSubject(quotation.subject || '')
        setValidUntil(quotation.validUntil ? quotation.validUntil.slice(0, 10) : '')
        setCurrency(quotation.currency)
        setBillingType(quotation.billingType || 'MILESTONE')
        setItems(quotation.items?.length ? quotation.items : [{ ...defaultItem }])
        setDiscount(Number(quotation.discount) || 0)
        setNotes(quotation.notes || '')
        setTerms(quotation.terms || '')
        setStatus(quotation.status)
        setQuotationNumber(quotation.quotationNumber)
        setScopeOfWork(quotation.scopeOfWork || '')
        setOutOfScope(quotation.outOfScope || '')
        setAssumptions(quotation.assumptions || '')
        setRevisionPolicy(quotation.revisionPolicy || '')
        setWarrantyPeriod(quotation.warrantyPeriod || '')
        setIpOwnership(quotation.ipOwnership || '')
        setTechStack(quotation.techStack || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  const totals = calculateTotals(items, discount)
  const client = clients.find((c) => c.id === clientId)
  const customer = client
    ? { name: client.name, company: client.company, address: client.address, phone: client.phone, email: client.email, gst: client.gstNumber }
    : { name: '', company: '', address: '', phone: '', email: '', gst: '' }

  async function handleSave(e) {
    e.preventDefault()
    if (!clientId) {
      setError('Select a client before saving.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      clientId,
      projectId: projectId || undefined,
      subject,
      validUntil: validUntil || undefined,
      currency,
      billingType,
      items,
      discount,
      notes,
      terms,
      status,
      scopeOfWork,
      outOfScope,
      assumptions,
      revisionPolicy,
      warrantyPeriod,
      ipOwnership,
      techStack,
    }
    try {
      if (isNew) {
        const { quotation } = await api.post('/admin/quotations', payload)
        navigate(`/admin/quotations/${quotation.id}`, { replace: true })
      } else {
        await api.put(`/admin/quotations/${id}`, payload)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleConvert() {
    setConverting(true)
    setError('')
    try {
      const { invoice } = await api.post(`/admin/quotations/${id}/convert-to-invoice`)
      navigate(`/admin/invoices/${invoice.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setConverting(false)
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div>
      <Link to="/admin/quotations" className="text-sm text-slate-500 hover:underline">
        ← Quotations
      </Link>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#0B1F3A]">
          {isNew ? 'New quotation' : quotationNumber}
        </h1>
        {!isNew && ['SENT', 'DRAFT'].includes(status) && (
          <button
            onClick={handleConvert}
            disabled={converting}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {converting ? 'Converting…' : 'Convert to invoice'}
          </button>
        )}
      </div>

      {error && <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

      <div className="mt-4">
        <DocumentBuilderLayout
          left={
            <form className="space-y-6" onSubmit={handleSave}>
              <LeftPanelSection title="Client" icon={<span>👤</span>}>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                >
                  <option value="" disabled>
                    Select a client
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                >
                  <option value="">No linked project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.client?.name})
                    </option>
                  ))}
                </select>
              </LeftPanelSection>

              <LeftPanelSection title="Business Details" icon={<span>🏢</span>}>
                <div className="space-y-2">
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Business Name" value={seller.businessName} onChange={(e) => setSeller((s) => ({ ...s, businessName: e.target.value }))} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Contact Person" value={seller.contactPerson} onChange={(e) => setSeller((s) => ({ ...s, contactPerson: e.target.value }))} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Address" value={seller.address} onChange={(e) => setSeller((s) => ({ ...s, address: e.target.value }))} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Phone" value={seller.phone} onChange={(e) => setSeller((s) => ({ ...s, phone: e.target.value }))} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Email" value={seller.email} onChange={(e) => setSeller((s) => ({ ...s, email: e.target.value }))} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="GST Number (optional)" value={seller.gst} onChange={(e) => setSeller((s) => ({ ...s, gst: e.target.value }))} />
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Document Details" icon={<span>📄</span>}>
                <div className="space-y-2">
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Currency (e.g. INR, USD)" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                  <select
                    value={billingType}
                    onChange={(e) => setBillingType(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                  >
                    <option value="MILESTONE">Milestone-based (fixed price)</option>
                    <option value="HOURLY">Hourly (time &amp; materials)</option>
                  </select>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30"
                  >
                    {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Items" icon={<span>🧾</span>}>
                <ItemTable
                  items={items}
                  onChange={setItems}
                  onAdd={() => setItems([...items, { ...defaultItem }])}
                  onRemove={(idx) => setItems(items.filter((_, i) => i !== idx))}
                  billingType={billingType}
                />
              </LeftPanelSection>

              <LeftPanelSection title="Scope of Work" icon={<span>📐</span>}>
                <div className="space-y-2">
                  <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Scope of Work — what will be built" value={scopeOfWork} onChange={(e) => setScopeOfWork(e.target.value)} />
                  <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Out of Scope — explicitly excluded" value={outOfScope} onChange={(e) => setOutOfScope(e.target.value)} />
                  <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Assumptions & dependencies" value={assumptions} onChange={(e) => setAssumptions(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Revision policy (e.g. 2 rounds included)" value={revisionPolicy} onChange={(e) => setRevisionPolicy(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Warranty period (e.g. 30 days post go-live)" value={warrantyPeriod} onChange={(e) => setWarrantyPeriod(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="IP ownership terms" value={ipOwnership} onChange={(e) => setIpOwnership(e.target.value)} />
                  <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Technology stack" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Pricing Summary" icon={<span>💰</span>}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Discount:</span>
                    <input type="number" min={0} className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </div>
                  <PricingSummary subtotal={totals.subtotal} taxTotal={totals.taxTotal} discount={totals.discount} grandTotal={totals.grandTotal} currency={currency || 'INR'} />
                </div>
              </LeftPanelSection>

              <LeftPanelSection title="Additional Info" icon={<span>📝</span>}>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                <textarea className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/30" placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} />
              </LeftPanelSection>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-[#0B1F3A] py-2 text-sm font-medium text-white hover:bg-[#0B1F3A]/90 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save quotation'}
              </button>
            </form>
          }
          right={
            <>
              <div className="mb-4 flex justify-end">
                <PrintButton targetId="quotation-preview" />
              </div>
              <PrintView>
                <div id="quotation-preview">
                  <DocumentPreview
                    type="quotation"
                    seller={seller}
                    customer={customer}
                    details={{ quotationNumber: quotationNumber || '(unsaved)', validUntil, subject }}
                    items={items}
                    totals={totals}
                    notes={notes}
                    terms={terms}
                    billingType={billingType}
                    sow={{ scopeOfWork, outOfScope, assumptions, revisionPolicy, warrantyPeriod, ipOwnership, techStack }}
                  />
                </div>
              </PrintView>
            </>
          }
        />
      </div>
    </div>
  )
}
