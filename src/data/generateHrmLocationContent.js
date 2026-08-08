// Generates hrm-software SEO page content for the ~714 Indian districts and 34 states that
// don't have a hand-written page in HrmLocationPageTemplate.jsx. Returns the exact same shape
// HrmLocalSEOPage.jsx already renders (meta/intro/whatProductDoes/whyItWorks/useCases/faq/cta)
// so that component needs no structural changes.
//
// Mirrors src/data/generateLocationContent.js's approach exactly: to avoid duplicate/thin-
// content SEO penalties at this scale, every prose block is chosen from several hand-written
// variants via a deterministic hash of the place name (not one template with only the name
// swapped), and only real, constant product facts are used — no fabricated customer counts,
// ratings, or a pricing figure that hasn't actually been published for this product (unlike
// Medora+'s disclosed ₹5,000/month, HR & Inventory pricing is quote-based today).

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
  { text: 'See a Demo', href: 'https://hrm.aadhiraiinnovations.com', variant: 'secondary' },
]

const WHAT_PRODUCT_DOES_VARIANTS = [
  {
    heading: 'What HR & Inventory Does for Your Business',
    sections: [
      { title: 'Employee Records', detail: 'Centralized staff records, documents, and employment history in one secure place.' },
      { title: 'Leave & Attendance', detail: 'Leave requests, approvals, and attendance tracking with a complete, audit-ready trail.' },
      { title: 'Payroll Data', detail: 'Accurate payroll data generated straight from verified attendance — no manual calculations.' },
      { title: 'Shift Scheduling', detail: 'Plan and adjust shifts across teams with conflict detection built in.' },
      { title: 'Real-Time Stock', detail: 'Know your inventory at any moment, with low-stock alerts across every location.' },
      { title: 'Purchase Orders', detail: 'Full purchase order lifecycle from request through receipt, with vendor history.' },
    ],
  },
  {
    heading: 'Everything Your HR Team and Stock Room Need',
    sections: [
      { title: 'One Employee System', detail: 'Staff records, documents, and history — no more scattered spreadsheets per department.' },
      { title: 'Attendance That Feeds Payroll', detail: 'Leave and attendance tracked accurately, flowing straight into payroll — nothing re-typed by hand.' },
      { title: 'Biometric-Ready Attendance', detail: 'Works with fingerprint and card-based scanners for tamper-proof attendance records.' },
      { title: 'Live Inventory Visibility', detail: 'See exactly what you have, what\'s low, and what needs reordering — in real time.' },
      { title: 'Multi-Location Ready', detail: 'Manage people and stock across every branch from one dashboard.' },
      { title: 'Role-Based Access', detail: 'Staff see and do exactly what their role allows — nothing more.' },
    ],
  },
]

const WHY_IT_WORKS_VARIANTS = [
  ({ district, state }) => ({
    heading: `Why HR & Inventory is Right for ${district} Businesses`,
    sections: [
      { title: 'Made by a Tamil Nadu-Based Team', detail: `Aadhirai Innovations understands Indian HR compliance and day-to-day business realities, including running a team in ${state}.` },
      { title: 'One System, Not Five', detail: 'HR and inventory live in the same place — no manual reconciliation between disconnected tools.' },
      { title: 'Payroll You Can Trust', detail: 'Payroll data is generated from verified attendance, not a spreadsheet someone has to double-check.' },
      { title: 'Flexible Pricing', detail: 'Pricing is based on your team size and needs — get a straightforward quote, no generic enterprise price tag.' },
      { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup, data migration, and staff training.' },
      { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support — not an automated helpdesk.' },
    ],
  }),
  ({ district, state }) => ({
    heading: `Why Growing Businesses in ${district} Choose HR & Inventory`,
    sections: [
      { title: 'Built for Indian HR Operations', detail: `Leave policies, attendance rules, and compliance expectations that actually fit how businesses in ${state} run — not an adapted foreign template.` },
      { title: 'No More Disconnected Tools', detail: 'Employee records, attendance, payroll data, and stock control in a single dashboard instead of separate systems.' },
      { title: 'Straightforward Pricing', detail: 'A quote based on your actual team size — no hidden setup fees, no forcing you into an enterprise tier you don\'t need.' },
      { title: 'Fast Implementation', detail: 'Most deployments go live within 2–3 weeks, covering setup and staff training.' },
      { title: 'Multi-Location From Day One', detail: 'Centralized reporting across every branch, with each location keeping its own data.' },
      { title: 'A Real Team on the Other End', detail: 'WhatsApp and phone support from people who understand HR operations, not a ticket queue.' },
    ],
  }),
]

const FAQ_VARIANTS = [
  ({ district }) => [
    { q: 'Can HR & Inventory manage multiple locations?', a: `Yes. HR & Inventory supports unlimited locations with centralized reporting — useful for businesses in ${district} running more than one site or branch.` },
    { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance records, then exported to your accounting system or payroll processor — no manual calculation.' },
    { q: 'What does it cost?', a: 'Pricing is based on your team size and requirements — contact us for a straightforward quote.' },
    { q: 'How long does implementation take?', a: 'Most organizations go live in 2–3 weeks, including setup, data migration, and staff training.' },
    { q: 'Can it track stock across branches?', a: 'Yes. Real-time stock tracking across every location, with low-stock alerts and reorder recommendations per branch.' },
    { q: 'What leave types are supported?', a: 'Fully customizable leave types — annual, sick, maternity, and more — configurable per department or organization-wide.' },
  ],
  ({ district }) => [
    { q: `Does HR & Inventory work for businesses in ${district} with more than one location?`, a: 'Yes — it\'s built for multi-location from the ground up, with centralized reporting and each site keeping its own data.' },
    { q: 'Does the system handle payroll correctly?', a: 'Yes. Payroll data is generated straight from verified attendance records, ready to export to your accounting or payroll processor.' },
    { q: 'How much does it cost?', a: 'There\'s no fixed price list — pricing depends on your team size, so we put together a quote based on your actual needs.' },
    { q: 'How quickly can we go live?', a: 'Typically 2–3 weeks from kickoff, covering setup, data migration, and staff training.' },
    { q: 'What about tracking stock and purchase orders?', a: 'Real-time inventory across locations, plus a full purchase order lifecycle from request through receipt.' },
    { q: 'Do you provide training for our staff?', a: 'Yes — training on employee records, attendance, payroll, and inventory is part of every implementation.' },
  ],
]

const INTRO_BODY_VARIANTS = [
  ({ district, state, neighbor }) =>
    `Growing businesses in ${district} usually start with spreadsheets for HR and a separate system (or another spreadsheet) for stock — and the two never quite line up, especially once payroll needs both.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, serving growing businesses across ${state}, including ${neighbor}. Employee records, leave and attendance, payroll data, and real-time stock and purchase orders — all in one system instead of disconnected tools.`,
  ({ district, state }) =>
    `Running HR and inventory as separate systems in ${district}, ${state} usually means manual reconciliation, duplicate data entry, and payroll numbers nobody fully trusts. That's slow, and it doesn't scale as a team grows.\n\nHR & Inventory replaces both with one system: employee records, leave and attendance tracking, payroll data generated from verified attendance, and real-time stock control — built for growing Indian businesses.`,
  ({ district, state }) =>
    `Businesses in ${district} face the same operational pressure as growing teams across ${state}: accurate attendance and payroll, stock that's actually tracked, and HR records that hold up when it matters — usually managed across two or three disconnected tools today.\n\nHR & Inventory is a single system built specifically for this: employee management, leave and attendance, payroll data ready for export, and real-time inventory and purchase orders, whether you run one location or several.`,
  ({ district, state, neighbor }) =>
    `Most growing businesses in ${district} manage HR in one tool and inventory in another — which works, until payroll needs attendance data that's a week out of date, or stock goes missing between systems.\n\nHR & Inventory gives businesses across ${state}, including ${neighbor}, one system for employee records, leave and attendance, payroll data, and real-time stock and purchase orders — no more reconciling two tools by hand.`,
]

const META_TITLE_VARIANTS = [
  ({ district }) => `HRM Software in ${district} | HR & Inventory by Aadhirai`,
  ({ district }) => `Best HR Management Software in ${district} — Payroll, Attendance | HR & Inventory`,
  ({ district, state }) => `HR & Inventory — HRM Software in ${district}, ${state}`,
]

const META_DESCRIPTION_VARIANTS = [
  ({ district }) => `HRM software in ${district} for growing businesses. Employee records, leave, attendance, payroll, and inventory in one system.`,
  ({ district }) => `HR management software built for growing businesses in ${district}. Payroll from verified attendance, real-time stock, multi-location ready.`,
  ({ district, state }) => `HR & Inventory brings HRM software to ${district}, ${state} — employee records, payroll data, attendance, and stock in one place.`,
]

const USE_CASES = {
  heading: 'HR & Inventory for Every Kind of Growing Business',
  cases: [
    { type: 'Growing SMBs', detail: 'Replace spreadsheets with one system for employee records, attendance, and stock — no extra headcount needed to manage it.' },
    { type: 'Multi-Location Businesses', detail: 'Unified dashboard across every branch. Centralized HR and inventory reporting from one place.' },
    { type: 'Manufacturing & Institutional Employers', detail: 'Biometric-ready attendance, shift scheduling, and payroll data for larger, shift-based teams.' },
    { type: 'Retail Chains & Distributors', detail: 'Staff management alongside purchase orders, stock allocation, and vendor tracking.' },
  ],
}

export function buildDistrictPageData({ district, state, neighboringDistricts = [] }) {
  const neighbor = neighboringDistricts[0] || state
  const ctx = { district, state, neighbor }

  return {
    city: district,
    state,
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: pick(district, 'meta-title', META_TITLE_VARIANTS)(ctx),
      description: pick(district, 'meta-desc', META_DESCRIPTION_VARIANTS)(ctx),
    },
    intro: {
      headline: `HRM Software in ${district}`,
      subheading: 'For Growing Businesses, Multi-Location Teams & Institutions',
      body: pick(district, 'intro-body', INTRO_BODY_VARIANTS)(ctx),
    },
    whatProductDoes: pick(district, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(district, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(district, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: 'Ready to bring your HR and inventory together?',
      subheading: 'Get accuracy, efficiency, and one system instead of several.',
      buttons: CTA_BUTTONS,
    },
  }
}

export function buildStatePageData({ state, districtCount }) {
  const ctx = { district: state, state, neighbor: state }

  return {
    city: state,
    state,
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: `HRM Software in ${state} | HR & Inventory by Aadhirai`,
      description: `HR management software for growing businesses across ${state}. Employee records, payroll, attendance, and inventory. Covering ${districtCount} districts.`,
    },
    intro: {
      headline: `HRM Software in ${state}`,
      subheading: `Serving Growing Businesses Across ${districtCount} Districts`,
      body: `${state} is home to thousands of growing businesses still running HR on spreadsheets and inventory on a separate system, with no clean link between the two — especially once payroll needs both.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations — employee records, leave and attendance, payroll data generated from verified attendance, and real-time stock and purchase orders, all in one system. Browse HRM software availability in specific districts of ${state} below.`,
    },
    whatProductDoes: pick(state, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(state, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(state, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: `Ready to bring your HR and inventory together in ${state}?`,
      subheading: 'Get accuracy, efficiency, and one system instead of several.',
      buttons: CTA_BUTTONS,
    },
  }
}
