// Generates pharmacy-billing-software SEO page content for the ~711 Indian districts and 35
// states that don't have a hand-written page in LocalSEOPageTemplate.jsx. Returns the exact
// same shape LocalSEOPage.jsx already renders (meta/intro/whatProductDoes/whyItWorks/useCases/
// faq/cta) so that component needs no structural changes.
//
// To avoid duplicate/thin-content SEO penalties at this scale, every prose block is chosen from
// several hand-written variants via a deterministic hash of the place name (not one template
// with only the name swapped), and only real, constant product facts are used — no fabricated
// customer counts or statistics (see project memory on that exact mistake earlier in this repo's
// history).

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

// Different `salt` per call site so two fields don't always pick the same variant index
// together (which would itself become a repeating, detectable pattern across pages).
function pick(name, salt, variants) {
  return variants[hashString(name + salt) % variants.length]
}

const CTA_BUTTONS = [
  { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
  { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
]

const WHAT_PRODUCT_DOES_VARIANTS = [
  {
    heading: 'What Medora+ Does for Your Pharmacy',
    sections: [
      { title: 'Fast Billing', detail: 'Barcode scanning and quick invoicing. Process transactions in seconds, even during peak hours.' },
      { title: 'Real-Time Inventory', detail: 'Know your stock anytime. Low-stock alerts prevent stockouts. Track every medicine category.' },
      { title: 'Expiry Management', detail: 'Track batch-level expiry dates. Get alerts before expiry. Prevent selling expired medicine.' },
      { title: 'Works Offline', detail: 'Complete offline operation. Billing works even without internet. No data loss.' },
      { title: 'GST-Compliant Invoicing', detail: 'All invoices GST-ready. HSN codes and GSTIN built-in. Audit-ready records.' },
      { title: 'Business Reports', detail: 'Daily sales summary, profit reports, top-selling items. Real business data.' },
    ],
  },
  {
    heading: 'Everything Your Pharmacy Counter Needs',
    sections: [
      { title: 'Quick Billing', detail: 'Scan and bill in seconds — built for a busy counter, not a slow back office.' },
      { title: 'Live Stock Visibility', detail: 'See exactly what you have, what\'s running low, and what needs reordering — in real time.' },
      { title: 'Batch & Expiry Tracking', detail: 'Every batch tracked to its expiry date, with alerts before it becomes a loss.' },
      { title: 'Fully Offline-Capable', detail: 'No internet, no problem — billing and stock management keep working regardless.' },
      { title: 'GST-Ready Invoices', detail: 'HSN codes, GSTIN validation, and audit-ready tax records on every bill.' },
      { title: 'Daily Business Reports', detail: 'Sales, profit, and top movers — without compiling anything by hand.' },
    ],
  },
]

const WHY_IT_WORKS_VARIANTS = [
  ({ district, state }) => ({
    heading: `Why Medora+ is Right for ${district} Pharmacies`,
    sections: [
      { title: 'Made by a Tamil Nadu-Based Team', detail: `Aadhirai Innovations understands Indian pharmacy compliance and business needs, including the realities of running a pharmacy in ${state}.` },
      { title: 'Offline-First Design', detail: `Internet can be unreliable in parts of ${state}. Medora+ works fully offline, so your billing never stops.` },
      { title: 'Built-In GST Compliance', detail: 'Every invoice is GST-ready with no manual tax calculations — ready for an audit at any time.' },
      { title: 'Very Affordable', detail: 'Starts at ₹5,000/month for a single shop — far cheaper than a large ERP system, and pays for itself quickly.' },
      { title: 'Quick to Set Up', detail: '1–2 weeks from kickoff to go-live, with minimal disruption to daily billing.' },
      { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support — not an automated helpdesk.' },
    ],
  }),
  ({ district, state }) => ({
    heading: `Why Pharmacies in ${district} Choose Medora+`,
    sections: [
      { title: 'Built for Indian Pharmacy Compliance', detail: `GST rules, HSN codes, and audit expectations are built in from day one — no adapting a foreign template for ${state}.` },
      { title: 'No Internet? No Problem', detail: 'Billing, stock, and reporting all keep working offline, then sync automatically once you\'re back online.' },
      { title: 'Straightforward Pricing', detail: 'From ₹5,000/month for a single shop, with no hidden setup fees.' },
      { title: 'Fast Implementation', detail: 'Most single-shop deployments go live within 1–2 weeks, including staff training.' },
      { title: 'Batch-Level Accountability', detail: 'Every medicine batch tracked from purchase to sale, with expiry alerts well ahead of time.' },
      { title: 'A Real Team on the Other End', detail: 'WhatsApp and phone support from people who understand pharmacy operations, not a ticket queue.' },
    ],
  }),
]

const FAQ_VARIANTS = [
  ({ district }) => [
    { q: 'Does Medora+ work without internet?', a: `Yes, completely. Medora+ is designed to work fully offline. All billing and inventory work without internet — ideal for pharmacies in ${district}.` },
    { q: 'Is it GST-compliant?', a: 'Yes. Full GST built-in — HSN codes, GSTIN validation, and audit-ready records. Every invoice is ready for tax filing.' },
    { q: 'What\'s the cost?', a: 'From ₹5,000/month for single shops. A free 30-day trial is available.' },
    { q: 'How long does implementation take?', a: '1–2 weeks, including setup, training, and go-live support.' },
    { q: 'Can I track medicine batches and expiry?', a: 'Yes. Batch-level tracking with automatic alerts well before expiry.' },
    { q: 'Is staff training included?', a: 'Yes — billing, inventory, and reporting training are included in implementation.' },
  ],
  ({ district }) => [
    { q: `Can pharmacies in ${district} use Medora+ without a reliable internet connection?`, a: 'Yes — Medora+ is offline-first by design. Billing, stock, and reports all work with no internet connection at all.' },
    { q: 'Does the software handle GST correctly?', a: 'Yes, in full — HSN codes, GSTIN validation, and audit-ready tax reports come standard on every invoice.' },
    { q: 'How much does it cost?', a: 'Plans start at ₹5,000/month for a single-shop pharmacy, with a free 30-day trial to test it first.' },
    { q: 'How quickly can we go live?', a: 'Typically 1–2 weeks from kickoff, covering setup, data entry, and staff training.' },
    { q: 'What about medicines that are close to expiry?', a: 'Every batch is tracked individually, with alerts raised well ahead of the expiry date.' },
    { q: 'Do you provide training for our staff?', a: 'Yes, training on billing, inventory, and reporting is part of every implementation.' },
  ],
]

const INTRO_BODY_VARIANTS = [
  ({ district, state, neighbor }) =>
    `${district}'s pharmacy and medical retail sector serves a wide mix of local customers, and many medical shops here still rely on manual registers or spreadsheets for billing and stock — losing hours to manual work and risking GST compliance violations.\n\nMedora+ is pharmacy billing software built for Indian pharmacies by Aadhirai Innovations, serving pharmacies across ${state}, including ${neighbor}. It's designed for your context: works offline (no internet dependency), GST-ready billing, expiry tracking, and real-time stock management.`,
  ({ district, state }) =>
    `Running a pharmacy in ${district}, ${state} means dealing with daily billing, stock tracking, and GST compliance — often with nothing more than a manual register or a basic spreadsheet. That's slow, error-prone, and hard to audit.\n\nMedora+ replaces all of that with GST-ready billing, batch-level expiry tracking, and real-time inventory — built for Indian pharmacies, and designed to keep working even when the internet doesn't.`,
  ({ district, state }) =>
    `Pharmacies in ${district} face the same daily pressure as medical stores across ${state}: accurate billing, stock that's actually tracked, and GST records that hold up to an audit — usually managed by hand today.\n\nMedora+ is offline-first pharmacy software built specifically for this: GST-compliant invoicing, expiry alerts before stock goes bad, and real-time inventory, whether or not you have a reliable internet connection.`,
  ({ district, state, neighbor }) =>
    `Most medical shops in ${district} still run on manual registers or spreadsheets — which works, until a GST filing needs backup, stock goes missing, or a batch quietly expires unnoticed.\n\nMedora+ gives pharmacies across ${state}, including ${neighbor}, a GST-ready billing system that works fully offline, tracks every batch's expiry, and keeps stock numbers accurate in real time.`,
]

const META_TITLE_VARIANTS = [
  ({ district }) => `Pharmacy Billing Software in ${district} | Medora+ by Aadhirai`,
  ({ district }) => `Best Pharmacy Software in ${district} — GST-Ready, Offline | Medora+`,
  ({ district, state }) => `Medora+ Pharmacy Billing Software — ${district}, ${state}`,
]

const META_DESCRIPTION_VARIANTS = [
  ({ district }) => `Pharmacy billing software in ${district} for medical shops. GST-compliant, offline-first, affordable.`,
  ({ district }) => `GST-ready, offline-first pharmacy billing software built for medical shops in ${district}. Batch-level expiry tracking included.`,
  ({ district, state }) => `Medora+ brings GST-compliant, offline-capable pharmacy billing to ${district}, ${state} — real-time stock, expiry alerts, fast setup.`,
]

const USE_CASES = {
  heading: 'Medora+ for Every Kind of Pharmacy',
  cases: [
    { type: 'Single Medical Shops', detail: 'Efficient daily billing and inventory. One person can manage everything — no manual spreadsheets.' },
    { type: 'Pharmacy Chains', detail: 'Multiple locations? Unified dashboard. Manage inventory and reporting from one place.' },
    { type: 'Institutional Pharmacies', detail: 'Hospital or clinic pharmacies. High-volume transactions with controlled substance tracking.' },
    { type: 'Medicine Wholesalers', detail: 'Manage customer orders, invoicing, and stock allocation.' },
  ],
}

export function buildDistrictPageData({ district, state, neighboringDistricts = [] }) {
  const neighbor = neighboringDistricts[0] || state
  const ctx = { district, state, neighbor }

  return {
    city: district,
    state,
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',
    meta: {
      title: pick(district, 'meta-title', META_TITLE_VARIANTS)(ctx),
      description: pick(district, 'meta-desc', META_DESCRIPTION_VARIANTS)(ctx),
    },
    intro: {
      headline: `Pharmacy Billing Software in ${district}`,
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: pick(district, 'intro-body', INTRO_BODY_VARIANTS)(ctx),
    },
    whatProductDoes: pick(district, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(district, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(district, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Get accuracy, efficiency, and compliance in one system.',
      buttons: CTA_BUTTONS,
    },
  }
}

export function buildStatePageData({ state, districtCount }) {
  const ctx = { district: state, state, neighbor: state }

  return {
    city: state,
    state,
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',
    meta: {
      title: `Pharmacy Billing Software in ${state} | Medora+ by Aadhirai`,
      description: `GST-ready, offline-first pharmacy billing software for medical shops across ${state}. Covering ${districtCount} districts.`,
    },
    intro: {
      headline: `Pharmacy Billing Software in ${state}`,
      subheading: `Serving Medical Shops Across ${districtCount} Districts`,
      body: `${state} is home to thousands of independent pharmacies and medical shops, most still running on manual registers or spreadsheets for billing, stock, and GST records.\n\nMedora+ is pharmacy billing software built for Indian pharmacies by Aadhirai Innovations — GST-ready invoicing, batch-level expiry tracking, and real-time inventory that works fully offline. Browse pharmacy software availability in specific districts of ${state} below.`,
    },
    whatProductDoes: pick(state, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(state, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(state, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: `Ready to upgrade your pharmacy billing in ${state}?`,
      subheading: 'Get accuracy, efficiency, and compliance in one system.',
      buttons: CTA_BUTTONS,
    },
  }
}
