'use client'

import { useState, useEffect } from 'react'
import { 
  RefreshCw, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Calendar,
  Clock,
  Loader2,
  Save,
  Hotel,
  Home as HomeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { PropertyCalendarSync, ExternalCalendarConfig } from '@/lib/types'

interface CalendarSyncProps {
  propertyId: string
  propertyTitle: string
  className?: string
}

export function CalendarSync({ propertyId, propertyTitle, className }: CalendarSyncProps) {
  const [syncData, setSyncData] = useState<PropertyCalendarSync | null>(null)
  const [airbnbUrl, setAirbnbUrl] = useState('')
  const [bookingUrl, setBookingUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState<'airbnb' | 'booking' | 'all' | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch current sync status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/ical/sync?propertyId=${propertyId}`)
        const data: PropertyCalendarSync = await response.json()
        setSyncData(data)
        
        // Set initial URL values from channels
        const airbnbChannel = data.channels?.find(c => c.channel === 'airbnb')
        const bookingChannel = data.channels?.find(c => c.channel === 'booking')
        if (airbnbChannel?.icalUrl) setAirbnbUrl(airbnbChannel.icalUrl)
        if (bookingChannel?.icalUrl) setBookingUrl(bookingChannel.icalUrl)
      } catch (error) {
        console.error('Failed to fetch sync status:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStatus()
  }, [propertyId])

  // Save URLs
  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/ical/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          airbnbIcalUrl: airbnbUrl || null,
          bookingIcalUrl: bookingUrl || null,
          action: 'save'
        })
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Saved successfully' })
        // Refresh status
        const statusResponse = await fetch(`/api/ical/sync?propertyId=${propertyId}`)
        setSyncData(await statusResponse.json())
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save' })
    } finally {
      setIsSaving(false)
    }
  }

  // Sync calendars
  const handleSync = async (channel: 'airbnb' | 'booking' | 'all') => {
    const canSyncAirbnb = airbnbUrl || syncData?.channels?.find(c => c.channel === 'airbnb')?.icalUrl
    const canSyncBooking = bookingUrl || syncData?.channels?.find(c => c.channel === 'booking')?.icalUrl
    
    if (channel === 'airbnb' && !canSyncAirbnb) {
      setMessage({ type: 'error', text: 'Please enter an Airbnb iCal URL first' })
      return
    }
    if (channel === 'booking' && !canSyncBooking) {
      setMessage({ type: 'error', text: 'Please enter a Booking.com iCal URL first' })
      return
    }
    if (channel === 'all' && !canSyncAirbnb && !canSyncBooking) {
      setMessage({ type: 'error', text: 'Please enter at least one calendar URL first' })
      return
    }
    
    setIsSyncing(channel)
    setMessage(null)
    try {
      const action = channel === 'all' ? 'sync' : `sync-${channel}`
      const response = await fetch('/api/ical/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          airbnbIcalUrl: airbnbUrl || undefined,
          bookingIcalUrl: bookingUrl || undefined,
          action
        })
      })
      const data = await response.json()
      if (response.ok) {
        const parts: string[] = []
        if (data.airbnb?.success) parts.push(`Airbnb: ${data.airbnb.eventsCount} events`)
        if (data.booking?.success) parts.push(`Booking.com: ${data.booking.eventsCount} events`)
        setMessage({ 
          type: data.overallStatus === 'error' ? 'error' : 'success', 
          text: parts.length > 0 ? `Synced ${parts.join(', ')}` : data.message
        })
        // Refresh status
        const statusResponse = await fetch(`/api/ical/sync?propertyId=${propertyId}`)
        setSyncData(await statusResponse.json())
      } else {
        setMessage({ type: 'error', text: data.error || 'Sync failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Sync failed' })
    } finally {
      setIsSyncing(null)
    }
  }

  // Copy internal URL to clipboard
  const handleCopyUrl = async () => {
    if (syncData?.internalIcalUrl) {
      await navigator.clipboard.writeText(syncData.internalIcalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getChannelStatus = (channel: 'airbnb' | 'booking'): ExternalCalendarConfig | undefined => {
    return syncData?.channels?.find(c => c.channel === channel)
  }

  if (isLoading) {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-6", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const airbnbChannel = getChannelStatus('airbnb')
  const bookingChannel = getChannelStatus('booking')

  return (
    <div className={cn("bg-card rounded-xl border border-border p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold/10">
            <Calendar className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold">External Calendars Sync</h3>
            <p className="text-sm text-muted-foreground">{propertyTitle}</p>
          </div>
        </div>
        <Badge 
          variant={
            syncData?.overallStatus === 'success' ? 'default' :
            syncData?.overallStatus === 'error' ? 'destructive' :
            syncData?.overallStatus === 'partial' ? 'secondary' :
            syncData?.overallStatus === 'syncing' ? 'secondary' : 'outline'
          }
          className="capitalize"
        >
          {syncData?.overallStatus === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
          {syncData?.overallStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
          {syncData?.overallStatus === 'syncing' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          {syncData?.overallStatus || 'Not configured'}
        </Badge>
      </div>

      {/* Import Section */}
      <Tabs defaultValue="airbnb" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="airbnb" className="gap-2">
            <HomeIcon className="w-4 h-4" />
            Airbnb
            {airbnbChannel?.syncStatus === 'success' && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="booking" className="gap-2">
            <Hotel className="w-4 h-4" />
            Booking.com
            {bookingChannel?.syncStatus === 'success' && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </TabsTrigger>
        </TabsList>
        
        {/* Airbnb Tab */}
        <TabsContent value="airbnb" className="space-y-4 mt-4">
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Airbnb Calendar URL
            </label>
            <p className="text-xs text-muted-foreground">
              Paste your Airbnb calendar export URL to import blocked dates.
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://www.airbnb.com/calendar/ical/..."
                value={airbnbUrl}
                onChange={(e) => setAirbnbUrl(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button 
                variant="outline"
                onClick={() => handleSync('airbnb')}
                disabled={isSyncing !== null || !airbnbUrl}
                className="gap-2"
              >
                {isSyncing === 'airbnb' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync
              </Button>
            </div>
            
            {/* Airbnb status */}
            {airbnbChannel?.lastSyncAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Last synced: {new Date(airbnbChannel.lastSyncAt).toLocaleString()}
                {airbnbChannel.eventsCount !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {airbnbChannel.eventsCount} events
                  </Badge>
                )}
              </div>
            )}
            {airbnbChannel?.error && (
              <p className="text-xs text-red-500">{airbnbChannel.error}</p>
            )}
            
            <p className="text-xs text-muted-foreground pt-2">
              <a 
                href="https://www.airbnb.com/help/article/99" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                How to export your Airbnb calendar
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </TabsContent>
        
        {/* Booking.com Tab */}
        <TabsContent value="booking" className="space-y-4 mt-4">
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Booking.com Calendar URL
            </label>
            <p className="text-xs text-muted-foreground">
              Paste your Booking.com calendar export URL to import blocked dates.
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://admin.booking.com/..."
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button 
                variant="outline"
                onClick={() => handleSync('booking')}
                disabled={isSyncing !== null || !bookingUrl}
                className="gap-2"
              >
                {isSyncing === 'booking' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sync
              </Button>
            </div>
            
            {/* Booking.com status */}
            {bookingChannel?.lastSyncAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Last synced: {new Date(bookingChannel.lastSyncAt).toLocaleString()}
                {bookingChannel.eventsCount !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {bookingChannel.eventsCount} events
                  </Badge>
                )}
              </div>
            )}
            {bookingChannel?.error && (
              <p className="text-xs text-red-500">{bookingChannel.error}</p>
            )}
            
            <p className="text-xs text-muted-foreground pt-2">
              <a 
                href="https://partner.booking.com/en-us/help/rates-availability/extranet-calendar/how-synchronize-your-calendars-across-channels" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                How to export your Booking.com calendar
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save and Sync All */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button 
          variant="outline" 
          onClick={handleSave}
          disabled={isSaving || isSyncing !== null}
          className="gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save URLs
        </Button>
        <Button 
          onClick={() => handleSync('all')}
          disabled={isSyncing !== null || (!airbnbUrl && !bookingUrl)}
          className="gap-2 bg-gold text-black hover:bg-gold/90"
        >
          {isSyncing === 'all' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Sync All
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Export Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Export to External Platforms
        </label>
        <p className="text-xs text-muted-foreground">
          Copy this URL and paste it into Airbnb and Booking.com calendar import settings to sync your website bookings.
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            value={syncData?.internalIcalUrl || ''}
            readOnly
            className="flex-1 font-mono text-sm bg-muted"
          />
          <Button 
            variant="outline" 
            onClick={handleCopyUrl}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg text-sm",
          message.type === 'success' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}
    </div>
  )
}

// Status badge for property grid
export function CalendarSyncStatusBadge({ 
  airbnbConfigured,
  bookingConfigured,
  overallStatus, 
  lastSyncAt 
}: { 
  airbnbConfigured?: boolean
  bookingConfigured?: boolean
  overallStatus: 'idle' | 'syncing' | 'success' | 'error' | 'partial'
  lastSyncAt?: string 
}) {
  const configured = airbnbConfigured || bookingConfigured
  
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-2 h-2 rounded-full",
        overallStatus === 'success' ? "bg-green-500" :
        overallStatus === 'error' ? "bg-red-500" :
        overallStatus === 'partial' ? "bg-yellow-500" :
        overallStatus === 'syncing' ? "bg-yellow-500 animate-pulse" :
        configured ? "bg-gray-400" : "bg-gray-300"
      )} />
      <span className="text-xs text-muted-foreground">
        {overallStatus === 'success' && lastSyncAt 
          ? `Synced ${new Date(lastSyncAt).toLocaleDateString()}`
          : overallStatus === 'error' ? 'Sync error'
          : overallStatus === 'partial' ? 'Partial sync'
          : overallStatus === 'syncing' ? 'Syncing...'
          : configured ? 'Ready to sync'
          : 'Not configured'
        }
      </span>
      {configured && (
        <div className="flex items-center gap-1">
          {airbnbConfigured && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              <HomeIcon className="w-2.5 h-2.5 mr-0.5" />
              Airbnb
            </Badge>
          )}
          {bookingConfigured && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              <Hotel className="w-2.5 h-2.5 mr-0.5" />
              Booking
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
