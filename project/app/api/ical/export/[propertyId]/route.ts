import { NextRequest, NextResponse } from 'next/server'
import { generateICalContent, BookedPeriod } from '@/lib/ical'
import { createClient } from '@/lib/supabase/server'
import type { Property } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params

    // Remove .ics extension if present
    const cleanPropertyId = propertyId.replace(/\.ics$/, '')

    // Fetch the property from Supabase
    const supabase = await createClient()
    const { data: dbProperty, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', cleanPropertyId)
      .single()

    if (error || !dbProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Map DB row to the Property shape needed by generateICalContent
    const property: Property = {
      id: dbProperty.id,
      title: dbProperty.title || dbProperty.name_en || dbProperty.name_fr || 'Untitled',
      slug: dbProperty.slug || dbProperty.id,
      type: dbProperty.type || dbProperty.category || 'riad',
      shortDescription: dbProperty.description_short || dbProperty.short_description_en || '',
      description: dbProperty.description_long || dbProperty.description_en || '',
      status: dbProperty.status || 'published',
      location: {
        city: dbProperty.location || 'Marrakech',
        district: dbProperty.district || 'Medina',
        subDistrict: dbProperty.sub_district,
        address: dbProperty.address,
        mapLocation: dbProperty.map_location || dbProperty.map_url,
      },
      numberOfBedrooms: dbProperty.num_bedrooms || dbProperty.bedrooms || 1,
      bathrooms: dbProperty.num_bathrooms || dbProperty.bathrooms || 1,
      bedroomGuestCapacity: dbProperty.bedroom_guest_capacity || dbProperty.max_guests || 2,
      additionalGuestCapacity: dbProperty.additional_guest_capacity || 0,
      totalGuestCapacity: dbProperty.total_guest_capacity || dbProperty.max_guests || 2,
      pricePerNight: dbProperty.price_per_night || 0,
      currency: dbProperty.currency || 'EUR',
      features: {} as Property['features'],
      amenities: [],
      parking: (dbProperty.parking_type || 'nearby') as Property['parking'],
      images: [],
      availability: [],
      featured: dbProperty.featured || false,
      createdAt: dbProperty.created_at || new Date().toISOString(),
      updatedAt: dbProperty.updated_at || new Date().toISOString(),
    }

    // Fetch bookings for this property from DB (or use empty array if no bookings table yet)
    const bookings: BookedPeriod[] = []

    // Get the base URL from the request
    const baseUrl = request.nextUrl.origin

    // Generate the ICS content
    const icsContent = generateICalContent(property, bookings, baseUrl)

    // Return as downloadable ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${property.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-calendar.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('iCal export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    )
  }
}
