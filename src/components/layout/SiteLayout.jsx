import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import Footer from './Footer'
import WhatsAppWidget from '../ui/WhatsAppWidget'

/* ─── Per-route SEO config ────────────────────────────────────────────
   All title/description/og values are set here in one place. Rendered as a
   <Helmet> below (not a direct document.title/DOM mutation) so that dynamic
   pages rendering their own nested <Helmet> (LocalSEOPage, HrmLocalSEOPage,
   TransportLocalSEOPage, etc.) always win via react-helmet-async's normal
   "innermost/last-mounted wins" merge, instead of racing a separate DOM-
   mutation effect that could fire after Helmet's own commit and clobber it
   back to this fallback — which is exactly what happened on client-side
   redirects (e.g. an aliased city slug navigating to its canonical page)
   before this fix, and would have started happening on the new
   /transport-software tree's own alias redirects too.
──────────────────────────────────────────────────────────────────────── */
const SEO = {
  '/': {
    title: 'Pharmacy Software Tamil Nadu — Medora+ & Medora Offline | Aadhirai Innovations',
    description:
      'GST-compliant pharmacy billing software for Tamil Nadu pharmacies — Peravurani, Pattukkottai, Thanjavur, Pudukkottai, Trichy, Aranthangi and beyond. Offline-first, AI stock forecasting. We also build custom business software and backend engineering.',
    ogTitle: 'Pharmacy Software for Tamil Nadu | Aadhirai Innovations',
    ogDescription:
      'Medora+ and Medora Offline — GST-ready billing, expiry alerts, and offline-first pharmacy management, built for Tamil Nadu pharmacies. Custom software and backend engineering also available.',
    canonical: 'https://www.aadhiraiinnovations.com/',
  },
  '/services': {
    title: 'Services — Backend Architecture Engagements | Aadhirai Innovations',
    description:
      'Production Readiness Audit (₹4–6 lakh, 3 weeks), Architecture Advisory Retainer, and Fixed-Scope Engineering for Series A and B software companies.',
    ogTitle: 'Services | Aadhirai Innovations',
    ogDescription:
      'Three ways to engage: Production Readiness Audit, Architecture Advisory Retainer, Fixed-Scope Engineering. Backend architecture specialists for growth-stage companies.',
    canonical: 'https://www.aadhiraiinnovations.com/services',
  },
  '/about': {
    title: 'About Aadhirai Innovations — Backend Architecture Specialists',
    description:
      'Aadhirai Innovations was founded to help funded Indian startups build backend infrastructure that scales. Senior architect with enterprise-grade financial systems experience.',
    ogTitle: 'About | Aadhirai Innovations',
    ogDescription:
      'Senior backend architecture for funded Indian startups. Founded by Arthi Manikandan. Senior architect with 8+ years experience in high-availability systems.',
    canonical: 'https://www.aadhiraiinnovations.com/about',
  },
  '/contact': {
    title: 'Contact Aadhirai Innovations — Book a Production Readiness Audit',
    description:
      'Get in touch with Aadhirai Innovations to discuss a Production Readiness Audit, Architecture Advisory Retainer, or Fixed-Scope Engineering engagement.',
    ogTitle: 'Contact | Aadhirai Innovations',
    ogDescription:
      'Book a Production Readiness Audit or discuss an architecture engagement. We respond within one business day.',
    canonical: 'https://www.aadhiraiinnovations.com/contact',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Aadhirai Innovations',
    description:
      'How Aadhirai Innovations collects, uses, and protects your personal information across our website, Medora+ and Medora Offline software, and free tools.',
    ogTitle: 'Privacy Policy | Aadhirai Innovations',
    ogDescription: 'How we collect, use, and protect your personal information.',
    canonical: 'https://www.aadhiraiinnovations.com/privacy-policy',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Aadhirai Innovations',
    description:
      'The terms governing use of aadhiraiinnovations.com, Medora+ and Medora Offline licenses, and our free browser-based tools.',
    ogTitle: 'Terms of Service | Aadhirai Innovations',
    ogDescription: 'Terms governing use of our website, software licenses, and free tools.',
    canonical: 'https://www.aadhiraiinnovations.com/terms-of-service',
  },
  '/refund-policy': {
    title: 'Refund & Cancellation Policy | Aadhirai Innovations',
    description:
      'Our refund and cancellation policy for Medora Offline license purchases, including exceptions for duplicate or failed payments.',
    ogTitle: 'Refund & Cancellation Policy | Aadhirai Innovations',
    ogDescription: 'Refund and cancellation terms for Medora Offline license purchases.',
    canonical: 'https://www.aadhiraiinnovations.com/refund-policy',
  },
  '/solutions/pharmacy-software': {
    title: 'Pharmacy Management Software India — Medora+ | Aadhirai Innovations',
    description:
      'GST-compliant pharmacy billing software with AI stock forecasting, expiry alerts, and offline-first architecture. Built for Indian pharmacies. Free demo available.',
    ogTitle: 'Medora+ Pharmacy Management Software India | Aadhirai Innovations',
    ogDescription:
      "India's AI-powered pharmacy management system. Billing, stock control, expiry alerts, GST compliance. Demo available.",
    canonical: 'https://www.aadhiraiinnovations.com/solutions/pharmacy-software',
  },
  '/solutions/erp-automation': {
    title: 'ERP & Business Automation Software for Indian SMEs | Aadhirai Innovations',
    description:
      'Affordable ERP systems and workflow automation for small and mid-sized businesses in India. AI analytics, inventory control. Built in Tamil Nadu.',
    ogTitle: 'ERP & Business Automation for Indian SMEs | Aadhirai Innovations',
    ogDescription:
      'Custom ERP and workflow automation built for Indian SMEs. AI-powered analytics, offline-first, GST-ready.',
    canonical: 'https://www.aadhiraiinnovations.com/solutions/erp-automation',
  },
  '/products/medora-plus': {
    title: 'Medora+ — AI Pharmacy Management Software India | Aadhirai Innovations',
    description:
      "Medora+ is India's AI-powered pharmacy management system. Billing, stock control, expiry tracking, GST compliance, and cloud sync. Demo available.",
    ogTitle: 'Medora+ Pharmacy Software | Aadhirai Innovations',
    ogDescription:
      'Complete pharmacy management: GST billing, AI forecasting, expiry alerts, offline operation with cloud sync. Built for Indian pharmacies.',
    canonical: 'https://www.aadhiraiinnovations.com/products/medora-plus',
  },
  '/products/medora-offline': {
    title: 'Offline Pharmacy Billing Software India — Medora Pharma (Windows) | Aadhirai Innovations',
    description:
      'Offline pharmacy management software for India and Tamil Nadu. No internet, no monthly server costs — GST billing, FEFO inventory, and reports run entirely on your own Windows computer. Free 30-day trial.',
    ogTitle: 'Offline Pharmacy Software India — Medora Pharma | Aadhirai Innovations',
    ogDescription:
      'The offline pharmacy billing and inventory system built for Indian pharmacies — GST-compliant, works with zero internet after install, data never leaves your computer. Free trial.',
    canonical: 'https://www.aadhiraiinnovations.com/products/medora-offline',
  },
  '/products/hr-inventory': {
    title: 'HRM Software India — HR & Inventory Management | Aadhirai Innovations',
    description:
      'HRM software for growing Indian businesses — employee records, leave, attendance, payroll, shift scheduling, and real-time inventory in one system. Free demo available.',
    ogTitle: 'HR & Inventory — HRM Software India | Aadhirai Innovations',
    ogDescription:
      'Complete HRM software: employee records, leave and attendance, payroll data, shift scheduling, and inventory control. Built for growing Indian businesses.',
    canonical: 'https://www.aadhiraiinnovations.com/products/hr-inventory',
  },
  '/products/transport-logistics': {
    title: 'Transport & Logistics Software India — Quotation, Invoicing, Fleet Tracking | Aadhirai Innovations',
    description:
      'Transport and logistics software for Indian fleet operators — quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet management, and revenue reporting in one system. Free live demo available.',
    ogTitle: 'Transport & Logistics Software India | Aadhirai Innovations',
    ogDescription:
      'Quotation-to-invoice conversion, live GPS driver tracking, delivery job tracking, fleet management, and revenue reporting — built for transport and logistics companies.',
    canonical: 'https://www.aadhiraiinnovations.com/products/transport-logistics',
  },
  '/founder': {
    title: 'Founder | Aadhirai Innovations — Enterprise Software Company, Tamil Nadu',
    description:
      'Manikandan Subramaniyan, founder of Aadhirai Innovations. 10+ years building pharmacy software, ERP systems, and enterprise automation for Indian businesses.',
    ogTitle: 'Founder | Aadhirai Innovations',
    ogDescription:
      'Building reliable pharmacy software and enterprise systems for India. 10+ years of engineering experience from Tamil Nadu.',
    canonical: 'https://www.aadhiraiinnovations.com/founder',
  },
  '/tools': {
    title: 'Free Document Tools Online — PDF & DOCX Utilities | Aadhirai Innovations',
    description:
      'Free online document tools: convert DOCX to PDF, convert PDF to Word, and edit PDF files online. Fast, browser-based tools for offices, students, and businesses.',
    ogTitle: 'Free PDF & Document Tools | Aadhirai Innovations',
    ogDescription:
      'Free browser-based document tools. Convert Word to PDF, PDF to Word, edit PDFs online. No signup required.',
    canonical: 'https://www.aadhiraiinnovations.com/tools',
  },
  '/tools/gst-calculator': {
    title: 'GST Calculator India — Add & Remove GST Online | Aadhirai Innovations',
    description:
      'Free GST calculator for India. Calculate GST inclusive/exclusive prices, CGST + SGST for intra-state and IGST for inter-state transactions. Supports all GST rates: 0%, 3%, 5%, 12%, 18%, 28%.',
    ogTitle: 'GST Calculator India — CGST, SGST & IGST | Aadhirai Innovations',
    ogDescription:
      'Instantly calculate GST in India. Add GST or remove GST from any price. Get CGST, SGST, and IGST breakdowns for all GST slabs.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/gst-calculator',
  },
  '/tools/amount-to-words': {
    title: 'Amount to Words Converter — Rupees in Words for Invoices | Aadhirai Innovations',
    description:
      'Free tool to convert any ₹ amount into words using the Indian numbering system (Lakh, Crore, paise) — for invoices, cheques, and quotations.',
    ogTitle: 'Amount to Words Converter | Aadhirai Innovations',
    ogDescription:
      'Convert rupee amounts into words instantly — Indian Lakh/Crore numbering, paise supported. Free, no signup.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/amount-to-words',
  },
  '/tools/emi-calculator': {
    title: 'EMI Calculator India — Loan EMI, Interest & Total Payment | Aadhirai Innovations',
    description:
      'Free EMI calculator for India. Calculate monthly EMI, total interest, and total payment for home loans, car loans, and personal loans.',
    ogTitle: 'EMI Calculator | Aadhirai Innovations',
    ogDescription:
      'Instantly calculate loan EMI, total interest, and total payment. Works for home, car, and personal loans.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/emi-calculator',
  },
  '/tools/qr-code-generator': {
    title: 'QR Code Generator — Free Online, No Signup | Aadhirai Innovations',
    description:
      'Free online QR code generator. Turn any text, URL, or contact info into a downloadable QR code instantly. No signup, no watermark.',
    ogTitle: 'QR Code Generator | Aadhirai Innovations',
    ogDescription: 'Create a QR code from any text or URL, instantly, for free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/qr-code-generator',
  },
  '/tools/barcode-generator': {
    title: 'Barcode Generator Online — CODE128, EAN-13, UPC | Aadhirai Innovations',
    description:
      'Free online barcode generator. Create CODE128, EAN-13, and UPC barcodes for inventory labels or packaging, and download as PNG.',
    ogTitle: 'Barcode Generator | Aadhirai Innovations',
    ogDescription: 'Generate CODE128, EAN-13, and UPC barcodes instantly, for free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/barcode-generator',
  },
  '/tools/image-compressor': {
    title: 'Image Compressor Online — Reduce JPEG & PNG Size | Aadhirai Innovations',
    description:
      'Free online image compressor. Reduce JPEG, PNG, and WebP file size in your browser with an adjustable quality slider. No upload to any server.',
    ogTitle: 'Image Compressor | Aadhirai Innovations',
    ogDescription: 'Shrink image file size in your browser, free, with instant before/after preview.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/image-compressor',
  },
  '/tools/password-generator': {
    title: 'Free Password Generator — Strong, Random & Secure | Aadhirai Innovations',
    description:
      'Free online password generator using cryptographically secure randomness. Adjustable length and character types, nothing stored or transmitted.',
    ogTitle: 'Password Generator | Aadhirai Innovations',
    ogDescription: 'Generate strong, random passwords instantly, free, with nothing stored.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/password-generator',
  },
  '/tools/unit-converter': {
    title: 'Unit Converter Online — Length, Weight, Temperature, Volume | Aadhirai Innovations',
    description:
      'Free online unit converter for length, weight, temperature, volume, and area. Convert between metric and imperial units instantly.',
    ogTitle: 'Unit Converter | Aadhirai Innovations',
    ogDescription: 'Convert length, weight, temperature, volume, and area units instantly, for free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/unit-converter',
  },
  '/tools/currency-converter': {
    title: 'Currency Converter — Live Exchange Rates | Aadhirai Innovations',
    description:
      'Free online currency converter with live, daily exchange rates for major world currencies including INR, USD, EUR, and GBP.',
    ogTitle: 'Currency Converter | Aadhirai Innovations',
    ogDescription: 'Convert between world currencies using live, daily reference exchange rates.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/currency-converter',
  },
  '/tools/docx-to-pdf-converter': {
    title: 'DOCX to PDF Converter — Convert Word to PDF Online | Aadhirai Innovations',
    description:
      'Free online DOCX to PDF converter. Convert Word documents to PDF in seconds. No signup, no file limit. Works in browser.',
    ogTitle: 'DOCX to PDF Converter Online | Aadhirai Innovations',
    ogDescription:
      'Convert Word documents (.docx) to PDF for free. No account needed. Instant browser-based conversion.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/docx-to-pdf-converter',
  },
  '/tools/pdf-to-docx-converter': {
    title: 'PDF to DOCX Converter — Convert PDF to Word Online | Aadhirai Innovations',
    description:
      'Free online PDF to Word converter. Extract editable text from PDF and get a DOCX file. Works in browser, no signup required.',
    ogTitle: 'PDF to DOCX Converter Online | Aadhirai Innovations',
    ogDescription:
      'Convert PDF to editable Word documents online for free. No account needed. Works for text-based PDFs.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-to-docx-converter',
  },
  '/forum': {
    title: 'Community Forum — Ask a Question | Aadhirai Innovations',
    description:
      'Ask questions about Medora+, Medora Offline, Aadhirai Billing, or any of our products and get answers from our community and support team.',
    ogTitle: 'Community Forum | Aadhirai Innovations',
    ogDescription: 'Ask a question, browse answers, or help someone else out.',
    canonical: 'https://www.aadhiraiinnovations.com/forum',
  },
  '/blog': {
    title: 'Blog — Pharmacy & Business Software Insights | Aadhirai Innovations',
    description:
      'Practical guides on GST compliance, pharmacy operations, inventory management, workforce scheduling, and digitizing retail — from real implementation experience.',
    ogTitle: 'Blog | Aadhirai Innovations',
    ogDescription: 'Practical guides on pharmacy operations, GST compliance, inventory, and business software.',
    canonical: 'https://www.aadhiraiinnovations.com/blog',
  },
  '/case-studies': {
    title: 'Case Studies — Client Results | Aadhirai Innovations',
    description:
      'How Ebrain Technologies and Vasantham Pharmacy use Aadhirai Innovations software and engineering to run their operations.',
    ogTitle: 'Case Studies | Aadhirai Innovations',
    ogDescription: 'Real client results from Aadhirai Innovations products and engineering work.',
    canonical: 'https://www.aadhiraiinnovations.com/case-studies',
  },
  '/pricing': {
    title: 'Pricing — Medora+, Medora Offline, Aadhirai Billing | Aadhirai Innovations',
    description:
      'Pricing for Medora+ pharmacy software, Medora Offline licenses, and Aadhirai Billing. Custom-scoped pricing for our other business systems.',
    ogTitle: 'Pricing | Aadhirai Innovations',
    ogDescription: 'Transparent pricing for Medora+, Medora Offline, and Aadhirai Billing.',
    canonical: 'https://www.aadhiraiinnovations.com/pricing',
  },
  '/careers': {
    title: 'Careers — Join Aadhirai Innovations',
    description:
      'How we hire at Aadhirai Innovations, and our current opening for a Sales Partner covering Medora+ and Aadhirai Billing.',
    ogTitle: 'Careers | Aadhirai Innovations',
    ogDescription: 'Current opening: Sales Partner for Medora+ and Aadhirai Billing. Remote, commission or salaried.',
    canonical: 'https://www.aadhiraiinnovations.com/careers',
  },
  '/resources': {
    title: 'Resources — Free Tools & Pharmacy Compliance Checklist | Aadhirai Innovations',
    description:
      'Free business tools and a downloadable pharmacy GST & compliance checklist, from Aadhirai Innovations.',
    ogTitle: 'Resources | Aadhirai Innovations',
    ogDescription: 'Free tools and downloadable guides for pharmacy and business operations.',
    canonical: 'https://www.aadhiraiinnovations.com/resources',
  },
  '/tools/percentage-calculator': {
    title: 'Percentage Calculator — Find X% of a Number | Aadhirai Innovations',
    description: 'Free percentage calculator. Find X% of a number, what percentage one number is of another, or the percentage change between two values.',
    ogTitle: 'Percentage Calculator | Aadhirai Innovations',
    ogDescription: 'Calculate X% of a number, percentage of a total, or percentage change instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/percentage-calculator',
  },
  '/tools/discount-calculator': {
    title: 'Discount & Margin Calculator — Price, Profit, Markup | Aadhirai Innovations',
    description: 'Free discount and profit margin calculator. Calculate a discounted price, or find margin and markup from cost and selling price.',
    ogTitle: 'Discount & Margin Calculator | Aadhirai Innovations',
    ogDescription: 'Calculate discounted prices, profit margin, and markup instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/discount-calculator',
  },
  '/tools/tds-calculator': {
    title: 'TDS Calculator India — Sections 194C, 194H, 194I, 194J | Aadhirai Innovations',
    description: 'Free TDS calculator for India. Estimate TDS deduction and net payable by section — contractor payments, rent, commission, professional fees.',
    ogTitle: 'TDS Calculator | Aadhirai Innovations',
    ogDescription: 'Estimate TDS deduction and net payable amount for common Income Tax Act sections.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/tds-calculator',
  },
  '/tools/hsn-sac-lookup': {
    title: 'HSN & SAC Code Lookup — Pharmacy & Retail Reference | Aadhirai Innovations',
    description: 'A curated reference of common HSN and SAC codes for pharmacy and general retail businesses in India, with typical GST rates.',
    ogTitle: 'HSN & SAC Code Lookup | Aadhirai Innovations',
    ogDescription: 'Common HSN and SAC codes for pharmacy and retail, with typical GST rates.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/hsn-sac-lookup',
  },
  '/tools/merge-pdf': {
    title: 'Merge PDF Online — Combine PDF Files Free | Aadhirai Innovations',
    description: 'Free online tool to merge multiple PDF files into one, in the order you choose. Runs entirely in your browser.',
    ogTitle: 'Merge PDF | Aadhirai Innovations',
    ogDescription: 'Combine multiple PDFs into one file, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/merge-pdf',
  },
  '/tools/split-pdf': {
    title: 'Split PDF Online — Extract Pages Free | Aadhirai Innovations',
    description: 'Free online tool to split a PDF into multiple files by page range. Runs entirely in your browser.',
    ogTitle: 'Split PDF | Aadhirai Innovations',
    ogDescription: 'Split a PDF into multiple files by page range, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/split-pdf',
  },
  '/tools/image-to-pdf': {
    title: 'Image to PDF Converter — JPG & PNG to PDF Free | Aadhirai Innovations',
    description: 'Free online tool to combine JPG and PNG images into a single PDF file, in the order you choose.',
    ogTitle: 'Image to PDF Converter | Aadhirai Innovations',
    ogDescription: 'Combine images into a single PDF, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/image-to-pdf',
  },
  '/tools/pdf-to-image': {
    title: 'PDF to Image Converter — PDF to PNG Free | Aadhirai Innovations',
    description: 'Free online tool to convert each page of a PDF into a PNG image. Runs entirely in your browser.',
    ogTitle: 'PDF to Image Converter | Aadhirai Innovations',
    ogDescription: 'Convert PDF pages to PNG images, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-to-image',
  },
  '/tools/age-calculator': {
    title: 'Age Calculator — Exact Age in Years, Months, Days | Aadhirai Innovations',
    description: 'Free online age calculator. Calculate exact age in years, months, and days from a date of birth, plus days until next birthday.',
    ogTitle: 'Age Calculator | Aadhirai Innovations',
    ogDescription: 'Calculate exact age in years, months, and days instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/age-calculator',
  },
  '/tools/date-difference-calculator': {
    title: 'Date Difference Calculator — Days Between Two Dates | Aadhirai Innovations',
    description: 'Free online date difference calculator. Find the number of years, months, days, and weeks between two dates.',
    ogTitle: 'Date Difference Calculator | Aadhirai Innovations',
    ogDescription: 'Find the difference between two dates in years, months, days, and weeks.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/date-difference-calculator',
  },
  '/tools/base64-encoder-decoder': {
    title: 'Base64 Encoder / Decoder Online Free | Aadhirai Innovations',
    description: 'Free online Base64 encoder and decoder. Convert text to Base64 or decode Base64 back to text, entirely in your browser.',
    ogTitle: 'Base64 Encoder / Decoder | Aadhirai Innovations',
    ogDescription: 'Encode or decode Base64 instantly, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/base64-encoder-decoder',
  },
  '/tools/url-encoder-decoder': {
    title: 'URL Encoder / Decoder Online Free | Aadhirai Innovations',
    description: 'Free online URL encoder and decoder. Percent-encode text for safe use in URLs, or decode an encoded URL back to plain text.',
    ogTitle: 'URL Encoder / Decoder | Aadhirai Innovations',
    ogDescription: 'Percent-encode or decode URLs instantly, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/url-encoder-decoder',
  },
  '/tools/timestamp-converter': {
    title: 'Timestamp Converter — Unix Time to Date Online | Aadhirai Innovations',
    description: 'Free online Unix timestamp converter. Convert a Unix timestamp to a human-readable date, or a date to a Unix timestamp.',
    ogTitle: 'Timestamp Converter | Aadhirai Innovations',
    ogDescription: 'Convert Unix timestamps to dates and back, instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/timestamp-converter',
  },
  '/tools/uuid-generator': {
    title: 'UUID Generator Online Free — UUID v4 | Aadhirai Innovations',
    description: 'Free online UUID (v4) generator. Generate one or many random, cryptographically secure UUIDs instantly.',
    ogTitle: 'UUID Generator | Aadhirai Innovations',
    ogDescription: 'Generate random, cryptographically secure UUIDs instantly, free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/uuid-generator',
  },
  '/tools/case-converter': {
    title: 'Case Converter Online — UPPERCASE, Title Case & More | Aadhirai Innovations',
    description: 'Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, or camelCase instantly.',
    ogTitle: 'Case Converter | Aadhirai Innovations',
    ogDescription: 'Convert text case instantly, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/case-converter',
  },
  '/tools/word-counter': {
    title: 'Word & Character Counter Online Free | Aadhirai Innovations',
    description: 'Free online word and character counter. Get live word count, character count, sentence count, and estimated reading time.',
    ogTitle: 'Word & Character Counter | Aadhirai Innovations',
    ogDescription: 'Live word count, character count, and reading time, free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/word-counter',
  },
  '/tools/compound-interest-calculator': {
    title: 'Compound Interest Calculator Online Free | Aadhirai Innovations',
    description: 'Free compound interest calculator. Calculate maturity value and interest earned with annual, semi-annual, quarterly, or monthly compounding.',
    ogTitle: 'Compound Interest Calculator | Aadhirai Innovations',
    ogDescription: 'Calculate compound interest and maturity value instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/compound-interest-calculator',
  },
  '/tools/simple-interest-calculator': {
    title: 'Simple Interest Calculator Online Free | Aadhirai Innovations',
    description: 'Free simple interest calculator. Calculate interest earned and total amount for a given principal, rate, and time.',
    ogTitle: 'Simple Interest Calculator | Aadhirai Innovations',
    ogDescription: 'Calculate simple interest and total amount instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/simple-interest-calculator',
  },
  '/tools/sip-calculator': {
    title: 'SIP Calculator — Mutual Fund Maturity Value | Aadhirai Innovations',
    description: 'Free SIP calculator. Estimate the maturity value of monthly mutual fund investments.',
    ogTitle: 'SIP Calculator | Aadhirai Innovations',
    ogDescription: 'Estimate SIP maturity value, invested amount, and returns.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/sip-calculator',
  },
  '/tools/salary-ctc-calculator': {
    title: 'Salary / CTC Breakup Calculator India | Aadhirai Innovations',
    description: 'Free illustrative CTC to in-hand salary breakup calculator. Estimate Basic, HRA, PF, and take-home pay from annual CTC.',
    ogTitle: 'Salary / CTC Calculator | Aadhirai Innovations',
    ogDescription: 'Illustrative breakup of Basic, HRA, PF, and take-home pay from CTC.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/salary-ctc-calculator',
  },
  '/tools/gstin-validator': {
    title: 'GSTIN Format Validator — Check GST Number | Aadhirai Innovations',
    description: 'Free GSTIN format and checksum validator for India. Checks the 15-character structure and check-digit of a GST Identification Number.',
    ogTitle: 'GSTIN Validator | Aadhirai Innovations',
    ogDescription: 'Validate GSTIN structure and check-digit instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/gstin-validator',
  },
  '/tools/loan-comparison-calculator': {
    title: 'Loan Comparison Calculator — Compare EMI Offers | Aadhirai Innovations',
    description: 'Free loan comparison calculator. Compare EMI, total interest, and total payment across up to 3 loan offers side by side.',
    ogTitle: 'Loan Comparison Calculator | Aadhirai Innovations',
    ogDescription: 'Compare multiple loan offers side by side instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/loan-comparison-calculator',
  },
  '/tools/pdf-compressor': {
    title: 'PDF Compressor Online — Reduce PDF Size Free | Aadhirai Innovations',
    description: 'Free online PDF compressor. Reduce PDF file size by re-rendering pages at a lower image quality, entirely in your browser.',
    ogTitle: 'PDF Compressor | Aadhirai Innovations',
    ogDescription: 'Reduce PDF file size, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-compressor',
  },
  '/tools/watermark-pdf': {
    title: 'Watermark PDF Online Free | Aadhirai Innovations',
    description: 'Free online tool to add a diagonal text watermark to every page of a PDF. Runs entirely in your browser.',
    ogTitle: 'Watermark PDF | Aadhirai Innovations',
    ogDescription: 'Add a text watermark to every PDF page, free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/watermark-pdf',
  },
  '/tools/pdf-page-numbers': {
    title: 'Add Page Numbers to PDF Online Free | Aadhirai Innovations',
    description: 'Free online tool to add page numbers to every page of a PDF. Runs entirely in your browser.',
    ogTitle: 'Add Page Numbers to PDF | Aadhirai Innovations',
    ogDescription: 'Add page numbers to a PDF, free, in your browser.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-page-numbers',
  },
  '/tools/jwt-decoder': {
    title: 'JWT Decoder Online Free | Aadhirai Innovations',
    description: 'Free online JWT decoder. Decode the header and payload of a JSON Web Token, entirely in your browser.',
    ogTitle: 'JWT Decoder | Aadhirai Innovations',
    ogDescription: 'Decode JWT header and payload instantly, free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/jwt-decoder',
  },
  '/tools/regex-tester': {
    title: 'Regex Tester Online Free | Aadhirai Innovations',
    description: 'Free online regular expression tester. Test a regex pattern against sample text, see matches highlighted, and inspect capture groups.',
    ogTitle: 'Regex Tester | Aadhirai Innovations',
    ogDescription: 'Test regular expressions against sample text instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/regex-tester',
  },
  '/tools/text-diff-checker': {
    title: 'Text Diff Checker Online Free | Aadhirai Innovations',
    description: 'Free online text diff checker. Compare two blocks of text line by line and see additions and deletions highlighted.',
    ogTitle: 'Text Diff Checker | Aadhirai Innovations',
    ogDescription: 'Compare two blocks of text and see differences highlighted.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/text-diff-checker',
  },
  '/tools/color-converter': {
    title: 'Color Converter — Hex, RGB, HSL Online Free | Aadhirai Innovations',
    description: 'Free online color converter. Convert between Hex, RGB, and HSL color formats instantly, with a live preview.',
    ogTitle: 'Color Converter | Aadhirai Innovations',
    ogDescription: 'Convert Hex, RGB, and HSL color formats instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/color-converter',
  },
  '/tools/slug-generator': {
    title: 'URL Slug Generator Online Free | Aadhirai Innovations',
    description: 'Free online URL slug generator. Convert any text into a clean, lowercase, hyphenated URL slug instantly.',
    ogTitle: 'Slug Generator | Aadhirai Innovations',
    ogDescription: 'Convert text into a clean URL slug instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/slug-generator',
  },
  '/tools/cron-explainer': {
    title: 'Cron Expression Explainer Online Free | Aadhirai Innovations',
    description: 'Free online cron expression explainer. Paste a 5-field cron expression and get a plain-English explanation of when it runs.',
    ogTitle: 'Cron Expression Explainer | Aadhirai Innovations',
    ogDescription: 'Understand any cron expression in plain English.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/cron-explainer',
  },
  '/tools/lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator Online Free | Aadhirai Innovations',
    description: 'Free online Lorem Ipsum placeholder text generator. Generate paragraphs, sentences, or words of classic dummy text.',
    ogTitle: 'Lorem Ipsum Generator | Aadhirai Innovations',
    ogDescription: 'Generate Lorem Ipsum placeholder text instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/lorem-ipsum-generator',
  },
  '/tools/meta-tag-generator': {
    title: 'Meta Tag Generator — SEO Tags Online Free | Aadhirai Innovations',
    description: 'Free online SEO meta tag generator. Generate title, description, canonical, Open Graph, and Twitter Card tags for any page.',
    ogTitle: 'Meta Tag Generator | Aadhirai Innovations',
    ogDescription: 'Generate SEO meta tags for any page instantly.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/meta-tag-generator',
  },
  '/tools/robots-txt-generator': {
    title: 'Robots.txt Generator Online Free | Aadhirai Innovations',
    description: 'Free online robots.txt generator. Build a robots.txt file with allow/disallow rules and a sitemap reference.',
    ogTitle: 'Robots.txt Generator | Aadhirai Innovations',
    ogDescription: 'Generate a robots.txt file instantly, free.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/robots-txt-generator',
  },
  '/tools/open-graph-preview': {
    title: 'Open Graph Preview Tool — Social Share Preview | Aadhirai Innovations',
    description: 'Free online Open Graph preview tool. See how your page will look when shared on Facebook, LinkedIn, or Twitter/X before you publish.',
    ogTitle: 'Open Graph Preview Tool | Aadhirai Innovations',
    ogDescription: 'Preview how your page looks when shared on social media.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/open-graph-preview',
  },
  '/tools/pdf-editor': {
    title: 'PDF Editor Online — Rotate, Delete & Reorder PDF Pages | Aadhirai Innovations',
    description:
      'Free online PDF editor. Rotate, delete, and reorder PDF pages in your browser. No account required. Download edited PDF instantly.',
    ogTitle: 'Free PDF Editor Online | Aadhirai Innovations',
    ogDescription:
      'Edit PDF pages online for free. Rotate pages, delete pages, reorder pages. Browser-based, no software install.',
    canonical: 'https://www.aadhiraiinnovations.com/tools/pdf-editor',
  },
}

const DEFAULT_SEO = SEO['/']

function SiteLayout() {
  const { pathname, hash } = useLocation()

  /* Scroll to hash anchor or page top on navigation */
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  /* Fallback SEO for this route, rendered as a <Helmet> further up this component's
     JSX below — any page rendered via <Outlet /> that mounts its own <Helmet> (all the
     dynamic/local-SEO pages do) is nested deeper and always wins per-tag, no DOM-mutation
     race involved. Routes with a specific SEO[pathname] entry get it exactly; anything
     else (including every dynamic city/state/district page) falls back to the homepage's
     tags here until/unless its own page-level Helmet overrides them. */
  const seoConfig = SEO[pathname] ?? DEFAULT_SEO

  return (
    <div className="min-h-screen bg-white text-[#0B1F3A]">
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta property="og:title" content={seoConfig.ogTitle} />
        <meta property="og:description" content={seoConfig.ogDescription} />
        <meta property="og:url" content={seoConfig.canonical} />
        <meta name="twitter:title" content={seoConfig.ogTitle} />
        <meta name="twitter:description" content={seoConfig.ogDescription} />
        <link rel="canonical" href={seoConfig.canonical} />
      </Helmet>

      <Header />
      <main>
        <Outlet />
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  )
}

export default SiteLayout
