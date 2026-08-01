/**
 * Sitemap Generation Script
 * Generates sitemap.xml for all pages including dynamic city pages
 * Run: node generate-sitemap.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { states } from './src/data/locationSlugs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DOMAIN = 'https://aadhiraiinnovations.com'
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
  { path: '/contact', lastmod: today, priority: '0.7', changefreq: 'monthly' },
  { path: '/tools', lastmod: today, priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', lastmod: today, priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', lastmod: today, priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', lastmod: today, priority: '0.3', changefreq: 'yearly' },
]

// Product pages (from products.js data) — 'medora-plus' deliberately excluded, it's already
// listed in staticPages above with a distinct priority; this was previously duplicated here.
const productSlugs = [
  'billing',
  'sanko-erp',
  'passtrack',
  'mouna-ai',
  'workforce',
  'school-management',
  'pos-system',
  'inventory-management',
  'billing-software',
  'crm-software',
  'hrms'
]

const productPages = productSlugs.map(slug => ({
  path: `/products/${slug}`,
  lastmod: today,
  priority: '0.8',
  changefreq: 'monthly'
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

// Combine all pages
const allPages = [...staticPages, ...productPages, ...locationHubPage, ...statePages, ...districtPages]

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
console.log(`   - Product pages: ${productPages.length}`)
console.log(`   - Location hub: ${locationHubPage.length}`)
console.log(`   - State pages: ${statePages.length}`)
console.log(`   - District pages: ${districtPages.length}`)
