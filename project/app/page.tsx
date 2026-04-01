// Home page - v5 - cache invalidation
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { ServicesSection } from '@/components/home/services-section'
import { ExperiencesSection } from '@/components/home/experiences-section'
import { InvestmentCTA } from '@/components/home/investment-cta'
import { BookingCTA } from '@/components/home/booking-cta'
import { TestimonialsSection } from '@/components/ui/social-proof'
import { TrustBadges } from '@/components/ui/trust-badges'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        {/* Trust badges immediately after hero for credibility */}
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <TrustBadges variant="horizontal" />
          </div>
        </section>
        <CategoriesSection />
        <FeaturedProperties />
        {/* Testimonials for social proof before asking to book */}
        <TestimonialsSection />
        <ServicesSection />
        <ExperiencesSection />
        <InvestmentCTA />
        <BookingCTA />
      </main>
      <Footer />
    </>
  )
}
