'use client'

import { useState, useEffect } from 'react'
import {
  DollarSign,
  Percent,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  Save,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { AdminLayout } from '@/components/admin/admin-layout'
import { fetchPublishedPropertiesClient, fetchServicesClient } from '@/lib/data-fetcher-client'
import type { UiProperty } from '@/lib/adapters/property-adapter'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface ServiceItem {
  id: string
  name: string
  category: string
  description: string
  image: string
  price?: number
  priceType?: string
}

export default function AdminPricingPage() {
  const [properties, setProperties] = useState<UiProperty[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false)
  const [extraDialogOpen, setExtraDialogOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    fetchPublishedPropertiesClient().then(props => {
      setProperties(props)
      if (props.length > 0 && !selectedProperty) {
        setSelectedProperty(props[0].id)
      }
      setLoadingProperties(false)
    })
    fetchServicesClient().then(data => {
      setServices(data)
      setLoadingServices(false)
    })
  }, [])

  // Monthly prices for the selected property (initially empty)
  const [monthlyPrices, setMonthlyPrices] = useState<Record<number, number>>({})

  // Load selected property's base price into all months when property changes
  useEffect(() => {
    const prop = properties.find(p => p.id === selectedProperty)
    if (prop) {
      const base = prop.pricePerNight || 0
      const prices: Record<number, number> = {}
      for (let i = 1; i <= 12; i++) prices[i] = base
      setMonthlyPrices(prices)
    } else {
      setMonthlyPrices({})
    }
  }, [selectedProperty, properties])

  // Group services by category
  const servicesByCategory = services.reduce<Record<string, ServiceItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <AdminLayout title="Pricing & Extras">
      <Tabs defaultValue="monthly" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Pricing</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Rules</TabsTrigger>
            <TabsTrigger value="extras">Extras & Services</TabsTrigger>
          </TabsList>

          {properties.length > 0 && (
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Monthly Pricing Tab */}
        <TabsContent value="monthly" className="space-y-6">
          {loadingProperties ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <DollarSign className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No properties to price</p>
              <p className="text-sm text-muted-foreground mt-1">Add a property first, then set its monthly pricing here.</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => setCurrentYear(y => y - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">{currentYear}</h2>
                  <Button variant="outline" size="icon" onClick={() => setCurrentYear(y => y + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {months.map((month, index) => (
                  <div key={month} className="space-y-2">
                    <Label className="text-sm font-medium">{month}</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={monthlyPrices[index + 1] || ''}
                        onChange={(e) => setMonthlyPrices(prev => ({
                          ...prev,
                          [index + 1]: parseInt(e.target.value) || 0
                        }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Base price per night</p>
                  <p>These monthly prices serve as the base rate. Seasonal rules and special periods will apply adjustments on top of these base prices.</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Seasonal Rules Tab */}
        <TabsContent value="seasonal" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Create pricing rules for specific date ranges
            </p>
            <Button className="gap-2" onClick={() => setSeasonDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Season
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No seasonal rules defined</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add seasonal pricing rules to automatically adjust rates for peak seasons, holidays, and special periods.
            </p>
          </div>
        </TabsContent>

        {/* Extras & Services Tab */}
        <TabsContent value="extras" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Manage additional services and extras guests can book
            </p>
            <Button className="gap-2" onClick={() => setExtraDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Extra
            </Button>
          </div>

          {loadingServices ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No extras or services yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add services like airport transfers, private chef, hammam sessions, etc. that guests can book alongside their stay.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {Object.entries(servicesByCategory).map(([category, items]) => (
                <div key={category} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold capitalize mb-4">{category}</h3>
                  <div className="grid gap-3">
                    {items.map(extra => (
                      <div
                        key={extra.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{extra.name}</p>
                          <p className="text-sm text-muted-foreground">{extra.priceType || 'flat fee'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">{extra.price || 0}€</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Season Dialog */}
      <Dialog open={seasonDialogOpen} onOpenChange={setSeasonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Seasonal Pricing</DialogTitle>
            <DialogDescription>Define pricing adjustments for specific date ranges.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Season Name</Label>
              <Input placeholder="e.g., Summer Peak" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" className="mt-1.5" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Adjustment Type</Label>
                <Select defaultValue="increase">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase</SelectItem>
                    <SelectItem value="decrease">Decrease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Percentage</Label>
                <div className="relative mt-1.5">
                  <Input type="number" placeholder="20" />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeasonDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setSeasonDialogOpen(false)}>Save Season</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Extra Dialog */}
      <Dialog open={extraDialogOpen} onOpenChange={setExtraDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Extra Service</DialogTitle>
            <DialogDescription>Add a new service or extra that guests can book.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Name</Label>
              <Input placeholder="e.g., Airport Transfer" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (€)</Label>
                <Input type="number" placeholder="50" className="mt-1.5" />
              </div>
              <div>
                <Label>Unit</Label>
                <Select defaultValue="flat">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat fee</SelectItem>
                    <SelectItem value="person">Per person</SelectItem>
                    <SelectItem value="trip">Per trip</SelectItem>
                    <SelectItem value="session">Per session</SelectItem>
                    <SelectItem value="day">Per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select defaultValue="service">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtraDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setExtraDialogOpen(false)}>Save Extra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
