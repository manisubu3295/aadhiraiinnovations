import HeroSection from '../components/sections/HeroSection'
import ProofStripSection from '../components/sections/ProofStripSection'
import ProductPortfolioSection from '../components/sections/ProductPortfolioSection'
import FeaturedCitiesSection from '../components/sections/FeaturedCitiesSection'
import PartnershipsSection from '../components/sections/PartnershipsSection'
import FounderPreviewSection from '../components/sections/FounderPreviewSection'
import FinalCtaSection from '../components/sections/FinalCtaSection'

function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Proof strip */}
      <ProofStripSection />

      {/* 3. Product portfolio */}
      <ProductPortfolioSection />

      {/* 3b. Featured cities — links to top city pages */}
      <FeaturedCitiesSection />

      {/* 4. Testimonials */}
      <PartnershipsSection />

      {/* 5. Founder */}
      <FounderPreviewSection />

      {/* 6. CTA */}
      <FinalCtaSection />
    </>
  )
}

export default HomePage
