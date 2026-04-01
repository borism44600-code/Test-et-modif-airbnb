'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { createPartnerAction, updatePartnerAction, deletePartnerAction } from '@/app/admin/actions'

interface Partner {
  id: string
  name: string
  category: string
  description_short?: string
  description_long?: string
  area?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  booking_url?: string
  image_url?: string
  rating?: number
  price_range?: string
  tags?: string[]
  featured?: boolean
  status: string
  created_at?: string
}

interface PartnersAdminProps {
  initialPartners: Partner[]
}

const categoryLabels: Record<string, string> = {
  restaurant: 'Restaurant',
  spa: 'Spa & Wellness',
  tour: 'Tours & Excursions',
  activity: 'Activities',
  transport: 'Transport',
  driver: 'Private Driver',
  other: 'Other Services',
}

const categoryOptions = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'spa', label: 'Spa & Wellness' },
  { value: 'tour', label: 'Tours & Excursions' },
  { value: 'activity', label: 'Activities' },
  { value: 'transport', label: 'Transport' },
  { value: 'driver', label: 'Private Driver' },
  { value: 'other', label: 'Other Services' },
]

export function PartnersAdmin({ initialPartners }: PartnersAdminProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    description_short: '',
    description_long: '',
    area: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    booking_url: '',
    image_url: '',
    price_range: '',
    status: 'draft',
    featured: false,
  })

  // Filter partners
  const filteredPartners = initialPartners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.description_short || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || partner.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const openAddForm = () => {
    setEditingPartner(null)
    setFormData({
      name: '',
      category: 'restaurant',
      description_short: '',
      description_long: '',
      area: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      booking_url: '',
      image_url: '',
      price_range: '',
      status: 'draft',
      featured: false,
    })
    setFormOpen(true)
  }

  const openEditForm = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      category: partner.category,
      description_short: partner.description_short || '',
      description_long: partner.description_long || '',
      area: partner.area || '',
      address: partner.address || '',
      phone: partner.phone || '',
      email: partner.email || '',
      website: partner.website || '',
      booking_url: partner.booking_url || '',
      image_url: partner.image_url || '',
      price_range: partner.price_range || '',
      status: partner.status,
      featured: partner.featured || false,
    })
    setFormOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      if (editingPartner) {
        await updatePartnerAction(editingPartner.id, formData)
      } else {
        await createPartnerAction({
          ...formData,
          status: formData.status as 'draft' | 'published' | 'archived'
        })
      }
      
      setFormOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('Failed to save partner. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    startTransition(async () => {
      try {
        await deletePartnerAction(deleteId)
        router.refresh()
      } catch (error) {
        console.error('Failed to delete partner:', error)
      } finally {
        setDeleteId(null)
      }
    })
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AdminLayout title="Partners & Activities">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">{initialPartners.length}</div>
            <div className="text-sm text-muted-foreground">Total Partners</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">
              {initialPartners.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">
              {initialPartners.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">
              {new Set(initialPartners.map(p => p.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search partners..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openAddForm} className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Partner
          </Button>
        </div>

        {/* Partners Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Area</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery || categoryFilter !== 'all' 
                        ? 'No partners match your filters' 
                        : 'No partners yet. Add your first partner!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            {partner.image_url ? (
                              <Image
                                src={partner.image_url}
                                alt={partner.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{partner.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {partner.description_short}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {categoryLabels[partner.category] || partner.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {partner.area || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {partner.phone || partner.email || partner.website || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={partner.status === 'published' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditForm(partner)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {partner.website && (
                              <DropdownMenuItem asChild>
                                <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visit Website
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setDeleteId(partner.id)}
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
          Showing {filteredPartners.length} of {initialPartners.length} partners
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? 'Edit Partner' : 'Add New Partner'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., La Mamounia Restaurant"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Textarea
                id="shortDesc"
                value={formData.description_short}
                onChange={(e) => updateField('description_short', e.target.value)}
                placeholder="Brief description..."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullDesc">Full Description</Label>
              <Textarea
                id="fullDesc"
                value={formData.description_long}
                onChange={(e) => updateField('description_long', e.target.value)}
                placeholder="Detailed description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Area/District</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  placeholder="e.g., Medina, Gueliz"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  value={formData.price_range}
                  onChange={(e) => updateField('price_range', e.target.value)}
                  placeholder="e.g., $$$, 50-100 EUR"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Full address..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+212..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bookingUrl">Booking URL</Label>
                <Input
                  id="bookingUrl"
                  value={formData.booking_url}
                  onChange={(e) => updateField('booking_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured Partner</Label>
                <p className="text-sm text-muted-foreground">Show prominently on the site</p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => updateField('featured', v)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.name}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Partner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this partner? This action cannot be undone.
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
    </AdminLayout>
  )
}
