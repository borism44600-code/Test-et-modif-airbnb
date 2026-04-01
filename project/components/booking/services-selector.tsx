'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coffee, UtensilsCrossed, Car, Mountain, Sparkles, Clock,
  Plus, Minus, Check, ChevronRight, Lock, Calendar, Users,
  Plane, MapPin, Info, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  BreakfastBooking,
  MealBooking,
  TaxiBooking,
  OtherServiceBooking,
  MealType,
  TaxiDirection,
  DEFAULT_SERVICE_PRICING,
  calculateBreakfastTotal,
  calculateMealTotal,
  calculateTaxiTotal,
  calculateExcursionTotal,
  calculateDriverTotal,
  calculateSpaTotal,
  generateServiceId,
  canModifyService,
  formatDeadline,
  getServiceModificationDeadline,
  generateStayDates,
  MEAL_TYPE_LABELS,
  TAXI_DIRECTION_LABELS
} from '@/lib/service-booking'

interface ServicesSelectorProps {
  checkIn: string
  checkOut: string
  numberOfAdults: number
  numberOfChildren: number
  bookingId?: string
  isPostBooking?: boolean
  onServicesChange: (services: {
    breakfasts: BreakfastBooking[]
    meals: MealBooking[]
    taxis: TaxiBooking[]
    otherServices: OtherServiceBooking[]
    total: number
  }) => void
  initialServices?: {
    breakfasts?: BreakfastBooking[]
    meals?: MealBooking[]
    taxis?: TaxiBooking[]
    otherServices?: OtherServiceBooking[]
  }
}

const serviceCategories = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, description: 'Daily breakfast service' },
  { id: 'meals', label: 'Meals', icon: UtensilsCrossed, description: 'Lunch & dinner options' },
  { id: 'taxi', label: 'Airport Transfer', icon: Car, description: 'Private airport transfers' },
  { id: 'excursions', label: 'Excursions', icon: Mountain, description: 'Day trips & activities' },
  { id: 'driver', label: 'Private Driver', icon: Car, description: 'Full or half day driver' },
  { id: 'spa', label: 'Spa & Wellness', icon: Sparkles, description: 'Relaxation treatments' },
]

export function ServicesSelector({
  checkIn,
  checkOut,
  numberOfAdults,
  numberOfChildren,
  bookingId = 'new',
  isPostBooking = false,
  onServicesChange,
  initialServices
}: ServicesSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [breakfasts, setBreakfasts] = useState<BreakfastBooking[]>(initialServices?.breakfasts || [])
  const [meals, setMeals] = useState<MealBooking[]>(initialServices?.meals || [])
  const [taxis, setTaxis] = useState<TaxiBooking[]>(initialServices?.taxis || [])
  const [otherServices, setOtherServices] = useState<OtherServiceBooking[]>(initialServices?.otherServices || [])
  
  // Dialog states
  const [showBreakfastDialog, setShowBreakfastDialog] = useState(false)
  const [showMealDialog, setShowMealDialog] = useState(false)
  const [showTaxiDialog, setShowTaxiDialog] = useState(false)
  const [showExcursionDialog, setShowExcursionDialog] = useState(false)
  const [showDriverDialog, setShowDriverDialog] = useState(false)
  const [showSpaDialog, setShowSpaDialog] = useState(false)

  const stayDates = useMemo(() => generateStayDates(checkIn, checkOut), [checkIn, checkOut])
  const pricing = DEFAULT_SERVICE_PRICING

  // Calculate totals
  const totals = useMemo(() => {
    const breakfastTotal = breakfasts.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.total : sum, 0)
    const mealTotal = meals.reduce((sum, m) => m.status !== 'cancelled' ? sum + m.total : sum, 0)
    const taxiTotal = taxis.reduce((sum, t) => t.status !== 'cancelled' ? sum + t.price : sum, 0)
    const otherTotal = otherServices.reduce((sum, s) => s.status !== 'cancelled' ? sum + s.total : sum, 0)
    return {
      breakfast: breakfastTotal,
      meals: mealTotal,
      taxi: taxiTotal,
      other: otherTotal,
      total: breakfastTotal + mealTotal + taxiTotal + otherTotal
    }
  }, [breakfasts, meals, taxis, otherServices])

  // Notify parent of changes
  const notifyChange = (
    newBreakfasts: BreakfastBooking[],
    newMeals: MealBooking[],
    newTaxis: TaxiBooking[],
    newOther: OtherServiceBooking[]
  ) => {
    const total = 
      newBreakfasts.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.total : sum, 0) +
      newMeals.reduce((sum, m) => m.status !== 'cancelled' ? sum + m.total : sum, 0) +
      newTaxis.reduce((sum, t) => t.status !== 'cancelled' ? sum + t.price : sum, 0) +
      newOther.reduce((sum, s) => s.status !== 'cancelled' ? sum + s.total : sum, 0)

    onServicesChange({
      breakfasts: newBreakfasts,
      meals: newMeals,
      taxis: newTaxis,
      otherServices: newOther,
      total
    })
  }

  // ============================================
  // BREAKFAST HANDLERS
  // ============================================
  
  const [breakfastMode, setBreakfastMode] = useState<'all' | 'select'>('all')
  const [selectedBreakfastDates, setSelectedBreakfastDates] = useState<Set<string>>(new Set())
  const [breakfastGuests, setBreakfastGuests] = useState<Record<string, number>>({})

  const handleBreakfastAllDays = () => {
    const newBreakfasts: BreakfastBooking[] = stayDates.map(date => ({
      id: generateServiceId('BF'),
      bookingId,
      date,
      numberOfGuests: numberOfAdults + numberOfChildren,
      pricePerPerson: pricing.breakfast.pricePerPerson,
      total: calculateBreakfastTotal(numberOfAdults + numberOfChildren, pricing),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    setBreakfasts(newBreakfasts)
    notifyChange(newBreakfasts, meals, taxis, otherServices)
    setShowBreakfastDialog(false)
  }

  const handleBreakfastSelectedDays = () => {
    const newBreakfasts: BreakfastBooking[] = Array.from(selectedBreakfastDates).map(date => ({
      id: generateServiceId('BF'),
      bookingId,
      date,
      numberOfGuests: breakfastGuests[date] || numberOfAdults + numberOfChildren,
      pricePerPerson: pricing.breakfast.pricePerPerson,
      total: calculateBreakfastTotal(breakfastGuests[date] || numberOfAdults + numberOfChildren, pricing),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    setBreakfasts(newBreakfasts)
    notifyChange(newBreakfasts, meals, taxis, otherServices)
    setShowBreakfastDialog(false)
  }

  const toggleBreakfastDate = (date: string) => {
    const newSet = new Set(selectedBreakfastDates)
    if (newSet.has(date)) {
      newSet.delete(date)
    } else {
      newSet.add(date)
      if (!breakfastGuests[date]) {
        setBreakfastGuests(prev => ({ ...prev, [date]: numberOfAdults + numberOfChildren }))
      }
    }
    setSelectedBreakfastDates(newSet)
  }

  const updateBreakfastGuests = (date: string, guests: number) => {
    setBreakfastGuests(prev => ({ ...prev, [date]: guests }))
  }

  const removeBreakfast = (id: string) => {
    const newBreakfasts = breakfasts.filter(b => b.id !== id)
    setBreakfasts(newBreakfasts)
    notifyChange(newBreakfasts, meals, taxis, otherServices)
  }

  // ============================================
  // MEAL HANDLERS
  // ============================================

  const [mealDate, setMealDate] = useState<string>(stayDates[0] || '')
  const [mealType, setMealType] = useState<MealType>('dinner')
  const [mealAdults, setMealAdults] = useState(numberOfAdults)
  const [mealChildren, setMealChildren] = useState(numberOfChildren)
  const [mealNotes, setMealNotes] = useState('')

  const addMeal = () => {
    const newMeal: MealBooking = {
      id: generateServiceId('ML'),
      bookingId,
      date: mealDate,
      mealType,
      numberOfAdults: mealAdults,
      numberOfChildren: mealChildren,
      pricePerAdult: pricing.meals[mealType].pricePerAdult,
      pricePerChild: pricing.meals[mealType].pricePerChild,
      total: calculateMealTotal(mealType, mealAdults, mealChildren, pricing),
      status: 'pending',
      notes: mealNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newMeals = [...meals, newMeal]
    setMeals(newMeals)
    notifyChange(breakfasts, newMeals, taxis, otherServices)
    setShowMealDialog(false)
    // Reset form
    setMealNotes('')
  }

  const removeMeal = (id: string) => {
    const newMeals = meals.filter(m => m.id !== id)
    setMeals(newMeals)
    notifyChange(breakfasts, newMeals, taxis, otherServices)
  }

  // ============================================
  // TAXI HANDLERS
  // ============================================

  const [taxiDate, setTaxiDate] = useState<string>(checkIn)
  const [taxiTime, setTaxiTime] = useState<string>('14:00')
  const [taxiDirection, setTaxiDirection] = useState<TaxiDirection>('airport_to_property')
  const [taxiPassengers, setTaxiPassengers] = useState(numberOfAdults + numberOfChildren)
  const [taxiFlightNumber, setTaxiFlightNumber] = useState('')
  const [taxiNotes, setTaxiNotes] = useState('')

  const addTaxi = () => {
    const newTaxi: TaxiBooking = {
      id: generateServiceId('TX'),
      bookingId,
      date: taxiDate,
      time: taxiTime,
      direction: taxiDirection,
      numberOfPassengers: taxiPassengers,
      flightNumber: taxiFlightNumber || undefined,
      price: calculateTaxiTotal(taxiDirection, taxiPassengers, pricing),
      status: 'pending',
      notes: taxiNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newTaxis = [...taxis, newTaxi]
    setTaxis(newTaxis)
    notifyChange(breakfasts, meals, newTaxis, otherServices)
    setShowTaxiDialog(false)
    // Reset and set up for return
    if (taxiDirection === 'airport_to_property') {
      setTaxiDirection('property_to_airport')
      setTaxiDate(checkOut)
      setTaxiTime('10:00')
    }
  }

  const removeTaxi = (id: string) => {
    const newTaxis = taxis.filter(t => t.id !== id)
    setTaxis(newTaxis)
    notifyChange(breakfasts, meals, newTaxis, otherServices)
  }

  // ============================================
  // EXCURSION HANDLERS
  // ============================================

  const [excursionKey, setExcursionKey] = useState<string>('atlas_day')
  const [excursionDate, setExcursionDate] = useState<string>(stayDates[0] || '')
  const [excursionAdults, setExcursionAdults] = useState(numberOfAdults)
  const [excursionChildren, setExcursionChildren] = useState(numberOfChildren)

  const addExcursion = () => {
    const excursion = pricing.excursions[excursionKey]
    const newService: OtherServiceBooking = {
      id: generateServiceId('EX'),
      bookingId,
      serviceType: 'excursion',
      serviceName: excursion.name,
      date: excursionDate,
      time: '08:30',
      numberOfAdults: excursionAdults,
      numberOfChildren: excursionChildren,
      duration: excursion.duration,
      pricePerAdult: excursion.pricePerAdult,
      pricePerChild: excursion.pricePerChild,
      total: calculateExcursionTotal(excursionKey, excursionAdults, excursionChildren, pricing),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newOther = [...otherServices, newService]
    setOtherServices(newOther)
    notifyChange(breakfasts, meals, taxis, newOther)
    setShowExcursionDialog(false)
  }

  // ============================================
  // DRIVER HANDLERS
  // ============================================

  const [driverDate, setDriverDate] = useState<string>(stayDates[0] || '')
  const [driverDuration, setDriverDuration] = useState<'half_day' | 'full_day'>('full_day')

  const addDriver = () => {
    const newService: OtherServiceBooking = {
      id: generateServiceId('DR'),
      bookingId,
      serviceType: 'driver',
      serviceName: `Private Driver - ${driverDuration === 'full_day' ? 'Full Day' : 'Half Day'}`,
      date: driverDate,
      time: driverDuration === 'full_day' ? '09:00' : '14:00',
      numberOfAdults: numberOfAdults + numberOfChildren,
      duration: driverDuration,
      pricePerAdult: calculateDriverTotal(driverDuration, pricing),
      total: calculateDriverTotal(driverDuration, pricing),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newOther = [...otherServices, newService]
    setOtherServices(newOther)
    notifyChange(breakfasts, meals, taxis, newOther)
    setShowDriverDialog(false)
  }

  // ============================================
  // SPA HANDLERS
  // ============================================

  const [spaKey, setSpaKey] = useState<string>('massage_relaxation')
  const [spaDate, setSpaDate] = useState<string>(stayDates[0] || '')
  const [spaTime, setSpaTime] = useState<string>('15:00')
  const [spaPersons, setSpaPersons] = useState(1)

  const addSpa = () => {
    const spaService = pricing.spa[spaKey]
    const newService: OtherServiceBooking = {
      id: generateServiceId('SP'),
      bookingId,
      serviceType: 'spa',
      serviceName: spaService.name,
      date: spaDate,
      time: spaTime,
      numberOfAdults: spaPersons,
      duration: spaService.duration,
      pricePerAdult: spaService.pricePerPerson,
      total: calculateSpaTotal(spaKey, spaPersons, pricing),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newOther = [...otherServices, newService]
    setOtherServices(newOther)
    notifyChange(breakfasts, meals, taxis, newOther)
    setShowSpaDialog(false)
  }

  const removeOtherService = (id: string) => {
    const newOther = otherServices.filter(s => s.id !== id)
    setOtherServices(newOther)
    notifyChange(breakfasts, meals, taxis, newOther)
  }

  // ============================================
  // RENDER
  // ============================================

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const hasServices = breakfasts.length > 0 || meals.length > 0 || taxis.length > 0 || otherServices.length > 0

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Add Optional Services</h2>
        <p className="text-muted-foreground">
          Enhance your stay with curated experiences and services
        </p>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {serviceCategories.map((category) => {
          const Icon = category.icon
          const count = 
            category.id === 'breakfast' ? breakfasts.filter(b => b.status !== 'cancelled').length :
            category.id === 'meals' ? meals.filter(m => m.status !== 'cancelled').length :
            category.id === 'taxi' ? taxis.filter(t => t.status !== 'cancelled').length :
            category.id === 'excursions' ? otherServices.filter(s => s.serviceType === 'excursion' && s.status !== 'cancelled').length :
            category.id === 'driver' ? otherServices.filter(s => s.serviceType === 'driver' && s.status !== 'cancelled').length :
            category.id === 'spa' ? otherServices.filter(s => s.serviceType === 'spa' && s.status !== 'cancelled').length : 0
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (category.id === 'breakfast') setShowBreakfastDialog(true)
                else if (category.id === 'meals') setShowMealDialog(true)
                else if (category.id === 'taxi') setShowTaxiDialog(true)
                else if (category.id === 'excursions') setShowExcursionDialog(true)
                else if (category.id === 'driver') setShowDriverDialog(true)
                else if (category.id === 'spa') setShowSpaDialog(true)
              }}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all text-left',
                count > 0 
                  ? 'border-gold bg-gold/5' 
                  : 'border-border hover:border-gold/50'
              )}
            >
              <Icon className="w-6 h-6 text-gold mb-2" />
              <p className="font-medium text-sm">{category.label}</p>
              <p className="text-xs text-muted-foreground">{category.description}</p>
              {count > 0 && (
                <Badge className="absolute top-2 right-2 bg-gold text-gold-foreground">
                  {count}
                </Badge>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected Services Summary */}
      {hasServices && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5 space-y-4"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Selected Services
          </h3>

          {/* Breakfasts */}
          {breakfasts.filter(b => b.status !== 'cancelled').length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Coffee className="w-4 h-4" />
                Breakfast ({breakfasts.filter(b => b.status !== 'cancelled').length} days)
              </div>
              <div className="flex flex-wrap gap-2">
                {breakfasts.filter(b => b.status !== 'cancelled').map(b => {
                  const locked = isPostBooking && !canModifyService(b.date)
                  return (
                    <div 
                      key={b.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                        locked ? "bg-muted" : "bg-gold/10"
                      )}
                    >
                      {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span>{formatDate(b.date)}</span>
                      <span className="text-muted-foreground">({b.numberOfGuests} guests)</span>
                      <span className="font-medium">{b.total}€</span>
                      {!locked && (
                        <button onClick={() => removeBreakfast(b.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Meals */}
          {meals.filter(m => m.status !== 'cancelled').length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UtensilsCrossed className="w-4 h-4" />
                Meals
              </div>
              <div className="flex flex-wrap gap-2">
                {meals.filter(m => m.status !== 'cancelled').map(m => {
                  const locked = isPostBooking && !canModifyService(m.date)
                  return (
                    <div 
                      key={m.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                        locked ? "bg-muted" : "bg-gold/10"
                      )}
                    >
                      {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span>{formatDate(m.date)}</span>
                      <Badge variant="outline" className="text-xs">{MEAL_TYPE_LABELS[m.mealType]}</Badge>
                      <span className="font-medium">{m.total}€</span>
                      {!locked && (
                        <button onClick={() => removeMeal(m.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Taxis */}
          {taxis.filter(t => t.status !== 'cancelled').length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Car className="w-4 h-4" />
                Airport Transfers
              </div>
              <div className="flex flex-wrap gap-2">
                {taxis.filter(t => t.status !== 'cancelled').map(t => {
                  const locked = isPostBooking && !canModifyService(t.date)
                  return (
                    <div 
                      key={t.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                        locked ? "bg-muted" : "bg-gold/10"
                      )}
                    >
                      {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span>{formatDate(t.date)} {t.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {t.direction === 'airport_to_property' ? 'Arrival' : 'Departure'}
                      </Badge>
                      <span className="font-medium">{t.price}€</span>
                      {!locked && (
                        <button onClick={() => removeTaxi(t.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Other Services */}
          {otherServices.filter(s => s.status !== 'cancelled').length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                Experiences & Wellness
              </div>
              <div className="flex flex-wrap gap-2">
                {otherServices.filter(s => s.status !== 'cancelled').map(s => {
                  const locked = isPostBooking && !canModifyService(s.date)
                  return (
                    <div 
                      key={s.id} 
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                        locked ? "bg-muted" : "bg-gold/10"
                      )}
                    >
                      {locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span>{s.serviceName}</span>
                      <span className="text-muted-foreground">{formatDate(s.date)}</span>
                      <span className="font-medium">{s.total}€</span>
                      {!locked && (
                        <button onClick={() => removeOtherService(s.id)} className="text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <span className="font-medium">Total Services</span>
            <span className="text-xl font-semibold text-gold">{totals.total}€</span>
          </div>
        </motion.div>
      )}

      {/* Breakfast Dialog */}
      <Dialog open={showBreakfastDialog} onOpenChange={setShowBreakfastDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <Coffee className="w-5 h-5 text-gold" />
  Add Breakfast
  </DialogTitle>
  <DialogDescription>
  Select dates and number of guests for daily breakfast service.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-6 py-4">
            <p className="text-sm text-muted-foreground">
              {pricing.breakfast.pricePerPerson}€ per person
            </p>

            <Tabs value={breakfastMode} onValueChange={(v) => setBreakfastMode(v as 'all' | 'select')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Every Day</TabsTrigger>
                <TabsTrigger value="select">Select Days</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="p-4 bg-gold/10 rounded-lg">
                  <p className="font-medium">Breakfast for all {stayDates.length} days</p>
                  <p className="text-sm text-muted-foreground">
                    {numberOfAdults + numberOfChildren} guests × {stayDates.length} days × {pricing.breakfast.pricePerPerson}€
                  </p>
                  <p className="text-lg font-semibold mt-2">
                    {calculateBreakfastTotal(numberOfAdults + numberOfChildren, pricing) * stayDates.length}€
                  </p>
                </div>
                <Button onClick={handleBreakfastAllDays} className="w-full">
                  Add Breakfast for All Days
                </Button>
              </TabsContent>

              <TabsContent value="select" className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stayDates.map(date => {
                    const isSelected = selectedBreakfastDates.has(date)
                    const guests = breakfastGuests[date] || numberOfAdults + numberOfChildren
                    return (
                      <div 
                        key={date}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all",
                          isSelected ? "border-gold bg-gold/5" : "border-border"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleBreakfastDate(date)}
                            className="flex items-center gap-3"
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              isSelected ? "border-gold bg-gold" : "border-muted-foreground"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium">{formatDate(date)}</span>
                          </button>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateBreakfastGuests(date, Math.max(1, guests - 1))}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{guests}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateBreakfastGuests(date, guests + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm text-muted-foreground ml-2">
                                {calculateBreakfastTotal(guests, pricing)}€
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button 
                  onClick={handleBreakfastSelectedDays} 
                  className="w-full"
                  disabled={selectedBreakfastDates.size === 0}
                >
                  Add Selected Days ({selectedBreakfastDates.size})
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meal Dialog */}
      <Dialog open={showMealDialog} onOpenChange={setShowMealDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <UtensilsCrossed className="w-5 h-5 text-gold" />
  Add Meal
  </DialogTitle>
  <DialogDescription>
  Book traditional Moroccan lunch or dinner for your group.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Select value={mealDate} onValueChange={setMealDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {stayDates.map(date => (
                      <SelectItem key={date} value={date}>{formatDate(date)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunch">Lunch ({pricing.meals.lunch.pricePerAdult}€/adult)</SelectItem>
                    <SelectItem value="dinner">Dinner ({pricing.meals.dinner.pricePerAdult}€/adult)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adults</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMealAdults(Math.max(1, mealAdults - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{mealAdults}</span>
                  <Button variant="outline" size="icon" onClick={() => setMealAdults(mealAdults + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Children</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMealChildren(Math.max(0, mealChildren - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{mealChildren}</span>
                  <Button variant="outline" size="icon" onClick={() => setMealChildren(mealChildren + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dietary Requirements (optional)</Label>
              <Textarea 
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Any allergies or dietary requirements..."
                rows={2}
              />
            </div>

            <div className="p-4 bg-gold/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-semibold">{calculateMealTotal(mealType, mealAdults, mealChildren, pricing)}€</span>
              </div>
            </div>

            <Button onClick={addMeal} className="w-full">Add Meal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Taxi Dialog */}
      <Dialog open={showTaxiDialog} onOpenChange={setShowTaxiDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <Car className="w-5 h-5 text-gold" />
  Airport Transfer
  </DialogTitle>
  <DialogDescription>
  Private transfer to or from Marrakech Menara Airport.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Direction</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={taxiDirection === 'airport_to_property' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setTaxiDirection('airport_to_property')
                    setTaxiDate(checkIn)
                    setTaxiTime('14:00')
                  }}
                >
                  <Plane className="w-4 h-4 mr-2 rotate-45" />
                  Arrival
                </Button>
                <Button
                  variant={taxiDirection === 'property_to_airport' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => {
                    setTaxiDirection('property_to_airport')
                    setTaxiDate(checkOut)
                    setTaxiTime('10:00')
                  }}
                >
                  <Plane className="w-4 h-4 mr-2 -rotate-45" />
                  Departure
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={taxiDate} onChange={(e) => setTaxiDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={taxiTime} onChange={(e) => setTaxiTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Passengers</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setTaxiPassengers(Math.max(1, taxiPassengers - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{taxiPassengers}</span>
                <Button variant="outline" size="icon" onClick={() => setTaxiPassengers(taxiPassengers + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Flight Number (optional)</Label>
              <Input 
                value={taxiFlightNumber}
                onChange={(e) => setTaxiFlightNumber(e.target.value)}
                placeholder="e.g., AT823"
              />
            </div>

            <div className="p-4 bg-gold/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Transfer Price</span>
                <span className="text-lg font-semibold">{calculateTaxiTotal(taxiDirection, taxiPassengers, pricing)}€</span>
              </div>
              {taxiPassengers > 4 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Includes {pricing.taxi.perExtraPassenger}€ per extra passenger (over 4)
                </p>
              )}
            </div>

            <Button onClick={addTaxi} className="w-full">Add Transfer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Excursion Dialog */}
      <Dialog open={showExcursionDialog} onOpenChange={setShowExcursionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <Mountain className="w-5 h-5 text-gold" />
  Book an Excursion
  </DialogTitle>
  <DialogDescription>
  Discover Morocco with our curated day trips and experiences.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Choose Excursion</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(pricing.excursions).map(([key, exc]) => (
                  <button
                    key={key}
                    onClick={() => setExcursionKey(key)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      excursionKey === key ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{exc.name}</p>
                        <p className="text-xs text-muted-foreground">{exc.description}</p>
                      </div>
                      <Badge variant="outline">{exc.duration === 'full_day' ? 'Full Day' : 'Half Day'}</Badge>
                    </div>
                    <p className="text-sm mt-1">{exc.pricePerAdult}€/adult • {exc.pricePerChild}€/child</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Select value={excursionDate} onValueChange={setExcursionDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {stayDates.map(date => (
                    <SelectItem key={date} value={date}>{formatDate(date)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adults</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setExcursionAdults(Math.max(1, excursionAdults - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{excursionAdults}</span>
                  <Button variant="outline" size="icon" onClick={() => setExcursionAdults(excursionAdults + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Children</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setExcursionChildren(Math.max(0, excursionChildren - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{excursionChildren}</span>
                  <Button variant="outline" size="icon" onClick={() => setExcursionChildren(excursionChildren + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gold/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-semibold">{calculateExcursionTotal(excursionKey, excursionAdults, excursionChildren, pricing)}€</span>
              </div>
            </div>

            <Button onClick={addExcursion} className="w-full">Book Excursion</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Driver Dialog */}
      <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <Car className="w-5 h-5 text-gold" />
  Private Driver
  </DialogTitle>
  <DialogDescription>
  Hire a private driver for city exploration or day trips.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              A private driver for your day trips and city exploration.
            </p>

            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={driverDuration === 'half_day' ? 'default' : 'outline'}
                  onClick={() => setDriverDuration('half_day')}
                >
                  Half Day ({pricing.driver.halfDay}€)
                </Button>
                <Button
                  variant={driverDuration === 'full_day' ? 'default' : 'outline'}
                  onClick={() => setDriverDuration('full_day')}
                >
                  Full Day ({pricing.driver.fullDay}€)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Select value={driverDate} onValueChange={setDriverDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {stayDates.map(date => (
                    <SelectItem key={date} value={date}>{formatDate(date)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-gold/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-semibold">{calculateDriverTotal(driverDuration, pricing)}€</span>
              </div>
            </div>

            <Button onClick={addDriver} className="w-full">Book Private Driver</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spa Dialog */}
      <Dialog open={showSpaDialog} onOpenChange={setShowSpaDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <Sparkles className="w-5 h-5 text-gold" />
  Spa & Wellness
  </DialogTitle>
  <DialogDescription>
  Relax with traditional hammam and massage treatments.
  </DialogDescription>
  </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Choose Treatment</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(pricing.spa).map(([key, spa]) => (
                  <button
                    key={key}
                    onClick={() => setSpaKey(key)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      spaKey === key ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{spa.name}</p>
                        <p className="text-xs text-muted-foreground">{spa.description}</p>
                      </div>
                      <Badge variant="outline">{spa.duration}</Badge>
                    </div>
                    <p className="text-sm mt-1">{spa.pricePerPerson}€/person</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Select value={spaDate} onValueChange={setSpaDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {stayDates.map(date => (
                      <SelectItem key={date} value={date}>{formatDate(date)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={spaTime} onValueChange={setSpaTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Persons</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setSpaPersons(Math.max(1, spaPersons - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-semibold">{spaPersons}</span>
                <Button variant="outline" size="icon" onClick={() => setSpaPersons(spaPersons + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gold/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total</span>
                <span className="text-lg font-semibold">{calculateSpaTotal(spaKey, spaPersons, pricing)}€</span>
              </div>
            </div>

            <Button onClick={addSpa} className="w-full">Book Treatment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modification Notice */}
      {isPostBooking && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">Service Modification Policy</p>
            <p className="text-muted-foreground">
              Services can be modified until the day before at 3:00 PM (Marrakech time). 
              After this deadline, services are locked and cannot be changed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
