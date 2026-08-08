// Generates transport-software SEO page content for the ~714 Indian districts and 34 states that
// don't have a hand-written page in TransportLocationPageTemplate.jsx. Returns the exact same
// shape TransportLocalSEOPage.jsx already renders (meta/intro/whatProductDoes/whyItWorks/
// useCases/faq/cta) so that component needs no structural changes.
//
// Mirrors src/data/generateHrmLocationContent.js's approach exactly: to avoid duplicate/thin-
// content SEO penalties at this scale, every prose block is chosen from several hand-written
// variants via a deterministic hash of the place name (not one template with only the name
// swapped), and only real, constant product facts are used — no fabricated customer counts,
// ratings, or a pricing figure that hasn't actually been published for this product (pricing is
// quote-based today, same as HR & Inventory).

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
  { text: 'See a Demo', href: 'https://transport.aadhiraiinnovations.com', variant: 'secondary' },
]

const WHAT_PRODUCT_DOES_VARIANTS = [
  {
    heading: 'What Aadhirai Transport & Logistics Does for Your Fleet',
    sections: [
      { title: 'Quotation → Invoice', detail: 'Build a quotation, then convert it to an invoice in one step — no re-typing line items or client details.' },
      { title: 'Live GPS Driver Tracking', detail: 'A live map shows every driver\'s current position with pickup and delivery pins, updated automatically.' },
      { title: 'Delivery Job Tracking', detail: 'Assign jobs to drivers and track status from dispatch through delivery, with a driver-facing portal.' },
      { title: 'Driver & Fleet Management', detail: 'Driver records with licence expiry warnings, plus vehicle and fleet tracking in one place.' },
      { title: 'Expense Management', detail: 'Drivers log fuel and vehicle expenses for approval, tied to the job or vehicle that incurred them.' },
      { title: 'Revenue Dashboard', detail: 'Aging, revenue, and client summary reports with CSV export.' },
    ],
  },
  {
    heading: 'Everything Your Transport Business Needs to Bill and Dispatch',
    sections: [
      { title: 'One Billing System', detail: 'Quotations, invoices, and a reusable item catalog — no more Word or PDF templates rebuilt for every client.' },
      { title: 'Configurable Rate Units', detail: 'Per-KM, per-trip, or true calendar-month billing, matching however you actually charge each client.' },
      { title: 'Live Fleet Map', detail: 'See every driver\'s position and job status in real time, without a phone call.' },
      { title: 'Driver Records That Warn You', detail: 'Licence expiry warnings and vehicle tracking, so nothing lapses unnoticed.' },
      { title: 'Approval-Based Expenses', detail: 'Fuel and vehicle expenses submitted by drivers, reviewed before they hit your books.' },
      { title: 'Statement of Account', detail: 'Date-ranged, status-filtered statements for client billing reconciliation.' },
    ],
  },
]

const WHY_IT_WORKS_VARIANTS = [
  ({ district, state }) => ({
    heading: `Why Aadhirai Transport & Logistics is Right for ${district} Fleets`,
    sections: [
      { title: 'Made by a Tamil Nadu-Based Team', detail: `Aadhirai Innovations understands how transport businesses actually bill and dispatch, including running a fleet in ${state}.` },
      { title: 'One System, Not a Word Template', detail: 'Quotations, invoices, delivery jobs, and fleet records live in the same place — no manual reconciliation between spreadsheets and phone calls.' },
      { title: 'Live GPS Visibility', detail: 'A live map shows exactly where every driver and job is, without calling to check.' },
      { title: 'Flexible Rate Units', detail: 'Per-trip, per-KM, or calendar-month billing — invoices match how you actually charge clients.' },
      { title: 'Quick to Set Up', detail: 'Most fleets go live in 2–3 weeks, including invoice numbering, item catalog setup, and driver training.' },
      { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support — not an automated helpdesk.' },
    ],
  }),
  ({ district, state }) => ({
    heading: `Why Growing Fleets in ${district} Choose Aadhirai Transport & Logistics`,
    sections: [
      { title: 'Built for Indian Transport Operations', detail: `Billing structures and job tracking that actually fit how transport companies run in ${state} — not an adapted foreign template.` },
      { title: 'No More Disconnected Tools', detail: 'Quotations, invoicing, delivery jobs, fleet records, and expenses in a single dashboard instead of separate spreadsheets and phone calls.' },
      { title: 'Straightforward Pricing', detail: 'A quote based on your actual fleet size — no hidden setup fees, no forcing you into an enterprise tier you don\'t need.' },
      { title: 'Fast Implementation', detail: 'Most deployments go live within 2–3 weeks, covering setup and driver training.' },
      { title: 'Live Tracking From Day One', detail: 'Every driver\'s position and job status visible in real time, wherever they\'re running.' },
      { title: 'A Real Team on the Other End', detail: 'WhatsApp and phone support from people who understand transport operations, not a ticket queue.' },
    ],
  }),
]

const FAQ_VARIANTS = [
  ({ district }) => [
    { q: 'Can Aadhirai Transport & Logistics track drivers live in and around ' + district + '?', a: `Yes. A live GPS map shows every active driver's current position with pickup and delivery pins, useful for fleets operating in and around ${district}.` },
    { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
    { q: 'What does it cost?', a: 'Pricing is based on your fleet size and requirements — contact us for a straightforward quote.' },
    { q: 'How long does implementation take?', a: 'Most fleets go live in 2–3 weeks, including setup, invoice numbering, and driver training.' },
    { q: 'Can it handle different billing structures?', a: 'Yes. Rate units are fully configurable — per-trip, per-KM, or a true calendar-month billing option.' },
    { q: 'Can drivers log fuel and vehicle expenses?', a: 'Yes. Drivers submit expense entries tied to a job or vehicle, which go through an approval workflow.' },
  ],
  ({ district }) => [
    { q: `Does Aadhirai Transport & Logistics work for fleets in ${district}?`, a: `Yes — it's built for any transport or logistics business, including fleets operating in ${district}, with live GPS tracking and configurable billing.` },
    { q: 'Does the system handle billing correctly for different job types?', a: 'Yes. Rate units are configurable per-trip, per-KM, or calendar-month, so invoices match however you actually bill each client.' },
    { q: 'How much does it cost?', a: 'There\'s no fixed price list — pricing depends on your fleet size, so we put together a quote based on your actual needs.' },
    { q: 'How quickly can we go live?', a: 'Typically 2–3 weeks from kickoff, covering setup, invoice numbering, and driver training.' },
    { q: 'What about tracking drivers and vehicles?', a: 'Live GPS tracking for every driver, plus driver and vehicle records with licence expiry warnings.' },
    { q: 'Do you provide training for our drivers and office staff?', a: 'Yes — training on quotations, invoicing, delivery jobs, and expense submission is part of every implementation.' },
  ],
]

const INTRO_BODY_VARIANTS = [
  ({ district, state, neighbor }) =>
    `Transport operators in ${district} usually bill from a Word or PDF template and track drivers by phone call — and neither scales once job volume grows or a client asks for a proper statement of account.\n\nAadhirai Transport & Logistics is transport operations software built by Aadhirai Innovations, serving fleets across ${state}, including near ${neighbor}. Quotations that convert straight into invoices, live GPS driver tracking, delivery job tracking, fleet and driver records, and revenue reporting — all in one system instead of disconnected tools.`,
  ({ district, state }) =>
    `Running billing and dispatch as separate manual processes in ${district}, ${state} usually means a Word invoice template, a spreadsheet for jobs, and phone calls to find out where a driver is. That's slow, and it doesn't scale as a fleet grows.\n\nAadhirai Transport & Logistics replaces all three with one system: quotation-to-invoice conversion, live GPS tracking, delivery job tracking, and fleet and driver records — built for growing transport and logistics businesses.`,
  ({ district, state }) =>
    `Transport businesses in ${district} face the same operational pressure as fleets across ${state}: accurate, fast invoicing, drivers whose location you actually know, and billing that holds up when a client asks for a statement of account — usually managed today across a Word template, a spreadsheet, and a phone.\n\nAadhirai Transport & Logistics is a single system built specifically for this: quotation-to-invoice conversion, live GPS driver tracking, delivery job management, and fleet records, whether you run a handful of trucks or a large fleet.`,
  ({ district, state, neighbor }) =>
    `Most transport companies in ${district} still invoice from a Word or PDF template and dispatch drivers over WhatsApp and phone calls — which works, until a client disputes an invoice or asks where their delivery actually is.\n\nAadhirai Transport & Logistics gives fleets across ${state}, including near ${neighbor}, one system for quotations, invoicing, live GPS driver tracking, delivery jobs, and fleet records — no more reconciling a template, a spreadsheet, and a phone call.`,
]

const META_TITLE_VARIANTS = [
  ({ district }) => `Transport Software in ${district} | Aadhirai Transport & Logistics`,
  ({ district }) => `Best Transport & Logistics Software in ${district} — Billing, GPS Tracking | Aadhirai`,
  ({ district, state }) => `Aadhirai Transport & Logistics — Software in ${district}, ${state}`,
]

const META_DESCRIPTION_VARIANTS = [
  ({ district }) => `Transport software in ${district} for growing fleets. Quotation-to-invoice conversion, live GPS driver tracking, and fleet management in one system.`,
  ({ district }) => `Transport and logistics software built for fleets in ${district}. Billing from verified job data, live driver tracking, configurable rate units.`,
  ({ district, state }) => `Aadhirai Transport & Logistics brings transport software to ${district}, ${state} — quotations, invoicing, live GPS tracking, and fleet records in one place.`,
]

const USE_CASES = {
  heading: 'Aadhirai Transport & Logistics for Every Kind of Fleet Business',
  cases: [
    { type: 'Transport Companies', detail: 'Quotation, invoicing, and delivery job tracking in one system instead of Word/PDF templates.' },
    { type: 'Logistics Operators', detail: 'Fleet, driver, and live GPS visibility alongside client billing and revenue reporting.' },
    { type: 'Freight Forwarders', detail: 'Job-based billing with configurable per-unit rate structures, including true calendar-month billing.' },
    { type: 'Last-Mile & Distribution Fleets', detail: 'Driver-facing job status updates and live tracking for high delivery-volume operations.' },
  ],
}

export function buildDistrictPageData({ district, state, neighboringDistricts = [] }) {
  const neighbor = neighboringDistricts[0] || state
  const ctx = { district, state, neighbor }

  return {
    city: district,
    state,
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: pick(district, 'meta-title', META_TITLE_VARIANTS)(ctx),
      description: pick(district, 'meta-desc', META_DESCRIPTION_VARIANTS)(ctx),
    },
    intro: {
      headline: `Transport & Logistics Software in ${district}`,
      subheading: 'For Fleet Operators, Freight Forwarders & Delivery Businesses',
      body: pick(district, 'intro-body', INTRO_BODY_VARIANTS)(ctx),
    },
    whatProductDoes: pick(district, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(district, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(district, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: 'Ready to bring your billing, dispatch, and fleet together?',
      subheading: 'Get accuracy, live visibility, and one system instead of a Word template and phone calls.',
      buttons: CTA_BUTTONS,
    },
  }
}

export function buildStatePageData({ state, districtCount }) {
  const ctx = { district: state, state, neighbor: state }

  return {
    city: state,
    state,
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: `Transport Software in ${state} | Aadhirai Transport & Logistics`,
      description: `Transport and logistics software for fleets across ${state}. Quotation-to-invoice conversion, live GPS tracking, and fleet management. Covering ${districtCount} districts.`,
    },
    intro: {
      headline: `Transport & Logistics Software in ${state}`,
      subheading: `Serving Transport & Logistics Businesses Across ${districtCount} Districts`,
      body: `${state} is home to transport and logistics businesses still invoicing from a Word or PDF template and dispatching drivers over phone calls, with no live view of where a job actually stands.\n\nAadhirai Transport & Logistics is transport operations software built by Aadhirai Innovations — quotations that convert straight into invoices, live GPS driver tracking, delivery job tracking, and fleet and driver records, all in one system. Browse transport software availability in specific districts of ${state} below.`,
    },
    whatProductDoes: pick(state, 'what-product', WHAT_PRODUCT_DOES_VARIANTS),
    whyItWorks: pick(state, 'why-works', WHY_IT_WORKS_VARIANTS)(ctx),
    useCases: USE_CASES,
    faq: pick(state, 'faq', FAQ_VARIANTS)(ctx),
    cta: {
      heading: `Ready to bring your billing, dispatch, and fleet together in ${state}?`,
      subheading: 'Get accuracy, live visibility, and one system instead of a Word template and phone calls.',
      buttons: CTA_BUTTONS,
    },
  }
}
