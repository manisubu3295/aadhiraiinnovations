import LegalPageLayout from '../components/layout/LegalPageLayout'

function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund & Cancellation Policy" effectiveDate="27 July 2026">
      <section>
        <p>
          This policy covers Medora Offline license purchases made through our Razorpay checkout. It
          does not cover consulting engagements (Production Readiness Audit, Architecture Advisory
          Retainer, Fixed-Scope Engineering), which are governed by the cancellation terms of their
          own signed agreement.
        </p>
      </section>

      <section>
        <h2>Digital delivery</h2>
        <p>
          A Medora Offline license is a digital product: once payment is confirmed, your license is
          generated and emailed to you, along with a GST invoice, within a short time. This is a
          self-service license — it does not include an ongoing support contract, only email support
          for initial setup within 24–72 hours.
        </p>
      </section>

      <section>
        <h2>No refunds after delivery</h2>
        <p>
          Because the license is delivered digitally and is locked to your device's Machine ID
          immediately on issue, we do not offer refunds once a license has been generated and
          delivered.
        </p>
      </section>

      <section>
        <h2>Exceptions</h2>
        <p>We will review a refund request, at our discretion, only in these situations:</p>
        <ul>
          <li>You were charged more than once for the same license order (duplicate payment)</li>
          <li>Payment was captured by Razorpay but no license was generated or delivered due to a technical failure on our end</li>
        </ul>
        <p>
          To request a review, email{' '}
          <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a> within 7 days
          of payment with your order details. Approved refunds are issued to the original payment
          method via Razorpay and typically take 7–10 business days to reflect, depending on your
          bank.
        </p>
      </section>

      <section>
        <h2>Failed or incomplete payments</h2>
        <p>
          If a payment fails or is not captured, no license is generated and you should not be
          charged. If you see a charge with no corresponding license email, contact us and we'll
          reconcile it.
        </p>
      </section>

      <section>
        <h2>Contact us</h2>
        <p>
          For any billing or refund question, email{' '}
          <a href="mailto:info@aadhiraiinnovations.com">info@aadhiraiinnovations.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}

export default RefundPolicyPage
