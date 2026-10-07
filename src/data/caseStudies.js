// Case study content — every entry here is a real, named client. Do not add fabricated/
// placeholder/composite entries: CaseStudiesPage.jsx's own copy promises visitors every quote
// here is a real client's own words ("quoted directly, not a composite or a sample").
//
// contactName is optional — when a client gave a company-level account rather than a named
// person's quote, leave it null/undefined and CaseStudyRow (src/pages/CaseStudiesPage.jsx) falls
// back to attributing the quote to `client` directly instead of showing a blank name line.
const caseStudies = [
  {
    slug: 'vasantham-pharmacy',
    client: 'Vasantham Pharmacy',
    contactName: 'Selvakumar',
    role: 'Owner',
    location: 'Thanjavur',
    industry: 'Pharmacy',
    initial: 'S',
    outcome: 'Operational clarity',
    headline: 'Billing and stock management became significantly more efficient.',
    summary:
      'Vasantham Pharmacy runs day-to-day billing and medicine inventory on Medora+. Before, tracking stock and reconciling billing took manual effort; the pharmacy needed a system built for how Indian pharmacies actually operate — GST-compliant billing, real stock visibility, and reliable day-to-day use.',
    quote:
      'After implementing Medora+, our billing and stock management became significantly more efficient. Tracking medicines and managing inventory is now simple and reliable. It has meaningfully improved our daily pharmacy operations.',
    product: { name: 'Medora+', href: '/products/medora-plus' },
  },
  {
    slug: 'ebrain-technologies',
    client: 'Ebrain Technologies',
    contactName: 'Ulaganathan Koothaiyan',
    role: 'Managing Partner & CTO',
    location: null,
    industry: 'Technology',
    initial: 'U',
    outcome: 'Delivery excellence',
    headline: 'High-quality software, delivered on time, at fair value.',
    summary:
      'Ebrain Technologies engaged Aadhirai Innovations for software delivery work. What stood out to their team was consistency: competitive pricing, dependable timelines, and engineering quality that held up after handover — the same standard we bring to every engagement.',
    quote:
      'Aadhirai Innovations stands out for delivering high-quality software solutions with exceptional value. Their products are competitively priced, their team ensures timely delivery, and they consistently exceed expectations. I have full confidence in their work and will continue to recommend them to my colleagues.',
    product: { name: 'Fixed-Scope Engineering', href: '/services#engineering' },
  },
  {
    slug: 'akb-transport-logistics',
    client: 'AKB Transport & Logistics',
    contactName: null,
    role: null,
    location: 'Singapore',
    industry: 'Transport & Logistics',
    initial: 'A',
    outcome: 'Invoicing efficiency',
    headline: 'Quotations turn into invoices — and client dues stop living in a spreadsheet.',
    summary:
      'AKB Transport & Logistics runs quotations, invoicing, and client account tracking on Aadhirai Transport & Logistics. Before switching, the team tracked quotations and outstanding client dues manually in Excel — invoicing took longer, and knowing exactly what each client owed meant digging through a spreadsheet. Converting an approved quotation straight into an invoice, and seeing every client\'s dues at a glance, is now part of the same system instead of a manual step.',
    quote:
      'Invoicing and quotations are far more efficient now, and we can see exactly what each client owes without digging through spreadsheets. It\'s a big change from how we used to track things in Excel.',
    product: { name: 'Aadhirai Transport & Logistics', href: '/products/transport-logistics' },
  },
  {
    slug: 'shanthi-clinic',
    client: 'Shanthi Clinic',
    contactName: null,
    role: null,
    location: 'Pattukottai',
    industry: 'Pharmacy',
    initial: 'S',
    outcome: 'Reliable support',
    headline: 'Signed on early, and the support is what has kept them with us.',
    summary:
      'Shanthi Clinic in Pattukottai adopted Medora+ for pharmacy billing and stock management early on, and today runs its in-house dispensary on Aadhirai Clinic Pharmacy — the clinic edition built on the same core. What has kept them with Aadhirai Innovations since isn\'t only the software — it\'s been the service and support, from the initial setup through everyday use.',
    quote:
      'We started with Medora+ when we were just getting going, and the service and support have been with us the whole way. That\'s what has kept us with Aadhirai Innovations.',
    product: { name: 'Aadhirai Clinic Pharmacy', href: '/products/clinic-pharmacy' },
  },
  {
    slug: 'pr-rajagopala-iyengar',
    client: 'P R Rajagopala Iyengar',
    contactName: null,
    role: null,
    location: 'Tiruvarur',
    industry: 'Retail & Dealership',
    initial: 'P',
    outcome: 'Affordable, done well',
    headline: 'A professional web presence, found on search, without an enterprise price tag.',
    summary:
      'P R Rajagopala Iyengar, an authorized Texmo dealer in Tiruvarur specializing in electrical, plumbing, pump, and borewell equipment, needed a website that represented the business properly without a large design budget. Aadhirai Innovations designed and built the site at an affordable price, then handled its search engine optimisation (SEO) — so the business has a real web presence that local customers can actually find on Google.',
    quote:
      'We wanted a proper website for the business without paying enterprise prices for it. Aadhirai Innovations delivered exactly that — a professional site at a price that worked for us.',
    product: { name: 'Visit prrajagopalaiyengar.com', href: 'https://prrajagopalaiyengar.com/' },
  },
]

export default caseStudies
