import HeroSection from '../components/sections/HeroSection'
import ProofStripSection from '../components/sections/ProofStripSection'
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection'
import WhatWeBuildSection from '../components/sections/WhatWeBuildSection'
import MedoraSpotlightSection from '../components/sections/MedoraSpotlightSection'
import MedoraPharmacyBenefitsSection from '../components/sections/MedoraPharmacyBenefitsSection'
import ResearchApproachSection from '../components/sections/ResearchApproachSection'
import VideoSection from '../components/sections/VideoSection'
import PartnershipsSection from '../components/sections/PartnershipsSection'
import MediaGallerySection from '../components/sections/MediaGallerySection'
import IndustriesCarouselSection from '../components/sections/IndustriesCarouselSection'
import FounderPreviewSection from '../components/sections/FounderPreviewSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'

function HomePage() {
  return (
    <>
      {/* 1. Cinematic hero — authority & positioning */}
      <HeroSection />

      {/* 2. Authority band — key trust signals on dark background */}
      <ProofStripSection />

      {/* 3. Problem vs solution — editorial split storytelling */}
      <WhyChooseUsSection />

      {/* 4. What we build — alternating editorial solution blocks */}
      <WhatWeBuildSection />

      {/* 5. Flagship product — Medora+ dark showcase */}
      <MedoraSpotlightSection />

      {/* 6. Medora client testimonial video */}
      <MedoraPharmacyBenefitsSection />

      {/* 7. Delivery methodology — 5-phase process */}
      <ResearchApproachSection />

      {/* 8. Company overview video */}
      <VideoSection />

      {/* 9. Client testimonials */}
      <PartnershipsSection />

      {/* 10. Engineering principles */}
      <MediaGallerySection />

      {/* 11. Industries covered */}
      <IndustriesCarouselSection />

      {/* 12. Founder authority — split-screen dark section */}
      <FounderPreviewSection />

      {/* 13. Final CTA + Contact — dark premium with WhatsApp */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
