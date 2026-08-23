// Closing-CTA content for BlogPostPage.jsx, keyed by each post's `ctaProduct`
// field in blogPosts.js. Keeps the CTA relevant to what the post is actually
// about — previously every post (HR, transport, billing posts included)
// closed with a hardcoded "modernize your pharmacy operations" pitch.
const blogCtaConfig = {
  medora: {
    heading: 'Ready to modernize your pharmacy operations?',
    body: 'Medora+ brings everything covered in this guide together — GST compliance, offline operation, expiry tracking, and complete inventory management.',
    primary: { label: 'Try Demo', href: 'https://demo.aadhiraiinnovations.com' },
  },
  hr: {
    heading: 'Ready to simplify HR for your growing team?',
    body: 'HR & Inventory brings employee records, leave and attendance, and payroll data generated from verified attendance into one system — most organizations go live in 2–3 weeks.',
    primary: { label: 'Explore HR & Inventory', href: '/products/hr-inventory' },
  },
  workforce: {
    heading: 'Ready to fix scheduling for your team?',
    body: 'Workforce Manager handles shift planning, conflict detection, and biometric attendance, with clean payroll data export — no more spreadsheet scheduling.',
    primary: { label: 'Explore Workforce Manager', href: '/products/workforce-manager' },
  },
  transport: {
    heading: "Ready to modernize your fleet's billing and dispatch?",
    body: 'Aadhirai Transport & Logistics brings one-step quotation-to-invoice conversion, live GPS driver tracking, and fleet management into one dashboard.',
    primary: { label: 'Explore Transport & Logistics', href: '/products/transport-logistics' },
  },
  billing: {
    heading: 'Ready for GST billing built for how retail actually runs?',
    body: 'Aadhirai Billing gives your business its own isolated database, barcode billing, and role-based staff access — usable the moment you sign up.',
    primary: { label: 'Try Aadhirai Billing', href: 'https://billing.aadhiraiinnovations.com/login' },
  },
  pos: {
    heading: 'Ready for a POS system built for the counter, not the boardroom?',
    body: "Aadhirai's POS System brings fast barcode billing, real-time multi-branch inventory, and offline-first operation together in one system.",
    primary: { label: 'Explore POS System', href: '/products/pos-system' },
  },
}

export const DEFAULT_BLOG_CTA = {
  heading: 'Ready to modernize this part of your business?',
  body: 'Talk to our team about which Aadhirai Innovations product fits your operations — pharmacy billing, HR & inventory, POS, retail billing, or transport & logistics.',
  primary: { label: 'Talk to us', href: 'https://wa.me/918508716957' },
}

export default blogCtaConfig
