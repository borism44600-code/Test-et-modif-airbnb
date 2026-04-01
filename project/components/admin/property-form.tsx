'use client'

import { useState } from 'react'
import { Bed, Users, Sofa, Bath, Save, X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Property, PropertyType, BEDROOM_OPTIONS, GUEST_CAPACITY_OPTIONS,
  SleepingSpace, BedType, BED_TYPE_LABELS, BathroomType, BATHROOM_TYPE_LABELS
} from '@/lib/types'

interface PropertyFormProps {
  property?: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Partial<Property>) => void
}

export function PropertyForm({ property, open, onOpenChange, onSave }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    type: property?.type || 'riad' as PropertyType,
    shortDescription: property?.shortDescription || '',
    pricePerNight: property?.pricePerNight || 0,
    numberOfBedrooms: property?.numberOfBedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    bedroomGuestCapacity: property?.bedroomGuestCapacity || 2,
    additionalGuestCapacity: property?.additionalGuestCapacity || 0,
    totalGuestCapacity: property?.totalGuestCapacity || 2,
  })

  const [sleepingArrangements, setSleepingArrangements] = useState<SleepingSpace[]>(
    property?.sleepingArrangements || []
  )

  const addRoom = () => {
    const newRoom: SleepingSpace = {
      roomName: `Bedroom ${sleepingArrangements.filter(r => r.roomType === 'bedroom').length + 1}`,
      roomType: 'bedroom',
      beds: [{ type: 'double', quantity: 1 }],
      ensuite: false
    }
    setSleepingArrangements([...sleepingArrangements, newRoom])
  }

  const addLivingRoom = () => {
    const newRoom: SleepingSpace = {
      roomName: 'Living Room',
      roomType: 'living-room',
      beds: [{ type: 'sofa-bed-double', quantity: 1 }],
      notes: 'Additional sleeping space'
    }
    setSleepingArrangements([...sleepingArrangements, newRoom])
  }

  const removeRoom = (index: number) => {
    setSleepingArrangements(sleepingArrangements.filter((_, i) => i !== index))
  }

  const updateRoom = (index: number, updates: Partial<SleepingSpace>) => {
    setSleepingArrangements(sleepingArrangements.map((room, i) => 
      i === index ? { ...room, ...updates } : room
    ))
  }

  const addBedToRoom = (roomIndex: number) => {
    const room = sleepingArrangements[roomIndex]
    updateRoom(roomIndex, {
      beds: [...room.beds, { type: 'single', quantity: 1 }]
    })
  }

  const removeBedFromRoom = (roomIndex: number, bedIndex: number) => {
    const room = sleepingArrangements[roomIndex]
    updateRoom(roomIndex, {
      beds: room.beds.filter((_, i) => i !== bedIndex)
    })
  }

  const updateBed = (roomIndex: number, bedIndex: number, updates: Partial<{ type: BedType; quantity: number }>) => {
    const room = sleepingArrangements[roomIndex]
    updateRoom(roomIndex, {
      beds: room.beds.map((bed, i) => i === bedIndex ? { ...bed, ...updates } : bed)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      sleepingArrangements: sleepingArrangements.length > 0 ? sleepingArrangements : undefined
    })
    onOpenChange(false)
  }

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
<DialogTitle className="text-xl font-semibold">
  {property ? 'Edit Property' : 'Add New Property'}
  </DialogTitle>
  <DialogDescription>
  {property ? 'Update the property details below.' : 'Fill in the property details to add a new listing.'}
  </DialogDescription>
  </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Riad Jardin Secret"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="type">Property Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => updateField('type', value as PropertyType)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riad">Riad</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price per Night (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.pricePerNight}
                  onChange={(e) => updateField('pricePerNight', parseInt(e.target.value) || 0)}
                  className="mt-1.5"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.shortDescription}
                  onChange={(e) => updateField('shortDescription', e.target.value)}
                  placeholder="Brief description of the property..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Room Configuration */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Room Configuration
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="numberOfBedrooms" className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-primary" />
                  Number of Bedrooms
                </Label>
                <Select
                  value={formData.numberOfBedrooms.toString()}
                  onValueChange={(value) => updateField('numberOfBedrooms', parseInt(value))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BEDROOM_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms" className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-primary" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.bathrooms}
                  onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 1)}
                  className="mt-1.5"
                />
              </div>

              </div>
          </div>

          {/* Guest Capacity */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Guest Capacity
            </h3>
            <p className="text-sm text-muted-foreground -mt-2">
              Specify how many guests can be accommodated in different sleeping areas
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/30 rounded-xl p-4">
                <Label htmlFor="bedroomGuestCapacity" className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bed className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="block font-medium">Bedroom Guests</span>
                    <span className="text-xs text-muted-foreground">In bedrooms only</span>
                  </div>
                </Label>
                <Select
                  value={formData.bedroomGuestCapacity.toString()}
                  onValueChange={(value) => {
                    const bedroomCapacity = parseInt(value)
                    updateField('bedroomGuestCapacity', bedroomCapacity)
                    updateField('totalGuestCapacity', bedroomCapacity + formData.additionalGuestCapacity)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_CAPACITY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4">
                <Label htmlFor="additionalGuestCapacity" className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Sofa className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block font-medium">Additional Guests</span>
                    <span className="text-xs text-muted-foreground">Sofa beds, etc.</span>
                  </div>
                </Label>
                <Select
                  value={formData.additionalGuestCapacity.toString()}
                  onValueChange={(value) => {
                    const additionalCapacity = parseInt(value)
                    updateField('additionalGuestCapacity', additionalCapacity)
                    updateField('totalGuestCapacity', formData.bedroomGuestCapacity + additionalCapacity)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">1 guest</SelectItem>
                    <SelectItem value="2">2 guests</SelectItem>
                    <SelectItem value="3">3 guests</SelectItem>
                    <SelectItem value="4">4 guests</SelectItem>
                    <SelectItem value="5">5 guests</SelectItem>
                    <SelectItem value="6">6 guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <Label htmlFor="totalGuestCapacity" className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="block font-medium">Total Capacity</span>
                    <span className="text-xs text-muted-foreground">Auto-calculated</span>
                  </div>
                </Label>
                <div className="text-2xl font-semibold text-primary">
                  {formData.totalGuestCapacity} guests
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  = {formData.bedroomGuestCapacity} (bedrooms) + {formData.additionalGuestCapacity} (additional)
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sleeping Arrangements */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Detailed Sleeping Arrangements
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Specify beds in each room (displayed on property page)
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={addRoom}>
                  <Plus className="w-3 h-3 mr-1" />
                  Bedroom
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addLivingRoom}>
                  <Plus className="w-3 h-3 mr-1" />
                  Living Room
                </Button>
              </div>
            </div>

            {sleepingArrangements.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg">
                <Bed className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No sleeping arrangements defined yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add bedrooms and living rooms to specify beds in each space.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sleepingArrangements.map((room, roomIndex) => (
                  <div 
                    key={roomIndex}
                    className="bg-secondary/30 rounded-xl p-4 border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {room.roomType === 'bedroom' ? (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bed className="w-4 h-4 text-primary" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                            <Sofa className="w-4 h-4 text-gold" />
                          </div>
                        )}
                        <div>
                          <Input
                            value={room.roomName}
                            onChange={(e) => updateRoom(roomIndex, { roomName: e.target.value })}
                            className="h-7 text-sm font-medium bg-transparent border-none px-0 focus-visible:ring-0"
                            placeholder="Room name"
                          />
{room.roomType === 'bedroom' && (
                          <div className="flex items-center gap-3 mt-1">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={room.ensuite || false}
                                onChange={(e) => updateRoom(roomIndex, { 
                                  ensuite: e.target.checked,
                                  bathroomType: e.target.checked ? 'shower' : undefined
                                })}
                                className="rounded border-border"
                              />
                              <span className="text-xs text-muted-foreground">Ensuite</span>
                            </label>
                            {room.ensuite && (
                              <Select
                                value={room.bathroomType || 'shower'}
                                onValueChange={(value) => updateRoom(roomIndex, { bathroomType: value as BathroomType })}
                              >
                                <SelectTrigger className="h-6 text-xs w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(BATHROOM_TYPE_LABELS).filter(([key]) => key !== 'none').map(([value, label]) => (
                                    <SelectItem key={value} value={value} className="text-xs">
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        )}
                        </div>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRoom(roomIndex)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Beds */}
                    <div className="space-y-2 ml-11">
                      {room.beds.map((bed, bedIndex) => (
                        <div key={bedIndex} className="flex items-center gap-2">
                          <Select
                            value={bed.type}
                            onValueChange={(value) => updateBed(roomIndex, bedIndex, { type: value as BedType })}
                          >
                            <SelectTrigger className="h-8 text-xs flex-1">
                              <SelectValue placeholder="Bed type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(BED_TYPE_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value} className="text-xs">
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={bed.quantity.toString()}
                            onValueChange={(value) => updateBed(roomIndex, bedIndex, { quantity: parseInt(value) })}
                          >
                            <SelectTrigger className="h-8 text-xs w-16">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                          {room.beds.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeBedFromRoom(roomIndex, bedIndex)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground"
                        onClick={() => addBedToRoom(roomIndex)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add bed
                      </Button>
                    </div>

                    {/* Notes for living room */}
                    {room.roomType === 'living-room' && (
                      <div className="ml-11 mt-3">
                        <Input
                          value={room.notes || ''}
                          onChange={(e) => updateRoom(roomIndex, { notes: e.target.value })}
                          placeholder="Notes (e.g., 'Additional sleeping space')"
                          className="h-7 text-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-gold text-black hover:bg-gold/90">
              <Save className="w-4 h-4 mr-2" />
              {property ? 'Save Changes' : 'Create Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
