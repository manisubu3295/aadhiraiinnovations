import SectionHeading from '../ui/SectionHeading';
import Container from '../ui/Container';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'Automates GST billing and reduces manual errors',
  'Tracks stock, batches, and expiry for compliance',
  'Provides instant expiry alerts to prevent losses',
  'Enables fast sales and purchase management',
  'Works offline and syncs to cloud when needed',
  'Supports multi-store and multi-user operations',
  'Easy reporting for regulatory and business insights',
  'Quick onboarding and reliable support',
];

export default function MedoraPharmacyBenefitsSection() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-emerald-50 via-white to-cyan-50/60">
      <Container>
        <SectionHeading
          eyebrow="How Medora+ Helps"
          title="Empowering Pharmacies with Medora+"
          description="Medora+ is designed to solve real pharmacy pain points, streamline operations, and ensure compliance."
          centered
        />
        {/* Testimonial video below the benefits */}
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="aspect-video overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_8px_24px_rgba(255,193,7,0.08)]">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/4vQjlgKnycY"
              title="Medora+ Testimonial"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
