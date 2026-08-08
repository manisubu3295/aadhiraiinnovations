/**
 * Sitemap Generation Script
 * Generates sitemap.xml for all pages including dynamic city pages
 * Run: node generate-sitemap.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { states } from './src/data/locationSlugs.js'
import { states as hrmStates } from './src/data/hrmLocationSlugs.js'
import blogPosts from './src/data/blogPosts.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Must match the canonical domain used sitewide (index.html's default canonical/og:url and
// every SiteLayout.jsx SEO entry use www — a mismatched sitemap domain confuses search engines
// about which host is canonical).
const DOMAIN = 'https://www.aadhiraiinnovations.com'
const today = new Date().toISOString().split('T')[0]

// All static pages
const staticPages = [
  { path: '/', lastmod: today, priority: '1.0', changefreq: 'weekly' },
  { path: '/founder', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/solutions/pharmacy-software', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/solutions/erp-automation', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/products/medora-plus', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/products/medora-offline', lastmod: today, priority: '0.9', changefreq: 'monthly' },
  { path: '/about', lastmod: today, priority: '0.7', changefreq: 'monthly' },
  { path: '/services', lastmod: today, priority: '0.7', changefreq: 'monthly' },
  { path: '/pricing', lastmod: today, priority: '0.8', changefreq: 'monthly' },
  { path: '/case-studies', lastmod: today, priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', lastmod: today, priority: '0.7', changefreq: 'weekly' },
  { path: '/resources', lastmod: today, priority: '0.6', changefreq: 'monthly' },
  { path: '/careers', lastmod: today, priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', lastmod: today, priority: '0.7', changefreq: 'monthly' },
  { path: '/tools', lastmod: today, priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', lastmod: today, priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', lastmod: today, priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', lastmod: today, priority: '0.3', changefreq: 'yearly' },
]

// Individual /tools/* pages — previously missing from the sitemap entirely.
const toolSlugs = [
  'gst-calculator',
  'amount-to-words',
  'emi-calculator',
  'docx-to-pdf-converter',
  'pdf-to-docx-converter',
  'pdf-editor',
  'json-formatter',
  'xml-formatter',
  'text-formatter',
  'json-to-xml',
  'xml-to-json',
  'qr-code-generator',
  'barcode-generator',
  'image-compressor',
  'password-generator',
  'unit-converter',
  'currency-converter',
  'percentage-calculator',
  'discount-calculator',
  'tds-calculator',
  'hsn-sac-lookup',
  'merge-pdf',
  'split-pdf',
  'image-to-pdf',
  'pdf-to-image',
  'age-calculator',
  'date-difference-calculator',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'timestamp-converter',
  'uuid-generator',
  'case-converter',
  'word-counter',
  'compound-interest-calculator',
  'simple-interest-calculator',
  'sip-calculator',
  'salary-ctc-calculator',
  'gstin-validator',
  'loan-comparison-calculator',
  'pdf-compressor',
  'watermark-pdf',
  'pdf-page-numbers',
  'jwt-decoder',
  'regex-tester',
  'text-diff-checker',
  'color-converter',
  'slug-generator',
  'cron-explainer',
  'lorem-ipsum-generator',
  'meta-tag-generator',
  'robots-txt-generator',
  'open-graph-preview',
]

const toolPages = toolSlugs.map(slug => ({
  path: `/tools/${slug}`,
  lastmod: today,
  priority: '0.6',
  changefreq: 'monthly',
}))

// Product pages (from products.js data) — 'medora-plus'/'medora-offline' deliberately excluded,
// already listed in staticPages above with a distinct priority; this was previously duplicated
// here. Slugs below must match the `route` field in src/data/products.js, not the `slug` field —
// several of these have historically drifted out of sync (fixed 2026-08).
// 'workforce-manager' deliberately excluded — that page now canonicalizes to /products/hr-inventory
// (HR & Inventory became the sole flagship HRM page), so it shouldn't self-list in the sitemap.
const productSlugs = [
  'billing',
  'hr-inventory',
  'decision-os',
  'mouna-ai',
  'school-os',
  'crm',
  'pharma-dist',
  'passtrack',
  'pos',
  'voltage-iq',
]

const productPages = productSlugs.map(slug => ({
  path: `/products/${slug}`,
  lastmod: today,
  priority: slug === 'hr-inventory' ? '0.9' : '0.8',
  changefreq: 'monthly'
}))

// Blog posts (from src/data/blogPosts.js) — kept in sync automatically since both the
// /blog index page and this sitemap read from the same source.
const blogPages = Object.keys(blogPosts).map(slug => ({
  path: `/blog/${slug}`,
  lastmod: today,
  priority: '0.5',
  changefreq: 'monthly',
}))

// National pharmacy-billing-software local SEO — hub -> state -> district. Slugs come from
// src/data/locationSlugs.js (a single source of truth shared with the routing/page-data layer),
// so this can never drift out of sync with what actually resolves at those URLs the way the old
// hand-maintained city list could.
const locationHubPage = [
  { path: '/pharmacy-billing-software', lastmod: today, priority: '0.9', changefreq: 'monthly' },
]

const statePages = states.map(({ stateSlug }) => ({
  path: `/pharmacy-billing-software/state/${stateSlug}`,
  lastmod: today,
  priority: '0.8',
  changefreq: 'monthly',
}))

const districtPages = states.flatMap(({ districts }) =>
  districts.map(({ slug }) => ({
    path: `/pharmacy-billing-software/${slug}`,
    lastmod: today,
    priority: '0.6',
    changefreq: 'monthly',
  }))
)

// National hrm-software local SEO — hub -> state -> district, same mechanics as the pharmacy
// tree above but a fully independent slug source (src/data/hrmLocationSlugs.js), since its
// curated cities/aliases don't necessarily match pharmacy's.
const hrmLocationHubPage = [
  { path: '/hrm-software', lastmod: today, priority: '0.9', changefreq: 'monthly' },
]

const hrmStatePages = hrmStates.map(({ stateSlug }) => ({
  path: `/hrm-software/state/${stateSlug}`,
  lastmod: today,
  priority: '0.8',
  changefreq: 'monthly',
}))

const hrmDistrictPages = hrmStates.flatMap(({ districts }) =>
  districts.map(({ slug }) => ({
    path: `/hrm-software/${slug}`,
    lastmod: today,
    priority: '0.6',
    changefreq: 'monthly',
  }))
)

// Combine all pages
const allPages = [
  ...staticPages, ...toolPages, ...productPages, ...blogPages,
  ...locationHubPage, ...statePages, ...districtPages,
  ...hrmLocationHubPage, ...hrmStatePages, ...hrmDistrictPages,
]

// Generate XML
const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
const xmlNamespace = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

const urlEntries = allPages
  .map(page => `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')

const sitemap = `${xmlHeader}
${xmlNamespace}
${urlEntries}
</urlset>`

// Write to public directory
const outputPath = path.join(__dirname, 'public', 'sitemap.xml')
const publicDir = path.dirname(outputPath)

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

fs.writeFileSync(outputPath, sitemap, 'utf8')

console.log(`✅ Sitemap generated successfully!`)
console.log(`📍 Location: public/sitemap.xml`)
console.log(`📊 Total URLs: ${allPages.length}`)
console.log(`   - Static pages: ${staticPages.length}`)
console.log(`   - Tool pages: ${toolPages.length}`)
console.log(`   - Product pages: ${productPages.length}`)
console.log(`   - Blog posts: ${blogPages.length}`)
console.log(`   - Location hub: ${locationHubPage.length}`)
console.log(`   - State pages: ${statePages.length}`)
console.log(`   - District pages: ${districtPages.length}`)
console.log(`   - HRM location hub: ${hrmLocationHubPage.length}`)
console.log(`   - HRM state pages: ${hrmStatePages.length}`)
console.log(`   - HRM district pages: ${hrmDistrictPages.length}`)
