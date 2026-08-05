import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertTriangle } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

/* ─── Schema Injection ──────────────────────────────────────────────────── */
function usePageSchema() {
  useEffect(() => {
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'HSN & SAC Code Lookup',
      'description': 'A curated reference of common HSN and SAC codes for pharmacy and general retail businesses in India, with typical GST rates.',
      'url': 'https://www.aadhiraiinnovations.com/tools/hsn-sac-lookup',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    }
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Is this the complete official HSN/SAC list?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'No. The official CBIC HSN list has over 20,000 entries. This is a curated reference of the codes most commonly used by pharmacy and general retail businesses — always confirm the exact code and rate for your specific product on the GST portal or with your supplier invoice.' },
        },
        {
          '@type': 'Question',
          'name': 'Why do some medicine HSN codes show a rate range?',
          'acceptedAnswer': { '@type': 'Answer', 'text': 'Medicaments under HSN 3003/3004 span multiple GST rates (0%, 5%, or 12%) depending on the specific formulation — the exact rate depends on the product, not just the HSN heading.' },
        },
      ],
    }
    const wpScript = document.createElement('script')
    wpScript.type = 'application/ld+json'
    wpScript.setAttribute('data-schema', 'webapplication')
    wpScript.text = JSON.stringify(webAppSchema)
    document.head.appendChild(wpScript)
    const faqScript = document.createElement('script')
    faqScript.type = 'application/ld+json'
    faqScript.setAttribute('data-schema', 'faqpage')
    faqScript.text = JSON.stringify(faqSchema)
    document.head.appendChild(faqScript)
    return () => { wpScript.remove(); faqScript.remove() }
  }, [])
}

// Curated reference — NOT the full official CBIC HSN/SAC master (20,000+ entries). Focused on
// codes a pharmacy or general retail business runs into most often. Verify exact codes/rates
// for your specific product on the GST portal before filing.
const CODES = [
  { code: '3003', type: 'HSN', desc: 'Medicaments (not put up in measured doses / retail form)', rate: '5% / 12%' },
  { code: '3004', type: 'HSN', desc: 'Medicaments (measured doses, retail packing)', rate: '0% / 5% / 12%' },
  { code: '3002', type: 'HSN', desc: 'Vaccines, blood fractions, antisera', rate: '5%' },
  { code: '3005', type: 'HSN', desc: 'Wadding, gauze, bandages, medical dressings', rate: '12%' },
  { code: '3006', type: 'HSN', desc: 'Pharmaceutical goods — first-aid kits, contraceptives, dental cements', rate: '12%' },
  { code: '2941', type: 'HSN', desc: 'Antibiotics (bulk)', rate: '5%' },
  { code: '2942', type: 'HSN', desc: 'Other organic compounds (bulk drugs)', rate: '5% / 18%' },
  { code: '9018', type: 'HSN', desc: 'Medical, surgical, dental, veterinary instruments', rate: '12%' },
  { code: '9019', type: 'HSN', desc: 'Physiotherapy, massage, ozone therapy apparatus', rate: '12%' },
  { code: '9021', type: 'HSN', desc: 'Orthopaedic appliances, hearing aids, splints', rate: '5%' },
  { code: '3822', type: 'HSN', desc: 'Diagnostic or laboratory reagents, test kits', rate: '12%' },
  { code: '3401', type: 'HSN', desc: 'Soap and organic surface-active products', rate: '18%' },
  { code: '3304', type: 'HSN', desc: 'Beauty and skincare preparations', rate: '18%' },
  { code: '3306', type: 'HSN', desc: 'Oral / dental hygiene preparations', rate: '18%' },
  { code: '4818', type: 'HSN', desc: 'Paper-based sanitary and hygiene products', rate: '12% / 18%' },
  { code: '1901', type: 'HSN', desc: 'Malt extract, food preparations (incl. baby food)', rate: '5% / 18%' },
  { code: '2106', type: 'HSN', desc: 'Food supplements / nutraceutical preparations', rate: '18%' },
  { code: '3923', type: 'HSN', desc: 'Plastic packaging articles (bottles, containers)', rate: '18%' },
  { code: '4819', type: 'HSN', desc: 'Cartons, boxes, packaging of paper/paperboard', rate: '18%' },
  { code: '8471', type: 'HSN', desc: 'Computers, POS terminals, billing hardware', rate: '18%' },
  { code: '8443', type: 'HSN', desc: 'Printers (incl. thermal receipt printers)', rate: '18%' },
  { code: '4911', type: 'HSN', desc: 'Printed materials — invoices, labels, brochures', rate: '12%' },
  { code: '998311', type: 'SAC', desc: 'Management consulting services', rate: '18%' },
  { code: '997212', type: 'SAC', desc: 'Rental / leasing of commercial property (shop rent)', rate: '18%' },
  { code: '998719', type: 'SAC', desc: 'Maintenance and repair of equipment', rate: '18%' },
  { code: '997331', type: 'SAC', desc: 'Licensing for right to use software / IT services', rate: '18%' },
  { code: '998599', type: 'SAC', desc: 'Other business support services', rate: '18%' },
]

/* ─── Lookup ─────────────────────────────────────────────────────────────── */
function HsnSacLookup() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CODES
    return CODES.filter((c) => c.code.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or product — e.g. bandages, 3004, rent"
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/20 focus:border-[#0B1F3A] text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left">
              <th className="px-4 py-3 font-semibold text-[#0B1F3A] text-xs uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 font-semibold text-[#0B1F3A] text-xs uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 font-semibold text-[#0B1F3A] text-xs uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 font-semibold text-[#0B1F3A] text-xs uppercase tracking-wider">Typical GST</th>
            </tr>
          </thead>
          <tbody>
            {results.map((c) => (
              <tr key={c.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-[#0B1F3A]">{c.code}</td>
                <td className="px-4 py-3 text-slate-500">{c.type}</td>
                <td className="px-4 py-3 text-slate-600">{c.desc}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{c.rate}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No matches in this reference list. Check the GST portal for codes outside pharmacy/retail.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-none" strokeWidth={1.75} />
        <p className="text-xs text-amber-800 leading-relaxed">
          This is a curated reference of {CODES.length} commonly-used codes, not the full official CBIC HSN/SAC master list. Rates can vary by exact product formulation — confirm on the GST portal before filing.
        </p>
      </div>
    </div>
  )
}

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function HsnSacLookupPage() {
  usePageSchema()

  return (
    <>
      <ToolPageHero
        title="HSN & SAC Code Lookup"
        description="A curated reference of common HSN and SAC codes for pharmacy and general retail businesses, with typical GST rates."
        breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'HSN & SAC Lookup' }]}
        badge="Free Tool"
      />

      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10">
              <HsnSacLookup />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-slate-50 border-b border-slate-100 py-16 md:py-20 lg:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-slate-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Understanding HSN &amp; SAC</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0B1F3A] sm:text-4xl leading-[1.2] mb-6">
              HSN codes goods, SAC codes services
            </h2>
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                HSN (Harmonized System of Nomenclature) codes classify physical goods for GST — every medicine, bandage, or piece of equipment you sell needs the right HSN on the invoice. SAC (Services Accounting Code) does the same job for services, like rent or consulting.
              </p>
              <p>
                Getting the code wrong doesn't just look sloppy — it can mean the wrong tax rate applied, which shows up as a mismatch during a GST audit. For pharmacies specifically, the same HSN heading (like 3004 for medicines) can span multiple GST rates depending on the exact formulation, so the code alone doesn't always tell you the rate.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <ToolFaqSection
        title="HSN & SAC Lookup Questions"
        items={[
          { q: 'Is this the complete official HSN/SAC list?', a: 'No — the official CBIC list has 20,000+ entries. This covers the codes most relevant to pharmacy and general retail. Confirm exact codes on the GST portal.' },
          { q: 'Why do some codes show a rate range?', a: 'Medicaments under 3003/3004 span 0%, 5%, and 12% depending on the specific formulation — the code alone doesn\'t fix the rate.' },
          { q: 'Where can I check the official rate for my product?', a: 'The GST portal (cbic-gst.gov.in) publishes the full rate schedule by HSN/SAC code. Your supplier invoice usually also states the applicable code.' },
        ]}
      />

      <ToolCta
        headline="Need HSN codes applied automatically on every invoice?"
        body="Medora+ and Aadhirai Billing auto-assign HSN codes and the correct GST rate per product — no manual lookup at the counter."
        ctas={[
          { label: 'Explore Medora+', href: '/products/medora-plus', primary: true },
          { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false },
        ]}
      />
    </>
  )
}
