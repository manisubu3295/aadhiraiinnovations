/**
 * HrmLocationPageTemplate — hand-written cityPageData for the 8 curated HRM-software cities.
 * Used for: /hrm-software/{city}
 *
 * Mirrors src/components/sections/LocalSEOPageTemplate.jsx's contract exactly (same data shape
 * consumed by HrmLocalSEOPage.jsx) but is a separate, independent curated set — see
 * src/data/hrmLocationSlugs.js for why. Every city below has genuinely unique intro/why-it-works/
 * FAQ prose reflecting that city's actual business character (IT hub, textiles, manufacturing,
 * etc. — all common-knowledge industry associations, not fabricated client counts or stats).
 */

const CTA_BUTTONS = [
  { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
  { text: 'See a Demo', href: 'https://hrm.aadhiraiinnovations.com', variant: 'secondary' },
]

const CTA = {
  heading: 'Ready to bring your HR and inventory together?',
  subheading: 'Get accuracy, efficiency, and one system instead of several.',
  buttons: CTA_BUTTONS,
}

const USE_CASES = {
  heading: 'HR & Inventory for Every Kind of Growing Business',
  cases: [
    { type: 'Growing SMBs', detail: 'Replace spreadsheets with one system for employee records, attendance, and stock — no extra headcount needed to manage it.' },
    { type: 'Multi-Location Businesses', detail: 'Unified dashboard across every branch. Centralized HR and inventory reporting from one place.' },
    { type: 'Manufacturing & Institutional Employers', detail: 'Biometric-ready attendance, shift scheduling, and payroll data for larger, shift-based teams.' },
    { type: 'Retail Chains & Distributors', detail: 'Staff management alongside purchase orders, stock allocation, and vendor tracking.' },
  ],
}

const WHAT_PRODUCT_DOES = {
  heading: 'What HR & Inventory Does for Your Business',
  sections: [
    { title: 'Employee Records', detail: 'Centralized staff records, documents, and employment history in one secure place.' },
    { title: 'Leave & Attendance', detail: 'Leave requests, approvals, and attendance tracking with a complete, audit-ready trail.' },
    { title: 'Payroll Data', detail: 'Accurate payroll data generated straight from verified attendance — no manual calculations.' },
    { title: 'Shift Scheduling', detail: 'Plan and adjust shifts across teams with conflict detection built in.' },
    { title: 'Real-Time Stock', detail: 'Know your inventory at any moment, with low-stock alerts across every location.' },
    { title: 'Purchase Orders', detail: 'Full purchase order lifecycle from request through receipt, with vendor history.' },
  ],
}

export const cityPageData = {
  chennai: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Chennai | HR & Inventory by Aadhirai',
      description: 'HR management software for Chennai businesses — employee records, leave, attendance, payroll, and inventory in one system. Built by a Tamil Nadu team.',
    },
    intro: {
      headline: 'HRM Software in Chennai',
      subheading: 'For IT, Manufacturing, Retail & Multi-Location Businesses',
      body: `Chennai's mix of IT services, auto and electronics manufacturing, and retail chains means HR teams here are often managing attendance, leave, and payroll across very different kinds of shifts and locations — while inventory and purchase orders sit in a completely separate system.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, headquartered in Tamil Nadu with a base in Chennai. It brings employee records, leave and attendance, payroll data generated from verified attendance, and real-time stock and purchase orders into a single system — built for the pace and variety of Chennai's business landscape.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Chennai Businesses',
      sections: [
        { title: 'A Tamil Nadu Team, Based in Chennai', detail: 'Aadhirai Innovations operates out of Peravurani and Chennai — support that understands local business hours, compliance, and how Chennai teams actually work.' },
        { title: 'Built for Mixed Shift Patterns', detail: 'Whether it\'s an IT team on flexible hours or a manufacturing floor on fixed shifts, attendance and scheduling adapt to how your teams actually work.' },
        { title: 'Payroll You Can Trust', detail: 'Payroll data is generated from verified attendance, not a spreadsheet someone has to double-check every month.' },
        { title: 'Multi-Location From Day One', detail: 'Manage HR and stock across every Chennai location — or branches elsewhere in Tamil Nadu — from one dashboard.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup, data migration, and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team — not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does HR & Inventory suit Chennai\'s mix of IT and manufacturing businesses?', a: 'Yes. Leave, attendance, and shift scheduling are configurable per department, so an IT team on flexible hours and a manufacturing floor on fixed shifts can both run in the same system.' },
      { q: 'Can it manage multiple Chennai locations or branches elsewhere in Tamil Nadu?', a: 'Yes. HR & Inventory supports unlimited locations with centralized reporting, while each site keeps its own attendance and stock data.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance records, then exported to your accounting system or payroll processor.' },
      { q: 'What does HR & Inventory cost in Chennai?', a: 'Pricing is based on your team size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Chennai organizations go live in 2–3 weeks, including setup, data migration, and staff training.' },
      { q: 'Can it track stock and purchase orders too?', a: 'Yes. Real-time inventory across locations, plus a full purchase order lifecycle from request through receipt.' },
    ],
    cta: CTA,
  },

  coimbatore: {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Coimbatore | HR & Inventory by Aadhirai',
      description: 'HRM software for Coimbatore\'s textile and engineering businesses — employee records, attendance, payroll, and stock control in one system.',
    },
    intro: {
      headline: 'HRM Software in Coimbatore',
      subheading: 'For Textile, Engineering & Multi-Unit Businesses',
      body: `Coimbatore's textile mills, pump and engineering manufacturers, and multi-unit trading businesses typically run large shift-based workforces alongside significant raw material and finished-goods inventory — usually tracked in separate, disconnected systems.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations for exactly this kind of business: employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders — all in one system, built for Tamil Nadu's manufacturing base.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Coimbatore Businesses',
      sections: [
        { title: 'Built for Shift-Based Workforces', detail: 'Shift scheduling and biometric-ready attendance suit manufacturing floors and multi-shift operations common across Coimbatore.' },
        { title: 'HR and Stock, One System', detail: 'Employee attendance and raw-material or finished-goods stock live in the same place — no manual reconciliation between two tools.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, reducing manual calculation errors for large teams.' },
        { title: 'Multi-Unit Ready', detail: 'Manage HR and inventory across multiple units or branches from a single dashboard.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from a Tamil Nadu-based team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is HR & Inventory suited to Coimbatore\'s textile and engineering units?', a: 'Yes. Shift scheduling and biometric-ready attendance are built for shift-based manufacturing workforces, alongside real-time stock tracking for raw materials and finished goods.' },
      { q: 'Can it handle multiple units or branches?', a: 'Yes. Unlimited locations with centralized reporting, while each unit keeps its own attendance and inventory data.' },
      { q: 'How does payroll work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What\'s the cost?', a: 'Pricing depends on team size and needs — contact us for a straightforward quote.' },
      { q: 'How long does setup take?', a: 'Most Coimbatore organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track purchase orders?', a: 'Yes — full purchase order lifecycle from request through receipt, with vendor history.' },
    ],
    cta: CTA,
  },

  bengaluru: {
    city: 'Bengaluru',
    state: 'Karnataka',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Bengaluru | HR & Inventory by Aadhirai',
      description: 'HRM software for Bengaluru startups and growing businesses — employee records, leave, attendance, payroll, and inventory in one system.',
    },
    intro: {
      headline: 'HRM Software in Bengaluru',
      subheading: 'For Startups, Tech Teams & Growing Businesses',
      body: `Bengaluru's startups and growing tech-adjacent businesses often outgrow spreadsheet-based HR quickly, but a full enterprise HRMS is overkill for a team that's still scaling — and most of those systems don't handle inventory or purchase orders at all.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations for growing teams: employee records, leave and attendance, payroll data generated from verified attendance, and — where it's needed — real-time stock and purchase order management, all in one system that scales with the team instead of requiring a re-platform.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Bengaluru Teams',
      sections: [
        { title: 'Right-Sized for a Growing Team', detail: 'Built for businesses moving off spreadsheets, not an enterprise HRMS with a six-month rollout.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated straight from attendance records — one less manual process for a lean HR team.' },
        { title: 'Inventory Included, Not Bolted On', detail: 'Businesses that also need stock and purchase order tracking get it in the same system, not a second tool.' },
        { title: 'Multi-Location Ready', detail: 'Manage HR and stock across every office or warehouse from one dashboard as the team grows.' },
        { title: 'Fast Implementation', detail: 'Most organizations go live in 2–3 weeks, including setup and training.' },
        { title: 'Direct Support', detail: 'WhatsApp and phone support from Aadhirai\'s own team, not a ticket queue.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is HR & Inventory a good fit for a Bengaluru startup moving off spreadsheets?', a: 'Yes. It\'s built for growing teams that need real HR structure — employee records, leave, attendance, payroll — without an enterprise HRMS rollout.' },
      { q: 'Do we need the inventory features if we\'re a pure services business?', a: 'No. Businesses that don\'t need stock or purchase order tracking can use the HR side alone — the system doesn\'t force unused features on you.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What does it cost?', a: 'Pricing is based on your team size — contact us for a straightforward quote rather than a fixed enterprise price list.' },
      { q: 'How fast can we get set up?', a: 'Most organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Can it support multiple offices as we grow?', a: 'Yes — unlimited locations with centralized reporting, added as you need them.' },
    ],
    cta: CTA,
  },

  hyderabad: {
    city: 'Hyderabad',
    state: 'Telangana',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Hyderabad | HR & Inventory by Aadhirai',
      description: 'HRM software for Hyderabad businesses — IT, pharma, and manufacturing. Employee records, attendance, payroll, and inventory in one system.',
    },
    intro: {
      headline: 'HRM Software in Hyderabad',
      subheading: 'For IT, Pharma & Manufacturing Businesses',
      body: `Hyderabad's IT services firms, pharmaceutical and life-sciences companies, and manufacturing units each have different attendance and compliance needs — but most end up managing HR in one tool and inventory or asset tracking in another, with no link between the two.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations that brings employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders into a single system — configurable enough to work across very different Hyderabad business types.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Hyderabad Businesses',
      sections: [
        { title: 'Configurable Across Industries', detail: 'Leave policies, shift rules, and attendance methods adapt to IT, pharma, or manufacturing operations alike.' },
        { title: 'Compliance-Ready Records', detail: 'A complete, audit-ready trail for every leave and attendance decision — useful for regulated industries like pharma.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, reducing manual errors across larger teams.' },
        { title: 'Multi-Location Support', detail: 'Manage HR and stock across every Hyderabad site, or branches elsewhere, from one dashboard.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support — not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does HR & Inventory work for regulated industries like pharma?', a: 'Yes. Every leave and attendance decision is captured in a complete, audit-ready trail, and access is role-based so staff only see and do what their role permits.' },
      { q: 'Can it handle multiple Hyderabad locations?', a: 'Yes. Unlimited locations with centralized reporting, while each site keeps its own data.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance records, ready to export to your accounting or payroll processor.' },
      { q: 'What\'s the pricing?', a: 'Pricing is based on team size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track equipment or stock, not just people?', a: 'Yes — real-time stock tracking and a full purchase order lifecycle, alongside the HR features.' },
    ],
    cta: CTA,
  },

  salem: {
    city: 'Salem',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Salem | HR & Inventory by Aadhirai',
      description: 'HRM software for Salem\'s steel, textile, and trading businesses — employee records, attendance, payroll, and stock control in one system.',
    },
    intro: {
      headline: 'HRM Software in Salem',
      subheading: 'For Steel, Textile & Trading Businesses',
      body: `Salem's steel and textile manufacturers, along with its trading and distribution businesses, typically run shift-based teams alongside real inventory pressure — raw materials in, finished goods out — usually tracked separately from HR and payroll.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, based in Tamil Nadu, that brings employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders into one system for Salem's manufacturing and trading businesses.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Salem Businesses',
      sections: [
        { title: 'A Tamil Nadu Team', detail: 'Aadhirai Innovations is based in Tamil Nadu — support that understands local business needs and compliance.' },
        { title: 'Built for Shift-Based Teams', detail: 'Shift scheduling and biometric-ready attendance suit manufacturing floors common in Salem\'s steel and textile units.' },
        { title: 'HR and Stock Together', detail: 'Employee attendance and raw material or finished-goods stock live in one system, not two disconnected tools.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, reducing manual errors for larger teams.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is HR & Inventory suited to Salem\'s steel and textile manufacturers?', a: 'Yes. Shift scheduling and biometric-ready attendance are built for shift-based manufacturing workforces, alongside real-time stock tracking.' },
      { q: 'Can it handle multiple units or trading branches?', a: 'Yes. Unlimited locations with centralized reporting, while each unit keeps its own attendance and inventory data.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What does it cost?', a: 'Pricing depends on team size and needs — contact us for a straightforward quote.' },
      { q: 'How long does setup take?', a: 'Most Salem organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track purchase orders?', a: 'Yes — full purchase order lifecycle from request through receipt, with vendor history.' },
    ],
    cta: CTA,
  },

  tiruchirappalli: {
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Tiruchirappalli | HR & Inventory by Aadhirai',
      description: 'HRM software for Tiruchirappalli\'s engineering, education, and trading businesses — employee records, attendance, payroll, and inventory in one system.',
    },
    intro: {
      headline: 'HRM Software in Tiruchirappalli',
      subheading: 'For Engineering, Trading & Institutional Employers',
      body: `Tiruchirappalli's engineering and heavy-equipment manufacturers, educational institutions, and trading businesses each manage sizeable staff rosters alongside stock or asset tracking needs — usually across separate, unlinked systems.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, headquartered in Tamil Nadu, bringing employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders into one system for Tiruchirappalli's businesses and institutions.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Tiruchirappalli Organizations',
      sections: [
        { title: 'A Tamil Nadu Team', detail: 'Aadhirai Innovations is based in Tamil Nadu — support that understands local compliance and how institutions here actually run.' },
        { title: 'Suited to Institutional Employers', detail: 'Role-based access and audit-ready records work well for schools, colleges, and larger organizations with structured hierarchies.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, cutting manual work for larger staff rosters.' },
        { title: 'HR and Stock Together', detail: 'Employee records and inventory or asset tracking live in the same system, not two disconnected tools.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does HR & Inventory suit institutions like schools or colleges in Tiruchirappalli?', a: 'Yes. Role-based access and a complete audit trail for every leave and attendance decision work well for structured, larger organizations.' },
      { q: 'Can it handle multiple campuses or branches?', a: 'Yes. Unlimited locations with centralized reporting, while each site keeps its own data.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What\'s the cost?', a: 'Pricing is based on team size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track equipment or stock as well as people?', a: 'Yes — real-time stock tracking and a full purchase order lifecycle, alongside the HR features.' },
    ],
    cta: CTA,
  },

  madurai: {
    city: 'Madurai',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Madurai | HR & Inventory by Aadhirai',
      description: 'HRM software for Madurai\'s textile, trading, and retail businesses — employee records, attendance, payroll, and stock control in one system.',
    },
    intro: {
      headline: 'HRM Software in Madurai',
      subheading: 'For Textile, Trading & Retail Businesses',
      body: `Madurai's textile and garment trade, along with its wholesale and retail businesses, tend to run staff across a shop floor or warehouse and stock across the same space — but the two are usually tracked in completely separate systems, if at all.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, based in Tamil Nadu, bringing employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders together in one system for Madurai's trading and retail businesses.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Madurai Businesses',
      sections: [
        { title: 'A Tamil Nadu Team', detail: 'Aadhirai Innovations is based in Tamil Nadu — support that understands local business needs and compliance.' },
        { title: 'HR and Stock in One Place', detail: 'Staff attendance and stock across the shop floor or warehouse live in the same system, not two disconnected tools.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, reducing manual errors.' },
        { title: 'Multi-Location Ready', detail: 'Manage HR and stock across every Madurai outlet or branch from one dashboard.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is HR & Inventory suited to Madurai\'s textile and trading businesses?', a: 'Yes. Employee attendance and real-time stock tracking live in the same system, useful for shop-floor or warehouse operations.' },
      { q: 'Can it handle multiple outlets or branches?', a: 'Yes. Unlimited locations with centralized reporting, while each outlet keeps its own attendance and inventory data.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What does it cost?', a: 'Pricing depends on team size and needs — contact us for a straightforward quote.' },
      { q: 'How long does setup take?', a: 'Most Madurai organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track purchase orders?', a: 'Yes — full purchase order lifecycle from request through receipt, with vendor history.' },
    ],
    cta: CTA,
  },

  vellore: {
    city: 'Vellore',
    state: 'Tamil Nadu',
    product: 'HR & Inventory',
    productSlug: 'hrm-software',
    tagline: 'HRM Software',
    meta: {
      title: 'HRM Software in Vellore | HR & Inventory by Aadhirai',
      description: 'HRM software for Vellore\'s leather, auto components, and medical businesses — employee records, attendance, payroll, and inventory in one system.',
    },
    intro: {
      headline: 'HRM Software in Vellore',
      subheading: 'For Leather, Auto Components & Institutional Employers',
      body: `Vellore's leather and auto-component manufacturers, along with its hospitals and educational institutions, each run sizeable teams with different shift and compliance needs — usually managed with HR and inventory or asset tracking as two separate, disconnected systems.\n\nHR & Inventory is HR operations software built by Aadhirai Innovations, based in Tamil Nadu, bringing employee records, leave and attendance, payroll data from verified attendance, and real-time stock and purchase orders into one system for Vellore's businesses and institutions.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why HR & Inventory Works for Vellore Organizations',
      sections: [
        { title: 'A Tamil Nadu Team', detail: 'Aadhirai Innovations is based in Tamil Nadu — support that understands local business needs and compliance.' },
        { title: 'Built for Shift-Based Manufacturing', detail: 'Shift scheduling and biometric-ready attendance suit manufacturing floors common in Vellore\'s leather and auto-component units.' },
        { title: 'Suited to Institutions Too', detail: 'Role-based access and audit-ready records work equally well for hospitals and educational institutions with structured hierarchies.' },
        { title: 'Payroll From Verified Attendance', detail: 'Payroll data is generated directly from attendance records, reducing manual errors for larger teams.' },
        { title: 'Quick to Set Up', detail: 'Most organizations go live in 2–3 weeks, including setup and staff training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is HR & Inventory suited to Vellore\'s manufacturing units?', a: 'Yes. Shift scheduling and biometric-ready attendance are built for shift-based manufacturing workforces, alongside real-time stock tracking.' },
      { q: 'Does it work for hospitals or educational institutions too?', a: 'Yes. Role-based access and a complete audit trail for every leave and attendance decision suit structured, larger organizations well.' },
      { q: 'How does payroll integration work?', a: 'Payroll data is generated automatically from verified attendance, ready to export to your accounting or payroll processor.' },
      { q: 'What\'s the cost?', a: 'Pricing is based on team size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most organizations go live in 2–3 weeks, including data migration and staff training.' },
      { q: 'Does it track equipment or stock as well as people?', a: 'Yes — real-time stock tracking and a full purchase order lifecycle, alongside the HR features.' },
    ],
    cta: CTA,
  },
}
