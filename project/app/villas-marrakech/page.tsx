'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Star, Users, Bed, Bath, Check, Waves, TreePalm, Car } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { mockProperties } from '@/lib/data'
import { LOCATIONS } from '@/lib/seo'

const villas = mockProperties.filter(p => p.type === 'villa')

const villaFeatures = [
  { icon: Waves, title: 'Private Pool', description: 'Most villas feature private swimming pools for your exclusive use.' },
  { icon: TreePalm, title: 'Gardens & Grounds', description: 'Spacious outdoor areas with lush gardens and lounging spaces.' },
  { icon: Car, title: 'Easy Access', description: 'Located outside the medina with parking and easy car access.' },
  { icon: Users, title: 'Perfect for Groups', description: 'Spacious layouts ideal for families and larger groups.' },
  { icon: Bed, title: 'Multiple Bedrooms', description: '3-7 bedroom options to accommodate your entire party.' },
  { icon: Star, title: 'Luxury Amenities', description: 'High-end finishes, modern kitchens, and premium furnishings.' }
]

export default function VillasMarrakechPage() {

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/categories/villas.jpg"
              alt="Luxury Villa with pool in Marrakech"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <p className="luxury-subheading text-white/80 mb-4">Luxury & Space</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading mb-6">
              Villas in Marrakech
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the ultimate in Moroccan luxury with our stunning private villas. 
              Featuring pools, gardens, and panoramic views of the Atlas Mountains.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#properties">
                <Button size="lg" className="gap-2">
                  View All Villas
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
                <p className="text-3xl font-semibold text-primary">{villas.length}+</p>
                <p className="text-sm text-muted-foreground">Villas Available</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">90%</p>
                <p className="text-sm text-muted-foreground">With Private Pool</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">3-7</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose a Villa */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Why Choose a Villa in Marrakech?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our villas offer the perfect blend of Moroccan charm and modern luxury, 
                with space and privacy for an unforgettable stay.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villaFeatures.map((feature, index) => (
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

        {/* Location - Palmeraie Focus */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/locations/palmeraie.jpg"
                  alt="Palmeraie - Villa neighborhood in Marrakech"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="luxury-subheading text-gold mb-3">Prime Location</p>
                <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                  Villas in La Palmeraie
                </h2>
                <p className="text-muted-foreground mb-6">
                  La Palmeraie is Marrakech&apos;s most prestigious villa neighborhood, a verdant oasis 
                  of over 100,000 palm trees just 15 minutes from the medina. Here you&apos;ll find 
                  our most luxurious properties with expansive grounds, private pools, and 
                  breathtaking views of the Atlas Mountains.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    '15 minutes from Marrakech medina',
                    'Peaceful and secure gated communities',
                    'Large plots with mature gardens',
                    'Easy access to golf courses',
                    'Close to luxury hotels and restaurants'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/villas-marrakech-palmeraie">
                  <Button className="gap-2">
                    Explore Palmeraie Villas
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Villas */}
        <section id="properties" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-subheading text-gold mb-3">Our Collection</p>
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Featured Villas in Marrakech
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each villa in our collection offers exceptional quality, stunning design, 
                and all the amenities for a perfect Moroccan getaway.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/properties/villas">
                <Button size="lg" variant="outline" className="gap-2">
                  View All {villas.length} Villas
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
              Your Guide to Villa Rentals in Marrakech
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Renting a private villa in Marrakech offers an unparalleled experience of luxury, 
                privacy, and authentic Moroccan living. Unlike traditional riads in the medina, 
                villas provide spacious grounds, private swimming pools, and easy car access—perfect 
                for families with children or groups seeking a resort-like experience.
              </p>
              <h3 className="text-foreground font-semibold mt-8 mb-4">Best Areas for Villas in Marrakech</h3>
              <p>
                <strong>La Palmeraie:</strong> The most sought-after location for luxury villas, 
                this palm grove offers peace and tranquility just 15 minutes from the city center. 
                Properties here often feature large gardens, pools, and stunning mountain views.
              </p>
              <p>
                <strong>Route de l&apos;Ourika:</strong> Popular for its proximity to the Atlas Mountains, 
                this area offers villas with dramatic landscapes and easy access to mountain excursions.
              </p>
              <p>
                <strong>Amelkis:</strong> A prestigious neighborhood near the Royal Golf Course, 
                perfect for golf enthusiasts seeking luxury accommodation.
              </p>
              <h3 className="text-foreground font-semibold mt-8 mb-4">What to Expect from Our Villas</h3>
              <p>
                All our villas come with dedicated staff including housekeeping and often a cook 
                who can prepare traditional Moroccan dishes. Most properties feature private pools 
                (heated in winter upon request), landscaped gardens, outdoor dining areas, and 
                modern amenities like air conditioning and high-speed WiFi.
              </p>
              <p>
                We personally visit and vet every property in our collection to ensure it meets 
                our standards for quality, cleanliness, and guest experience. Our concierge team 
                is available to arrange everything from airport transfers to private chefs and 
                spa treatments.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Find Your Perfect Villa in Marrakech
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let us help you choose the ideal villa for your group. Our team knows 
              every property personally and can match you with the perfect accommodation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="gap-2">
                  Book Your Villa
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Get Personalized Recommendations
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
