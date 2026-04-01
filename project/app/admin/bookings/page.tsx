'use client'

import { useState, useMemo } from 'react'
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  AlertTriangle,
  DollarSign,
  Ban,
  Plus,
  CalendarOff,
  Undo2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminLayout } from '@/components/admin/admin-layout'
import { BookingServicesView } from '@/components/admin/booking-services-view'
import { 
  calculateRefund, 
  generateCancellationSummary,
  formatCurrency,
  formatMarrakechDate,
  canCancelBooking,
  RefundCalculation,
  BookingStatus,
  RefundStatus
} from '@/lib/booking-rules'
import type { BookingServices } from '@/lib/service-booking'
import { createEmptyBookingServices } from '@/lib/service-booking'

// Extended booking type for admin with cancellation support
interface AdminBooking {
  id: string
  guest: {
    name: string
    email: string
    phone: string
  }
  property: {
    id: string
    name: string
  }
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
  }
  extras: {
    name: string
    quantity: number
    price: number
  }[]
  pricing: {
    nightlyRate: number
    subtotal: number
    cleaningFee: number
    extras: number
    total: number
  }
  payment: {
    method: 'card' | 'paypal' | 'bank_transfer'
    status: 'pending' | 'paid' | 'refunded' | 'partial_refund'
    transactionId?: string
    captureId?: string
    paidAt?: string
  }
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'refunded' | 'partially_refunded' | 'completed'
  cancellation?: {
    cancelledAt: string
    reason?: string
    refundStatus: RefundStatus
    refundAmount?: number
    refundTransactionId?: string
    processedBy?: string
  }
  source: 'website' | 'airbnb' | 'booking' | 'manual'
  notes?: string
  services?: BookingServices // New services booking system
  createdAt: string
  updatedAt: string
}

// Date block type for manual blocking
interface DateBlock {
  id: string
  propertyId: string
  propertyName: string
  startDate: string
  endDate: string
  type: 'maintenance' | 'owner_use' | 'other'
  reason?: string
  createdAt: string
}

// Mock bookings data
const mockBookings: AdminBooking[] = [
  {
    id: 'BK001',
    guest: {
      name: 'Jean-Pierre Martin',
      email: 'jp.martin@email.com',
      phone: '+33 6 12 34 56 78',
    },
    property: { id: 'p1', name: 'Riad Jardin Secret' },
    checkIn: '2026-04-15',
    checkOut: '2026-04-19',
    nights: 4,
    guests: { adults: 2, children: 0 },
    extras: [
      { name: 'Airport Transfer (Round Trip)', quantity: 1, price: 60 },
      { name: 'Breakfast', quantity: 4, price: 60 },
    ],
    pricing: {
      nightlyRate: 450,
      subtotal: 1800,
      cleaningFee: 80,
      extras: 120,
      total: 2000,
    },
    payment: {
      method: 'paypal',
      status: 'paid',
      transactionId: 'PAYID-MXYZ123456789',
      captureId: 'CAP-123456789',
      paidAt: '2026-03-15T10:30:00Z',
    },
    status: 'confirmed',
    source: 'website',
    services: {
      bookingId: 'BK001',
      breakfasts: [
        { id: 'BF-001', bookingId: 'BK001', date: '2026-04-15', numberOfGuests: 2, pricePerPerson: 25, total: 50, status: 'confirmed', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
        { id: 'BF-002', bookingId: 'BK001', date: '2026-04-16', numberOfGuests: 2, pricePerPerson: 25, total: 50, status: 'confirmed', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
        { id: 'BF-003', bookingId: 'BK001', date: '2026-04-17', numberOfGuests: 2, pricePerPerson: 25, total: 50, status: 'pending', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
        { id: 'BF-004', bookingId: 'BK001', date: '2026-04-18', numberOfGuests: 2, pricePerPerson: 25, total: 50, status: 'pending', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
      ],
      meals: [
        { id: 'ML-001', bookingId: 'BK001', date: '2026-04-16', mealType: 'dinner', numberOfAdults: 2, numberOfChildren: 0, pricePerAdult: 60, pricePerChild: 35, total: 120, status: 'confirmed', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
      ],
      taxis: [
        { id: 'TX-001', bookingId: 'BK001', date: '2026-04-15', time: '14:30', direction: 'airport_to_property', numberOfPassengers: 2, flightNumber: 'AT823', price: 25, status: 'confirmed', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
        { id: 'TX-002', bookingId: 'BK001', date: '2026-04-19', time: '10:00', direction: 'property_to_airport', numberOfPassengers: 2, price: 25, status: 'pending', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
      ],
      otherServices: [
        { id: 'SP-001', bookingId: 'BK001', serviceType: 'spa', serviceName: 'Traditional Hammam', date: '2026-04-17', time: '15:00', numberOfAdults: 2, duration: '60min', pricePerAdult: 45, total: 90, status: 'pending', createdAt: '2026-03-15T10:30:00Z', updatedAt: '2026-03-15T10:30:00Z' },
      ],
      totalServicesAmount: 460
    },
    createdAt: '2026-03-15T10:25:00Z',
    updatedAt: '2026-03-15T10:30:00Z',
  },
  {
    id: 'BK002',
    guest: {
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+44 7700 900123',
    },
    property: { id: 'p2', name: 'Villa Palmeraie Oasis' },
    checkIn: '2026-04-20',
    checkOut: '2026-04-27',
    nights: 7,
    guests: { adults: 6, children: 2 },
    extras: [
      { name: 'Private Driver (Full Day)', quantity: 2, price: 400 },
      { name: 'Chef Service (Dinner)', quantity: 3, price: 450 },
    ],
    pricing: {
      nightlyRate: 1200,
      subtotal: 8400,
      cleaningFee: 150,
      extras: 850,
      total: 9400,
    },
    payment: {
      method: 'paypal',
      status: 'pending',
    },
    status: 'pending',
    source: 'website',
    notes: 'Guest requested late check-out if possible',
    services: {
      bookingId: 'BK002',
      breakfasts: [
        { id: 'BF-010', bookingId: 'BK002', date: '2026-04-21', numberOfGuests: 8, pricePerPerson: 25, total: 200, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
        { id: 'BF-011', bookingId: 'BK002', date: '2026-04-22', numberOfGuests: 8, pricePerPerson: 25, total: 200, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
      ],
      meals: [
        { id: 'ML-010', bookingId: 'BK002', date: '2026-04-21', mealType: 'dinner', numberOfAdults: 6, numberOfChildren: 2, pricePerAdult: 60, pricePerChild: 35, total: 430, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
        { id: 'ML-011', bookingId: 'BK002', date: '2026-04-24', mealType: 'lunch', numberOfAdults: 6, numberOfChildren: 2, pricePerAdult: 45, pricePerChild: 25, total: 320, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
      ],
      taxis: [
        { id: 'TX-010', bookingId: 'BK002', date: '2026-04-20', time: '15:00', direction: 'airport_to_property', numberOfPassengers: 8, price: 45, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
      ],
      otherServices: [
        { id: 'EX-010', bookingId: 'BK002', serviceType: 'excursion', serviceName: 'Atlas Mountains Day Trip', date: '2026-04-23', time: '08:30', numberOfAdults: 6, numberOfChildren: 2, duration: 'full_day', pricePerAdult: 85, pricePerChild: 45, total: 600, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
        { id: 'DR-010', bookingId: 'BK002', serviceType: 'driver', serviceName: 'Private Driver - Full Day', date: '2026-04-25', numberOfAdults: 8, duration: 'full_day', pricePerAdult: 150, total: 150, status: 'pending', createdAt: '2026-03-20T14:15:00Z', updatedAt: '2026-03-20T14:15:00Z' },
      ],
      totalServicesAmount: 1945
    },
    createdAt: '2026-03-20T14:15:00Z',
    updatedAt: '2026-03-20T14:15:00Z',
  },
  {
    id: 'BK003',
    guest: {
      name: 'Mohammed Al-Rashid',
      email: 'm.alrashid@email.com',
      phone: '+971 50 123 4567',
    },
    property: { id: 'p3', name: 'Riad Ambre & Epices' },
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    nights: 3,
    guests: { adults: 2, children: 0 },
    extras: [],
    pricing: {
      nightlyRate: 320,
      subtotal: 960,
      cleaningFee: 50,
      extras: 0,
      total: 1010,
    },
    payment: {
      method: 'card',
      status: 'paid',
      transactionId: 'pi_3NxABC987654321',
      paidAt: '2026-03-18T08:45:00Z',
    },
    status: 'confirmed',
    source: 'airbnb',
    createdAt: '2026-03-18T08:40:00Z',
    updatedAt: '2026-03-18T08:45:00Z',
  },
  {
    id: 'BK004',
    guest: {
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      phone: '+1 555 123 4567',
    },
    property: { id: 'p4', name: 'Apartment Hivernage Elite' },
    checkIn: '2026-04-07',
    checkOut: '2026-04-14',
    nights: 7,
    guests: { adults: 2, children: 1 },
    extras: [
      { name: 'Airport Transfer (One Way)', quantity: 1, price: 35 },
    ],
    pricing: {
      nightlyRate: 180,
      subtotal: 1260,
      cleaningFee: 40,
      extras: 35,
      total: 1335,
    },
    payment: {
      method: 'paypal',
      status: 'refunded',
      transactionId: 'PAYID-NXDEF456789012',
      captureId: 'CAP-456789012',
    },
    status: 'cancelled',
    cancellation: {
      cancelledAt: '2026-03-25T09:00:00Z',
      reason: 'Travel restrictions',
      refundStatus: 'completed',
      refundAmount: 975,
      refundTransactionId: 'REF-123456789',
      processedBy: 'Admin'
    },
    source: 'website',
    notes: 'Cancelled due to travel restrictions',
    createdAt: '2026-03-10T16:20:00Z',
    updatedAt: '2026-03-25T09:00:00Z',
  },
  {
    id: 'BK005',
    guest: {
      name: 'David Chen',
      email: 'd.chen@email.com',
      phone: '+86 138 1234 5678',
    },
    property: { id: 'p5', name: 'Villa Atlas Retreat' },
    checkIn: '2026-04-25',
    checkOut: '2026-05-02',
    nights: 7,
    guests: { adults: 4, children: 2 },
    extras: [
      { name: 'Excursion - Atlas Mountains', quantity: 6, price: 480 },
      { name: 'Breakfast', quantity: 7, price: 105 },
    ],
    pricing: {
      nightlyRate: 950,
      subtotal: 6650,
      cleaningFee: 120,
      extras: 585,
      total: 7355,
    },
    payment: {
      method: 'bank_transfer',
      status: 'paid',
      transactionId: 'BT-2026-0412-001',
      paidAt: '2026-03-28T11:00:00Z',
    },
    status: 'confirmed',
    source: 'manual',
    notes: 'VIP guest - repeat customer',
    createdAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-28T11:00:00Z',
  },
]

// Mock date blocks
const mockDateBlocks: DateBlock[] = [
  {
    id: 'DB001',
    propertyId: 'p1',
    propertyName: 'Riad Jardin Secret',
    startDate: '2026-05-01',
    endDate: '2026-05-05',
    type: 'maintenance',
    reason: 'Annual pool maintenance',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'DB002',
    propertyId: 'p2',
    propertyName: 'Villa Palmeraie Oasis',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    type: 'owner_use',
    reason: 'Owner family visit',
    createdAt: '2026-03-15T14:00:00Z',
  },
]

const statusConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'secondary', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'default', icon: CheckCircle2 },
  paid: { label: 'Paid', color: 'default', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'destructive', icon: XCircle },
  refunded: { label: 'Refunded', color: 'outline', icon: Undo2 },
  partially_refunded: { label: 'Partial Refund', color: 'outline', icon: Undo2 },
  completed: { label: 'Completed', color: 'outline', icon: CheckCircle2 },
}

const paymentStatusConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', color: 'secondary' },
  paid: { label: 'Paid', color: 'default' },
  refunded: { label: 'Refunded', color: 'destructive' },
  partial_refund: { label: 'Partial Refund', color: 'outline' },
}

const refundStatusConfig: Record<RefundStatus, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  not_applicable: { label: 'N/A', color: 'outline' },
  pending: { label: 'Pending', color: 'secondary' },
  completed: { label: 'Completed', color: 'default' },
  refused: { label: 'Refused', color: 'destructive' },
}

const sourceConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'outline' }> = {
  website: { label: 'Website', color: 'default' },
  airbnb: { label: 'Airbnb', color: 'secondary' },
  booking: { label: 'Booking.com', color: 'secondary' },
  manual: { label: 'Manual', color: 'outline' },
}

const blockTypeConfig: Record<string, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  maintenance: { label: 'Maintenance', color: 'secondary' },
  owner_use: { label: 'Owner Use', color: 'default' },
  other: { label: 'Other', color: 'outline' },
}

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'blocks'>('bookings')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  
  // Cancellation dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<AdminBooking | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [refundCalculation, setRefundCalculation] = useState<RefundCalculation | null>(null)
  const [refundOverride, setRefundOverride] = useState(false)
  const [overrideAmount, setOverrideAmount] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [isProcessingCancellation, setIsProcessingCancellation] = useState(false)
  
  // Block dates dialog state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [blockFormData, setBlockFormData] = useState({
    propertyId: '',
    startDate: '',
    endDate: '',
    type: 'maintenance' as 'maintenance' | 'owner_use' | 'other',
    reason: ''
  })

  // Manual booking dialog
  const [manualBookingOpen, setManualBookingOpen] = useState(false)

  // Filter bookings
  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesSource = sourceFilter === 'all' || booking.source === sourceFilter
    
    return matchesSearch && matchesStatus && matchesSource
  })

  // Stats
  const confirmedCount = mockBookings.filter(b => b.status === 'confirmed' || b.status === 'paid').length
  const pendingCount = mockBookings.filter(b => b.status === 'pending').length
  const cancelledCount = mockBookings.filter(b => b.status === 'cancelled').length
  const totalRevenue = mockBookings
    .filter(b => b.status !== 'cancelled' && b.payment.status === 'paid')
    .reduce((sum, b) => sum + b.pricing.total, 0)

  const openDetails = (booking: AdminBooking) => {
    setSelectedBooking(booking)
    setDetailsOpen(true)
  }

  const openCancelDialog = (booking: AdminBooking) => {
    const canCancel = canCancelBooking({ 
      status: booking.status as BookingStatus, 
      checkIn: booking.checkIn 
    })
    
    if (!canCancel.canCancel) {
      alert(canCancel.reason)
      return
    }
    
    setBookingToCancel(booking)
    setCancellationReason('')
    setRefundOverride(false)
    setOverrideAmount('')
    setOverrideReason('')
    
    // Calculate refund
    const calculation = calculateRefund(booking)
    setRefundCalculation(calculation)
    
    setCancelDialogOpen(true)
  }

  const processCancellation = async () => {
    if (!bookingToCancel || !refundCalculation) return
    
    setIsProcessingCancellation(true)
    
    try {
      // Determine final refund amount
      const finalRefundAmount = refundOverride && overrideAmount 
        ? parseFloat(overrideAmount)
        : refundCalculation.refundableAmount
      
      // In production, this would:
      // 1. Update booking status in database
      // 2. Call PayPal refund API if payment was via PayPal
      // 3. Send confirmation emails
      // 4. Update availability calendar
      
      console.log('Processing cancellation:', {
        bookingId: bookingToCancel.id,
        reason: cancellationReason,
        refundAmount: finalRefundAmount,
        override: refundOverride,
        overrideReason: overrideReason,
        paymentMethod: bookingToCancel.payment.method,
        captureId: bookingToCancel.payment.captureId
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Close dialogs and refresh
      setCancelDialogOpen(false)
      setBookingToCancel(null)
      setRefundCalculation(null)
      
      // Show success message (in production, use toast)
      alert(`Booking ${bookingToCancel.id} cancelled successfully. Refund of ${formatCurrency(finalRefundAmount)} will be processed.`)
      
    } catch (error) {
      console.error('Cancellation failed:', error)
      alert('Failed to process cancellation. Please try again.')
    } finally {
      setIsProcessingCancellation(false)
    }
  }

  const processRefund = async (booking: AdminBooking) => {
    if (!booking.payment.captureId) {
      alert('No payment capture ID found. Cannot process refund.')
      return
    }
    
    // In production, call the refund API
    console.log('Processing refund for:', booking.id)
    alert('Refund processing initiated. This would call the PayPal refund API.')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AdminLayout title="Bookings">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Cancelled</p>
            <p className="text-2xl font-bold text-red-500">{cancelledCount}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">&euro;{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'bookings' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === 'blocks' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Blocked Dates
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <>
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search bookings..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking">Booking.com</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => setManualBookingOpen(true)} className="gap-2 flex-1 sm:flex-none">
                  <Plus className="w-4 h-4" />
                  Manual Booking
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead className="hidden md:table-cell">Property</TableHead>
                      <TableHead className="hidden lg:table-cell">Check In</TableHead>
                      <TableHead className="hidden lg:table-cell">Nights</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Payment</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => {
                      const statusInfo = statusConfig[booking.status] || statusConfig.pending
                      const StatusIcon = statusInfo.icon
                      return (
                        <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(booking)}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {booking.id}
                              <Badge variant="outline" className="text-[10px] px-1">
                                {sourceConfig[booking.source].label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.guest.name}</p>
                              <p className="text-sm text-muted-foreground hidden sm:block">{booking.guest.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{booking.property.name}</TableCell>
                          <TableCell className="hidden lg:table-cell">{formatDate(booking.checkIn)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{booking.nights}</TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={paymentStatusConfig[booking.payment.status].color}>
                              {paymentStatusConfig[booking.payment.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">&euro;{booking.pricing.total.toLocaleString()}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openDetails(booking)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {booking.status === 'pending' && (
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Confirm Booking
                                  </DropdownMenuItem>
                                )}
                                {booking.cancellation?.refundStatus === 'pending' && (
                                  <DropdownMenuItem onClick={() => processRefund(booking)}>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => openCancelDialog(booking)}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} of {mockBookings.length} bookings
            </div>
          </>
        ) : (
          <>
            {/* Blocked Dates Tab */}
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Manually blocked dates for properties (maintenance, owner use, etc.)
              </p>
              <Button onClick={() => setBlockDialogOpen(true)} className="gap-2">
                <CalendarOff className="w-4 h-4" />
                Block Dates
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDateBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.propertyName}</TableCell>
                      <TableCell>{formatDate(block.startDate)}</TableCell>
                      <TableCell>{formatDate(block.endDate)}</TableCell>
                      <TableCell>
                        <Badge variant={blockTypeConfig[block.type].color}>
                          {blockTypeConfig[block.type].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{block.reason || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {/* Booking Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  Booking {selectedBooking.id}
                  <Badge variant={statusConfig[selectedBooking.status]?.color || 'secondary'}>
                    {statusConfig[selectedBooking.status]?.label || selectedBooking.status}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  View and manage booking details, services, and cancellation options.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Cancellation Info (if cancelled) */}
                {selectedBooking.cancellation && (
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-red-800 dark:text-red-200">
                      <XCircle className="w-4 h-4" />
                      Cancellation Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700 dark:text-red-300">Cancelled At</span>
                        <span>{formatDateTime(selectedBooking.cancellation.cancelledAt)}</span>
                      </div>
                      {selectedBooking.cancellation.reason && (
                        <div className="flex justify-between">
                          <span className="text-red-700 dark:text-red-300">Reason</span>
                          <span>{selectedBooking.cancellation.reason}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-red-700 dark:text-red-300">Refund Status</span>
                        <Badge variant={refundStatusConfig[selectedBooking.cancellation.refundStatus].color}>
                          {refundStatusConfig[selectedBooking.cancellation.refundStatus].label}
                        </Badge>
                      </div>
                      {selectedBooking.cancellation.refundAmount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-red-700 dark:text-red-300">Refund Amount</span>
                          <span className="font-medium">{formatCurrency(selectedBooking.cancellation.refundAmount)}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedBooking.cancellation.refundStatus === 'pending' && (
                      <Button 
                        className="w-full mt-2" 
                        size="sm"
                        onClick={() => processRefund(selectedBooking)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Process Refund
                      </Button>
                    )}
                  </div>
                )}

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Guest Information
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedBooking.guest.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${selectedBooking.guest.email}`} className="text-primary hover:underline">
                        {selectedBooking.guest.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedBooking.guest.phone}`} className="text-primary hover:underline">
                        {selectedBooking.guest.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Booking Details
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property</span>
                      <span className="font-medium">{selectedBooking.property.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">{formatDate(selectedBooking.checkIn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">{formatDate(selectedBooking.checkOut)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nights</span>
                      <span className="font-medium">{selectedBooking.nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium">
                        {selectedBooking.guests.adults} adults
                        {selectedBooking.guests.children > 0 && `, ${selectedBooking.guests.children} children`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source</span>
                      <Badge variant="outline">{sourceConfig[selectedBooking.source].label}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Pricing & Payment
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        &euro;{selectedBooking.pricing.nightlyRate} x {selectedBooking.nights} nights
                      </span>
                      <span>&euro;{selectedBooking.pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaning fee</span>
                      <span>&euro;{selectedBooking.pricing.cleaningFee}</span>
                    </div>
                    {selectedBooking.extras.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <span className="text-sm text-muted-foreground">Extras:</span>
                          {selectedBooking.extras.map((extra, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {extra.name} x{extra.quantity}
                              </span>
                              <span>&euro;{extra.price}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">&euro;{selectedBooking.pricing.total}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Payment Status</span>
                      <Badge variant={paymentStatusConfig[selectedBooking.payment.status].color}>
                        {paymentStatusConfig[selectedBooking.payment.status].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="capitalize">{selectedBooking.payment.method.replace('_', ' ')}</span>
                    </div>
                    {selectedBooking.payment.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {selectedBooking.payment.transactionId}
                        </code>
                      </div>
                    )}
                    {selectedBooking.payment.captureId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capture ID</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {selectedBooking.payment.captureId}
                        </code>
                      </div>
                    )}
                    {selectedBooking.payment.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid At</span>
                        <span>{formatDateTime(selectedBooking.payment.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booked Services */}
                {selectedBooking.services && (
                  selectedBooking.services.breakfasts.length > 0 ||
                  selectedBooking.services.meals.length > 0 ||
                  selectedBooking.services.taxis.length > 0 ||
                  selectedBooking.services.otherServices.length > 0
                ) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Booked Services</h3>
                      <BookingServicesView
                        services={selectedBooking.services}
                        checkIn={selectedBooking.checkIn}
                        checkOut={selectedBooking.checkOut}
                        readOnly={false}
                      />
                    </div>
                  </>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Notes</h3>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm">{selectedBooking.notes}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                  <p>Created: {formatDateTime(selectedBooking.createdAt)}</p>
                  <p>Last updated: {formatDateTime(selectedBooking.updatedAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedBooking.status === 'pending' && (
                    <Button className="flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </Button>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'refunded' && (
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'refunded' && (
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setDetailsOpen(false)
                        openCancelDialog(selectedBooking)
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Cancellation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              {bookingToCancel && (
                <>Cancel booking {bookingToCancel.id} for {bookingToCancel.guest.name}</>
              )}
            </DialogDescription>
          </DialogHeader>

          {refundCalculation && (
            <div className="space-y-4">
              {/* Refund Calculation Summary */}
              <div className={`rounded-lg p-4 space-y-2 ${
                refundCalculation.isWithinFreeCancellation 
                  ? 'bg-green-50 dark:bg-green-950/20' 
                  : 'bg-red-50 dark:bg-red-950/20'
              }`}>
                <h4 className={`font-medium ${
                  refundCalculation.isWithinFreeCancellation
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {refundCalculation.isWithinFreeCancellation 
                    ? 'Partial Refund Available' 
                    : 'No Refund (Late Cancellation)'}
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Days until check-in</span>
                    <span className="font-medium">{refundCalculation.daysUntilCheckIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights booked</span>
                    <span className="font-medium">{refundCalculation.nightsBooked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights retained</span>
                    <span className="font-medium">{refundCalculation.nightsRetained}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span>Original amount</span>
                    <span>{formatCurrency(refundCalculation.originalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount retained</span>
                    <span>{formatCurrency(refundCalculation.amountRetained)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2">
                    <span>Refundable amount</span>
                    <span className="text-primary">{formatCurrency(refundCalculation.refundableAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="space-y-2">
                <Label>Cancellation Reason</Label>
                <Textarea
                  placeholder="Enter reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Refund Override */}
              <div className="space-y-3 p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="refundOverride"
                    checked={refundOverride}
                    onChange={(e) => setRefundOverride(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="refundOverride" className="cursor-pointer">
                    Override refund amount
                  </Label>
                </div>

                {refundOverride && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-2">
                      <Label>Custom Refund Amount (EUR)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={overrideAmount}
                        onChange={(e) => setOverrideAmount(e.target.value)}
                        min="0"
                        max={refundCalculation.originalAmount}
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Override Reason</Label>
                      <Textarea
                        placeholder="Explain why you're overriding the calculated refund..."
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              disabled={isProcessingCancellation}
            >
              Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={processCancellation}
              disabled={isProcessingCancellation}
            >
              {isProcessingCancellation ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Dates Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block Dates</DialogTitle>
            <DialogDescription>
              Block dates for a property (maintenance, owner use, etc.)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select 
                value={blockFormData.propertyId} 
                onValueChange={(v) => setBlockFormData(prev => ({ ...prev, propertyId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p1">Riad Jardin Secret</SelectItem>
                  <SelectItem value="p2">Villa Palmeraie Oasis</SelectItem>
                  <SelectItem value="p3">Riad Ambre & Epices</SelectItem>
                  <SelectItem value="p4">Apartment Hivernage Elite</SelectItem>
                  <SelectItem value="p5">Villa Atlas Retreat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={blockFormData.startDate}
                  onChange={(e) => setBlockFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={blockFormData.endDate}
                  onChange={(e) => setBlockFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Block Type</Label>
              <Select 
                value={blockFormData.type} 
                onValueChange={(v: 'maintenance' | 'owner_use' | 'other') => setBlockFormData(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="owner_use">Owner Use</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Enter reason for blocking..."
                value={blockFormData.reason}
                onChange={(e) => setBlockFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              <CalendarOff className="w-4 h-4 mr-2" />
              Block Dates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Booking Dialog (placeholder) */}
      <Dialog open={manualBookingOpen} onOpenChange={setManualBookingOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Manual Booking</DialogTitle>
            <DialogDescription>
              Create a booking manually for phone reservations or special arrangements
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <p>Manual booking form would go here.</p>
            <p className="text-sm">This would include guest details, property selection, dates, pricing, etc.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManualBookingOpen(false)}>
              Cancel
            </Button>
            <Button>
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
