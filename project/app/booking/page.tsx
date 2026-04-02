'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, Users, Plus, Minus, Check, ArrowRight, ArrowLeft,
  CreditCard, MapPin, Bed, Bath, Shield, Clock, Star, Sparkles, 
  HeartHandshake, CheckCircle2, AlertCircle, Building2, PartyPopper, Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvailabilityCalendar } from '@/components/properties/availability-calendar'
import { SplitStaySuggestionCard } from '@/components/booking/split-stay-suggestion'
import { CancellationPolicy } from '@/components/booking/cancellation-policy'
import { ServicesSelector } from '@/components/booking/services-selector'
import { PayPalPayment, PaymentSuccessDetails } from '@/components/payment/paypal-payment'
import type { BreakfastBooking, MealBooking, TaxiBooking, OtherServiceBooking } from '@/lib/service-booking'
import { mockProperties, mockAddons } from '@/lib/data'
import { fetchPublishedPropertiesClient } from '@/lib/data-fetcher-client'
import type { UiProperty } from '@/lib/adapters/property-adapter'
import { 
  checkPropertyAvailability, 
  generateSplitStaySuggestion,
  calculateNights,
  formatDateShort,
  SplitStaySuggestion,
  BookingSegment
} from '@/lib/availability'
import { cn } from '@/lib/utils'

const trustFeatures = [
  { icon: Shield, text: 'Secure Booking' },
  { icon: Clock, text: 'Here to Help' },
  { icon: HeartHandshake, text: 'Free Cancellation (15 days)' }
]

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preselectedPropertyId = searchParams.get('property')
  const preselectedCheckIn = searchParams.get('checkIn')
  const preselectedCheckOut = searchParams.get('checkOut')
  
  // Parse preselected dates
  const initialCheckIn = preselectedCheckIn ? new Date(preselectedCheckIn) : null
  const initialCheckOut = preselectedCheckOut ? new Date(preselectedCheckOut) : null
  
  // If a property is preselected with dates, check availability first
  const [step, setStep] = useState(preselectedPropertyId ? 2 : 1)
  const [selectedPropertyId, setSelectedPropertyId] = useState(preselectedPropertyId || '')
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({ 
    start: initialCheckIn, 
    end: initialCheckOut 
  })
  const [guests, setGuests] = useState({ adults: 2, children: 0 })
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; quantity: number; persons: number }[]>([])
  const [bookedServices, setBookedServices] = useState<{
    breakfasts: BreakfastBooking[]
    meals: MealBooking[]
    taxis: TaxiBooking[]
    otherServices: OtherServiceBooking[]
    total: number
  }>({ breakfasts: [], meals: [], taxis: [], otherServices: [], total: 0 })
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', specialRequests: '' })
  
  // Split-stay state
  const [splitStaySuggestion, setSplitStaySuggestion] = useState<SplitStaySuggestion | null>(null)
  const [acceptedSplitStay, setAcceptedSplitStay] = useState(false)
  const [bookingSegments, setBookingSegments] = useState<BookingSegment[]>([])
  
  // Payment state
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentSuccessDetails | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [allProperties, setAllProperties] = useState<UiProperty[]>(mockProperties)

  useEffect(() => {
    fetchPublishedPropertiesClient().then(data => {
      if (data.length > 0) setAllProperties(data)
    })
  }, [])

  const selectedProperty = allProperties.find(p => p.id === selectedPropertyId)

  // Check availability when dates change
  useEffect(() => {
    if (selectedProperty && dates.start && dates.end) {
      const availability = checkPropertyAvailability(selectedProperty, dates.start, dates.end)
      
      if (availability.status === 'partial') {
        const suggestion = generateSplitStaySuggestion(
          selectedProperty,
          dates.start,
          dates.end,
          allProperties
        )
        setSplitStaySuggestion(suggestion)
        setAcceptedSplitStay(false)
      } else if (availability.status === 'available') {
        setSplitStaySuggestion(null)
        setAcceptedSplitStay(false)
      }
    }
  }, [selectedProperty, dates.start, dates.end])

  const nights = useMemo(() => {
    if (!dates.start || !dates.end) return 0
    return calculateNights(dates.start, dates.end)
  }, [dates.start, dates.end])

  const calculateTotal = () => {
    let total = 0
    
    if (acceptedSplitStay && splitStaySuggestion) {
      // Calculate total for split stay
      splitStaySuggestion.segments.forEach(segment => {
        const property = allProperties.find(p => p.id === segment.propertyId)
        if (property) {
          total += property.pricePerNight * segment.nights
        }
      })
    } else if (selectedProperty) {
      total = selectedProperty.pricePerNight * nights
    }
    
    // Add legacy addons (kept for backward compatibility)
    selectedAddons.forEach(addon => {
      const addonData = mockAddons.find(a => a.id === addon.id)
      if (addonData) {
        if (addonData.pricePerPerson) {
          total += addonData.pricePerPerson * addon.persons * addon.quantity
        } else if (addonData.priceFlat) {
          total += addonData.priceFlat * addon.quantity
        }
      }
    })
    
    // Add new services total
    total += bookedServices.total
    
    return total
  }

  const total = calculateTotal()
  const servicesTotal = bookedServices.total
  const accommodationTotal = total - servicesTotal

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addonId)
      if (exists) {
        return prev.filter(a => a.id !== addonId)
      }
      return [...prev, { id: addonId, quantity: 1, persons: guests.adults + guests.children }]
    })
  }

  const updateAddonQuantity = (addonId: string, delta: number) => {
    setSelectedAddons(prev => prev.map(a => {
      if (a.id === addonId) {
        return { ...a, quantity: Math.max(1, a.quantity + delta) }
      }
      return a
    }))
  }

  const handleAcceptSplitStay = () => {
    setAcceptedSplitStay(true)
    setStep(3)
  }

  const handleDeclineSplitStay = () => {
    // Reset and go back to property selection
    setSplitStaySuggestion(null)
    setSelectedPropertyId('')
    setDates({ start: null, end: null })
    setStep(1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedPropertyId
      case 2: 
        if (!dates.start || !dates.end || nights <= 0) return false
        // If there's a split stay suggestion, they must accept or decline
        if (splitStaySuggestion && !acceptedSplitStay) return false
        return true
      case 3: return guests.adults >= 1
      case 4: return true
      case 5: return contactInfo.name && contactInfo.email && contactInfo.phone
      case 6: return true // Review step - always can proceed to payment
      case 7: return paymentComplete // Payment must be completed
      default: return false
    }
  }

  const handlePaymentSuccess = (details: PaymentSuccessDetails) => {
    setPaymentComplete(true)
    setPaymentDetails(details)
    setPaymentError(null)
  }

  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message)
    setPaymentComplete(false)
  }

  const steps = [
    { number: 1, title: 'Property', description: 'Choose your stay' },
    { number: 2, title: 'Dates', description: 'When are you visiting' },
    { number: 3, title: 'Guests', description: 'Who is joining' },
    { number: 4, title: 'Extras', description: 'Optional services' },
    { number: 5, title: 'Details', description: 'Your information' },
    { number: 6, title: 'Review', description: 'Check details' },
    { number: 7, title: 'Payment', description: 'Secure checkout' },
  ]

  // Get all properties involved in booking
  const bookingProperties = useMemo(() => {
    if (acceptedSplitStay && splitStaySuggestion) {
      return splitStaySuggestion.properties
    }
    return selectedProperty ? [selectedProperty] : []
  }, [acceptedSplitStay, splitStaySuggestion, selectedProperty])

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container mx-auto px-6">
          {/* Page Title with Trust Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="luxury-subheading text-gold mb-3">Book Your Stay</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold luxury-heading mb-4">
              Reserve Your Property
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              A few simple steps and we&apos;ll confirm your booking within 24 hours.
            </p>
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustFeatures.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-4 h-4 text-gold" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Steps Indicator - Premium Design */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <motion.div 
                  className="h-full bg-gold"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center relative z-10">
                  <motion.div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 border-2',
                      step > s.number 
                        ? 'bg-gold border-gold text-black' 
                        : step === s.number 
                          ? 'bg-gold border-gold text-black shadow-lg shadow-gold/30' 
                          : 'bg-background border-muted text-muted-foreground'
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                  </motion.div>
                  <div className="mt-2 text-center hidden sm:block">
                    <span className={cn(
                      'text-xs font-medium block',
                      step >= s.number ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{s.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Property */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Choose Your Property</h2>
                    <p className="text-muted-foreground">Select from our collection of carefully chosen stays</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allProperties.map((property) => (
                      <motion.button
                        key={property.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPropertyId(property.id)}
                        className={cn(
                          'text-left p-4 rounded-xl border-2 transition-all',
                          selectedPropertyId === property.id
                            ? 'border-gold bg-gold/5 shadow-lg'
                            : 'border-border hover:border-gold/50'
                        )}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={property.images[0] || '/images/placeholder-property.jpg'}
                              alt={property.title}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                            {selectedPropertyId === property.id && (
                              <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-gold" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs uppercase tracking-wider text-gold font-medium">{property.type}</span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 fill-gold text-gold" />4.9
                              </span>
                            </div>
                            <h3 className="font-medium truncate">{property.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {property.location.district}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />{property.numberOfBedrooms}
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-3 h-3" />{property.bathrooms}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />{property.totalGuestCapacity}
                              </span>
                            </div>
                            <p className="mt-2 font-semibold text-lg">{property.pricePerNight}€<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Dates with Split-Stay Logic */}
              {step === 2 && selectedProperty && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">When Will You Visit?</h2>
                    <p className="text-muted-foreground">Green dates are available for your perfect getaway</p>
                  </div>
                  
                  <AvailabilityCalendar
                    availability={selectedProperty.availability}
                    selectedDates={dates}
                    onDateSelect={setDates}
                  />
                  
                  {dates.start && dates.end && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gold/10 border border-gold/20 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Arrival</p>
                          <p className="font-semibold text-lg">{formatDateShort(dates.start)}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-20 h-px bg-gold/30 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                              <span className="text-sm font-medium text-gold">{nights} nights</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Departure</p>
                          <p className="font-semibold text-lg">{formatDateShort(dates.end)}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Split-Stay Suggestion */}
                  {splitStaySuggestion && splitStaySuggestion.type === 'split' && !acceptedSplitStay && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <SplitStaySuggestionCard
                        suggestion={splitStaySuggestion}
                        properties={splitStaySuggestion.properties}
                        onAccept={handleAcceptSplitStay}
                        onDecline={handleDeclineSplitStay}
                      />
                    </motion.div>
                  )}

                  {/* Accepted Split-Stay Confirmation */}
                  {acceptedSplitStay && splitStaySuggestion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/10 border border-green-500/30 rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Split-Stay Accepted</p>
                          <p className="text-sm text-muted-foreground">
                            Your curated {splitStaySuggestion.totalNights}-night experience across {splitStaySuggestion.properties.length} properties is ready.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Select Guests */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Who&apos;s Joining You?</h2>
                    {bookingProperties.length > 0 && (
                      <p className="text-muted-foreground">
                        Accommodates up to {Math.min(...bookingProperties.map(p => p.totalGuestCapacity))} guests
                      </p>
                    )}
                  </div>
                  <div className="space-y-4 max-w-md mx-auto">
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-5 bg-card rounded-xl border border-border"
                    >
                      <div>
                        <p className="font-medium text-lg">Adults</p>
                        <p className="text-sm text-muted-foreground">Age 13 and above</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                          disabled={guests.adults <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-xl">{guests.adults}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                          disabled={bookingProperties.length > 0 && guests.adults + guests.children >= Math.min(...bookingProperties.map(p => p.totalGuestCapacity))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-5 bg-card rounded-xl border border-border"
                    >
                      <div>
                        <p className="font-medium text-lg">Children</p>
                        <p className="text-sm text-muted-foreground">Ages 2 to 12</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setGuests(g => ({ ...g, children: Math.max(0, g.children - 1) }))}
                          disabled={guests.children <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-xl">{guests.children}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setGuests(g => ({ ...g, children: g.children + 1 }))}
                          disabled={bookingProperties.length > 0 && guests.adults + guests.children >= Math.min(...bookingProperties.map(p => p.totalGuestCapacity))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Services & Extras */}
              {step === 4 && dates.start && dates.end && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <ServicesSelector
                    checkIn={dates.start.toISOString().split('T')[0]}
                    checkOut={dates.end.toISOString().split('T')[0]}
                    numberOfAdults={guests.adults}
                    numberOfChildren={guests.children}
                    onServicesChange={setBookedServices}
                  />
                  <p className="text-sm text-center text-muted-foreground">
                    You can always add or modify services later through your booking portal
                  </p>
                </motion.div>
              )}

              {/* Step 5: Contact Details */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Almost There</h2>
                    <p className="text-muted-foreground">Share your details so we can confirm your booking</p>
                  </div>
                  <div className="max-w-md mx-auto space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="name"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo(c => ({ ...c, name: e.target.value }))}
                        placeholder="As it appears on your ID"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(c => ({ ...c, email: e.target.value }))}
                        placeholder="We&apos;ll send confirmation here"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(c => ({ ...c, phone: e.target.value }))}
                        placeholder="+1 234 567 8900"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requests" className="text-sm font-medium">Special Requests <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                      <textarea
                        id="requests"
                        value={contactInfo.specialRequests}
                        onChange={(e) => setContactInfo(c => ({ ...c, specialRequests: e.target.value }))}
                        placeholder="Dietary requirements, celebration occasions, arrival time..."
                        className="w-full h-24 px-4 py-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Confirmation */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Review Your Booking</h2>
                    <p className="text-muted-foreground">Please confirm all details before submitting</p>
                  </div>
                  
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {/* Properties */}
                    {acceptedSplitStay && splitStaySuggestion ? (
                      // Split-Stay Summary
                      <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-5 h-5 text-gold" />
                          <h3 className="font-semibold">Your Premium Split-Stay</h3>
                        </div>
                        <div className="space-y-4">
                          {splitStaySuggestion.segments.map((segment, idx) => {
                            const property = allProperties.find(p => p.id === segment.propertyId)
                            if (!property) return null
                            return (
                              <div key={idx} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                                <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={property.images[0] || '/images/placeholder-property.jpg'}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{property.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDateShort(segment.start)} - {formatDateShort(segment.end)} ({segment.nights} nights)
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{property.pricePerNight * segment.nights}€</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : selectedProperty && (
                      // Single Property
                      <div className="p-6 border-b border-border">
                        <div className="flex gap-4">
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={selectedProperty.images[0] || '/images/placeholder-property.jpg'}
                              alt={selectedProperty.title}
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-gold font-medium">{selectedProperty.type}</span>
                            <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                            <p className="text-muted-foreground flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" />
                              {selectedProperty.location.district}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-border bg-secondary/30">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Check-in</p>
                        <p className="font-medium">{dates.start?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground">After 3:00 PM</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Check-out</p>
                        <p className="font-medium">{dates.end?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground">Before 11:00 AM</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Guests</p>
                        <p className="font-medium">
                          {guests.adults} adult{guests.adults > 1 ? 's' : ''}{guests.children > 0 && `, ${guests.children} child${guests.children > 1 ? 'ren' : ''}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Duration</p>
                        <p className="font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="p-6 space-y-3 border-b border-border">
                      {acceptedSplitStay && splitStaySuggestion ? (
                        splitStaySuggestion.segments.map((segment, idx) => {
                          const property = allProperties.find(p => p.id === segment.propertyId)
                          if (!property) return null
                          return (
                            <div key={idx} className="flex justify-between">
                              <span className="text-muted-foreground">{property.title} ({segment.nights} nights)</span>
                              <span>{property.pricePerNight * segment.nights}€</span>
                            </div>
                          )
                        })
                      ) : selectedProperty && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{selectedProperty.pricePerNight}€ x {nights} nights</span>
                          <span>{selectedProperty.pricePerNight * nights}€</span>
                        </div>
                      )}
                      
                      {/* Services breakdown */}
                      {bookedServices.breakfasts.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Breakfast ({bookedServices.breakfasts.length} days)</span>
                          <span>{bookedServices.breakfasts.reduce((s, b) => s + b.total, 0)}€</span>
                        </div>
                      )}
                      {bookedServices.meals.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Meals ({bookedServices.meals.length})</span>
                          <span>{bookedServices.meals.reduce((s, m) => s + m.total, 0)}€</span>
                        </div>
                      )}
                      {bookedServices.taxis.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Airport Transfers ({bookedServices.taxis.length})</span>
                          <span>{bookedServices.taxis.reduce((s, t) => s + t.price, 0)}€</span>
                        </div>
                      )}
                      {bookedServices.otherServices.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Experiences & Wellness ({bookedServices.otherServices.length})</span>
                          <span>{bookedServices.otherServices.reduce((s, o) => s + o.total, 0)}€</span>
                        </div>
                      )}
                      
                      {selectedAddons.map(addon => {
                        const addonData = mockAddons.find(a => a.id === addon.id)
                        if (!addonData) return null
                        const price = addonData.pricePerPerson 
                          ? addonData.pricePerPerson * addon.persons * addon.quantity
                          : (addonData.priceFlat || 0) * addon.quantity
                        return (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addonData.name} x{addon.quantity}</span>
                            <span>{price}€</span>
                          </div>
                        )
                      })}
                      <div className="flex justify-between font-semibold text-xl pt-3 border-t border-border">
                        <span>Total</span>
                        <span className="text-gold">{total}€</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-6 bg-secondary/30">
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{contactInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{contactInfo.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{contactInfo.phone}</p>
                        </div>
                      </div>
                      {contactInfo.specialRequests && (
                        <div className="mt-4">
                          <p className="text-muted-foreground text-sm">Special Requests</p>
                          <p className="text-sm">{contactInfo.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <CancellationPolicy 
                    nights={nights} 
                    checkInDate={dates.start}
                    nightlyRate={selectedProperty?.pricePerNight}
                  />

                  {/* Reassurance */}
                  <div className="bg-gold/10 border border-gold/20 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gold" />
                        <span>Secure Booking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-gold" />
                        <span>Flexible Cancellation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gold" />
                        <span>Confirmation within 24h</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 7: Payment */}
              {step === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {paymentComplete && paymentDetails ? (
                    // Payment Success
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </motion.div>
                      <h2 className="text-3xl font-semibold mb-3">Payment Successful!</h2>
                      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Your booking has been confirmed. We&apos;ve sent a confirmation email to {paymentDetails.payerEmail || contactInfo.email}.
                      </p>
                      
                      <div className="bg-card rounded-xl border border-border p-6 max-w-md mx-auto mb-8">
                        <div className="flex items-center justify-center gap-2 text-gold mb-4">
                          <PartyPopper className="w-5 h-5" />
                          <span className="font-medium">Booking Confirmed</span>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Booking Reference</span>
                            <span className="font-mono font-medium">{paymentDetails.bookingId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount Paid</span>
                            <span className="font-semibold text-gold">{paymentDetails.amount.toFixed(2)} {paymentDetails.currency}</span>
                          </div>
                          {paymentDetails.payerName && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Paid by</span>
                              <span>{paymentDetails.payerName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild variant="outline">
                          <Link href="/properties">Browse More Properties</Link>
                        </Button>
                        <Button asChild className="bg-gold text-black hover:bg-gold/90">
                          <Link href="/">Return Home</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Payment Form
                    <PayPalPayment
                      amount={total}
                      currency="EUR"
                      propertyId={selectedPropertyId}
                      propertyTitle={selectedProperty?.title || 'Property Booking'}
                      checkIn={dates.start?.toISOString().split('T')[0] || ''}
                      checkOut={dates.end?.toISOString().split('T')[0] || ''}
                      nights={nights}
                      guests={guests}
                      customerEmail={contactInfo.email}
                      customerName={contactInfo.name}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={() => setPaymentError('Payment was cancelled. Please try again.')}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons - Hide when payment is complete */}
            {!(step === 7 && paymentComplete) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mt-12 pt-6 border-t border-border"
              >
                <Button
                  variant="outline"
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 1 || (step === 7 && !paymentComplete)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
                {step < 6 ? (
                  <Button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed()}
                    className="gap-2 bg-gold text-black hover:bg-gold/90"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : step === 6 ? (
                  <Button 
                    onClick={() => setStep(7)}
                    className="gap-2 bg-gold text-black hover:bg-gold/90 px-8"
                  >
                    <Lock className="w-4 h-4" />
                    Proceed to Payment
                  </Button>
                ) : null}
              </motion.div>
            )}

            {/* Help text */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Questions? <Link href="/contact" className="text-gold hover:underline">Contact our concierge</Link> or call <a href="tel:+212500000000" className="text-gold hover:underline">+212 5 00 00 00 00</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing your booking...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
