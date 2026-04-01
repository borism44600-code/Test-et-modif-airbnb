'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Calendar,
  Building2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { mockProperties } from '@/lib/data'
import { AdminLayout } from '@/components/admin/admin-layout'

const stats = [
  {
    label: 'Total Revenue',
    value: '124,500',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Active Bookings',
    value: '23',
    change: '+4',
    trend: 'up',
    icon: Calendar,
  },
  {
    label: 'Properties Listed',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Building2,
  },
  {
    label: 'Partner Inquiries',
    value: '48',
    change: '+15%',
    trend: 'up',
    icon: Users,
  },
]

const recentBookings = [
  {
    id: 'BK001',
    guest: 'Jean-Pierre Martin',
    property: 'Riad Yasmine',
    checkIn: '2026-04-01',
    checkOut: '2026-04-05',
    status: 'confirmed',
    total: '1,200',
  },
  {
    id: 'BK002',
    guest: 'Sarah Williams',
    property: 'Villa Atlas',
    checkIn: '2026-04-03',
    checkOut: '2026-04-10',
    status: 'pending',
    total: '3,500',
  },
  {
    id: 'BK003',
    guest: 'Mohammed Al-Rashid',
    property: 'Riad Lotus',
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    status: 'confirmed',
    total: '900',
  },
  {
    id: 'BK004',
    guest: 'Emma Thompson',
    property: 'Apartment Gueliz',
    checkIn: '2026-04-07',
    checkOut: '2026-04-14',
    status: 'cancelled',
    total: '1,050',
  },
]

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead className="hidden md:table-cell">Property</TableHead>
                  <TableHead className="hidden lg:table-cell">Check In</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.guest}</TableCell>
                    <TableCell className="hidden md:table-cell">{booking.property}</TableCell>
                    <TableCell className="hidden lg:table-cell">{booking.checkIn}</TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'confirmed' ? 'default' :
                        booking.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{booking.total}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Properties</h2>
            <Link href="/admin/properties">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {mockProperties.slice(0, 4).map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{property.title}</p>
                  <p className="text-sm text-muted-foreground">{property.location.district}</p>
                  <p className="text-sm font-semibold text-primary">{property.pricePerNight}/night</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          <div className="p-4 pt-0">
            <Link href="/admin/properties">
              <Button variant="outline" className="w-full">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
