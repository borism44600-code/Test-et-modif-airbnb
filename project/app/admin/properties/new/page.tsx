'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Eye, Bed, Users, Sofa, Bath, Plus, Trash2,
  MapPin, DollarSign, Image as ImageIcon, Globe, Settings2, Car
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ImageUploader } from '@/components/admin/image-uploader'
import { createPropertyAction } from '@/app/admin/actions'
import { 
  PropertyType, PropertyStatus, BEDROOM_OPTIONS, GUEST_CAPACITY_OPTIONS,
  SleepingSpace, BedType, BED_TYPE_LABELS, BathroomType, BATHROOM_TYPE_LABELS,
  MAIN_DISTRICTS, MEDINA_DISTRICTS, KASBAH_DISTRICTS, APARTMENT_DISTRICTS,
  PARKING_OPTIONS, FEATURE_LABELS, PropertyFeatures
} from '@/lib/types'

const defaultFeatures: PropertyFeatures = {
  heatedPool: false,
  unheatedPool: false,
  heatedPlungePool: false,
  unheatedPlungePool: false,
  jacuzzi: false,
  hammam: false,
  bathtub: false,
  fireplace: false,
  terrace: false,
  rooftop: false,
  privateTerminate: false,
  wifi: true,
  airConditioning: true,
  breakfastPossible: false,
  mealsPossible: false,
  airportTransferPossible: false,
  privateDriverPossible: false,
  excursionsPossible: false,
  gasStove: false,
  washingMachine: false,
  iron: false,
  dishwasher: false,
  oven: false,
  coffeeMachine: false,
  fridge: false,
  mountainView: false,
  koutboubiaView: false,
  mouleyYazidView: false,
  monumentsView: false,
  souks: false,
}

interface FormSection {
  id: string
  title: string
  icon: React.ElementType
}

const sections: FormSection[] = [
  { id: 'general', title: 'General Identity', icon: Settings2 },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'capacity', title: 'Capacity & Rooms', icon: Bed },
  { id: 'pricing', title: 'Pricing', icon: DollarSign },
  { id: 'amenities', title: 'Amenities & Features', icon: Settings2 },
  { id: 'parking', title: 'Parking', icon: Car },
  { id: 'sync', title: 'Booking Sync', icon: Globe },
  { id: 'seo', title: 'SEO', icon: Globe },
  { id: 'media', title: 'Media', icon: ImageIcon },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // General
    title: '',
    slug: '',
    type: 'riad' as PropertyType,
    subtitle: '',
    shortDescription: '',
    description: '',
    status: 'draft' as PropertyStatus,
    
    // Location
    city: 'Marrakech',
    district: '',
    subDistrict: '',
    address: '',
    mapLocation: '',
    nearbyInfo: '',
    
    // Capacity
    numberOfBedrooms: 1,
    bathrooms: 1,
    bedroomGuestCapacity: 2,
    additionalGuestCapacity: 0,
    totalGuestCapacity: 2,
    
    // Pricing
    pricePerNight: 0,
    cleaningFee: 0,
    securityDeposit: 0,
    currency: 'EUR',
    priceDisplayNote: '',
    
    // Parking
    parking: 'nearby' as const,
    parkingNotes: '',
    
    // Sync
    airbnbIcalUrl: '',
    bookingIcalUrl: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    seoKeywords: '',
    
    // Features
    features: defaultFeatures,
    
    // Media
    images: [] as string[],
    
    // System
    featured: false,
  })

  const [sleepingArrangements, setSleepingArrangements] = useState<SleepingSpace[]>([])

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateFeature = (feature: keyof PropertyFeatures, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: value }
    }))
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Sleeping arrangements management
  const addBedroom = () => {
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

  const getSubDistricts = () => {
    if (formData.district === 'Kasbah Royal District') {
      return KASBAH_DISTRICTS
    } else if (formData.district === 'Medina of Marrakech') {
      return MEDINA_DISTRICTS
    }
    return []
  }

  const handleSave = async (publish = false) => {
    setIsSaving(true)
    
    try {
      // Prepare data for database
      const propertyData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        type: formData.type as 'riad' | 'villa' | 'apartment' | 'house',
        description_short: formData.shortDescription,
        description_long: formData.description,
        city: formData.city,
        district: formData.district,
        address: formData.address,
        map_location: formData.mapLocation,
        price_per_night: formData.pricePerNight || 0,
        cleaning_fee: formData.cleaningFee || 0,
        service_fee: 0,
        num_bedrooms: formData.numberOfBedrooms || 1,
        num_bathrooms: formData.bathrooms || 1,
        bedroom_guest_capacity: formData.bedroomGuestCapacity || 2,
        additional_guest_capacity: formData.additionalGuestCapacity || 0,
        total_guest_capacity: formData.totalGuestCapacity || formData.bedroomGuestCapacity || 2,
        amenities: Object.entries(formData.features || {})
          .filter(([_, value]) => value)
          .map(([key]) => key),
        parking_type: formData.parking,
        parking_spots: 0,
        parking_notes: formData.parkingNotes,
        seo_title: formData.metaTitle,
        seo_description: formData.metaDescription,
        seo_keywords: formData.seoKeywords ? formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean) : [],
        status: publish ? 'published' : formData.status,
        featured: formData.featured || false,
        airbnb_ical_url: formData.airbnbIcalUrl,
        booking_ical_url: formData.bookingIcalUrl,
        internal_ical_url: ''
      }

      // Save to database
      const result = await createPropertyAction(propertyData)
      
      if (result.error) {
        alert(`Erreur lors de la sauvegarde : ${result.error}`)
        return
      }
      
      router.push('/admin/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      alert('Failed to save property. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout title="Add New Property">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/admin/properties">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={formData.status === 'draft' ? 'secondary' : formData.status === 'published' ? 'default' : 'outline'}>
                {formData.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                Save Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Publish'}
              </Button>
            </div>
          </div>

          {/* General Identity Section */}
          {activeSection === 'general' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                General Identity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      updateField('title', e.target.value)
                      if (!formData.slug) {
                        updateField('slug', generateSlug(e.target.value))
                      }
                    }}
                    placeholder="e.g., Riad Jardin Secret"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="riad-jardin-secret"
                  />
                  <p className="text-xs text-muted-foreground">
                    {`/properties/${formData.slug || 'your-slug'}`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Category *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => updateField('type', value as PropertyType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riad">Riad</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="subtitle">Short Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="A tagline or short subtitle"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="shortDescription">Short Card Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => updateField('shortDescription', e.target.value)}
                    placeholder="Brief description for property cards (1-2 sentences)"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.shortDescription.length}/200 characters
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Detailed description of the property..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => updateField('status', value as PropertyStatus)}
                  >
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

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label htmlFor="featured">Featured Property</Label>
                    <p className="text-xs text-muted-foreground">Show on homepage</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => updateField('featured', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location Section */}
          {activeSection === 'location' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Marrakech"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => {
                      updateField('district', value)
                      updateField('subDistrict', '')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAIN_DISTRICTS.map(district => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getSubDistricts().length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subDistrict">Sub-District / Area</Label>
                    <Select
                      value={formData.subDistrict}
                      onValueChange={(value) => updateField('subDistrict', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-district" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubDistricts().map(sub => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Exact or approximate address"
                  />
                  <p className="text-xs text-muted-foreground">
                    This can be approximate for privacy
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mapLocation">Map / Location Reference</Label>
                  <Input
                    id="mapLocation"
                    value={formData.mapLocation}
                    onChange={(e) => updateField('mapLocation', e.target.value)}
                    placeholder="Google Maps link or coordinates"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nearbyInfo">Nearby Points of Interest</Label>
                  <Input
                    id="nearbyInfo"
                    value={formData.nearbyInfo}
                    onChange={(e) => updateField('nearbyInfo', e.target.value)}
                    placeholder="e.g., 5 min walk to Jemaa el-Fna"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Capacity Section */}
          {activeSection === 'capacity' && (
            <div className="space-y-6">
              {/* Room Configuration */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  Room Configuration
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-primary" />
                      Bedrooms
                    </Label>
                    <Select
                      value={formData.numberOfBedrooms.toString()}
                      onValueChange={(value) => updateField('numberOfBedrooms', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-primary" />
                      Bathrooms
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.bathrooms}
                      onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Guest Capacity */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Guest Capacity
                </h2>
                <p className="text-sm text-muted-foreground -mt-4">
                  Specify how many guests can be accommodated in different sleeping areas
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <Label className="flex items-center gap-2 mb-3">
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
                        <SelectValue />
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

                  <div className="bg-muted/30 rounded-xl p-4">
                    <Label className="flex items-center gap-2 mb-3">
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
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} guest{n > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <Label className="flex items-center gap-2 mb-3">
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

              {/* Sleeping Arrangements */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Detailed Sleeping Arrangements</h2>
                    <p className="text-sm text-muted-foreground">
                      Specify beds and bathroom facilities in each room
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addBedroom}>
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
                        className="bg-muted/30 rounded-xl p-4 border border-border/50"
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
                                  {[1, 2, 3].map(n => (
                                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeBedFromRoom(roomIndex, bedIndex)}
                                disabled={room.beds.length === 1}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => addBedToRoom(roomIndex)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Bed
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          {activeSection === 'pricing' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pricePerNight">Price per Night *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.currency === 'EUR' ? '\u20AC' : formData.currency === 'USD' ? '$' : 'DH'}
                    </span>
                    <Input
                      id="pricePerNight"
                      type="number"
                      min="0"
                      value={formData.pricePerNight}
                      onChange={(e) => updateField('pricePerNight', parseInt(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => updateField('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (\u20AC)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="MAD">MAD (DH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleaningFee">Cleaning Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.currency === 'EUR' ? '\u20AC' : formData.currency === 'USD' ? '$' : 'DH'}
                    </span>
                    <Input
                      id="cleaningFee"
                      type="number"
                      min="0"
                      value={formData.cleaningFee}
                      onChange={(e) => updateField('cleaningFee', parseInt(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.currency === 'EUR' ? '\u20AC' : formData.currency === 'USD' ? '$' : 'DH'}
                    </span>
                    <Input
                      id="securityDeposit"
                      type="number"
                      min="0"
                      value={formData.securityDeposit}
                      onChange={(e) => updateField('securityDeposit', parseInt(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="priceDisplayNote">Price Display Note</Label>
                  <Input
                    id="priceDisplayNote"
                    value={formData.priceDisplayNote}
                    onChange={(e) => updateField('priceDisplayNote', e.target.value)}
                    placeholder="e.g., Prices vary by season"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amenities Section */}
          {activeSection === 'amenities' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Amenities & Features
              </h2>

              <div className="space-y-6">
                {/* Pool & Wellness */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Pool & Wellness</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(['heatedPool', 'unheatedPool', 'heatedPlungePool', 'unheatedPlungePool', 'jacuzzi', 'hammam', 'bathtub'] as (keyof PropertyFeatures)[]).map((feature) => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features[feature]}
                          onChange={(e) => updateFeature(feature, e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{FEATURE_LABELS[feature]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Outdoor & Comfort */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Outdoor & Comfort</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(['terrace', 'rooftop', 'privateTerminate', 'fireplace', 'wifi', 'airConditioning'] as (keyof PropertyFeatures)[]).map((feature) => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features[feature]}
                          onChange={(e) => updateFeature(feature, e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{FEATURE_LABELS[feature]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Services Possible</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(['breakfastPossible', 'mealsPossible', 'airportTransferPossible', 'privateDriverPossible', 'excursionsPossible'] as (keyof PropertyFeatures)[]).map((feature) => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features[feature]}
                          onChange={(e) => updateFeature(feature, e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{FEATURE_LABELS[feature]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Kitchen */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Kitchen & Appliances</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(['gasStove', 'oven', 'fridge', 'dishwasher', 'coffeeMachine', 'washingMachine', 'iron'] as (keyof PropertyFeatures)[]).map((feature) => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features[feature]}
                          onChange={(e) => updateFeature(feature, e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{FEATURE_LABELS[feature]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Views */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Views & Location Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(['mountainView', 'koutboubiaView', 'mouleyYazidView', 'monumentsView', 'souks'] as (keyof PropertyFeatures)[]).map((feature) => (
                      <label key={feature} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features[feature]}
                          onChange={(e) => updateFeature(feature, e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{FEATURE_LABELS[feature]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parking Section */}
          {activeSection === 'parking' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Parking
              </h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Parking Option</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PARKING_OPTIONS.map((option) => (
                      <label 
                        key={option.value} 
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.parking === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="parking"
                          value={option.value}
                          checked={formData.parking === option.value}
                          onChange={(e) => updateField('parking', e.target.value as typeof formData.parking)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.parking === option.value ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {formData.parking === option.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingNotes">Additional Parking Notes</Label>
                  <Textarea
                    id="parkingNotes"
                    value={formData.parkingNotes}
                    onChange={(e) => updateField('parkingNotes', e.target.value)}
                    placeholder="Any additional parking information..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sync Section */}
          {activeSection === 'sync' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Booking / Calendar Sync
              </h2>
              <p className="text-sm text-muted-foreground -mt-4">
                Connect external calendars to sync availability
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="airbnbIcalUrl">Airbnb iCal URL</Label>
                  <Input
                    id="airbnbIcalUrl"
                    value={formData.airbnbIcalUrl}
                    onChange={(e) => updateField('airbnbIcalUrl', e.target.value)}
                    placeholder="https://www.airbnb.com/calendar/ical/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Export URL from your Airbnb calendar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookingIcalUrl">Booking.com iCal URL</Label>
                  <Input
                    id="bookingIcalUrl"
                    value={formData.bookingIcalUrl}
                    onChange={(e) => updateField('bookingIcalUrl', e.target.value)}
                    placeholder="https://admin.booking.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Export URL from your Booking.com extranet
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Internal iCal Export URL</p>
                  <p className="text-xs text-muted-foreground">
                    After saving, an internal iCal URL will be generated that you can import to Airbnb and Booking.com
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SEO Section */}
          {activeSection === 'seo' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                SEO Settings
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder={formData.title || 'Property title for search engines'}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaTitle.length}/60 characters (recommended)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="Description for search engine results..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.metaDescription.length}/160 characters (recommended)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => updateField('seoKeywords', e.target.value)}
                    placeholder="riad, marrakech, luxury, pool (comma separated)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Section */}
          {activeSection === 'media' && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Media
              </h2>

<ImageUploader
                images={formData.images || []}
                onChange={(images) => updateField('images', images)}
                maxImages={20}
                label="Property Images"
                description="Upload high-quality photos of the property. First image will be the cover."
              />

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Image management features (upload, reorder, delete) will be available after saving the property.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link href="/admin/properties">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Publish Property'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
