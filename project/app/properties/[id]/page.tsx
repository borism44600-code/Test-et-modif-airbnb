'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { 
  Bed, Bath, Users, MapPin, Check, ArrowRight, 
  Utensils, Car, Sparkles, Mountain, Calendar, Shield,
  Star, Clock, Phone, HeartHandshake, Award, Sofa, ShowerHead
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ImageGallery } from '@/components/properties/image-gallery'
import { AvailabilityCalendar } from '@/components/properties/availability-calendar'
import { Button } from '@/components/ui/button'
import { MiniTestimonial } from '@/components/ui/social-proof'
import { getPropertyBySlugClient as fetchPropertyBySlug, fetchServicesClient, fetchAddonsClient } from '@/lib/data-fetcher-client'
import type { UiProperty } from '@/lib/adapters/property-adapter'
import { FEATURE_LABELS, BED_TYPE_LABELS, BATHROOM_TYPE_LABELS, type PropertyFeatures, type SleepingSpace } from '@/lib/types'
import { cn } from '@/lib/utils'

const serviceIcons = {
  breakfast: Utensils,
  meals: Utensils,
  excursion: Mountain,
  spa: Sparkles,
  transport: Car,
}

// Property-specific storytelling based on type
const propertyStories = {
  riad: {
    intro: 'A traditional home in the heart of the medina',
    atmosphere: 'Riads are traditional Moroccan courtyard houses, built around a central garden or fountain. With their zellige tilework, carved plaster, and peaceful atmosphere, they offer a genuine taste of Moroccan living.'
  },
  villa: {
    intro: 'Space and privacy with views of the Atlas Mountains',
    atmosphere: 'Our villas offer generous living spaces, private gardens, and swimming pools. Ideal for families or groups who appreciate having room to relax while staying close to the city.'
  },
  apartment: {
    intro: 'Contemporary comfort with Moroccan character',
    atmosphere: 'Modern apartments that combine practical amenities with local craftsmanship. A comfortable base for exploring everything Marrakech has to offer.'
  }
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<UiProperty | null>(null)
  const [services, setServices] = useState<{ id: string; name: string; category: string; description: string; image: string }[]>([])
  const [addons, setAddons] = useState<{ id: string; name: string; pricePerPerson?: number; priceFlat?: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperty() {
      try {
        const dbProperty = await fetchPropertyBySlug(id)
        if (dbProperty) {
          setProperty(dbProperty)
        }
      } catch {
        // Property not found — will show notFound()
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
    fetchServicesClient().then(setServices)
    fetchAddonsClient().then(setAddons)
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 pb-16 min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-96 bg-muted rounded-xl" />
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!property) {
    notFound()
  }

  const features = property.features || {} as PropertyFeatures
  const activeFeatures = (Object.entries(features) as [keyof PropertyFeatures, boolean][])
    .filter(([, value]) => value)
    .map(([key]) => ({ key, label: FEATURE_LABELS[key] }))

  const propertyType = property.type || 'riad'
  const story = propertyStories[propertyType] || propertyStories.riad

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/properties" className="hover:text-foreground transition-colors">
              Properties
            </Link>
            <span>/</span>
            <Link 
              href={`/properties/${property.type}s`} 
              className="hover:text-foreground transition-colors capitalize"
            >
              {property.type}s
            </Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </nav>
        </div>

        {/* Image Gallery */}
        <div className="container mx-auto px-6 mb-12">
          <ImageGallery images={property.images} title={property.title} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Title & Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs uppercase tracking-wider rounded-full font-medium">
                    {property.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location.subDistrict || property.location.district}
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <Star className="w-4 h-4 fill-gold" />
                    <span className="font-medium">4.9</span>
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold luxury-heading mb-4">
                  {property.title}
                </h1>
                
                {/* Evocative intro */}
                <p className="text-lg text-primary italic mb-6">{story.intro}</p>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <span>{property.numberOfBedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{property.bedroomGuestCapacity} guests in bedrooms</span>
                  </div>
                  {property.additionalGuestCapacity > 0 && (
                    <div className="flex items-center gap-2">
                      <Sofa className="w-5 h-5 text-gold" />
                      <span>+{property.additionalGuestCapacity} additional</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span>Total: {property.totalGuestCapacity} guests</span>
                  </div>
                </div>
              </motion.div>

              {/* The Experience - Storytelling Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">The Experience</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {story.atmosphere}
                  </p>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </motion.div>

              {/* Sleeping Arrangements */}
              {property.sleepingArrangements && property.sleepingArrangements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Sleeping Arrangements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.sleepingArrangements.map((space: SleepingSpace, index: number) => (
                      <div 
                        key={index}
                        className="bg-secondary/50 rounded-lg p-4 border border-border/50"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {space.roomType === 'bedroom' ? (
                            <Bed className="w-5 h-5 text-primary" />
                          ) : (
                            <Sofa className="w-5 h-5 text-gold" />
                          )}
                          <h3 className="font-medium">{space.roomName}</h3>
                          {space.ensuite && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Ensuite
                            </span>
                          )}
                        </div>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {space.beds.map((bed, bedIndex) => (
                            <li key={bedIndex} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                              {bed.quantity > 1 ? `${bed.quantity}x ` : ''}{BED_TYPE_LABELS[bed.type]}
                            </li>
                          ))}
                          {space.ensuite && space.bathroomType && space.bathroomType !== 'none' && (
                            <li className="flex items-center gap-2 pt-1 border-t border-border/30 mt-2">
                              {space.bathroomType === 'shower' && (
                                <>
                                  <ShowerHead className="w-3.5 h-3.5 text-primary" />
                                  <span>Shower</span>
                                </>
                              )}
                              {space.bathroomType === 'bathtub' && (
                                <>
                                  <Bath className="w-3.5 h-3.5 text-primary" />
                                  <span>Bathtub</span>
                                </>
                              )}
                              {space.bathroomType === 'both' && (
                                <>
                                  <ShowerHead className="w-3.5 h-3.5 text-primary" />
                                  <span>Shower &amp; Bathtub</span>
                                </>
                              )}
                            </li>
                          )}
                        </ul>
                        {space.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {space.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Features */}
              {activeFeatures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Features &amp; Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activeFeatures.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Additional Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Additional Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-4 py-2 bg-secondary rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="bg-secondary/50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{property.location.district}</p>
                      {property.location.subDistrict && (
                        <p className="text-muted-foreground">{property.location.subDistrict}</p>
                      )}
                      {property.location.distanceFromCenter && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Distance from center: {property.location.distanceFromCenter.replace('-', ' ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Availability Calendar */}
              <AvailabilityCalendar 
                availability={property.availability} 
                readOnly={true}
                onBookingClick={() => window.location.href = `/booking?property=${property.id}`}
              />

              {/* Services Section — only shown if real services exist */}
              {services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Experiences &amp; Services</h2>
                  <p className="text-muted-foreground mb-6">
                    Enhance your stay with our premium services, available on request.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.slice(0, 4).map((service) => {
                      const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || Sparkles
                      return (
                        <div
                          key={service.id}
                          className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={service.image}
                              alt={service.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <h4 className="font-medium text-sm">{service.name}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Link href="/services" className="inline-block mt-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      View All Services
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Main Booking Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6 shadow-lg"
                >
                  {/* Price with value proposition */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold">{property.pricePerNight}€</span>
                      <span className="text-muted-foreground">/ night</span>
                    </div>
                    {property.priceDisplayNote && (
                      <p className="text-sm text-primary mt-1">{property.priceDisplayNote}</p>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="capitalize font-medium">{property.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bedrooms</span>
                      <span className="font-medium">{property.numberOfBedrooms}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Guests in Bedrooms</span>
                      <span className="font-medium">{property.bedroomGuestCapacity}</span>
                    </div>
                    {property.additionalGuestCapacity > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Additional Capacity</span>
                        <span className="font-medium">+{property.additionalGuestCapacity}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Total Capacity</span>
                      <span className="text-primary">{property.totalGuestCapacity} guests</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <Link href={`/booking?property=${property.id}`}>
                    <Button size="lg" className="w-full gap-2 bg-gold text-black hover:bg-gold/90 font-medium">
                      <Calendar className="w-5 h-5" />
                      Reserve Your Dates
                    </Button>
                  </Link>

                  {/* Reassurance */}
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Free cancellation up to 48 hours before check-in
                  </p>

                  {/* Secondary CTA */}
                  <div className="mt-4 pt-4 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground mb-2">Have questions?</p>
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Our Team
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Trust Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-secondary/50 rounded-xl p-5 space-y-4"
                >
                  <h4 className="font-medium text-sm">Why Book With Us</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Direct Contact</p>
                        <p className="text-xs text-muted-foreground">Speak with our team directly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Local Knowledge</p>
                        <p className="text-xs text-muted-foreground">Tips and guidance from our team</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <HeartHandshake className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Flexible Arrangements</p>
                        <p className="text-xs text-muted-foreground">We work with you on changes</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mini Testimonial */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <MiniTestimonial />
                </motion.div>

                {/* Optional Add-ons Preview — only if real addons exist */}
                {addons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-card rounded-xl border border-border p-5"
                  >
                    <h4 className="font-medium mb-4">Popular Add-ons</h4>
                    <div className="space-y-3">
                      {addons.slice(0, 3).map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{addon.name}</span>
                          <span className="font-medium text-primary">
                            {addon.pricePerPerson
                              ? `${addon.pricePerPerson}€/person`
                              : `${addon.priceFlat}€`}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Add during checkout</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
