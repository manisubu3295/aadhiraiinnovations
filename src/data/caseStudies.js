// Case study content, sourced from the real testimonials already used in
// src/components/sections/PartnershipsSection.jsx. Only 2 entries exist because
// only 2 real, attributable client stories exist — do not add placeholder/fabricated
// entries here. If a new client testimonial becomes available, add it in the same shape.
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
]

export default caseStudies
