import { Link } from 'react-router-dom'
import LegalPageLayout from '../components/layout/LegalPageLayout'

function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" effectiveDate="27 July 2026">
      <section>
        <p>
          These terms apply to your use of aadhiraiinnovations.com, our Medora+ and Medora Offline
          software, and our free browser-based tools. By using this site or purchasing a license, you
          agree to these terms. Consulting engagements (Production Readiness Audit, Architecture
          Advisory Retainer, Fixed-Scope Engineering) are instead governed by the separate Statement
          of Work or engagement agreement signed for that project.
        </p>
      </section>

      <section>
        <h2>Medora+ and Medora Offline licenses</h2>
        <ul>
          <li>Medora Offline licenses are self-service and one-time-purchase for a fixed term (3 months, 6 months, or 1 year).</li>
          <li>A license is issued and locked to the Machine ID of the device it's activated on, and is non-transferable to another device.</li>
          <li>
            The purchase price covers the software license only — there is no ongoing support
            contract included. If you run into an issue during initial setup, email{' '}
            <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a> and we
            will respond within 24–72 hours.
          </li>
          <li>
            See our{' '}
            <Link to="/refund-policy">Refund &amp; Cancellation Policy</Link> for details on refunds.
          </li>
        </ul>
      </section>

      <section>
        <h2>Free tools</h2>
        <p>
          Our GST Calculator, document converters, PDF editor, and similar tools are provided free of
          charge, "as is", on a best-effort basis, with no warranty of accuracy or fitness for a
          particular purpose. You're responsible for independently verifying any output — especially
          GST or tax calculations — before relying on it for filings or business decisions.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Reverse-engineer, decompile, or redistribute Medora+ or Medora Offline outside the terms of your license</li>
          <li>Use the site or tools for any unlawful purpose</li>
          <li>Scrape, systematically harvest, or overload our servers, including our location pages, with automated requests</li>
          <li>Attempt to circumvent license activation or Machine ID locking</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          The site content, software, product names, and branding are owned by Aadhirai Innovations
          and may not be used without our permission.
        </p>
      </section>

      <section>
        <h2>Payments and invoicing</h2>
        <p>
          Prices are listed in Indian Rupees (INR) and are subject to applicable GST. A GST invoice is
          generated and emailed automatically whenever a license is delivered.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          Our software and free tools are provided "as is" without warranties of any kind. To the
          extent permitted by law, we are not liable for indirect, incidental, or consequential
          damages arising from your use of the site, tools, or licensed software, and our total
          liability for any claim is limited to the amount you paid us for the relevant product.
        </p>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          We may suspend or terminate access to our software or systems for anyone who violates these
          terms.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, and any disputes are subject to the
          exclusive jurisdiction of the courts of Tamil Nadu.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The "Effective" date at the top of this page
          reflects the last revision.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about these terms can be sent to{' '}
          <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}

export default TermsOfServicePage
