'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, RefreshCw, Settings2, CheckCircle2, AlertCircle, Home as HomeIcon, Hotel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AdminLayout } from '@/components/admin/admin-layout'
import { CalendarSync, CalendarSyncStatusBadge } from '@/components/admin/calendar-sync'
import { mockProperties } from '@/lib/data'
import { cn } from '@/lib/utils'

interface PropertySyncStatus {
  propertyId: string
  propertyTitle: string
  internalIcalUrl: string
  airbnbConfigured: boolean
  bookingConfigured: boolean
  overallStatus: 'idle' | 'syncing' | 'success' | 'error' | 'partial'
  lastExternalSyncAt?: string
}

export default function AdminCalendarPage() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [syncStatuses, setSyncStatuses] = useState<PropertySyncStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const selectedPropertyData = mockProperties.find(p => p.id === selectedProperty)

  // Fetch all sync statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/ical/sync')
        const data = await response.json()
        setSyncStatuses(data.properties || [])
      } catch (error) {
        console.error('Failed to fetch sync statuses:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStatuses()
  }, [selectedProperty]) // Refetch when dialog closes

  const getPropertyStatus = (propertyId: string): PropertySyncStatus | undefined => {
    return syncStatuses.find(s => s.propertyId === propertyId)
  }

  // Count configured properties
  const configuredCount = syncStatuses.filter(s => s.airbnbConfigured || s.bookingConfigured).length
  const syncedCount = syncStatuses.filter(s => s.overallStatus === 'success').length

  return (
    <AdminLayout title="External Calendars Sync">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Synchronize availability with Airbnb and Booking.com to prevent double bookings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {syncedCount} synced
            </Badge>
            <Badge variant="secondary" className="gap-1">
              {configuredCount} configured
            </Badge>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            How External Calendar Sync Works
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <HomeIcon className="w-4 h-4" />
                Import from Airbnb
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to your Airbnb listing calendar</li>
                <li>Click &quot;Availability settings&quot;</li>
                <li>Select &quot;Export calendar&quot;</li>
                <li>Copy the iCal URL</li>
                <li>Paste it here and sync</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                Import from Booking.com
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to Booking.com Extranet</li>
                <li>Navigate to Calendar tab</li>
                <li>Click &quot;Sync calendars&quot;</li>
                <li>Copy the export URL</li>
                <li>Paste it here and sync</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Export to Platforms
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Copy your internal iCal URL</li>
                <li>Go to Airbnb/Booking.com</li>
                <li>Find &quot;Import calendar&quot; option</li>
                <li>Paste the URL and save</li>
                <li>Website bookings now sync</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProperties.map((property) => {
            const status = getPropertyStatus(property.id)
            
            return (
              <div 
                key={property.id}
                className={cn(
                  "bg-card rounded-xl border overflow-hidden transition-colors",
                  status?.overallStatus === 'success' 
                    ? "border-green-500/30 hover:border-green-500/50" 
                    : status?.overallStatus === 'error'
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-border hover:border-gold/50"
                )}
              >
                {/* Property Image */}
                <div className="relative h-32">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white truncate">{property.title}</h3>
                    <p className="text-xs text-white/80">{property.location.district}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 capitalize"
                  >
                    {property.type}
                  </Badge>
                </div>

                {/* Sync Status */}
                <div className="p-4 space-y-3">
                  {status ? (
                    <CalendarSyncStatusBadge
                      airbnbConfigured={status.airbnbConfigured}
                      bookingConfigured={status.bookingConfigured}
                      overallStatus={status.overallStatus}
                      lastSyncAt={status.lastExternalSyncAt}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span>Not configured</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <Settings2 className="w-4 h-4" />
                    Configure Sync
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sync Configuration Dialog */}
        <Dialog 
          open={!!selectedProperty} 
          onOpenChange={(open) => !open && setSelectedProperty(null)}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
<DialogTitle className="flex items-center gap-2">
  <RefreshCw className="w-5 h-5" />
  External Calendars Sync
  </DialogTitle>
  <DialogDescription>Manage calendar synchronization with Airbnb, Booking.com, and other platforms.</DialogDescription>
            </DialogHeader>
            {selectedPropertyData && (
              <CalendarSync 
                propertyId={selectedPropertyData.id}
                propertyTitle={selectedPropertyData.title}
                className="border-0 p-0"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
