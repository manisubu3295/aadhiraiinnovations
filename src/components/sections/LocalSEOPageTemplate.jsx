import { motion } from 'framer-motion'
import { ArrowRight, MapPin, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Container from '../ui/Container'

/**
 * LocalSEOPageTemplate — Reusable programmatic page for city-based SEO
 * Used for: /pharmacy-billing-software/{city}
 *
 * Props injected via data layer:
 * - city: city name
 * - product: product name (e.g., "Medora+")
 * - productDescription: what the product does
 * - localContext: city-specific business context
 * - benefits: localized benefits
 * - useCases: local use cases
 * - faqs: local FAQs
 */

// Data structure example
const cityPageData = {
  peravurani: {
    city: 'Peravurani',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Peravurani | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Peravurani for medical shops. GST-compliant, offline-first, expiry tracking. Made by Aadhirai Innovations—local company, global software.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Peravurani',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Peravurani's pharmacy and medical retail business is growing. Whether you're managing a single medical shop on Main Street or multiple locations across town, billing accuracy and GST compliance are non-negotiable. Most pharmacy owners in Peravurani still use outdated systems or manual spreadsheets — leading to billing errors, lost time at the counter, and compliance risk.\n\nMedora+ is a pharmacy billing software built specifically for Indian pharmacies, made right here in Peravurani by Aadhirai Innovations. It's designed to work in your business environment: offline-first operation (works even when internet cuts out), GST-ready billing, expiry tracking, and real-time stock management. Hundreds of pharmacy owners across Tamil Nadu—including several in Peravurani—now run their daily operations using Medora+.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'AI-Powered Billing',
          detail: 'Smart invoice generation with anomaly detection. Catches pricing errors before they happen. GST calculations are automatic.',
        },
        {
          title: 'Real-Time Inventory',
          detail: 'Know your stock at any time. Automatic reorder alerts when items run low. Prevents stockouts and overstock.',
        },
        {
          title: 'Expiry Management',
          detail: 'Never sell expired medicine again. Medora+ tracks batch-level expiry dates and alerts you before expiry.',
        },
        {
          title: 'Works Without Internet',
          detail: 'Peravurani has occasional internet outages. Medora+ works fully offline. All billing, stock, reports work without connectivity.',
        },
        {
          title: 'Multi-Location Support',
          detail: 'Manage multiple pharmacy locations from one dashboard. Central reporting, shared inventory across branches.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Built for Indian compliance. HSN codes, GSTIN validation, audit-ready records. Every invoice is ready for tax filing.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works Better for Peravurani Pharmacies',
      sections: [
        {
          title: 'Made by Local Founders',
          detail: 'Aadhirai Innovations is based right here in Peravurani. We understand Tamil Nadu\'s business environment, compliance requirements, and operational challenges. Your support team speaks Tamil and understands your context.',
        },
        {
          title: 'Compliance Ready from Day One',
          detail: 'Peravurani pharmacies face regular compliance audits. Medora+ keeps you audit-ready with complete transaction history, GST reconciliation, and controlled substance tracking.',
        },
        {
          title: 'Works Offline — Critical for Your Region',
          detail: 'Power cuts and internet outages happen. Unlike cloud-only systems, Medora+ works fully offline. Your billing never stops. Data syncs to cloud when internet returns.',
        },
        {
          title: 'Affordable for Single Shops',
          detail: 'You don\'t need enterprise ERP pricing (₹50K+/month). Medora+ starts at ₹5K/month for single locations. ROI in weeks.',
        },
        {
          title: 'Quick to Set Up',
          detail: 'Most Peravurani pharmacies go live in 1–2 weeks. No lengthy downtime. Your staff learns in hours, not weeks.',
        },
        {
          title: 'Real Support After Launch',
          detail: 'We don\'t disappear after go-live. Ongoing support, updates, and improvements included.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ Works for Different Pharmacy Types in Peravurani',
      cases: [
        {
          type: 'Single Medical Shops (Main Street, Nallai)',
          detail: 'Manage daily billing and inventory without hiring extra staff. Real-time stock prevents medicine stockouts. One person can run billing efficiently.',
        },
        {
          type: 'Multi-Location Pharmacy Chains',
          detail: 'If you have multiple shops across Peravurani or nearby towns, manage all locations from one dashboard. Central reporting and shared inventory views.',
        },
        {
          type: 'Hospital & Institutional Pharmacies',
          detail: 'Handle high-volume billing with controlled substance tracking and audit trails for compliance.',
        },
        {
          type: 'Medicine Distributors & Wholesale',
          detail: 'Manage customer orders, invoicing, and stock allocation for retail pharmacy customers.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet in Peravurani?',
        a: 'Yes, completely. Medora+ is built offline-first. All billing, stock management, and reporting work without internet. Data syncs to the cloud automatically when connectivity returns. This is critical for Peravurani\'s occasional power and internet outages.',
      },
      {
        q: 'Is Medora+ GST-compliant for Peravurani pharmacies?',
        a: 'Yes. Medora+ is fully GST-compliant with HSN code management, GSTIN validation, and audit-ready records. Every invoice is GST-ready and can be exported for ITC reconciliation and tax filing.',
      },
      {
        q: 'How much does Medora+ cost in Peravurani?',
        a: 'Medora+ starts at ₹5,000/month for single locations and ₹12,000/month for multi-location chains. We also offer a free 30-day trial. Contact us for custom pricing based on your pharmacy size and needs.',
      },
      {
        q: 'How long does implementation take?',
        a: 'Most Peravurani pharmacies go live in 1–2 weeks. Our implementation includes setup, data migration, staff training, and go-live support. No lengthy downtime or disruption to your operations.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Medora+ tracks batch-level expiry dates automatically. You get alerts 30 days before expiry. Expired items are flagged during billing so they can\'t be sold.',
      },
      {
        q: 'Does Medora+ work on my existing computer?',
        a: 'Yes. Medora+ runs on Windows, Mac, or web browser. If you have a computer or laptop, Medora+ will work on it. We provide setup and training.',
      },
      {
        q: 'What if I need support?',
        a: 'We provide direct support via phone, WhatsApp, and email. Our team in Peravurani is available during business hours. Emergency support available 24/7 for critical issues.',
      },
      {
        q: 'Can I import my existing pharmacy data?',
        a: 'Yes. We help migrate your existing stock list, customer records, and historical data. Migration is included in implementation.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Stop manual billing. Start working with real data.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  pattukottai: {
    city: 'Pattukottai',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Pattukottai | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Pattukottai for medical shops and chains. GST-compliant, offline-first, built by local software company.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Pattukottai',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Pattukottai's medical retail sector is active—medical shops on every main road serving both local customers and visitors. Managing billing across busy hours, tracking inventory accurately, and staying GST-compliant is a daily challenge. Most pharmacy owners in Pattukottai still rely on manual registers or basic spreadsheets, losing time at the counter and facing compliance risk.\n\nMedora+ is pharmacy billing software built for Indian pharmacies. It's designed for your business: offline-first (works when internet cuts out), GST-ready billing, expiry tracking, and real-time inventory. Made by Aadhirai Innovations, a software company based in nearby Peravurani. Hundreds of pharmacies across Tamil Nadu—including several in Pattukottai—now use Medora+ daily.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Barcode scanning and smart invoice generation. Process transactions in under 30 seconds, even during peak hours.',
        },
        {
          title: 'Real-Time Stock Tracking',
          detail: 'Know exactly what\'s in stock. Automatic low-stock alerts prevent stockouts. No more counting inventory manually.',
        },
        {
          title: 'Medicine Expiry Control',
          detail: 'Track batch-level expiry dates. Get alerts before expiry. Expired items are flagged during billing.',
        },
        {
          title: 'Works Offline Always',
          detail: 'Pattukottai\'s internet can be inconsistent. Medora+ works completely offline. Billing never stops.',
        },
        {
          title: 'GST Billing Automatic',
          detail: 'All invoices are GST-compliant. HSN codes, GSTIN validation built-in. Ready for audits and tax filings.',
        },
        {
          title: 'Business Reports Daily',
          detail: 'Daily sales summary, profit visibility, top-selling items. Make decisions based on real data.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Better for Pattukottai Pharmacies',
      sections: [
        {
          title: 'Built for Tamil Nadu',
          detail: 'Aadhirai Innovations (Peravurani-based) understands Tamil Nadu\'s compliance, business culture, and challenges. Your support team speaks Tamil and understands your context.',
        },
        {
          title: 'Works Without Internet',
          detail: 'Pattukottai has occasional outages. Medora+ works fully offline. Your billing never stops, even when connectivity goes down.',
        },
        {
          title: 'GST Compliance Built-In',
          detail: 'Every invoice is audit-ready. HSN codes, GSTIN validation, tax reconciliation features included from day one.',
        },
        {
          title: 'Affordable',
          detail: 'Starting at ₹5K/month for single locations. No expensive enterprise ERP pricing. ROI in weeks.',
        },
        {
          title: 'Fast Setup',
          detail: 'Go live in 1–2 weeks. Staff learns quickly. No lengthy disruption to your business.',
        },
        {
          title: 'Support When You Need It',
          detail: 'Direct WhatsApp and phone support during business hours. Not a helpdesk that ignores you.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Different Pharmacy Types in Pattukottai',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily billing and stock efficiently. One person can handle billing and inventory. Real-time stock prevents stockouts.',
        },
        {
          type: 'Pharmacy Chains (Multiple Locations)',
          detail: 'Multiple shops across Pattukottai? Manage all from one dashboard. Central reporting and shared inventory views.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with controlled substance tracking. Complete audit trail for compliance.',
        },
        {
          type: 'Medicine Distributors',
          detail: 'Manage customer orders, invoicing, and stock allocation for retail pharmacies.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work offline in Pattukottai?',
        a: 'Yes. Medora+ is completely offline-first. All billing, stock, and reports work without internet. Data syncs when connectivity returns. This is perfect for Pattukottai\'s internet reliability.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully. HSN codes, GSTIN validation, audit-ready records. Every invoice is GST-ready for tax filings.',
      },
      {
        q: 'What\'s the pricing?',
        a: 'Starting at ₹5,000/month for single shops, ₹12,000/month for chains. Free 30-day trial available.',
      },
      {
        q: 'How long to set up?',
        a: '1–2 weeks for most pharmacies. Setup, training, and go-live support included.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Batch-level tracking with automatic alerts 30 days before expiry. Expired items flagged during billing.',
      },
      {
        q: 'Do you provide training?',
        a: 'Yes. Included in implementation. Your staff will be trained on billing, stock management, and reports.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade from manual billing?',
      subheading: 'Get billing accuracy and inventory control without complexity.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  thanjavur: {
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Thanjavur | Medora+ by Aadhirai',
      description: 'Pharmacy billing software in Thanjavur for medical shops and chains. GST-compliant, offline-first, works for independent shops and pharmacy chains.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Thanjavur',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Thanjavur's pharmacy sector is busy—medical shops across the city serving residents and patients from nearby areas. Managing high-volume billing, tracking inventory across multiple medicine categories, and ensuring GST compliance is a daily operational challenge. Most pharmacy owners in Thanjavur use manual systems or spreadsheets, losing efficiency and facing compliance risks.\n\nMedora+ is a pharmacy management software built specifically for Indian pharmacies. Designed to work in your environment: offline-first (works even during power cuts), GST-ready billing, batch-level expiry tracking, and real-time inventory. Made by Aadhirai Innovations (based in Tamil Nadu). Used by 200+ pharmacies across Tamil Nadu, including several in Thanjavur.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Smart Billing System',
          detail: 'Barcode scanning, GST calculation, invoice generation in seconds. Handles peak hours efficiently.',
        },
        {
          title: 'Inventory Management',
          detail: 'Real-time stock visibility. Low-stock alerts prevent stockouts. Track stock across multiple medicine categories.',
        },
        {
          title: 'Expiry Tracking',
          detail: 'Batch-level expiry dates. Automatic alerts before expiry. Expired items flagged during billing.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works fully offline. Billing never stops, even during power cuts (common in Thanjavur).',
        },
        {
          title: 'GST Compliance',
          detail: 'Built-in GST features. Every invoice is audit-ready. Tax reconciliation built-in.',
        },
        {
          title: 'Daily Analytics',
          detail: 'Sales reports, profit analysis, top-selling items. Real-time business insights.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is the Best Choice for Thanjavur Pharmacies',
      sections: [
        {
          title: 'Built by Tamil Nadu Founders',
          detail: 'Aadhirai Innovations (Peravurani-based) understands Tamil Nadu\'s compliance, business environment, and challenges. Support team speaks Tamil.',
        },
        {
          title: 'Designed for Power Cuts',
          detail: 'Thanjavur experiences occasional power cuts. Medora+ is completely offline-first. No dependency on electricity or internet for billing.',
        },
        {
          title: 'GST-Ready from Day One',
          detail: 'All compliance built-in. HSN codes, GSTIN validation, audit-ready records. No manual tax calculations.',
        },
        {
          title: 'Affordable Pricing',
          detail: 'Starting at ₹5K/month for single shops. Much cheaper than generic ERP. Pays for itself in weeks.',
        },
        {
          title: 'Quick Implementation',
          detail: 'Go live in 1–2 weeks. Staff training included. No lengthy disruption.',
        },
        {
          title: 'Direct Support',
          detail: 'WhatsApp, phone, email support. Not a distant helpdesk. Real people supporting your business.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Thanjavur\'s Pharmacy Types',
      cases: [
        {
          type: 'Single Medical Shops (West Mada Street, Central Thanjavur)',
          detail: 'Efficient daily billing and stock management. One person can handle everything. Real inventory data.',
        },
        {
          type: 'Multi-Location Pharmacy Chains',
          detail: 'Multiple shops across Thanjavur? Unified dashboard. Central inventory views. Shared reporting.',
        },
        {
          type: 'Hospital & Clinic Pharmacies',
          detail: 'High-volume transactions. Controlled substance tracking. Complete audit trail.',
        },
        {
          type: 'Medicine Distributors & Wholesale',
          detail: 'Customer order management, invoicing, stock allocation for retail pharmacies.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work during power cuts in Thanjavur?',
        a: 'Yes, completely. Medora+ is offline-first. All billing, inventory, and reporting work without electricity or internet. This is one of its key features for Thanjavur.',
      },
      {
        q: 'Is Medora+ GST-compliant for Thanjavur pharmacies?',
        a: 'Yes. Full GST compliance. HSN codes, GSTIN validation, audit-ready records. Every invoice ready for tax filing.',
      },
      {
        q: 'How much does it cost?',
        a: 'From ₹5,000/month for single shops to ₹12,000/month for chains. Free 30-day trial to test.',
      },
      {
        q: 'How fast can we go live?',
        a: '1–2 weeks for most pharmacies. Setup, staff training, and go-live support included. Minimal business disruption.',
      },
      {
        q: 'Can I track expiry for multiple medicine batches?',
        a: 'Yes. Batch-level expiry tracking. Automatic alerts 30 days before expiry. During billing, expired items are flagged.',
      },
      {
        q: 'Is training provided?',
        a: 'Yes. Included in implementation. Your staff learns billing, inventory, and reporting.',
      },
      {
        q: 'What if we lose internet connection?',
        a: 'No problem. Medora+ works completely offline. When internet returns, data syncs automatically. Billing is never affected.',
      },
    ],

    cta: {
      heading: 'Ready to modernize your pharmacy operations?',
      subheading: 'Get billing control, inventory accuracy, and compliance—without complexity.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  aranthangi: {
    city: 'Aranthangi',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Aranthangi | Medora+ by Aadhirai',
      description: 'Pharmacy billing software in Aranthangi for medical shops. GST-compliant, offline-first, affordable.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Aranthangi',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Aranthangi's pharmacy and retail sector is growing—medical shops serving local residents and visitors. Managing daily billing manually, tracking inventory accurately, and staying GST-compliant is time-consuming and error-prone. Most pharmacy owners in Aranthangi still use manual registers or basic spreadsheets, losing hours to manual work and risking compliance violations.\n\nMedora+ is pharmacy billing software built for Indian pharmacies by Aadhirai Innovations (Peravurani-based). It's designed for your context: works offline (no internet dependency), GST-ready billing, expiry tracking, and real-time stock management. Used by 200+ pharmacies across Tamil Nadu.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Barcode scanning and quick invoicing. Process transactions in seconds, even during peak hours.',
        },
        {
          title: 'Real-Time Inventory',
          detail: 'Know your stock anytime. Low-stock alerts prevent stockouts. Track every medicine category.',
        },
        {
          title: 'Expiry Management',
          detail: 'Track batch-level expiry dates. Get alerts before expiry. Prevent selling expired medicine.',
        },
        {
          title: 'Works Offline',
          detail: 'Complete offline operation. Billing works even without internet. No data loss.',
        },
        {
          title: 'GST-Compliant Invoicing',
          detail: 'All invoices GST-ready. HSN codes and GSTIN built-in. Audit-ready records.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales summary, profit reports, top-selling items. Real business data.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Right for Aranthangi Pharmacies',
      sections: [
        {
          title: 'Made by Local Founders',
          detail: 'Aadhirai Innovations is Tamil Nadu-based. Understands local compliance, regulations, and business needs.',
        },
        {
          title: 'Offline-First Design',
          detail: 'Aranthangi\'s internet can be unreliable. Medora+ works fully offline. Your billing never stops.',
        },
        {
          title: 'Built-In GST Compliance',
          detail: 'Every invoice GST-ready. No manual tax calculations. Ready for audits anytime.',
        },
        {
          title: 'Very Affordable',
          detail: 'Starts at ₹5K/month for single shops. Much cheaper than big ERP systems. Pays for itself quickly.',
        },
        {
          title: 'Quick to Set Up',
          detail: '1–2 weeks implementation. Your staff learns in days. Minimal business disruption.',
        },
        {
          title: 'Real Human Support',
          detail: 'Direct WhatsApp and phone support. Not an automated helpdesk. People who understand your business.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Aranthangi\'s Pharmacies',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Efficient daily billing and inventory. One person can manage everything. No manual spreadsheets.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple locations? Unified dashboard. Manage inventory and reporting from one place.',
        },
        {
          type: 'Institutional Pharmacies',
          detail: 'Hospital or clinic pharmacies. High-volume transactions with controlled substance tracking.',
        },
        {
          type: 'Medicine Wholesalers',
          detail: 'Manage customer orders, invoicing, and stock allocation.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet?',
        a: 'Yes, completely. Medora+ is designed to work fully offline. All billing and inventory work without internet. Perfect for Aranthangi.',
      },
      {
        q: 'Is it GST-compliant?',
        a: 'Yes. Full GST built-in. HSN codes, GSTIN validation, audit-ready records. Every invoice ready for tax filing.',
      },
      {
        q: 'What\'s the cost?',
        a: 'From ₹5,000/month for single shops. Free 30-day trial available.',
      },
      {
        q: 'How long to implement?',
        a: '1–2 weeks. Setup, training, and go-live support included.',
      },
      {
        q: 'Can I track medicine batches and expiry?',
        a: 'Yes. Batch-level tracking with automatic alerts 30 days before expiry.',
      },
      {
        q: 'Is training included?',
        a: 'Yes. Staff training on billing, inventory, and reports included in implementation.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Get accuracy, efficiency, and compliance in one system.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  alangudi: {
    city: 'Alangudi',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Alangudi | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Alangudi for medical shops and pharmacies. GST-compliant, offline-first.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Alangudi',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Alangudi's pharmacy business is active—medical shops serving local residents with daily healthcare needs. Managing billing accuracy, tracking medicine inventory, and ensuring GST compliance is essential but time-consuming with manual systems. Most pharmacy owners in Alangudi still use handwritten registers or spreadsheets, losing efficiency and risking compliance violations.\n\nMedora+ is pharmacy management software built for Indian pharmacies by Aadhirai Innovations. Works offline (critical for Alangudi), GST-ready billing, batch-level expiry tracking, and real-time inventory. Used by 200+ pharmacies across Tamil Nadu, including several in Alangudi.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Smart Billing',
          detail: 'Barcode scanning and fast invoicing. Transactions processed in seconds.',
        },
        {
          title: 'Inventory Tracking',
          detail: 'Real-time stock visibility. Low-stock alerts. Track all medicine categories.',
        },
        {
          title: 'Expiry Control',
          detail: 'Batch-level expiry tracking. Alerts before expiry. Prevent expired medicine sales.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works fully offline. No internet dependency. Billing never stops.',
        },
        {
          title: 'GST Compliance',
          detail: 'Built-in GST features. Every invoice audit-ready. Tax reconciliation automated.',
        },
        {
          title: 'Business Data',
          detail: 'Daily sales reports, profit analysis, inventory insights.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Perfect for Alangudi Pharmacies',
      sections: [
        {
          title: 'Tamil Nadu-Based Support',
          detail: 'Aadhirai Innovations (Peravurani) understands Tamil Nadu\'s business and compliance needs.',
        },
        {
          title: 'Designed for Offline Use',
          detail: 'Alangudi\'s internet is not always reliable. Medora+ works completely offline. No disruption.',
        },
        {
          title: 'GST-Ready System',
          detail: 'All compliance built-in. HSN codes, GSTIN, audit logs. No manual work.',
        },
        {
          title: 'Affordable Pricing',
          detail: 'From ₹5K/month. Much cheaper than enterprise systems. Quick ROI.',
        },
        {
          title: 'Fast Setup',
          detail: '1–2 weeks implementation. Staff training included. Minimal disruption.',
        },
        {
          title: 'Direct Support',
          detail: 'WhatsApp and phone support from people who understand your business.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Alangudi\'s Pharmacy Types',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Efficient daily operations. One person can handle billing and inventory.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple locations? Unified management. One dashboard for all shops.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with compliance tracking.',
        },
        {
          type: 'Medicine Distributors',
          detail: 'Order management and customer invoicing.',
        },
      ],
    },

    faq: [
      {
        q: 'Does it work without internet in Alangudi?',
        a: 'Yes. Completely offline. Billing works anytime, even without connectivity. Data syncs when internet returns.',
      },
      {
        q: 'Is it GST-compliant?',
        a: 'Yes, fully. HSN codes, GSTIN validation, audit-ready records. Every invoice ready for tax compliance.',
      },
      {
        q: 'How much does it cost?',
        a: 'From ₹5,000/month for single locations. Free trial available.',
      },
      {
        q: 'How long to go live?',
        a: '1–2 weeks. Setup, training, and support included.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Batch-level tracking with automatic expiry alerts.',
      },
    ],

    cta: {
      heading: 'Ready to move beyond manual billing?',
      subheading: 'Get a professional billing system designed for your pharmacy.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  salem: {
    city: 'Salem',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Salem | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Salem for medical shops and chains. GST-compliant, offline-first, expiry tracking. Trusted by 50+ pharmacies in Salem district.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Salem',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Salem is one of Tamil Nadu's busiest pharmaceutical hubs. With hundreds of medical shops serving Salem city, industrial areas, and surrounding towns, billing accuracy and stock control are critical. Yet most pharmacy owners in Salem still use outdated systems or manual registers—leading to billing errors, inventory losses, and compliance issues.\n\nMedora+ is pharmacy billing software built for Indian pharmacies, used by 50+ pharmacies across Salem district. It's designed for your business: offline-first operation (works when internet cuts out), GST-ready billing, batch-level expiry tracking, and real-time inventory. Made by Aadhirai Innovations, with dedicated support for Salem-based pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'High-Speed Billing',
          detail: 'Process transactions in 20-30 seconds. Barcode scanning and smart invoice generation keep queues moving.',
        },
        {
          title: 'Real-Time Inventory Control',
          detail: 'Know stock levels instantly across locations. Automatic low-stock alerts prevent medicine stockouts.',
        },
        {
          title: 'Batch-Level Expiry Tracking',
          detail: 'Track expiry dates by batch. Automatic alerts 30 days before expiry. Expired items flagged at billing.',
        },
        {
          title: 'Works Without Internet',
          detail: 'Complete offline operation. All billing and reports work without connectivity. Data syncs when internet returns.',
        },
        {
          title: 'Multi-Location Dashboard',
          detail: 'Manage multiple pharmacy locations from one place. Central reports and shared inventory views.',
        },
        {
          title: 'GST-Ready Invoicing',
          detail: 'All invoices auto-comply with GST. HSN codes, GSTIN validation built-in. Ready for audits and tax filings.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Better for Salem Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Aadhirai Innovations understands Tamil Nadu\'s compliance landscape and operational challenges. Your support team speaks Tamil.',
        },
        {
          title: 'Offline-First Architecture',
          detail: 'Salem\'s occasional power issues won\'t affect your billing. Works completely offline. Your business never stops.',
        },
        {
          title: 'GST Compliance Included',
          detail: 'Every invoice is audit-ready. HSN codes, GSTIN validation, tax reconciliation features included from day one.',
        },
        {
          title: 'Affordable Pricing',
          detail: 'From ₹5,000/month for single locations, ₹12,000/month for chains. ROI within weeks, not years.',
        },
        {
          title: 'Fast Implementation',
          detail: 'Go live in 1–2 weeks. Staff training included. Minimal disruption to daily operations.',
        },
        {
          title: '24/7 Support Available',
          detail: 'WhatsApp, phone, and email support. Emergency assistance for critical issues any time.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ Works for All Pharmacy Types in Salem',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily billing, stock, and expiry tracking efficiently. One person can handle all operations.',
        },
        {
          type: 'Pharmacy Chains (2-10 locations)',
          detail: 'Multiple shops across Salem? Unified management from one dashboard. Central reporting and inventory sync.',
        },
        {
          type: 'Hospital & Institutional Pharmacies',
          detail: 'High-volume billing with controlled substance tracking and complete audit trail for compliance.',
        },
        {
          type: 'Medicine Distributors & Wholesalers',
          detail: 'Manage customer orders, batch invoicing, and stock allocation for retail pharmacy partners.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet in Salem?',
        a: 'Yes. 100% offline operation. All billing, inventory, and reports work without internet. Data syncs automatically when connectivity returns.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully. HSN code management, GSTIN validation, and audit-ready records are built-in. Every invoice is GST-ready for tax filings.',
      },
      {
        q: 'What\'s the pricing for Salem pharmacies?',
        a: 'Starts at ₹5,000/month for single locations, ₹12,000/month for multi-location chains. Free 30-day trial available.',
      },
      {
        q: 'How long does implementation take?',
        a: 'Most Salem pharmacies go live in 1–2 weeks. Implementation includes setup, data migration, staff training, and go-live support.',
      },
      {
        q: 'Can I track medicine expiry dates?',
        a: 'Yes. Batch-level expiry tracking with automatic alerts 30 days before expiry. Expired items are flagged during billing to prevent sales.',
      },
      {
        q: 'Do you support multiple pharmacy locations?',
        a: 'Yes. Manage unlimited locations from one dashboard. Each shop has its own user login, but all data syncs centrally.',
      },
      {
        q: 'What if my computer breaks down?',
        a: 'Your data is backed up in the cloud. All records are safe. You can resume operations on any computer within minutes.',
      },
      {
        q: 'Can I migrate my existing pharmacy data?',
        a: 'Yes. We help migrate your stock list, customer records, and historical data. Migration is included in implementation.',
      },
    ],

    cta: {
      heading: 'Join 50+ Salem Pharmacies Using Medora+',
      subheading: 'Stop manual billing. Start working with real data.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  trichy: {
    city: 'Trichy',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Trichy | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Trichy (Tiruchirappalli) for medical shops and chains. GST-compliant, offline-first, built for Indian pharmacies.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Trichy (Tiruchirappalli)',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Trichy is a major pharmaceutical hub with hundreds of medical shops spread across the city and surrounding areas. Managing billing across multiple locations, tracking inventory across branches, and ensuring GST compliance is complex. Most pharmacy owners in Trichy still rely on manual billing or spreadsheets—leading to errors and lost time.\n\nMedora+ is designed for pharmacy businesses like yours. It's built specifically for Indian operations: offline-first (works during internet outages), GST-ready billing, batch-level expiry tracking, and multi-location support. Aadhirai Innovations provides dedicated support for Trichy-based pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing During Rush Hours',
          detail: 'Process transactions in 20-30 seconds. Barcode scanning and smart invoice generation. Never slow down your counter.',
        },
        {
          title: 'Multi-Location Inventory Sync',
          detail: 'Manage stock across multiple Trichy locations from one dashboard. Shared inventory visibility prevents duplicate orders.',
        },
        {
          title: 'Batch Expiry Management',
          detail: 'Track medicine expiry by batch. Automatic alerts 30 days before expiry. Flag expired items at billing.',
        },
        {
          title: 'Works Completely Offline',
          detail: 'Trichy\'s internet can be unreliable. Medora+ works fully offline. All billing continues without connectivity.',
        },
        {
          title: 'Daily Business Reports',
          detail: 'Sales summaries, profit visibility, top-selling medicines. Make decisions based on real data.',
        },
        {
          title: 'GST-Ready from Day One',
          detail: 'All invoices are GST-compliant. HSN codes and GSTIN validation built-in. Ready for audits.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works Better for Trichy Pharmacies',
      sections: [
        {
          title: 'Built for Indian Compliance',
          detail: 'Aadhirai Innovations is based in Tamil Nadu. We understand local compliance, GST rules, and operational challenges.',
        },
        {
          title: 'Handles Internet Outages',
          detail: 'Works fully offline. No internet? No problem. Your billing never stops, even during power cuts.',
        },
        {
          title: 'Multi-Location Support',
          detail: 'Manage 2, 5, or 10 pharmacy locations from one dashboard. Central reporting and inventory sync.',
        },
        {
          title: 'Affordable for SMEs',
          detail: 'From ₹5,000/month. No expensive enterprise ERP pricing. ROI within weeks.',
        },
        {
          title: 'Quick Implementation',
          detail: '1–2 weeks to go live. Staff training included. Minimal business disruption.',
        },
        {
          title: 'Responsive Support Team',
          detail: 'Direct WhatsApp and phone support from people who understand pharmacy business.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Different Pharmacy Types in Trichy',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily operations efficiently. Real-time billing and inventory tracking. One person can handle all.',
        },
        {
          type: 'Pharmacy Chains (Multiple Locations)',
          detail: 'Multiple shops across Trichy? Unified management with one dashboard. Inventory synced across all locations.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'Handle high-volume billing with controlled substance tracking and complete audit trail.',
        },
        {
          type: 'Wholesale Distributors',
          detail: 'Manage customer orders and batch invoicing for retail pharmacy partners across the region.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet in Trichy?',
        a: 'Yes. Completely offline-first. All billing, inventory, and reports work without internet. Data syncs when connectivity returns.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully. HSN codes, GSTIN validation, and audit-ready records. Every invoice is ready for tax compliance.',
      },
      {
        q: 'Can I manage multiple pharmacy locations?',
        a: 'Yes. Unlimited locations from one dashboard. Shared inventory views and central reporting.',
      },
      {
        q: 'How long to go live?',
        a: '1–2 weeks for most pharmacies. Setup, training, and go-live support included.',
      },
      {
        q: 'What\'s the pricing?',
        a: 'From ₹5,000/month for single locations, ₹12,000/month for chains. Free 30-day trial available.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Batch-level tracking with automatic expiry alerts. Expired items flagged during billing.',
      },
      {
        q: 'Do you provide training?',
        a: 'Yes. Included in implementation. Your staff will be trained on billing, inventory, and reporting.',
      },
      {
        q: 'What support is available?',
        a: 'WhatsApp, phone, and email support. Emergency assistance available 24/7 for critical issues.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing system?',
      subheading: 'Get professional billing and inventory management designed for Indian pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  tirunelveli: {
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Tirunelveli | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Tirunelveli for medical shops and pharmacy chains. GST-compliant, offline-first, expiry tracking included.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Tirunelveli',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Tirunelveli's pharmaceutical sector is growing rapidly with medical shops across the city and neighboring areas. Managing billing accurately, controlling inventory, and staying GST-compliant is a constant challenge. Yet most pharmacy owners in Tirunelveli still use manual systems or basic spreadsheets—losing time and money.\n\nMedora+ is pharmacy billing software built specifically for Indian pharmacies. It works in your environment: offline-first (no internet? no problem), GST-ready invoicing, batch-level expiry tracking, and real-time inventory management. Made by Aadhirai Innovations with support tailored for Tirunelveli pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Instant Billing',
          detail: 'Process invoices in seconds. Barcode scanning with smart invoice generation. Fast counter service.',
        },
        {
          title: 'Real-Time Stock Control',
          detail: 'Know stock levels instantly. Automatic low-stock alerts. Prevent stockouts and overstock.',
        },
        {
          title: 'Medicine Expiry Tracking',
          detail: 'Batch-level expiry management with automatic alerts. Expired items flagged at billing.',
        },
        {
          title: 'Works Offline Always',
          detail: 'Complete offline operation. No internet? Billing continues. Data syncs automatically when online.',
        },
        {
          title: 'Business Analytics',
          detail: 'Daily sales reports, profit tracking, top-selling items. Make data-driven decisions.',
        },
        {
          title: 'GST-Compliant Billing',
          detail: 'Every invoice auto-complies with GST. HSN codes and GSTIN validation built-in.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works Better for Tirunelveli Pharmacies',
      sections: [
        {
          title: 'Built for Tamil Nadu Pharmacies',
          detail: 'Aadhirai Innovations understands local compliance requirements and operational challenges. Tamil-speaking support team.',
        },
        {
          title: 'Offline-First Design',
          detail: 'Works completely offline. No dependency on internet connectivity. Your billing never stops.',
        },
        {
          title: 'GST Compliance Built-In',
          detail: 'Every invoice is audit-ready. HSN codes, GSTIN validation, and tax reconciliation included.',
        },
        {
          title: 'Affordable Pricing',
          detail: 'Starting at ₹5,000/month. No expensive enterprise software. ROI within weeks.',
        },
        {
          title: 'Quick Go-Live',
          detail: '1–2 weeks implementation. Staff training included. Minimal business disruption.',
        },
        {
          title: 'Dedicated Support',
          detail: 'WhatsApp and phone support from a team that understands pharmacy operations.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ Works for All Pharmacy Types in Tirunelveli',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage billing and inventory efficiently. One person can handle all operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple locations? One unified dashboard. Shared inventory and central reporting.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with compliance tracking and audit trails.',
        },
        {
          type: 'Medicine Distributors',
          detail: 'Order management and customer invoicing for retail pharmacies.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet in Tirunelveli?',
        a: 'Yes. 100% offline operation. Billing, inventory, and reports work without internet. Data syncs when online.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully GST-compliant. HSN codes, GSTIN validation, and audit-ready records included.',
      },
      {
        q: 'What\'s the pricing?',
        a: 'From ₹5,000/month for single shops, ₹12,000/month for chains. Free trial available.',
      },
      {
        q: 'How long to implement?',
        a: '1–2 weeks. Setup, training, and go-live support included.',
      },
      {
        q: 'Can I track expiry dates?',
        a: 'Yes. Batch-level tracking with automatic alerts 30 days before expiry.',
      },
      {
        q: 'Do you support multiple locations?',
        a: 'Yes. Unlimited locations from one dashboard with shared inventory.',
      },
      {
        q: 'What support is available?',
        a: 'WhatsApp, phone, and email support. Emergency assistance available 24/7.',
      },
      {
        q: 'Can I migrate existing data?',
        a: 'Yes. We handle migration of stock lists, customer records, and historical data.',
      },
    ],

    cta: {
      heading: 'Ready to modernize your pharmacy billing?',
      subheading: 'Get professional billing software designed for Indian pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  erode: {
    city: 'Erode',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Erode | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Erode for medical shops and chains. GST-compliant, offline-first, real-time inventory tracking.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Erode',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Erode's pharmaceutical business is active with medical shops across the city serving both residents and workers in the textile industry. Accurate billing, inventory control, and GST compliance are essential. Yet many Erode pharmacies still operate with manual billing systems or spreadsheets—wasting time and creating compliance risks.\n\nMedora+ is pharmacy billing software purpose-built for Indian pharmacies. It's designed for your environment: offline-first (works during internet outages), GST-ready billing, batch-level expiry tracking, and real-time stock management. Made by Aadhirai Innovations with support tailored for Erode businesses.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing System',
          detail: 'Process transactions in 20-30 seconds. Barcode scanning for quick invoicing. Never keep customers waiting.',
        },
        {
          title: 'Real-Time Inventory',
          detail: 'Know stock levels instantly. Low-stock alerts prevent stockouts. Control medicine inventory efficiently.',
        },
        {
          title: 'Batch Expiry Management',
          detail: 'Track expiry dates by batch. Automatic alerts before expiry. Flag expired items at billing.',
        },
        {
          title: 'Offline-First Operation',
          detail: 'Works completely offline. No internet? Billing continues. Data syncs when connectivity returns.',
        },
        {
          title: 'Daily Business Reports',
          detail: 'Sales summaries, profit visibility, top products. Make informed decisions with real data.',
        },
        {
          title: 'GST-Compliant Invoicing',
          detail: 'Every invoice complies with GST rules. HSN codes and GSTIN validation built-in.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Better for Erode Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Aadhirai Innovations understands Tamil Nadu compliance and pharmacy operations. Local support team available.',
        },
        {
          title: 'Works Without Internet',
          detail: 'Erode\'s connectivity issues? No problem. Works fully offline. Your billing never stops.',
        },
        {
          title: 'Complete GST Compliance',
          detail: 'Every invoice is audit-ready. HSN codes, GSTIN validation, and tax reconciliation included.',
        },
        {
          title: 'Affordable for SMEs',
          detail: 'From ₹5,000/month. No expensive enterprise pricing. Pays for itself in weeks.',
        },
        {
          title: 'Fast Implementation',
          detail: '1–2 weeks to go live. Staff training included. Minimal disruption to operations.',
        },
        {
          title: 'Responsive Support',
          detail: 'Direct WhatsApp and phone support from people who understand your business.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Erode\'s Different Pharmacy Types',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily billing and stock efficiently. One person can run all operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple shops across Erode? Unified management from one dashboard.',
        },
        {
          type: 'Hospital & Institutional Pharmacies',
          detail: 'High-volume billing with controlled substance tracking.',
        },
        {
          type: 'Medicine Wholesalers',
          detail: 'Manage customer orders and batch invoicing for retail partners.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work offline in Erode?',
        a: 'Yes. Completely offline-first. All billing, inventory, and reports work without internet connection.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully. HSN codes, GSTIN validation, and audit-ready records. Ready for compliance.',
      },
      {
        q: 'What\'s the cost?',
        a: 'From ₹5,000/month for single shops, ₹12,000/month for chains. Free 30-day trial available.',
      },
      {
        q: 'How long does setup take?',
        a: '1–2 weeks. Setup, training, and go-live support included in implementation.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Batch-level expiry tracking with automatic alerts before expiry dates.',
      },
      {
        q: 'Do you support multiple locations?',
        a: 'Yes. Manage unlimited pharmacy locations from one central dashboard.',
      },
      {
        q: 'What if I need support?',
        a: 'WhatsApp, phone, and email support available. Emergency support 24/7 for critical issues.',
      },
      {
        q: 'Can you migrate my existing data?',
        a: 'Yes. We migrate your stock, customer records, and historical data. Included in implementation.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade to professional billing?',
      subheading: 'Get modern pharmacy management software for Erode businesses.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  visakhapatnam: {
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Visakhapatnam | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Visakhapatnam for medical shops and pharmacy chains. GST-compliant, offline-first, real-time inventory.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Visakhapatnam',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Visakhapatnam's pharmaceutical market is large and competitive. Medical shops are spread across the port city and surrounding areas. Accurate billing, inventory management, and GST compliance are non-negotiable. Yet most Visakhapatnam pharmacies still use outdated systems or manual billing—losing efficiency and facing compliance risks.\n\nMedora+ is pharmacy billing software designed for Indian pharmacies and trusted by pharmacies across South India. Built for your environment: offline-first (works during internet outages), GST-ready billing, batch-level expiry tracking, multi-location support. Aadhirai Innovations provides dedicated support for Visakhapatnam-based pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Instant Billing',
          detail: 'Process invoices in seconds. Barcode scanning with smart invoice generation. Fast counter service.',
        },
        {
          title: 'Real-Time Stock Management',
          detail: 'Know stock levels instantly. Low-stock alerts. Prevent stockouts and excess inventory.',
        },
        {
          title: 'Medicine Expiry Control',
          detail: 'Batch-level expiry tracking with automatic alerts. Flag expired items at billing.',
        },
        {
          title: 'Works Completely Offline',
          detail: 'Complete offline operation. Works without internet. No dependency on connectivity.',
        },
        {
          title: 'Business Intelligence',
          detail: 'Daily sales reports, profit analytics, top-selling medicines. Data-driven decisions.',
        },
        {
          title: 'GST-Ready Billing',
          detail: 'Every invoice complies with GST. HSN codes and GSTIN validation built-in.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ is Better for Visakhapatnam Pharmacies',
      sections: [
        {
          title: 'Built for South Indian Pharmacies',
          detail: 'Aadhirai Innovations understands South Indian compliance and pharmacy operations. Proven track record.',
        },
        {
          title: 'Reliable Offline Operation',
          detail: 'Works fully offline. No internet dependency. Your pharmacy never stops.',
        },
        {
          title: 'GST Compliance Assured',
          detail: 'Every invoice is audit-ready. HSN codes, GSTIN validation, tax reconciliation included.',
        },
        {
          title: 'Affordable Pricing',
          detail: 'From ₹5,000/month. No expensive enterprise software. ROI in weeks.',
        },
        {
          title: 'Quick Implementation',
          detail: '1–2 weeks to go live. Staff training included. Minimal business disruption.',
        },
        {
          title: 'Expert Support Team',
          detail: 'WhatsApp, phone, and email support from pharmacy software specialists.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Visakhapatnam\'s Pharmacy Types',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily operations efficiently. Real-time billing and inventory. One person can handle it.',
        },
        {
          type: 'Pharmacy Chains (Multiple Locations)',
          detail: 'Multiple shops across Visakhapatnam? Unified management with one dashboard.',
        },
        {
          type: 'Hospital & Institutional Pharmacies',
          detail: 'High-volume billing with compliance tracking and audit trails.',
        },
        {
          type: 'Medicine Distributors',
          detail: 'Manage customer orders, batch invoicing, and wholesale operations.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work offline in Visakhapatnam?',
        a: 'Yes. 100% offline operation. All billing, inventory, and reports work without internet.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully. HSN codes, GSTIN validation, and audit-ready records included.',
      },
      {
        q: 'What\'s the pricing?',
        a: 'From ₹5,000/month for single shops, ₹12,000/month for chains. Free trial available.',
      },
      {
        q: 'How long to implement?',
        a: '1–2 weeks for most pharmacies. Setup, training, and go-live support included.',
      },
      {
        q: 'Can I track medicine expiry?',
        a: 'Yes. Batch-level tracking with automatic alerts 30 days before expiry.',
      },
      {
        q: 'Do you support multiple locations?',
        a: 'Yes. Unlimited locations from one dashboard with centralized reporting.',
      },
      {
        q: 'What support is available?',
        a: 'WhatsApp, phone, and email support. Emergency assistance 24/7 for critical issues.',
      },
      {
        q: 'Can I migrate existing pharmacy data?',
        a: 'Yes. We migrate stock lists, customer records, and historical data. Included in setup.',
      },
    ],

    cta: {
      heading: 'Ready to modernize your pharmacy billing?',
      subheading: 'Get professional pharmacy management software for Visakhapatnam.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  kancheepuram: {
    city: 'Kancheepuram',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Kancheepuram | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Kancheepuram for medical shops and chains. GST-compliant, offline-first, expiry tracking.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Kancheepuram',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Kancheepuram is a historic city with a growing pharmaceutical sector. Medical shops serve both pilgrims and local residents. Managing billing accurately, tracking inventory, and ensuring GST compliance is essential. Yet most pharmacies in Kancheepuram still use manual billing systems—wasting time and creating errors.\n\nMedora+ is pharmacy billing software built for Indian pharmacies. It's designed for your business: offline-first (works without internet), GST-ready billing, batch-level expiry tracking, real-time inventory. Made by Aadhirai Innovations with support for Kancheepuram pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Process invoices in seconds. Barcode scanning with smart generation. Fast counter service.',
        },
        {
          title: 'Real-Time Inventory',
          detail: 'Know stock instantly. Low-stock alerts. Prevent stockouts.',
        },
        {
          title: 'Expiry Tracking',
          detail: 'Batch-level expiry management. Automatic alerts. Flag expired items.',
        },
        {
          title: 'Works Offline',
          detail: 'Complete offline operation. Works without internet. No connectivity issues.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales summaries, profit tracking, top products. Data-driven decisions.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Every invoice complies with GST. HSN codes and validation built-in.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works Better for Kancheepuram Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Aadhirai Innovations understands Tamil Nadu compliance and operations.',
        },
        {
          title: 'Offline-First Design',
          detail: 'Works completely offline. No internet dependency. Always available.',
        },
        {
          title: 'GST Compliance',
          detail: 'Every invoice is audit-ready. HSN codes and validation included.',
        },
        {
          title: 'Affordable',
          detail: 'From ₹5,000/month. No expensive enterprise software. ROI in weeks.',
        },
        {
          title: 'Quick Setup',
          detail: '1–2 weeks implementation. Staff training included.',
        },
        {
          title: 'Support Available',
          detail: 'WhatsApp and phone support from pharmacy software experts.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Kancheepuram Pharmacy Types',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily billing and inventory. One person can run operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple locations? One unified dashboard. Shared inventory.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with compliance tracking.',
        },
        {
          type: 'Medicine Distributors',
          detail: 'Order management and batch invoicing.',
        },
      ],
    },

    faq: [
      {
        q: 'Does Medora+ work without internet?',
        a: 'Yes. 100% offline operation. Works without internet connection.',
      },
      {
        q: 'Is Medora+ GST-compliant?',
        a: 'Yes, fully GST-compliant with audit-ready records.',
      },
      {
        q: 'What\'s the cost?',
        a: 'From ₹5,000/month for single shops. Free trial available.',
      },
      {
        q: 'How long to implement?',
        a: '1–2 weeks. Setup and training included.',
      },
      {
        q: 'Can I track expiry?',
        a: 'Yes. Batch-level tracking with automatic alerts.',
      },
      {
        q: 'Multiple location support?',
        a: 'Yes. Unlimited locations from one dashboard.',
      },
      {
        q: 'What support is available?',
        a: 'WhatsApp and phone support. Emergency assistance available.',
      },
      {
        q: 'Can I migrate data?',
        a: 'Yes. We migrate stock and customer records.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Get professional billing software for Kancheepuram pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  vellore: {
    city: 'Vellore',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Vellore | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Vellore for medical shops and pharmacy chains. GST-compliant, offline-first.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Vellore',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Vellore's pharmaceutical market is growing with medical shops across the city. Managing billing, inventory, and GST compliance efficiently is critical. Yet many Vellore pharmacies still operate with manual billing systems—losing time and creating compliance risks.\n\nMedora+ is pharmacy billing software designed for Indian pharmacies. Built for your environment: offline-first, GST-ready, batch-level expiry tracking, real-time inventory. Made by Aadhirai Innovations with support for Vellore pharmacies.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Process invoices in seconds. Barcode scanning. Fast counter service.',
        },
        {
          title: 'Real-Time Stock',
          detail: 'Know stock instantly. Low-stock alerts prevent stockouts.',
        },
        {
          title: 'Expiry Management',
          detail: 'Batch-level tracking. Automatic alerts. Flag expired items.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works completely offline. No internet dependency.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales, profit tracking, top products.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Every invoice GST-ready. HSN codes built-in.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works for Vellore Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Aadhirai Innovations understands local compliance.',
        },
        {
          title: 'Offline-First',
          detail: 'Works offline. No internet issues.',
        },
        {
          title: 'GST Compliance',
          detail: 'Every invoice audit-ready.',
        },
        {
          title: 'Affordable',
          detail: 'From ₹5,000/month.',
        },
        {
          title: 'Quick Setup',
          detail: '1–2 weeks implementation.',
        },
        {
          title: 'Support Available',
          detail: 'WhatsApp and phone support.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Vellore Pharmacies',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Manage daily operations efficiently.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'Multiple locations from one dashboard.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with compliance.',
        },
        {
          type: 'Distributors',
          detail: 'Order management and invoicing.',
        },
      ],
    },

    faq: [
      {
        q: 'Works offline?',
        a: 'Yes, 100% offline operation.',
      },
      {
        q: 'GST-compliant?',
        a: 'Yes, fully compliant.',
      },
      {
        q: 'Cost?',
        a: 'From ₹5,000/month.',
      },
      {
        q: 'Implementation time?',
        a: '1–2 weeks.',
      },
      {
        q: 'Expiry tracking?',
        a: 'Yes, batch-level tracking.',
      },
      {
        q: 'Multiple locations?',
        a: 'Yes, unlimited from one dashboard.',
      },
      {
        q: 'Support?',
        a: 'WhatsApp and phone support available.',
      },
      {
        q: 'Data migration?',
        a: 'Yes, included in setup.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Professional billing software for Vellore pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  nagercoil: {
    city: 'Nagercoil',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Nagercoil | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Nagercoil for medical shops and pharmacy chains. GST-compliant, offline-first.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Nagercoil',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Nagercoil's pharmaceutical sector serves both residents and visitors. Managing billing, inventory, and GST compliance is essential. Yet most pharmacies still use manual billing systems—wasting time.\n\nMedora+ is pharmacy billing software for Indian pharmacies. Built for your business: offline-first, GST-ready, expiry tracking, real-time inventory. Made by Aadhirai Innovations.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Process invoices in seconds with barcode scanning.',
        },
        {
          title: 'Real-Time Stock',
          detail: 'Know stock instantly. Low-stock alerts.',
        },
        {
          title: 'Expiry Tracking',
          detail: 'Batch-level tracking with alerts.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works completely offline.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales and profit tracking.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Every invoice GST-ready.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works for Nagercoil Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Understands local compliance.',
        },
        {
          title: 'Offline-First',
          detail: 'No internet dependency.',
        },
        {
          title: 'GST Compliance',
          detail: 'Audit-ready invoices.',
        },
        {
          title: 'Affordable',
          detail: 'From ₹5,000/month.',
        },
        {
          title: 'Quick Setup',
          detail: '1–2 weeks.',
        },
        {
          title: 'Expert Support',
          detail: 'WhatsApp and phone support.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Nagercoil Pharmacies',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Efficient daily operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'One dashboard for all locations.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing with compliance.',
        },
        {
          type: 'Distributors',
          detail: 'Order and invoice management.',
        },
      ],
    },

    faq: [
      {
        q: 'Works offline?',
        a: 'Yes, 100% offline.',
      },
      {
        q: 'GST-compliant?',
        a: 'Yes, fully.',
      },
      {
        q: 'Cost?',
        a: 'From ₹5,000/month.',
      },
      {
        q: 'Setup time?',
        a: '1–2 weeks.',
      },
      {
        q: 'Expiry tracking?',
        a: 'Yes, batch-level.',
      },
      {
        q: 'Multiple locations?',
        a: 'Yes, unlimited.',
      },
      {
        q: 'Support?',
        a: 'WhatsApp and phone.',
      },
      {
        q: 'Data migration?',
        a: 'Yes, included.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade your pharmacy billing?',
      subheading: 'Professional billing for Nagercoil pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  thoothukudi: {
    city: 'Thoothukudi',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Thoothukudi | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Thoothukudi for medical shops and pharmacy chains. GST-compliant, offline-first.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Thoothukudi',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Thoothukudi's pharmaceutical market is active with medical shops across the port city. Accurate billing and GST compliance are critical. Yet most pharmacies still use manual billing systems.\n\nMedora+ is pharmacy billing software for Indian pharmacies. Built for your business: offline-first, GST-ready, expiry tracking, real-time inventory. Made by Aadhirai Innovations.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Process invoices in seconds.',
        },
        {
          title: 'Real-Time Stock',
          detail: 'Know stock instantly.',
        },
        {
          title: 'Expiry Tracking',
          detail: 'Batch-level management.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works offline always.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales tracking.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Audit-ready invoices.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works for Thoothukudi Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Local compliance expertise.',
        },
        {
          title: 'Offline-First',
          detail: 'Always available.',
        },
        {
          title: 'GST Compliance',
          detail: 'Complete compliance.',
        },
        {
          title: 'Affordable',
          detail: 'From ₹5,000/month.',
        },
        {
          title: 'Quick Setup',
          detail: '1–2 weeks.',
        },
        {
          title: 'Support Available',
          detail: 'WhatsApp support.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Thoothukudi Pharmacies',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Efficient operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'One dashboard.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing.',
        },
        {
          type: 'Distributors',
          detail: 'Order management.',
        },
      ],
    },

    faq: [
      {
        q: 'Works offline?',
        a: 'Yes, completely.',
      },
      {
        q: 'GST-compliant?',
        a: 'Yes.',
      },
      {
        q: 'Cost?',
        a: 'From ₹5,000/month.',
      },
      {
        q: 'Setup time?',
        a: '1–2 weeks.',
      },
      {
        q: 'Expiry tracking?',
        a: 'Yes.',
      },
      {
        q: 'Multiple locations?',
        a: 'Yes.',
      },
      {
        q: 'Support?',
        a: 'Available.',
      },
      {
        q: 'Data migration?',
        a: 'Yes.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade?',
      subheading: 'Professional billing for Thoothukudi pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },

  dindigul: {
    city: 'Dindigul',
    state: 'Tamil Nadu',
    product: 'Medora+',
    productSlug: 'pharmacy-billing-software',
    tagline: 'Pharmacy Billing Software',

    meta: {
      title: 'Pharmacy Billing Software in Dindigul | Medora+ by Aadhirai',
      description: 'Best pharmacy billing software in Dindigul for medical shops and pharmacy chains. GST-compliant, offline-first.',
    },

    intro: {
      headline: 'Pharmacy Billing Software in Dindigul',
      subheading: 'For Medical Shops, Pharmacies & Retail Chains',
      body: `Dindigul's pharmaceutical business is growing. Medical shops serve residents and travelers. Accurate billing and GST compliance are essential. Yet most pharmacies still use manual billing systems.\n\nMedora+ is pharmacy billing software for Indian pharmacies. Built for your business: offline-first, GST-ready, expiry tracking, real-time inventory. Made by Aadhirai Innovations.`,
    },

    whatProductDoes: {
      heading: 'What Medora+ Does for Your Pharmacy',
      sections: [
        {
          title: 'Fast Billing',
          detail: 'Process invoices in seconds.',
        },
        {
          title: 'Real-Time Stock',
          detail: 'Know stock instantly.',
        },
        {
          title: 'Expiry Tracking',
          detail: 'Batch-level management.',
        },
        {
          title: 'Offline Operation',
          detail: 'Works offline always.',
        },
        {
          title: 'Business Reports',
          detail: 'Daily sales tracking.',
        },
        {
          title: 'GST-Compliant',
          detail: 'Audit-ready invoices.',
        },
      ],
    },

    whyItWorks: {
      heading: 'Why Medora+ Works for Dindigul Pharmacies',
      sections: [
        {
          title: 'Built for Indian Pharmacies',
          detail: 'Local compliance expertise.',
        },
        {
          title: 'Offline-First',
          detail: 'Always available.',
        },
        {
          title: 'GST Compliance',
          detail: 'Complete compliance.',
        },
        {
          title: 'Affordable',
          detail: 'From ₹5,000/month.',
        },
        {
          title: 'Quick Setup',
          detail: '1–2 weeks.',
        },
        {
          title: 'Support Available',
          detail: 'WhatsApp support.',
        },
      ],
    },

    useCases: {
      heading: 'Medora+ for Dindigul Pharmacies',
      cases: [
        {
          type: 'Single Medical Shops',
          detail: 'Efficient operations.',
        },
        {
          type: 'Pharmacy Chains',
          detail: 'One dashboard.',
        },
        {
          type: 'Hospital Pharmacies',
          detail: 'High-volume billing.',
        },
        {
          type: 'Distributors',
          detail: 'Order management.',
        },
      ],
    },

    faq: [
      {
        q: 'Works offline?',
        a: 'Yes, completely.',
      },
      {
        q: 'GST-compliant?',
        a: 'Yes.',
      },
      {
        q: 'Cost?',
        a: 'From ₹5,000/month.',
      },
      {
        q: 'Setup time?',
        a: '1–2 weeks.',
      },
      {
        q: 'Expiry tracking?',
        a: 'Yes.',
      },
      {
        q: 'Multiple locations?',
        a: 'Yes.',
      },
      {
        q: 'Support?',
        a: 'Available.',
      },
      {
        q: 'Data migration?',
        a: 'Yes.',
      },
    ],

    cta: {
      heading: 'Ready to upgrade?',
      subheading: 'Professional billing for Dindigul pharmacies.',
      buttons: [
        { text: 'Talk to Us', href: 'https://wa.me/918508716957', variant: 'primary' },
        { text: 'See a Demo', href: 'https://demo.aadhiraiinnovations.com', variant: 'secondary' },
      ],
    },
  },
}

export { cityPageData }
