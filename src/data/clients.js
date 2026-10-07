// Client roster — every business we've delivered for (or are actively delivering for), shown as
// a "who we work with" grid on the homepage and /case-studies via ClientsSection.jsx.
//
// This is deliberately separate from caseStudies.js: a case study requires a real quote from the
// client, whereas this roster only states what we built for them — so a client can appear here
// before (or without) agreeing to be quoted. Keep entries factual: name, location, industry, and
// the work delivered. No invented metrics or testimonials.
//
// status: 'live' — delivered and in use; 'coming-soon' — engagement in progress, not yet launched.
// url: optional public link (a delivered website). caseStudy: optional slug in caseStudies.js,
// which links the card to /case-studies#<slug>.
const clients = [
  {
    name: 'Vasantham Pharmacy',
    location: 'Thanjavur',
    industry: 'Pharmacy',
    delivered: ['Medora+ pharmacy software'],
    status: 'live',
    caseStudy: 'vasantham-pharmacy',
  },
  {
    name: 'Shanthi Clinic',
    location: 'Pattukottai',
    industry: 'Healthcare · Clinic',
    delivered: ['Clinic Pharmacy', 'Aadhirai LIMS — lab & analyzer interfacing', 'Ongoing support'],
    status: 'live',
    caseStudy: 'shanthi-clinic',
  },
  {
    name: 'Sri Venkateswara Clinic',
    location: null,
    industry: 'Healthcare · Clinic',
    delivered: ['Clinic Pharmacy', 'Aadhirai LIMS — lab & analyzer interfacing'],
    status: 'live',
  },
  {
    name: 'H2O Water Care',
    location: 'Kumbakonam',
    industry: 'RO Water Purifier Sales & Service',
    delivered: ['E-commerce website', 'Sales & service billing software', 'SEO'],
    status: 'live',
    url: 'https://h2owaterpurifier.com',
  },
  {
    name: 'P R Rajagopala Iyengar',
    location: 'Tiruvarur',
    industry: 'Retail & Dealership',
    delivered: ['Business website', 'Search engine optimisation (SEO)'],
    status: 'live',
    url: 'https://prrajagopalaiyengar.com/',
    caseStudy: 'pr-rajagopala-iyengar',
  },
  {
    name: 'AKB Transport & Logistics',
    location: 'Singapore',
    industry: 'Transport & Logistics',
    delivered: ['Transport & Logistics software'],
    status: 'live',
    caseStudy: 'akb-transport-logistics',
  },
  {
    name: 'Ebrain Technologies',
    location: null,
    industry: 'Technology',
    delivered: ['Fixed-scope software engineering'],
    status: 'live',
    caseStudy: 'ebrain-technologies',
  },
  {
    name: "Barani's Couture",
    location: null,
    industry: 'Fashion E-commerce',
    delivered: ['E-commerce store with online payments', 'SEO'],
    status: 'coming-soon',
    url: 'https://baraniscouture.com/',
  },
  {
    name: 'Sabu',
    location: null,
    industry: 'Photography & Video',
    delivered: ['Portfolio website with content admin'],
    status: 'coming-soon',
  },
]

export const liveClientCount = clients.filter((c) => c.status === 'live').length

export default clients
