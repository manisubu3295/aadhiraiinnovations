import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import Container from '../components/ui/Container'
import ToolPageHero from '../components/tools/ToolPageHero'
import ToolFaqSection from '../components/tools/ToolFaqSection'
import ToolCta from '../components/tools/ToolCta'

function usePageSchema() {
  useEffect(() => {
    const webAppSchema = { '@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Schema Markup Generator', 'description': 'Free JSON-LD schema markup generator for Article, Product, FAQPage, and LocalBusiness structured data.', 'url': 'https://www.aadhiraiinnovations.com/tools/schema-markup-generator', 'applicationCategory': 'UtilitiesApplication', 'operatingSystem': 'Web Browser', 'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' } }
    const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
      { '@type': 'Question', 'name': 'What is JSON-LD schema markup?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Structured data in JSON format that tells search engines exactly what your content is — an article, product, FAQ, or business — which can unlock rich results in search listings.' } },
      { '@type': 'Question', 'name': 'Where do I put the generated code?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Paste it inside a <script type="application/ld+json"> tag in your page\'s <head> or <body>.' } },
    ] }
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.setAttribute('data-schema', 'webapplication'); s1.text = JSON.stringify(webAppSchema); document.head.appendChild(s1)
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.setAttribute('data-schema', 'faqpage'); s2.text = JSON.stringify(faqSchema); document.head.appendChild(s2)
    return () => { s1.remove(); s2.remove() }
  }, [])
}

const TYPES = ['Article', 'Product', 'FAQPage', 'LocalBusiness']

function buildSchema(type, f) {
  switch (type) {
    case 'Article':
      return { '@context': 'https://schema.org', '@type': 'Article', headline: f.headline, author: { '@type': 'Person', name: f.author }, datePublished: f.date, image: f.image, description: f.description }
    case 'Product':
      return { '@context': 'https://schema.org', '@type': 'Product', name: f.name, description: f.description, image: f.image, offers: { '@type': 'Offer', price: f.price, priceCurrency: 'INR' } }
    case 'FAQPage':
      return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: (f.faqs || []).filter((q) => q.q && q.a).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) }
    case 'LocalBusiness':
      return { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: f.name, telephone: f.phone, address: f.address, url: f.image }
    default:
      return {}
  }
}

function SchemaMarkupGenerator() {
  const [type, setType] = useState('Article')
  const [fields, setFields] = useState({ faqs: [{ q: '', a: '' }, { q: '', a: '' }] })
  const [copyFeedback, setCopyFeedback] = useState(false)

  const update = (k, v) => setFields((f) => ({ ...f, [k]: v }))
  const updateFaq = (i, k, v) => setFields((f) => { const faqs = [...f.faqs]; faqs[i] = { ...faqs[i], [k]: v }; return { ...f, faqs } })

  const output = JSON.stringify(buildSchema(type, fields), null, 2)

  const copy = async () => { try { await navigator.clipboard.writeText(`<script type="application/ld+json">\n${output}\n</script>`); setCopyFeedback(true); setTimeout(() => setCopyFeedback(false), 2000) } catch (e) { console.error(e) } }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Schema Type</label>
        <div className="flex flex-wrap gap-2">{TYPES.map((t) => (<button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${type === t ? 'bg-[#0B1F3A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-150'}`}>{t}</button>))}</div>
      </div>

      {type === 'Article' && (<div className="grid gap-4 sm:grid-cols-2">
        <input placeholder="Headline" value={fields.headline || ''} onChange={(e) => update('headline', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Author Name" value={fields.author || ''} onChange={(e) => update('author', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input type="date" value={fields.date || ''} onChange={(e) => update('date', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Image URL" value={fields.image || ''} onChange={(e) => update('image', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <textarea placeholder="Description" value={fields.description || ''} onChange={(e) => update('description', e.target.value)} className="sm:col-span-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm" rows={2} />
      </div>)}
      {type === 'Product' && (<div className="grid gap-4 sm:grid-cols-2">
        <input placeholder="Product Name" value={fields.name || ''} onChange={(e) => update('name', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Price (₹)" value={fields.price || ''} onChange={(e) => update('price', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Image URL" value={fields.image || ''} onChange={(e) => update('image', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <textarea placeholder="Description" value={fields.description || ''} onChange={(e) => update('description', e.target.value)} className="sm:col-span-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm" rows={2} />
      </div>)}
      {type === 'FAQPage' && (<div className="space-y-3">
        {fields.faqs.map((q, i) => (<div key={i} className="grid gap-2 sm:grid-cols-2">
          <input placeholder={`Question ${i + 1}`} value={q.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
          <input placeholder={`Answer ${i + 1}`} value={q.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        </div>))}
        <button onClick={() => update('faqs', [...fields.faqs, { q: '', a: '' }])} className="text-xs font-semibold text-[#0B1F3A] hover:underline">+ Add another question</button>
      </div>)}
      {type === 'LocalBusiness' && (<div className="grid gap-4 sm:grid-cols-2">
        <input placeholder="Business Name" value={fields.name || ''} onChange={(e) => update('name', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Phone" value={fields.phone || ''} onChange={(e) => update('phone', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Website URL" value={fields.image || ''} onChange={(e) => update('image', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
        <input placeholder="Address" value={fields.address || ''} onChange={(e) => update('address', e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm" />
      </div>)}

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
        <pre className="text-xs font-mono text-[#0B1F3A] overflow-x-auto whitespace-pre-wrap">{output}</pre>
      </div>
      <button onClick={copy} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${copyFeedback ? 'bg-green-100 text-green-700' : 'bg-[#0B1F3A] text-white hover:bg-[#173762]'}`}><Copy className="h-4 w-4" />{copyFeedback ? 'Copied!' : 'Copy Script Tag'}</button>
    </div>
  )
}

export default function SchemaMarkupGeneratorPage() {
  usePageSchema()
  return (
    <>
      <ToolPageHero title="Schema Markup Generator" description="Generate JSON-LD structured data for Article, Product, FAQPage, and LocalBusiness — paste straight into your page." breadcrumbItems={[{ label: 'Tools', href: '/tools' }, { label: 'Schema Markup Generator' }]} badge="Free Tool" />
      <section className="bg-white border-b border-slate-100 py-12 md:py-16 lg:py-20">
        <Container><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto"><div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 md:p-10"><SchemaMarkupGenerator /></div></motion.div></Container>
      </section>
      <ToolFaqSection title="Schema Markup Questions" items={[
        { q: 'What is JSON-LD schema markup?', a: 'Structured data telling search engines what your content is — can unlock rich results in search listings.' },
        { q: 'Where do I put the generated code?', a: 'Inside a <script type="application/ld+json"> tag in your page\'s <head> or <body>.' },
      ]} />
      <ToolCta headline="Need SEO built into your website from day one?" body="Aadhirai Innovations builds custom websites and web applications with SEO and structured data done right." ctas={[{ label: 'Explore Solutions', href: '/solutions/erp-automation', primary: true }, { label: 'Talk to Us', href: 'https://wa.me/918508716957', primary: false }]} />
    </>
  )
}
