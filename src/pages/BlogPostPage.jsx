import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import Container from '../components/ui/Container'

// Import all blog posts
const blogPosts = {
  'pharmacy-billing-101': {
    slug: 'pharmacy-billing-101',
    title: 'Pharmacy Billing 101: Complete Guide to GST-Compliant Billing',
    excerpt: 'Everything pharmacy owners need to know about modern billing systems, GST compliance, and operational efficiency.',
    date: 'April 19, 2026',
    readTime: '8 min read',
    category: 'Pharmacy Operations',
    content: `
# Pharmacy Billing 101: Complete Guide to GST-Compliant Billing

Managing a pharmacy involves juggling dozens of tasks daily — from customer service to inventory management to compliance. At the heart of everything is billing. Get billing wrong, and everything else falls apart.

This guide covers what modern pharmacy billing looks like, why GST compliance matters, and how to choose the right system for your pharmacy.

## What is Pharmacy Billing?

Pharmacy billing is the process of invoicing customers for medicine and services they purchase. Sounds simple, but it's far more complex:

- **Price calculation** — Different medicines have different markups, tax rates, and supplier costs
- **GST compliance** — Every invoice must include HSN codes, GSTIN validation, and tax breakdowns
- **Inventory tracking** — Billing must reduce stock automatically
- **Medicine expiry** — Expired items must never be sold
- **Customer records** — Insurance claims, loyalty tracking, purchase history
- **Compliance records** — Every transaction must be audit-ready

## Why Billing Systems Matter

Manual billing (registers, spreadsheets, calculators) creates problems:

1. **Errors** — Manual entry mistakes lead to wrong charges, lost revenue, customer disputes
2. **Compliance risk** — GST audits require proof that every transaction is correct
3. **Time waste** — Counter moves slow, lines form, customer experience suffers
4. **No insights** — You can't answer basic questions: "What's my daily profit?" "Which medicines sell most?"

A proper billing system handles all this automatically.

## GST Compliance for Pharmacies

GST (Goods and Services Tax) is India's unified tax system. For pharmacies, understanding GST means:

### HSN Codes
Every medicine has a unique 8-digit HSN (Harmonized System of Nomenclature) code. Your billing system must automatically assign the correct HSN to each medicine for tax compliance.

### GSTIN Validation
Your customer's GSTIN (GST Identification Number) must be validated on each B2B invoice. This prevents tax fraud and ensures your records are audit-ready.

### Tax Rates
Different medicines fall under different tax brackets:
- **0% GST** — Many essential medicines
- **5% GST** — Common over-the-counter medicines
- **12% GST** — Certain formulations and non-essential items

Your billing system must apply the correct rate automatically.

### Audit Trail
Every transaction must be traceable. GST authorities can demand:
- Complete invoice copies
- Customer details
- HSN code assignment
- Tax calculation breakdown

A manual system makes this impossible. A proper billing system generates audit-ready records automatically.

## How Modern Pharmacy Billing Works

Here's what a modern system like Medora+ handles automatically:

1. **Barcode scanning** — Scan medicine barcodes for instant price lookup
2. **Real-time stock** — Inventory reduces automatically with each sale
3. **Automatic HSN** — Correct tax codes applied without manual entry
4. **GST calculation** — Tax breaks down by HSN automatically
5. **Customer records** — Insurance, loyalty, purchase history tracked
6. **Expiry alerts** — Expired medicines flagged, never sold
7. **Daily reconciliation** — End-of-day reports generated automatically

## The Impact on Your Pharmacy

With a modern billing system:

- **Faster transactions** — Barcode billing in 20-30 seconds vs 5 minutes manual
- **Zero errors** — No more wrong charges or customer disputes
- **Compliance ready** — Every invoice audit-ready, no audit anxiety
- **Real insights** — Know your daily profit, top-selling medicines, customer patterns
- **Happier customers** — Fast service, accurate billing, professional receipts

## Choosing the Right Pharmacy Billing System

When evaluating systems, ask:

1. **Is it GST-native?** (Built for GST, not adapted from foreign software)
2. **Does it work offline?** (For power cuts and internet outages)
3. **Does it track expiry?** (Critical for pharmacy compliance)
4. **Can it handle multiple locations?** (If you have chain pharmacies)
5. **What's the support like?** (Will you get help when you need it?)

[Learn more about Medora+ pharmacy billing software](https://aadhiraiinnovations.com/products/medora-plus) — the complete pharmacy management system built for Indian operations.

## Local Resources

Pharmacy billing software is now available for every major city in Tamil Nadu:
- [Pharmacy billing in Salem](https://aadhiraiinnovations.com/pharmacy-billing-software/salem)
- [Pharmacy billing in Trichy](https://aadhiraiinnovations.com/pharmacy-billing-software/trichy)
- [Pharmacy billing in Vellore](https://aadhiraiinnovations.com/pharmacy-billing-software/vellore)

## Summary

Good billing is the foundation of a good pharmacy. Modern systems like Medora+ handle the complexity so you can focus on customer care and business growth.
    `,
    relatedLinks: [
      { title: 'Medora+ Pharmacy Software', url: '/products/medora-plus' },
      { title: 'Pharmacy Software in Salem', url: '/pharmacy-billing-software/salem' },
      { title: 'GST Compliance Guide', url: '/blog/gst-compliance-pharmacies' },
    ],
  },
  'gst-compliance-pharmacies': {
    slug: 'gst-compliance-pharmacies',
    title: 'GST Compliance for Indian Pharmacies: 2026 Guide',
    excerpt: 'Complete guide to GST compliance for pharmacies — HSN codes, GSTIN validation, audit readiness, and common mistakes to avoid.',
    date: 'April 18, 2026',
    readTime: '10 min read',
    category: 'Compliance',
    content: `
# GST Compliance for Indian Pharmacies: 2026 Guide

GST compliance is non-negotiable for pharmacies. Get it wrong, and you face fines, audits, and loss of business. This guide covers everything pharmacy owners need to know about GST compliance in 2026.

## Understanding GST for Pharmacies

GST (Goods and Services Tax) applies to all medicine sales in India. For pharmacies, this means:

- **Every invoice must be GST-compliant** — Correct tax rate, HSN code, GSTIN
- **Tax rates vary by medicine** — 0%, 5%, 12% depending on the formulation
- **Audit trail is mandatory** — You must keep records for 6 years
- **GSTIN validation is critical** — Wrong GSTIN = invoice rejection and potential penalties

## HSN Codes: Your Foundation

HSN (Harmonized System of Nomenclature) codes identify medicines for tax classification. Every medicine has a code:

- **3004** — Medicaments (prepared medicines)
- **3002** — Vaccines and toxins
- **4905** — Maps, globes, printed
- **2942** — Organic compounds

Assigning the wrong code is a compliance violation. Your billing system must:
1. Have an updated HSN database
2. Auto-assign codes based on medicine name
3. Allow manual override for special cases
4. Generate reports by HSN code for compliance

## GSTIN Validation

GSTIN (GST Identification Number) identifies registered businesses for tax purposes. When a customer (another pharmacy, hospital) provides GSTIN:

1. **Validate** — Check that GSTIN format is correct (15 digits)
2. **Record** — Keep GSTIN on every B2B invoice
3. **Report** — GSTIN appears on all compliance reports

Invalid GSTIN or missing GSTIN on B2B sales = compliance violation.

## Tax Rate Application

Different medicines fall under different GST rates:

| Rate | Examples | HSN |
|------|----------|-----|
| 0% | Life-saving drugs, vaccines | 3002, 3004 (many) |
| 5% | Common OTC medicines | 3004 (some), 2942 (some) |
| 12% | Non-essential formulations | 3004 (some) |

Your system must:
- Know the correct rate for each medicine
- Apply it automatically
- Allow overrides for special cases
- Generate tax-wise reports

## Audit Readiness

GST authorities can audit at any time. Be ready to produce:

1. **Complete invoice copies** — Original invoices for any period
2. **HSN justification** — Why each medicine is classified under its HSN
3. **GSTIN validation** — Proof that customer GSTINs are valid
4. **Tax calculations** — Breakdown of tax per medicine
5. **Exemption proof** — Documents for 0% rated medicines

A manual system makes this impossible. A modern billing system generates audit-ready records automatically.

## Common GST Mistakes (and How to Avoid Them)

### Mistake 1: Wrong HSN Code
**Problem:** Assigning HSN 3004 to a cosmetic that should be classified under 3306
**Impact:** Tax mismatch, audit flag, potential penalty
**Solution:** Use a system with updated HSN database and auto-classification

### Mistake 2: Missing GSTIN on B2B Sales
**Problem:** Selling to hospitals without recording their GSTIN
**Impact:** Invoice rejected, compliance violation
**Solution:** Require GSTIN entry for all B2B customers

### Mistake 3: Wrong Tax Rate
**Problem:** Applying 5% to a medicine that should be 0% or 12%
**Impact:** Over/under tax collection, audit issues
**Solution:** Auto-apply rates based on HSN, with manual override capability

### Mistake 4: Incomplete Records
**Problem:** Not keeping copies of invoices for audits
**Impact:** Can't prove compliance when challenged
**Solution:** Use a system that auto-archives all invoices

## Tools for GST Compliance

Modern pharmacy billing systems like Medora+ handle GST automatically:

- ✓ HSN database automatically assigns codes
- ✓ GSTIN validation prevents entry errors
- ✓ Tax rates auto-apply based on classification
- ✓ All invoices are audit-ready
- ✓ Reports by HSN code and tax rate
- ✓ 6-year archive for compliance

## Getting Help

If you're unsure about your pharmacy's GST compliance:

1. **Consult a CA** — Chartered Accountant specializing in retail
2. **Check GST portal** — tax.gov.in has detailed guidance
3. **Use compliant software** — Modern billing systems handle most complexity
4. **Keep learning** — GST rules evolve; stay updated

[Learn about Medora+ — GST-compliant pharmacy billing](https://aadhiraiinnovations.com/products/medora-plus)

## Summary

GST compliance isn't optional — it's mandatory. But with modern billing systems, it's automatic. Stop worrying about compliance and focus on your business.
    `,
    relatedLinks: [
      { title: 'Medora+ GST Billing', url: '/products/medora-plus' },
      { title: 'Pharmacy Billing Guide', url: '/blog/pharmacy-billing-101' },
    ],
  },
  'best-pharmacy-software-2026': {
    slug: 'best-pharmacy-software-2026',
    title: 'Best Pharmacy Billing Software in 2026: Comparison Guide',
    excerpt: 'Compare pharmacy management software options. What features matter, how to evaluate vendors, and why Medora+ stands out.',
    date: 'April 17, 2026',
    readTime: '12 min read',
    category: 'Software Review',
    content: `
# Best Pharmacy Billing Software in 2026: Comparison Guide

The pharmacy software market is crowded. Some solutions are built for India, others adapted from foreign systems. This guide helps you choose the right software for your pharmacy.

## What Makes Good Pharmacy Software?

Before comparing vendors, understand what matters:

### 1. GST Compliance
Must-have:
- ✓ HSN code database
- ✓ GSTIN validation
- ✓ Tax rate automation
- ✓ Audit-ready records

### 2. Offline-First
Critical for Indian operations:
- ✓ Works without internet
- ✓ Auto-syncs when online
- ✓ No billing downtime

### 3. Expiry Management
Non-negotiable:
- ✓ Batch-level tracking
- ✓ Automatic alerts
- ✓ Prevents expired sales

### 4. Real-Time Inventory
Essential:
- ✓ Automatic stock reduction
- ✓ Low-stock alerts
- ✓ Multi-location sync

### 5. Support
Important:
- ✓ Local support team
- ✓ Training included
- ✓ Responsive help

## Evaluating Options

When comparing pharmacy software, ask vendors:

1. **Is your system GST-native or adapted?**
   - GST-native = Built for GST from the start
   - Adapted = Foreign system modified for GST (red flag)

2. **How does offline operation work?**
   - Fully offline = All functions work without internet
   - Partial offline = Limited functionality without internet (not good)

3. **What's included in your price?**
   - Implementation, training, support should be included
   - Not itemized as add-ons

4. **Can you manage multiple locations?**
   - Important if you run a chain
   - Centralized reporting is a must

5. **How long is implementation?**
   - Fast: 1-2 weeks
   - Slow: 4-6 weeks
   - Very slow: 2+ months (avoid)

## Key Features Comparison

| Feature | Essential? | What to Look For |
|---------|-----------|------------------|
| Barcode scanning | Yes | Fast lookup, bulk import |
| GST compliance | Yes | Auto HSN, GSTIN validation |
| Expiry tracking | Yes | Batch-level, alerts |
| Offline operation | Yes | Full functionality offline |
| Multi-location | If applicable | Centralized dashboard |
| Customer loyalty | Nice-to-have | Purchase history, rewards |
| Analytics | Nice-to-have | Daily profit, top products |

## Why Medora+ Stands Out

Medora+ is built specifically for Indian pharmacies:

✓ **GST-native** — Built for GST from day one, not adapted
✓ **Offline-first** — All operations work without internet
✓ **Expiry intelligent** — Batch-level tracking with automatic alerts
✓ **Multi-location** — Centralized management for pharmacy chains
✓ **Fast implementation** — Go live in 1-2 weeks
✓ **Local support** — Team in Tamil Nadu speaks Tamil

[Learn more: Medora+ Pharmacy Billing Software](https://aadhiraiinnovations.com/products/medora-plus)

## Cost Comparison

Generic pricing ranges (your actual cost may vary):

| Software Type | Price/Month | Features |
|---------------|------------|----------|
| Basic billing | ₹1,000-3,000 | Billing only, no compliance |
| Standard | ₹5,000-8,000 | Billing + basic inventory |
| Premium | ₹12,000-25,000 | Full-featured, multi-location |

Medora+ starts at ₹5,000/month for single locations — full-featured, not basic.

## Red Flags to Avoid

❌ **Cloud-only systems** — Fail when internet goes down (common in India)
❌ **Foreign vendors** — Don't understand Indian compliance
❌ **No offline option** — Your pharmacy stops when internet fails
❌ **Hidden costs** — Training, support, setup charged separately
❌ **Slow implementation** — 4+ weeks is too long
❌ **Poor support** — Email-only, no phone support

## What's Next?

1. **Request a demo** — See the software in action
2. **Ask about your city** — Is it used by pharmacies near you?
3. **Get implementation timeline** — How fast can you go live?
4. **Understand pricing** — What's included in the cost?
5. **Check support** — Can they help in your language?

[Explore pharmacy solutions by city](https://aadhiraiinnovations.com/pharmacy-billing-software/salem)

## Summary

The best pharmacy software for you depends on your needs, budget, and location. But certain features — GST compliance, offline operation, expiry tracking — are non-negotiable. Use this guide to evaluate options and choose wisely.
    `,
    relatedLinks: [
      { title: 'Medora+ Software', url: '/products/medora-plus' },
      { title: 'Pharmacy Software in Trichy', url: '/pharmacy-billing-software/trichy' },
    ],
  },
}

// Blog posts continue...
const allBlogSlugs = Object.keys(blogPosts)

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = blogPosts[slug]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0B1F3A] mb-3">Blog post not found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A] hover:text-[#0B1F3A]/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Meta Tags ──────────────────────────────────────────────────── */}
      {/* Would use Helmet in production for dynamic meta */}

      {/* ── Blog Post Header ───────────────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
        <Container>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0B1F3A]/60 hover:text-[#0B1F3A] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]/60">
                {post.category}
              </span>
              <div className="h-1 w-1 rounded-full bg-[#0B1F3A]/20" />
              <div className="flex items-center gap-4 text-[12px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1] mb-4 max-w-3xl">
              {post.title}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Blog Post Content ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="prose prose-sm md:prose-base max-w-3xl mx-auto text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>').replace(/^# /gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-[#0B1F3A]">').replace(/<h1/g, '<h1').replace(/^## /gm, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-[#0B1F3A]">').replace(/<h2/g, '<h2').replace(/^### /gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-[#0B1F3A]">').replace(/<h3/g, '<h3').replace(/\n\n/g, '</p><p class="mb-4">').replace(/^- /gm, '<li>').replace(/<li>/g, '<li class="ml-4 list-disc">') }}
          />
        </Container>
      </section>

      {/* ── Related Links ──────────────────────────────────────────────── */}
      {post.relatedLinks && post.relatedLinks.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-100 py-12 md:py-16">
          <Container>
            <h3 className="text-lg font-semibold text-[#0B1F3A] mb-6">Related resources</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className="group rounded-lg border border-slate-200 bg-white p-5 hover:shadow-md transition-all"
                >
                  <h4 className="font-medium text-[#0B1F3A] group-hover:text-[#0B1F3A]/70 text-sm mb-2 transition-colors">
                    {link.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0B1F3A]/60 group-hover:text-[#0B1F3A]">
                    Read more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl leading-[1.2] mb-4">
              Ready to modernize your pharmacy operations?
            </h2>
            <p className="text-base text-white/60 mb-6">
              Medora+ brings everything covered in this guide together — GST compliance, offline operation, expiry tracking, and complete inventory management.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://demo.aadhiraiinnovations.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-white/90"
              >
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918508716957"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                Talk to us
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
