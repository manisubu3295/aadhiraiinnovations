/**
 * TransportLocationPageTemplate — hand-written cityPageData for the 8 curated transport-software
 * cities. Used for: /transport-software/{city}
 *
 * Mirrors src/components/sections/HrmLocationPageTemplate.jsx's contract exactly (same data shape
 * consumed by TransportLocalSEOPage.jsx) but is a separate, independent curated set — see
 * src/data/transportLocationSlugs.js for why. Every city below has genuinely unique intro/why-it-
 * works/FAQ prose reflecting that city's actual freight/logistics character (port, trucking hub,
 * industrial belt, etc. — all common-knowledge industry associations, not fabricated client
 * counts or stats).
 */

const CTA_BUTTONS = [
  { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
  { text: 'See a Demo', href: 'https://transport.aadhiraiinnovations.com', variant: 'secondary' },
]

const CTA = {
  heading: 'Ready to bring your billing, dispatch, and fleet together?',
  subheading: 'Get accuracy, live visibility, and one system instead of a Word template and phone calls.',
  buttons: CTA_BUTTONS,
}

const USE_CASES = {
  heading: 'Aadhirai Transport & Logistics for Every Kind of Fleet Business',
  cases: [
    { type: 'Transport Companies', detail: 'Quotation, invoicing, and delivery job tracking in one system instead of Word/PDF templates.' },
    { type: 'Logistics Operators', detail: 'Fleet, driver, and live GPS visibility alongside client billing and revenue reporting.' },
    { type: 'Freight Forwarders', detail: 'Job-based billing with configurable per-unit rate structures, including true calendar-month billing.' },
    { type: 'Last-Mile & Distribution Fleets', detail: 'Driver-facing job status updates and live tracking for high delivery-volume operations.' },
  ],
}

const WHAT_PRODUCT_DOES = {
  heading: 'What Aadhirai Transport & Logistics Does for Your Fleet',
  sections: [
    { title: 'Quotation → Invoice', detail: 'Build a quotation, then convert it to an invoice in one step — no re-typing line items or client details.' },
    { title: 'Live GPS Driver Tracking', detail: 'A live map shows every driver\'s current position with pickup and delivery pins, updated automatically.' },
    { title: 'Delivery Job Tracking', detail: 'Assign jobs to drivers and track status from dispatch through delivery, with a driver-facing portal.' },
    { title: 'Driver & Fleet Management', detail: 'Driver records with licence expiry warnings, plus vehicle and fleet tracking in one place.' },
    { title: 'Expense Management', detail: 'Drivers log fuel and vehicle expenses for approval, tied to the job or vehicle that incurred them.' },
    { title: 'Revenue Dashboard', detail: 'Aging, revenue, and client summary reports with CSV export.' },
  ],
}

export const cityPageData = {
  chennai: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Chennai | Aadhirai Innovations',
      description: 'Transport software for Chennai fleet operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management. Built by a Tamil Nadu team.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Chennai',
      subheading: 'For Port, Container, and Auto-Manufacturing Freight',
      body: `Chennai runs on freight — Chennai Port and Kamarajar (Ennore) Port move containers in and out daily, and the city's auto and electronics manufacturing belt depends on tightly scheduled inbound and outbound trucking. Most transport operators here still bill from a Word or PDF template and track drivers over phone calls.\n\nAadhirai Transport & Logistics is transport operations software built by Aadhirai Innovations, headquartered in Tamil Nadu with a base in Chennai. It brings quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, and revenue reporting into one system — built for the pace of Chennai's port and manufacturing freight.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Chennai Fleets',
      sections: [
        { title: 'A Tamil Nadu Team, Based in Chennai', detail: 'Aadhirai Innovations operates out of Peravurani and Chennai — support that understands local freight patterns and how Chennai transport businesses actually bill.' },
        { title: 'Built for Port & Container Freight', detail: 'Job-based billing and configurable rate units suit container and port-linked freight movements as well as regular trucking routes.' },
        { title: 'Live Visibility Without Phone Calls', detail: 'A live GPS map shows exactly where every driver and delivery is — no more calling drivers to check status.' },
        { title: 'Faster, Accurate Invoicing', detail: 'Quotations convert to invoices instantly, with auto-numbering and a reusable item catalog keeping every invoice consistent.' },
        { title: 'Quick to Set Up', detail: 'Most Chennai fleets go live in 2–3 weeks, including invoice numbering setup, item catalog configuration, and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team — not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does Aadhirai Transport & Logistics suit Chennai\'s port and container freight operators?', a: 'Yes. Configurable rate units and job-based billing handle container and port-linked freight as well as standard trucking routes, with invoices that match how each client is actually billed.' },
      { q: 'Can it track drivers live across Chennai and connecting routes?', a: 'Yes. A live GPS map shows every active driver\'s current position with pickup and delivery pins, refreshed automatically.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost in Chennai?', a: 'Pricing is based on your fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Chennai fleets go live in 2–3 weeks, including setup, invoice numbering, and driver training.' },
      { q: 'Can drivers log fuel and vehicle expenses?', a: 'Yes. Drivers submit expense entries tied to a job or vehicle, which go through an approval workflow.' },
    ],
    cta: CTA,
  },

  mumbai: {
    city: 'Mumbai',
    state: 'Maharashtra',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Mumbai | Aadhirai Innovations',
      description: 'Transport software for Mumbai fleet operators — quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, and fleet management.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Mumbai',
      subheading: 'For India\'s Busiest Port Cluster & Last-Mile Delivery',
      body: `Mumbai sits at the centre of India's busiest port cluster and its highest-density last-mile delivery market, which means transport operators here juggle huge trucking volumes, tight delivery windows, and clients who expect real-time status — usually with billing still running on a Word or PDF template.\n\nAadhirai Transport & Logistics replaces that with one system: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, and revenue reporting — built for the volume and pace of Mumbai's freight and delivery operations.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Mumbai Fleets',
      sections: [
        { title: 'Built for High Job Volume', detail: 'Delivery job tracking and a driver-facing portal are built to handle the density of Mumbai\'s trucking and last-mile delivery traffic.' },
        { title: 'Live Tracking for Tight Windows', detail: 'A live GPS map shows exactly where every driver is, useful for meeting Mumbai\'s tight delivery and dock windows.' },
        { title: 'Configurable Billing', detail: 'Per-trip, per-KM, or calendar-month rate units match however your business actually bills clients across port, freight, and delivery work.' },
        { title: 'Fewer Billing Errors at Scale', detail: 'Auto-numbered invoices and a reusable item catalog keep billing consistent even at high transaction volume.' },
        { title: 'Quick to Set Up', detail: 'Most Mumbai fleets go live in 2–3 weeks, including setup, numbering configuration, and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team, not a ticket queue.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Can Aadhirai Transport & Logistics handle Mumbai\'s high delivery volume?', a: 'Yes. Delivery job tracking and the driver portal are built to handle high job volume, with live GPS tracking so dispatchers always know where every driver is.' },
      { q: 'Does it support port and container-linked freight billing?', a: 'Yes. Configurable rate units and job-based billing handle port, container, and standard trucking work with consistent, auto-numbered invoices.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in one step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on your fleet size and needs — contact us for a straightforward quote.' },
      { q: 'How long does setup take?', a: 'Most Mumbai fleets go live in 2–3 weeks, including data setup and driver training.' },
      { q: 'Can it track vehicle and fuel expenses?', a: 'Yes. Drivers log expenses tied to a job or vehicle, routed through an approval workflow before they hit revenue reporting.' },
    ],
    cta: CTA,
  },

  delhi: {
    city: 'Delhi',
    state: 'Delhi (NCT)',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Delhi NCR | Aadhirai Innovations',
      description: 'Transport software for Delhi NCR fleet operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management for India\'s largest inland freight hub.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Delhi NCR',
      subheading: 'For India\'s Largest Inland Freight & Trucking Hub',
      body: `Delhi NCR — including the warehousing belts around Gurugram and Faridabad — is India's largest inland freight and trucking hub, moving goods across the north Indian market and beyond. Transport operators here manage large fleets and high job volumes, most still billing from a Word or PDF template.\n\nAadhirai Transport & Logistics is transport operations software built for exactly this scale: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, expense management, and revenue reporting — one system for Delhi NCR's freight volume.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Delhi NCR Fleets',
      sections: [
        { title: 'Built for Large Fleet Operations', detail: 'Driver and fleet management, plus a driver-facing portal, scale to the size of Delhi NCR\'s trucking and warehousing operations.' },
        { title: 'Live Tracking Across the NCR', detail: 'A live GPS map shows every driver\'s position across Delhi, Gurugram, Faridabad, and connecting routes.' },
        { title: 'Configurable Billing at Scale', detail: 'Auto-numbered invoicing and a reusable item catalog keep billing consistent even with a high volume of daily trips.' },
        { title: 'Calendar-Month Billing Option', detail: 'True calendar-month rate units suit long-term contract freight common in NCR\'s warehousing and distribution work.' },
        { title: 'Quick to Set Up', detail: 'Most Delhi NCR fleets go live in 2–3 weeks, including numbering configuration and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support, not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does Aadhirai Transport & Logistics suit large NCR fleets?', a: 'Yes. Driver and fleet management, expense tracking, and live GPS visibility are built to scale to the size of Delhi NCR\'s trucking and warehousing operations.' },
      { q: 'Can it handle contract freight billed monthly?', a: 'Yes. Rate units include a true calendar-month billing option alongside per-trip and per-KM billing.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost in Delhi NCR?', a: 'Pricing is based on your fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most NCR fleets go live in 2–3 weeks, including setup, numbering, and driver training.' },
      { q: 'Can drivers log fuel and toll expenses?', a: 'Yes. Drivers submit expense entries tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },

  bengaluru: {
    city: 'Bengaluru',
    state: 'Karnataka',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Bengaluru | Aadhirai Innovations',
      description: 'Transport software for Bengaluru fleet and last-mile delivery operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Bengaluru',
      subheading: 'For E-Commerce Last-Mile & Distribution Fleets',
      body: `Bengaluru's IT and e-commerce base has made it one of India's highest-volume last-mile delivery and distribution markets, with fleets running dozens of jobs a day across a sprawling city — usually tracked over phone calls and billed from a spreadsheet.\n\nAadhirai Transport & Logistics is transport operations software built for exactly this: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking with driver status updates, fleet and driver records, and revenue reporting — one system for Bengaluru's delivery volume.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Bengaluru Fleets',
      sections: [
        { title: 'Built for High-Volume Last-Mile', detail: 'Delivery job tracking and a driver-facing portal handle the job volume typical of Bengaluru\'s e-commerce and distribution fleets.' },
        { title: 'Live Tracking Across a Sprawling City', detail: 'A live GPS map shows exactly where every driver is, useful across Bengaluru\'s traffic and spread-out delivery zones.' },
        { title: 'Fast, Consistent Invoicing', detail: 'Quotations convert to invoices instantly, with auto-numbering and a reusable item catalog keeping billing consistent at volume.' },
        { title: 'Configurable Rate Units', detail: 'Per-trip, per-KM, or calendar-month billing to match however contracts are actually structured.' },
        { title: 'Quick to Set Up', detail: 'Most Bengaluru fleets go live in 2–3 weeks, including setup and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is Aadhirai Transport & Logistics suited to Bengaluru\'s last-mile delivery volume?', a: 'Yes. Delivery job tracking and a driver-facing portal are built for high job volume, with live GPS tracking so dispatchers can see every driver in real time.' },
      { q: 'Can it manage a large distribution fleet?', a: 'Yes. Driver and fleet management with licence expiry tracking scale to large delivery and distribution operations.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Bengaluru fleets go live in 2–3 weeks, including setup and driver training.' },
      { q: 'Can drivers log expenses on the go?', a: 'Yes. Drivers submit fuel and vehicle expenses tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },

  hyderabad: {
    city: 'Hyderabad',
    state: 'Telangana',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Hyderabad | Aadhirai Innovations',
      description: 'Transport software for Hyderabad fleet operators — quotation-to-invoice conversion, live GPS driver tracking, fleet and expense management.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Hyderabad',
      subheading: 'For Pharma, Electronics & Warehousing Freight',
      body: `Hyderabad's pharmaceutical and electronics manufacturing base, alongside its growing warehousing corridor, means transport operators here handle freight that often needs tighter tracking and documentation than general cargo — usually managed with a Word template and phone calls to drivers.\n\nAadhirai Transport & Logistics replaces that with one system: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, expense management, and revenue reporting — built for Hyderabad's manufacturing and warehousing freight.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Hyderabad Fleets',
      sections: [
        { title: 'Built for Manufacturing & Pharma Freight', detail: 'Job tracking and a driver portal suit the tighter scheduling and documentation needs of pharma and electronics freight.' },
        { title: 'Live Tracking End to End', detail: 'A live GPS map shows every driver\'s position from pickup through delivery, useful for time-sensitive shipments.' },
        { title: 'Consistent, Auto-Numbered Invoicing', detail: 'Quotations convert to invoices instantly, with a reusable item catalog keeping billing consistent.' },
        { title: 'Expense Accountability', detail: 'Driver-submitted fuel and vehicle expenses go through approval, tied to the job or vehicle that incurred them.' },
        { title: 'Quick to Set Up', detail: 'Most Hyderabad fleets go live in 2–3 weeks, including setup and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support, not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does Aadhirai Transport & Logistics suit Hyderabad\'s pharma and electronics freight?', a: 'Yes. Job tracking, live GPS visibility, and driver management suit the tighter scheduling that pharma and electronics freight typically needs.' },
      { q: 'Can it track drivers live across Hyderabad and connecting routes?', a: 'Yes. A live GPS map shows every active driver\'s position with pickup and delivery pins, refreshed automatically.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Hyderabad fleets go live in 2–3 weeks, including setup and driver training.' },
      { q: 'Can drivers submit fuel and vehicle expenses?', a: 'Yes, tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },

  kolkata: {
    city: 'Kolkata',
    state: 'West Bengal',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Kolkata | Aadhirai Innovations',
      description: 'Transport software for Kolkata fleet operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management for eastern India\'s freight gateway.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Kolkata',
      subheading: 'For Eastern India\'s Port & Freight Gateway',
      body: `Kolkata Port and the surrounding freight corridor make the city eastern India's main gateway for cargo moving in and out of the Northeast and neighbouring countries. Transport operators here run high-volume trucking on tight schedules, usually billing from a Word or PDF template.\n\nAadhirai Transport & Logistics is transport operations software built for this: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, and revenue reporting — one system for Kolkata's port and gateway freight.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Kolkata Fleets',
      sections: [
        { title: 'Built for Port & Gateway Freight', detail: 'Job-based billing and configurable rate units suit port-linked freight and long-haul gateway routes alike.' },
        { title: 'Live Tracking Across Long Routes', detail: 'A live GPS map shows every driver\'s position, useful for the longer routes typical of gateway freight to the Northeast and beyond.' },
        { title: 'Consistent Invoicing at Volume', detail: 'Auto-numbered invoices and a reusable item catalog keep billing consistent across high trucking volume.' },
        { title: 'Expense Accountability', detail: 'Driver-submitted fuel and vehicle expenses go through approval, tied to the job or vehicle.' },
        { title: 'Quick to Set Up', detail: 'Most Kolkata fleets go live in 2–3 weeks, including setup and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from Aadhirai\'s own team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does Aadhirai Transport & Logistics suit Kolkata\'s port and gateway freight?', a: 'Yes. Configurable rate units and job-based billing handle port-linked and long-haul gateway freight with consistent, auto-numbered invoices.' },
      { q: 'Can it track drivers on long routes out of Kolkata?', a: 'Yes. A live GPS map shows every active driver\'s position with pickup and delivery pins, refreshed automatically, regardless of route length.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Kolkata fleets go live in 2–3 weeks, including setup and driver training.' },
      { q: 'Can drivers log expenses for long-haul trips?', a: 'Yes. Drivers submit fuel and vehicle expenses tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },

  pune: {
    city: 'Pune',
    state: 'Maharashtra',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Pune | Aadhirai Innovations',
      description: 'Transport software for Pune fleet operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management for auto and manufacturing freight.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Pune',
      subheading: 'For Auto, Manufacturing & the Pune–Mumbai Corridor',
      body: `Pune's automotive and manufacturing base runs on tightly scheduled ancillary-parts freight, much of it moving along the Pune–Mumbai industrial corridor — usually tracked over phone calls and billed from a Word or PDF template.\n\nAadhirai Transport & Logistics is transport operations software built for exactly this: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, and revenue reporting — one system for Pune's auto and manufacturing freight.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Pune Fleets',
      sections: [
        { title: 'Built for Just-in-Time Auto Freight', detail: 'Live GPS tracking and job status updates suit the tight delivery windows common in auto-ancillary freight.' },
        { title: 'Consistent Corridor Billing', detail: 'Configurable rate units match how Pune–Mumbai corridor freight is actually billed, per-trip or by calendar month.' },
        { title: 'Fast, Accurate Invoicing', detail: 'Quotations convert to invoices instantly, with auto-numbering keeping every invoice consistent.' },
        { title: 'Driver & Fleet Visibility', detail: 'Driver records with licence expiry warnings, plus vehicle tracking, in one place.' },
        { title: 'Quick to Set Up', detail: 'Most Pune fleets go live in 2–3 weeks, including setup and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support, not an automated helpdesk.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Does Aadhirai Transport & Logistics suit Pune\'s auto-ancillary freight?', a: 'Yes. Live GPS tracking and job status updates suit the tight delivery windows typical of just-in-time auto-parts freight.' },
      { q: 'Can it handle Pune–Mumbai corridor billing?', a: 'Yes. Configurable rate units, including calendar-month billing, match however corridor freight contracts are structured.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Pune fleets go live in 2–3 weeks, including setup and driver training.' },
      { q: 'Can drivers log fuel and vehicle expenses?', a: 'Yes, tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },

  coimbatore: {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    product: 'Aadhirai Transport & Logistics',
    productSlug: 'transport-software',
    tagline: 'Transport & Logistics Software',
    meta: {
      title: 'Transport & Logistics Software in Coimbatore | Aadhirai Innovations',
      description: 'Transport software for Coimbatore fleet operators — quotation-to-invoice conversion, live GPS driver tracking, and fleet management for textile and engineering freight.',
    },
    intro: {
      headline: 'Transport & Logistics Software in Coimbatore',
      subheading: 'For Textile, Engineering & Inland Freight',
      body: `Coimbatore's textile mills and engineering manufacturers depend on steady inland freight moving raw materials and finished goods across Tamil Nadu — freight most transport operators here still bill from a Word or PDF template.\n\nAadhirai Transport & Logistics is transport operations software built by Aadhirai Innovations for exactly this kind of business: quotations that convert straight into invoices, live GPS tracking of every driver, delivery job tracking, fleet and driver records, and revenue reporting — one system, built for Tamil Nadu's manufacturing freight.`,
    },
    whatProductDoes: WHAT_PRODUCT_DOES,
    whyItWorks: {
      heading: 'Why Aadhirai Transport & Logistics Works for Coimbatore Fleets',
      sections: [
        { title: 'A Tamil Nadu Team', detail: 'Aadhirai Innovations operates out of Peravurani and Chennai — support that understands how Tamil Nadu transport businesses actually bill.' },
        { title: 'Built for Inland Manufacturing Freight', detail: 'Job-based billing and configurable rate units suit steady raw-material and finished-goods freight runs.' },
        { title: 'Live Visibility Without Phone Calls', detail: 'A live GPS map shows exactly where every driver and delivery is.' },
        { title: 'Faster, Accurate Invoicing', detail: 'Quotations convert to invoices instantly, with auto-numbering keeping billing consistent.' },
        { title: 'Quick to Set Up', detail: 'Most Coimbatore fleets go live in 2–3 weeks, including setup and driver training.' },
        { title: 'Real Human Support', detail: 'Direct WhatsApp and phone support from a Tamil Nadu-based team.' },
      ],
    },
    useCases: USE_CASES,
    faq: [
      { q: 'Is Aadhirai Transport & Logistics suited to Coimbatore\'s textile and engineering freight?', a: 'Yes. Job-based billing and configurable rate units suit steady inland freight runs moving raw materials and finished goods.' },
      { q: 'Can it track drivers live within Tamil Nadu?', a: 'Yes. A live GPS map shows every active driver\'s position with pickup and delivery pins, refreshed automatically.' },
      { q: 'How does quotation-to-invoice conversion work?', a: 'Build a quotation, then convert it to an invoice in a single step — no re-entering client or line-item details.' },
      { q: 'What does it cost?', a: 'Pricing depends on fleet size and requirements — contact us for a straightforward quote.' },
      { q: 'How long does implementation take?', a: 'Most Coimbatore fleets go live in 2–3 weeks, including setup and driver training.' },
      { q: 'Can drivers log fuel and vehicle expenses?', a: 'Yes, tied to a job or vehicle, routed through an approval workflow.' },
    ],
    cta: CTA,
  },
}
