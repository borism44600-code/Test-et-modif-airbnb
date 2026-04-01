'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Star, Users, Bed, Bath, Check } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'
import { mockProperties } from '@/lib/data'
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/seo'

// Filter only riads
const riads = mockProperties.filter(p => p.type === 'riad')

// Content sections for SEO
const contentSections = {
  whatIsRiad: {
    en: {
      title: 'What is a Riad?',
      content: `A riad (from the Arabic word "ryad" meaning garden) is a traditional Moroccan house or palace with an interior garden or courtyard. These architectural gems are typically found in the old medinas of Moroccan cities, particularly in Marrakech, Fes, and Essaouira.

The defining feature of a riad is its inward focus—while the exterior walls may appear plain, the interior opens onto a central courtyard often featuring a fountain, lush plants, and intricate tilework (zellige). This design provides privacy, natural cooling, and a serene oasis away from the bustling streets of the medina.

Traditional riads feature multiple floors with rooms arranged around the central courtyard. The ground floor typically houses common areas and sometimes a small pool, while upper floors contain bedrooms with views over the courtyard or access to a rooftop terrace.`
    },
    fr: {
      title: 'Qu\'est-ce qu\'un Riad ?',
      content: `Un riad (du mot arabe "ryad" signifiant jardin) est une maison ou un palais marocain traditionnel avec un jardin ou une cour intérieure. Ces joyaux architecturaux se trouvent généralement dans les anciennes médinas des villes marocaines, notamment à Marrakech, Fès et Essaouira.

La caractéristique distinctive d'un riad est son orientation vers l'intérieur—tandis que les murs extérieurs peuvent paraître simples, l'intérieur s'ouvre sur une cour centrale comportant souvent une fontaine, des plantes luxuriantes et des carrelages complexes (zellige). Cette conception offre intimité, fraîcheur naturelle et un havre de paix loin des rues animées de la médina.

Les riads traditionnels comportent plusieurs étages avec des pièces disposées autour de la cour centrale. Le rez-de-chaussée abrite généralement les espaces communs et parfois une petite piscine, tandis que les étages supérieurs contiennent des chambres avec vue sur la cour ou accès à une terrasse sur le toit.`
    }
  },
  whyChooseRiad: {
    en: {
      title: 'Why Choose a Riad in Marrakech?',
      items: [
        { title: 'Authentic Experience', description: 'Live like a local in a traditional Moroccan home, experiencing the true culture and architecture of Marrakech.' },
        { title: 'Central Location', description: 'Most riads are located within the ancient medina, walking distance from souks, restaurants, and historical sites.' },
        { title: 'Privacy & Tranquility', description: 'Escape the bustling streets into your own private oasis with peaceful courtyards and rooftop terraces.' },
        { title: 'Personalized Service', description: 'Many riads offer breakfast, cooking classes, and concierge services for a boutique hotel experience.' },
        { title: 'Unique Architecture', description: 'Each riad is unique, featuring hand-crafted details, traditional zellige tiles, and carved plaster work.' },
        { title: 'Value for Groups', description: 'Renting an entire riad offers excellent value for families and groups compared to multiple hotel rooms.' }
      ]
    },
    fr: {
      title: 'Pourquoi Choisir un Riad à Marrakech ?',
      items: [
        { title: 'Expérience Authentique', description: 'Vivez comme un local dans une maison marocaine traditionnelle, en découvrant la vraie culture et l\'architecture de Marrakech.' },
        { title: 'Emplacement Central', description: 'La plupart des riads sont situés dans l\'ancienne médina, à distance de marche des souks, restaurants et sites historiques.' },
        { title: 'Intimité & Tranquillité', description: 'Échappez aux rues animées dans votre propre oasis privée avec des cours paisibles et des terrasses sur le toit.' },
        { title: 'Service Personnalisé', description: 'De nombreux riads proposent petit-déjeuner, cours de cuisine et services de conciergerie pour une expérience d\'hôtel boutique.' },
        { title: 'Architecture Unique', description: 'Chaque riad est unique, avec des détails artisanaux, des carreaux zellige traditionnels et du plâtre sculpté.' },
        { title: 'Rapport Qualité-Prix pour les Groupes', description: 'Louer un riad entier offre un excellent rapport qualité-prix pour les familles et les groupes par rapport à plusieurs chambres d\'hôtel.' }
      ]
    }
  },
  bestNeighborhoods: {
    en: {
      title: 'Best Neighborhoods for Riads in Marrakech',
      intro: 'Each neighborhood in the Marrakech medina has its own character and advantages for riad stays:'
    },
    fr: {
      title: 'Meilleurs Quartiers pour les Riads à Marrakech',
      intro: 'Chaque quartier de la médina de Marrakech a son propre caractère et ses avantages pour un séjour en riad :'
    }
  }
}

export default function RiadsMarrakechPage() {
  // Use English content directly for SSR stability - client hydration will update if needed
  const content = {
    whatIsRiad: contentSections.whatIsRiad.en,
    whyChooseRiad: contentSections.whyChooseRiad.en,
    bestNeighborhoods: contentSections.bestNeighborhoods.en
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/categories/riads.jpg"
              alt="Luxury Riad in Marrakech with traditional courtyard"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <p className="luxury-subheading text-white/80 mb-4">Authentic Moroccan Experience</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading mb-6">
              Riads in Marrakech
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover our handpicked collection of traditional riads in the heart of Marrakech&apos;s ancient medina. 
              Experience authentic Moroccan architecture, warm hospitality, and timeless elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#properties">
                <Button size="lg" className="gap-2">
                  View All Riads
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
                <p className="text-3xl font-semibold text-primary">{riads.length}+</p>
                <p className="text-sm text-muted-foreground">Riads Available</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Neighborhoods</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is a Riad Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                  {content.whatIsRiad.title}
                </h2>
                <div className="prose prose-lg text-muted-foreground">
                  {content.whatIsRiad.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/categories/riads.jpg"
                  alt="Traditional Riad courtyard with fountain"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose a Riad */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                {content.whyChooseRiad.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.whyChooseRiad.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                {content.bestNeighborhoods.title}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {content.bestNeighborhoods.intro}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(LOCATIONS).slice(0, 3).map(([key, location]) => (
                <Link 
                  key={key} 
                  href={`/riads-marrakech-${location.slug}`}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-64 rounded-xl overflow-hidden"
                  >
                    <Image
                      src={`/images/locations/${location.slug}.jpg`}
                      alt={`Riads in ${location.name.en}, Marrakech`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>Marrakech</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Riads in {location.name.en}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2">
                        {location.description.en}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Riads */}
        <section id="properties" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="luxury-subheading text-gold mb-3">Our Collection</p>
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Featured Riads in Marrakech
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each riad in our collection has been personally visited and selected for its quality, 
                authenticity, and exceptional service.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riads.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/properties/riads">
                <Button size="lg" variant="outline" className="gap-2">
                  View All {riads.length} Riads
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-4">
                Frequently Asked Questions About Riads
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: 'What is the difference between a riad and a hotel in Marrakech?',
                  a: 'A riad offers a more intimate and authentic experience compared to a hotel. You get an entire traditional Moroccan house (or part of it) with personalized service, a private courtyard, and often a rooftop terrace. Hotels offer standardized rooms while riads are unique properties with individual character.'
                },
                {
                  q: 'How do I find a riad in the medina?',
                  a: 'Finding a riad in the medina can be tricky due to the narrow, winding streets without car access. We provide detailed directions and can arrange for someone to meet you at a landmark point. Many riads are just minutes from Jemaa el-Fna square on foot.'
                },
                {
                  q: 'Can I rent an entire riad in Marrakech?',
                  a: 'Yes! Many of our riads are available for exclusive rental, perfect for families, groups of friends, or special occasions. This gives you complete privacy and access to all facilities including the courtyard, terrace, and sometimes a private pool.'
                },
                {
                  q: 'What amenities do riads typically offer?',
                  a: 'Our riads typically include air conditioning, WiFi, breakfast service, traditional furnishings, and access to rooftop terraces. Many also feature plunge pools or full pools, hammam facilities, and can arrange cooking classes, spa treatments, and excursions.'
                },
                {
                  q: 'Is it safe to stay in a riad in the medina?',
                  a: 'Absolutely. The medina is a safe area with a strong community feel. Riads often have secure entrances with staff, and the narrow streets mean very little traffic. The area is well-policed, especially around main tourist areas.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border-b pb-6"
                >
                  <h3 className="font-semibold text-lg mb-3">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Ready to Experience a Riad in Marrakech?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Let us help you find the perfect riad for your stay. Our team knows every property 
              personally and can match you with the ideal accommodation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="gap-2">
                  Book Your Riad
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Our Team
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
