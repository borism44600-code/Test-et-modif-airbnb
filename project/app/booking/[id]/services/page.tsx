'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, MapPin, Users, CheckCircle2, 
  AlertCircle, Clock, Home
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServicesSelector } from '@/components/booking/services-selector'
import { BookingServicesView } from '@/components/admin/booking-services-view'
import type { 
  BreakfastBooking, 
  MealBooking, 
  TaxiBooking, 
  OtherServiceBooking,
  BookingServices 
} from '@/lib/service-booking'
import { createEmptyBookingServices, calculateTotalServices } from '@/lib/service-booking'

// Mock booking data - in production this would come from API
const mockBookingData = {
  id: 'BK001',
  propertyName: 'Riad Jardin Secret',
  checkIn: '2026-04-15',
  checkOut: '2026-04-19',
  guests: {
    adults: 2,
    children: 0
  },
  status: 'confirmed' as const,
  services: createEmptyBookingServices('BK001')
}

export default function BookingServicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [booking] = useState(mockBookingData)
  const [services, setServices] = useState<BookingServices>(booking.services)
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleServicesChange = (newServices: {
    breakfasts: BreakfastBooking[]
    meals: MealBooking[]
    taxis: TaxiBooking[]
    otherServices: OtherServiceBooking[]
    total: number
  }) => {
    setServices({
      ...services,
      ...newServices,
      totalServicesAmount: newServices.total
    })
  }

  const handleSave = async () => {
    // In production, this would save to the API
    setSaveSuccess(true)
    setIsEditing(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <Link 
            href={`/booking/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Booking Details
          </Link>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="text-xl font-semibold font-mono">{id}</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  {booking.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-lg font-medium">
                <Home className="w-5 h-5 text-gold" />
                {booking.propertyName}
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Check-in
                </div>
                <p className="font-medium">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Check-out
                </div>
                <p className="font-medium">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </div>
                <p className="font-medium">{nights} nights</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  Guests
                </div>
                <p className="font-medium">
                  {booking.guests.adults} adult{booking.guests.adults > 1 ? 's' : ''}
                  {booking.guests.children > 0 && `, ${booking.guests.children} child${booking.guests.children > 1 ? 'ren' : ''}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-green-700 dark:text-green-400">Your services have been updated successfully.</p>
            </motion.div>
          )}

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Services & Extras</h2>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Add or Modify Services
                </Button>
              )}
            </div>

            {isEditing ? (
              <>
                <ServicesSelector
                  checkIn={booking.checkIn}
                  checkOut={booking.checkOut}
                  numberOfAdults={booking.guests.adults}
                  numberOfChildren={booking.guests.children}
                  bookingId={booking.id}
                  isPostBooking={true}
                  onServicesChange={handleServicesChange}
                  initialServices={services}
                />
                
                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <BookingServicesView
                services={services}
                checkIn={booking.checkIn}
                checkOut={booking.checkOut}
                readOnly={true}
              />
            )}
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-muted/30 rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Need assistance?</p>
                <p>
                  Our concierge team is available to help you plan your perfect stay. 
                  Contact us at <a href="mailto:concierge@example.com" className="text-gold hover:underline">concierge@example.com</a> or 
                  call <a href="tel:+212500000000" className="text-gold hover:underline">+212 5 00 00 00 00</a>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
