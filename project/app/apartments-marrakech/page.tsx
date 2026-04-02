'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Star, Wifi, Coffee, Building2, Train, ShoppingBag, Utensils } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { fetchPublishedPropertiesClient } from '@/lib/data-fetcher-client'
import type { UiProperty } from '@/lib/adapters/property-adapter'
import { useState, useEffect } from 'react'

const apartmentFeatures = [
  { icon: Building2, title: 'Modern Living', description: 'Contemporary design with all the comforts of home.' },
  { icon: Wifi, title: 'High-Speed WiFi', description: 'Perfect for remote workers and digital nomads.' },
  { icon: Coffee, title: 'Fully Equipped', description: 'Modern kitchens with everything you need.' },
  { icon: Train, title: 'Great Transport', description: 'Easy access to taxis and public transport.' },
  { icon: ShoppingBag, title: 'Near Shopping', description: 'Close to boutiques, malls, and markets.' },
  { icon: Utensils, title: 'Restaurant Scene', description: 'Walking distance to the best cafes and restaurants.' }
]

export default function ApartmentsMarrakechPage() {
  const [apartments, setApartments] = useState<UiProperty[]>([])
  useEffect(() => {
    fetchPublishedPropertiesClient().then(props => setApartments(props.filter(p => p.type === 'apartment')))
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/categories/apartments.jpg"
              alt="Modern apartment in Marrakech"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <p className="luxury-subheading text-white/80 mb-4">Modern Comfort</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading mb-6">
              Apartments in Marrakech
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Stylish apartments in Marrakech&apos;s modern districts. Perfect for couples, 
              solo travelers, and those seeking contemporary comfort with easy city access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#properties">
                <Button size="lg" className="gap-2">
                  View All Apartments
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-secondary/30 py-8 border-y">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-semibold text-primary">{apartments.length}+</p>
                <p className="text-sm text-muted-foreground">Apartments</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">Gueliz</p>
                <p className="text-sm text-muted-foreground">Prime Location</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">1-3</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose an Apartment */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Why Choose an Apartment in Marrakech?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the modern side of Marrakech with all the conveniences of home 
                in our carefully selected apartments.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartmentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/30 rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gueliz Focus */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="luxury-subheading text-gold mb-3">Prime Location</p>
                <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                  Apartments in Gueliz
                </h2>
                <p className="text-muted-foreground mb-6">
                  Gueliz is Marrakech&apos;s modern city center, built during the French protectorate era. 
                  Today it&apos;s a vibrant neighborhood with tree-lined boulevards, contemporary galleries, 
                  trendy cafes, and excellent restaurants. Our Gueliz apartments put you at the heart 
                  of this exciting district.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    '10 minutes walk to the Medina',
                    'Best restaurants and nightlife',
                    'Modern shopping and boutiques',
                    'Easy taxi and transport access',
                    'International-standard amenities'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/apartments-marrakech-gueliz">
                  <Button className="gap-2">
                    Explore Gueliz Apartments
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/locations/gueliz.jpg"
                  alt="Gueliz neighborhood in Marrakech"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Apartments */}
        <section id="properties" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-subheading text-gold mb-3">Our Collection</p>
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Featured Apartments in Marrakech
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Modern, comfortable, and perfectly located—our apartments offer 
                the ideal base for exploring Marrakech.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/properties/apartments">
                <Button size="lg" variant="outline" className="gap-2">
                  View All {apartments.length} Apartments
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-semibold luxury-heading mb-8 text-center">
              Apartment Rentals in Marrakech: Your Complete Guide
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                While Marrakech is famous for its traditional riads, the city&apos;s modern apartments 
                offer a different but equally appealing experience. Perfect for longer stays, 
                business travelers, and those who prefer contemporary amenities, our apartment 
                collection represents the best of modern Marrakech living.
              </p>
              <h3 className="text-foreground font-semibold mt-8 mb-4">Best Neighborhoods for Apartments</h3>
              <p>
                <strong>Gueliz:</strong> The undisputed center of modern Marrakech, Gueliz offers 
                the widest selection of quality apartments. Here you&apos;ll find everything from cozy 
                studios to spacious penthouses, all within walking distance of cafes, restaurants, 
                and shops.
              </p>
              <p>
                <strong>Hivernage:</strong> An upscale residential area adjacent to the medina walls, 
                Hivernage is home to luxury hotels and high-end apartments. It&apos;s perfect for those 
                who want proximity to both traditional and modern Marrakech.
              </p>
              <h3 className="text-foreground font-semibold mt-8 mb-4">Apartment vs. Riad: Which to Choose?</h3>
              <p>
                Choose an apartment if you value modern amenities, prefer to cook your own meals, 
                need reliable WiFi for work, or are staying for an extended period. Our apartments 
                offer the familiarity and convenience of home while still providing an authentic 
                Marrakech experience.
              </p>
              <p>
                All our apartments include high-speed WiFi, fully equipped kitchens, air conditioning, 
                and comfortable furnishings. Many also offer building amenities such as pools, gyms, 
                and secure parking.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Book Your Apartment in Marrakech
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re visiting for a week or a month, we&apos;ll help you find 
              the perfect apartment for your Marrakech stay.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="gap-2">
                  Book Your Apartment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Ask About Long-Term Stays
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
