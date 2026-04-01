'use client'

import { useState } from 'react'
import { 
  Calendar, 
  DollarSign, 
  Percent, 
  Plus, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { mockProperties } from '@/lib/data'
import { cn } from '@/lib/utils'

// Mock seasonal pricing
const seasonalPricing = [
  { id: '1', name: 'Peak Season', startDate: '2026-06-15', endDate: '2026-08-31', adjustment: 30, type: 'increase' },
  { id: '2', name: 'Christmas & New Year', startDate: '2026-12-20', endDate: '2027-01-05', adjustment: 50, type: 'increase' },
  { id: '3', name: 'Low Season', startDate: '2026-01-15', endDate: '2026-03-15', adjustment: 20, type: 'decrease' },
  { id: '4', name: 'Ramadan Special', startDate: '2026-03-01', endDate: '2026-03-30', adjustment: 15, type: 'decrease' },
]

// Mock extras
const extras = [
  { id: '1', name: 'Airport Transfer', price: 35, unit: 'per trip', category: 'transport' },
  { id: '2', name: 'Private Chef - Breakfast', price: 25, unit: 'per person', category: 'dining' },
  { id: '3', name: 'Private Chef - Dinner', price: 50, unit: 'per person', category: 'dining' },
  { id: '4', name: 'Hammam Session', price: 40, unit: 'per person', category: 'wellness' },
  { id: '5', name: 'Massage - 60min', price: 60, unit: 'per session', category: 'wellness' },
  { id: '6', name: 'Cooking Class', price: 75, unit: 'per person', category: 'activity' },
  { id: '7', name: 'Day Trip - Essaouira', price: 150, unit: 'per vehicle', category: 'activity' },
  { id: '8', name: 'Day Trip - Atlas Mountains', price: 120, unit: 'per vehicle', category: 'activity' },
  { id: '9', name: 'Early Check-in', price: 50, unit: 'flat fee', category: 'service' },
  { id: '10', name: 'Late Check-out', price: 50, unit: 'flat fee', category: 'service' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminPricingPage() {
  const [selectedProperty, setSelectedProperty] = useState(mockProperties[0]?.id || '')
  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false)
  const [extraDialogOpen, setExtraDialogOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(2026)

  // Monthly prices for the selected property
  const [monthlyPrices, setMonthlyPrices] = useState<Record<number, number>>({
    1: 350, 2: 350, 3: 380, 4: 400, 5: 420, 6: 450,
    7: 500, 8: 500, 9: 450, 10: 420, 11: 380, 12: 450
  })

  const property = mockProperties.find(p => p.id === selectedProperty)

  return (
    <AdminLayout title="Pricing & Extras">
      <Tabs defaultValue="monthly" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Pricing</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Rules</TabsTrigger>
            <TabsTrigger value="extras">Extras & Services</TabsTrigger>
          </TabsList>

          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {mockProperties.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Pricing Tab */}
        <TabsContent value="monthly" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentYear(y => y - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">{currentYear}</h2>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setCurrentYear(y => y + 1)}
                >
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

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Season Name</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Adjustment</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasonalPricing.map(season => (
                  <TableRow key={season.id}>
                    <TableCell className="font-medium">{season.name}</TableCell>
                    <TableCell>
                      {new Date(season.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(season.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={season.type === 'increase' ? 'default' : 'secondary'}>
                        {season.type === 'increase' ? '+' : '-'}{season.adjustment}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">All properties</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

          <div className="grid gap-6">
            {['transport', 'dining', 'wellness', 'activity', 'service'].map(category => {
              const categoryExtras = extras.filter(e => e.category === category)
              if (categoryExtras.length === 0) return null
              
              return (
                <div key={category} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold capitalize mb-4">{category}</h3>
                  <div className="grid gap-3">
                    {categoryExtras.map(extra => (
                      <div 
                        key={extra.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{extra.name}</p>
                          <p className="text-sm text-muted-foreground">{extra.unit}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">{extra.price}€</span>
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
              )
            })}
          </div>
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
