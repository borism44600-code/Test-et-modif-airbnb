'use client'

import { useState } from 'react'
import { 
  Coffee, UtensilsCrossed, Car, Mountain, Sparkles, Clock,
  Lock, Edit2, Trash2, Plus, Check, X, AlertCircle, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type {
  BreakfastBooking,
  MealBooking,
  TaxiBooking,
  OtherServiceBooking,
  BookingServices
} from '@/lib/service-booking'
import { 
  canModifyService, 
  formatDeadline, 
  getServiceModificationDeadline,
  MEAL_TYPE_LABELS,
  TAXI_DIRECTION_LABELS
} from '@/lib/service-booking'

interface BookingServicesViewProps {
  services: BookingServices
  checkIn: string
  checkOut: string
  onUpdate?: (services: BookingServices) => void
  readOnly?: boolean
}

export function BookingServicesView({
  services,
  checkIn,
  checkOut,
  onUpdate,
  readOnly = false
}: BookingServicesViewProps) {
  const [editingService, setEditingService] = useState<{
    type: 'breakfast' | 'meal' | 'taxi' | 'other'
    id: string
    data: BreakfastBooking | MealBooking | TaxiBooking | OtherServiceBooking
  } | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getStatusBadge = (status: string, date: string) => {
    const isLocked = !canModifyService(date)
    
    if (status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>
    }
    if (isLocked) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Lock className="w-3 h-3" />
          Locked
        </Badge>
      )
    }
    if (status === 'confirmed') {
      return <Badge className="bg-green-500">Confirmed</Badge>
    }
    return <Badge variant="outline">Pending</Badge>
  }

  const hasServices = 
    services.breakfasts.length > 0 || 
    services.meals.length > 0 || 
    services.taxis.length > 0 || 
    services.otherServices.length > 0

  if (!hasServices) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No services booked</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breakfasts */}
      {services.breakfasts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Coffee className="w-4 h-4 text-gold" />
            Breakfast
            <Badge variant="outline" className="ml-auto">{services.breakfasts.length} days</Badge>
          </h4>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-center p-3 font-medium">Guests</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  {!readOnly && <th className="p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {services.breakfasts.map(breakfast => {
                  const canEdit = canModifyService(breakfast.date) && !readOnly
                  return (
                    <tr key={breakfast.id} className="border-b border-border/50 last:border-0">
                      <td className="p-3">{formatDate(breakfast.date)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3 h-3" />
                          {breakfast.numberOfGuests}
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium">{breakfast.total}€</td>
                      <td className="p-3 text-center">{getStatusBadge(breakfast.status, breakfast.date)}</td>
                      {!readOnly && (
                        <td className="p-3 text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService({ type: 'breakfast', id: breakfast.id, data: breakfast })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={2} className="p-3 font-medium">Total Breakfast</td>
                  <td className="p-3 text-right font-semibold">
                    {services.breakfasts.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.total : sum, 0)}€
                  </td>
                  <td colSpan={!readOnly ? 2 : 1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Meals */}
      {services.meals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-gold" />
            Meals
            <Badge variant="outline" className="ml-auto">{services.meals.length}</Badge>
          </h4>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-center p-3 font-medium">Type</th>
                  <th className="text-center p-3 font-medium">Adults</th>
                  <th className="text-center p-3 font-medium">Children</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  {!readOnly && <th className="p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {services.meals.map(meal => {
                  const canEdit = canModifyService(meal.date) && !readOnly
                  return (
                    <tr key={meal.id} className="border-b border-border/50 last:border-0">
                      <td className="p-3">{formatDate(meal.date)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline">{MEAL_TYPE_LABELS[meal.mealType]}</Badge>
                      </td>
                      <td className="p-3 text-center">{meal.numberOfAdults}</td>
                      <td className="p-3 text-center">{meal.numberOfChildren}</td>
                      <td className="p-3 text-right font-medium">{meal.total}€</td>
                      <td className="p-3 text-center">{getStatusBadge(meal.status, meal.date)}</td>
                      {!readOnly && (
                        <td className="p-3 text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService({ type: 'meal', id: meal.id, data: meal })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={4} className="p-3 font-medium">Total Meals</td>
                  <td className="p-3 text-right font-semibold">
                    {services.meals.reduce((sum, m) => m.status !== 'cancelled' ? sum + m.total : sum, 0)}€
                  </td>
                  <td colSpan={!readOnly ? 2 : 1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Taxis */}
      {services.taxis.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Car className="w-4 h-4 text-gold" />
            Airport Transfers
            <Badge variant="outline" className="ml-auto">{services.taxis.length}</Badge>
          </h4>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Date & Time</th>
                  <th className="text-center p-3 font-medium">Direction</th>
                  <th className="text-center p-3 font-medium">Passengers</th>
                  <th className="text-center p-3 font-medium">Flight</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  {!readOnly && <th className="p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {services.taxis.map(taxi => {
                  const canEdit = canModifyService(taxi.date) && !readOnly
                  return (
                    <tr key={taxi.id} className="border-b border-border/50 last:border-0">
                      <td className="p-3">
                        <div>{formatDate(taxi.date)}</div>
                        <div className="text-muted-foreground text-xs">{taxi.time}</div>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={taxi.direction === 'airport_to_property' ? 'default' : 'secondary'}>
                          {taxi.direction === 'airport_to_property' ? 'Arrival' : 'Departure'}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">{taxi.numberOfPassengers}</td>
                      <td className="p-3 text-center text-muted-foreground">{taxi.flightNumber || '-'}</td>
                      <td className="p-3 text-right font-medium">{taxi.price}€</td>
                      <td className="p-3 text-center">{getStatusBadge(taxi.status, taxi.date)}</td>
                      {!readOnly && (
                        <td className="p-3 text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService({ type: 'taxi', id: taxi.id, data: taxi })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={4} className="p-3 font-medium">Total Transfers</td>
                  <td className="p-3 text-right font-semibold">
                    {services.taxis.reduce((sum, t) => t.status !== 'cancelled' ? sum + t.price : sum, 0)}€
                  </td>
                  <td colSpan={!readOnly ? 2 : 1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Other Services */}
      {services.otherServices.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Experiences & Wellness
            <Badge variant="outline" className="ml-auto">{services.otherServices.length}</Badge>
          </h4>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Service</th>
                  <th className="text-center p-3 font-medium">Date & Time</th>
                  <th className="text-center p-3 font-medium">Guests</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  {!readOnly && <th className="p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {services.otherServices.map(service => {
                  const canEdit = canModifyService(service.date) && !readOnly
                  return (
                    <tr key={service.id} className="border-b border-border/50 last:border-0">
                      <td className="p-3">
                        <div className="font-medium">{service.serviceName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{service.serviceType}</div>
                      </td>
                      <td className="p-3 text-center">
                        <div>{formatDate(service.date)}</div>
                        {service.time && <div className="text-muted-foreground text-xs">{service.time}</div>}
                      </td>
                      <td className="p-3 text-center">
                        {service.numberOfAdults} adult{service.numberOfAdults > 1 ? 's' : ''}
                        {service.numberOfChildren ? `, ${service.numberOfChildren} child${service.numberOfChildren > 1 ? 'ren' : ''}` : ''}
                      </td>
                      <td className="p-3 text-right font-medium">{service.total}€</td>
                      <td className="p-3 text-center">{getStatusBadge(service.status, service.date)}</td>
                      {!readOnly && (
                        <td className="p-3 text-right">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingService({ type: 'other', id: service.id, data: service })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={3} className="p-3 font-medium">Total Experiences</td>
                  <td className="p-3 text-right font-semibold">
                    {services.otherServices.reduce((sum, s) => s.status !== 'cancelled' ? sum + s.total : sum, 0)}€
                  </td>
                  <td colSpan={!readOnly ? 2 : 1}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grand Total */}
      <div className="bg-gold/10 rounded-lg p-4 flex justify-between items-center">
        <span className="font-semibold">Total Services</span>
        <span className="text-2xl font-bold text-gold">{services.totalServicesAmount}€</span>
      </div>

      {/* Modification Notice */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Services can be modified until the day before at 3:00 PM (Marrakech time). 
          After this deadline, services are locked and cannot be changed.
        </p>
      </div>
    </div>
  )
}
