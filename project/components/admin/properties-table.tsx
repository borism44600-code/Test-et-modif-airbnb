'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Bed,
  Users,
  Sofa,
  Copy,
  Archive,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deletePropertyAction } from '@/app/admin/actions'

interface Property {
  id: string
  title: string
  slug: string
  type: string
  city: string
  district?: string
  num_bedrooms: number
  num_bathrooms: number
  bedroom_guest_capacity?: number
  additional_guest_capacity?: number
  total_guest_capacity: number
  price_per_night: number
  status: string
  featured?: boolean
  property_images?: {
    id: string
    image_url: string
    is_cover: boolean
  }[]
}

interface PropertiesTableProps {
  properties: Property[]
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (property.district?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCoverImage = (property: Property) => {
    const coverImage = property.property_images?.find(img => img.is_cover)
    return coverImage?.image_url || property.property_images?.[0]?.image_url || '/placeholder-property.jpg'
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    startTransition(async () => {
      try {
        await deletePropertyAction(deleteId)
        router.refresh()
      } catch (error) {
        console.error('Failed to delete property:', error)
      } finally {
        setDeleteId(null)
      }
    })
  }

  const getStatusBadge = (status: string, featured?: boolean) => {
    if (status === 'published') {
      return <Badge variant="default" className="bg-green-600">{featured ? 'Featured' : 'Published'}</Badge>
    }
    if (status === 'draft') {
      return <Badge variant="secondary">Draft</Badge>
    }
    return <Badge variant="outline">Archived</Badge>
  }

  return (
    <>
      {/* Search */}
      <div className="relative w-full sm:w-auto mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search properties..." 
          className="pl-10 w-full sm:w-80"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Properties Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Rooms</TableHead>
                <TableHead className="hidden xl:table-cell">Capacity</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No properties match your search' : 'No properties yet. Add your first property!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={getCoverImage(property)}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{property.title}</p>
                          <p className="text-sm text-muted-foreground truncate md:hidden">
                            {property.district || property.city}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {property.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {property.district || property.city}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="w-3.5 h-3.5 text-muted-foreground" />
                        {property.num_bedrooms}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1" title="Bedroom guests">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          {property.bedroom_guest_capacity || property.total_guest_capacity}
                        </span>
                        {(property.additional_guest_capacity || 0) > 0 && (
                          <span className="flex items-center gap-1 text-muted-foreground" title="Additional guests">
                            <Sofa className="w-3.5 h-3.5" />
                            +{property.additional_guest_capacity}
                          </span>
                        )}
                        <span className="font-medium text-primary" title="Total capacity">
                          = {property.total_guest_capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      &euro;{property.price_per_night}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(property.status, property.featured)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/properties/${property.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View Public Page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/properties/${property.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteId(property.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProperties.length} of {properties.length} properties
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
              All associated images, rooms, and availability data will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
