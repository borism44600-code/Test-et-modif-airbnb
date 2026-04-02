'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  Calendar,
  Building2,
  Users,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchPublishedPropertiesClient } from '@/lib/data-fetcher-client'
import type { UiProperty } from '@/lib/adapters/property-adapter'
import { AdminLayout } from '@/components/admin/admin-layout'

export default function AdminDashboard() {
  const [properties, setProperties] = useState<UiProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedPropertiesClient()
      .then(setProperties)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid — real counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">{loading ? '...' : properties.length}</p>
          <p className="text-sm text-muted-foreground">Properties Listed</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">Active Bookings</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">Partner Inquiries</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">Pending Messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings — empty until real bookings exist */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-12 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Bookings will appear here once guests start reserving your properties.
            </p>
          </div>
        </div>

        {/* Properties Overview */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Properties</h2>
            <Link href="/admin/properties/new">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-2 animate-pulse">
                    <div className="w-16 h-16 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No properties yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add your first property to get started.
                </p>
                <Link href="/admin/properties/new">
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Button>
                </Link>
              </div>
            ) : (
              properties.slice(0, 4).map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={property.images[0] || '/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.location.district}</p>
                    <p className="text-sm font-semibold text-primary">{property.pricePerNight}€/night</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/properties/${property.slug}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
          {properties.length > 0 && (
            <div className="p-4 pt-0">
              <Link href="/admin/properties">
                <Button variant="outline" className="w-full">
                  View All Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
