import LegalPageLayout from '../components/layout/LegalPageLayout'

function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate="27 July 2026">
      <section>
        <p>
          This policy explains what personal information Aadhirai Innovations ("we", "us") collects
          through aadhiraiinnovations.com, our Medora+ and Medora Offline pharmacy software, our free
          browser-based tools, and our client portal, and how that information is used. It does not
          cover separate written agreements you sign with us for consulting engagements — those are
          governed by the terms of that specific agreement.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <p><strong>Information you give us directly:</strong></p>
        <ul>
          <li>Contact/enquiry form submissions — name, company, and your message</li>
          <li>Medora Offline trial downloads and subscription requests — name, email, phone/WhatsApp number, and business name</li>
          <li>License purchases — the above, plus your device's Machine ID (used to lock the license to your device) and payment confirmation details from our payment processor</li>
          <li>Client portal accounts — name, company, email, phone, billing address, and GST number, used to generate invoices and quotations</li>
          <li>Support tickets — subject and description of your request</li>
        </ul>
        <p><strong>Information collected automatically:</strong></p>
        <ul>
          <li>
            Your IP address, used briefly, on each page load, to infer which Indian state you're
            likely browsing from so we can show more relevant local copy (for example, mentioning
            your state on our homepage). This lookup happens on our own server using an offline
            database — your IP is not sent to any third party for this purpose, and we do not
            store a log of visitor IPs or locations.
          </li>
          <li>Standard server logs (timestamps, error logs) kept for security and debugging.</li>
        </ul>
        <p><strong>Our free tools (GST Calculator, PDF/DOCX converters, PDF Editor, and similar):</strong></p>
        <ul>
          <li>
            Files you open in these tools are processed entirely in your own browser. They are never
            uploaded to our servers and we never see their contents.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use this information</h2>
        <ul>
          <li>To respond to enquiries and support requests</li>
          <li>To generate, deliver, and re-send Medora licenses and the associated GST invoice</li>
          <li>To process payments for license purchases</li>
          <li>To send service and transactional emails (e.g. license delivery, invoices, ticket updates) and, where you've opted into or initiated it, WhatsApp messages</li>
          <li>To maintain client accounts, projects, tickets, and billing records in our internal systems</li>
          <li>To keep the site and our systems secure and working correctly</li>
        </ul>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          License payments are processed by Razorpay. We do not receive or store your full card,
          UPI, or bank account details — Razorpay handles that in accordance with its own security
          standards (PCI-DSS compliant). We receive confirmation of payment status and amount only.
        </p>
      </section>

      <section>
        <h2>Sharing your information</h2>
        <p>
          We do not sell your personal information. We share it only with the service providers
          necessary to run our business — our payment processor (Razorpay), our transactional email
          delivery provider, and, if you message us on WhatsApp, Meta's WhatsApp Business Platform —
          and when required by law (for example, GST records requested by tax authorities).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use only essential, functional cookies — for example, to keep you signed in to the
          client portal or admin panel. We do not currently use advertising or analytics tracking
          cookies on this site.
        </p>
      </section>

      <section>
        <h2>Data retention</h2>
        <p>
          We keep your information for as long as needed to provide the service you've requested,
          or as required by law — for example, GST invoices and related billing records are retained
          for the statutory period required under Indian tax law.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask us to access, correct, or delete the personal information we hold about you,
          or to stop sending you non-essential communications, by emailing{' '}
          <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a>. Note that
          we can't delete records we're legally required to keep, such as issued GST invoices, and we
          may still need to send service-related emails (e.g. about an active license or open
          ticket) even after an opt-out request, since those are necessary to deliver the service.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect your information. No
          method of transmission or storage is completely secure, and we can't guarantee absolute
          security.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>Our site and products are intended for business use and are not directed at children.</p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The "Effective" date at the top of this page
          reflects the last revision.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}

export default PrivacyPolicyPage
