import { NextRequest, NextResponse } from 'next/server'
import { 
  addDateBlock, 
  removeDateBlock, 
  getDateBlocksForProperty,
  DateBlockType 
} from '@/lib/availability'

// GET - Fetch date blocks for a property
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const blocks = getDateBlocksForProperty(propertyId)
    return NextResponse.json({ blocks })
  } catch (error) {
    console.error('Error fetching date blocks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch date blocks' },
      { status: 500 }
    )
  }
}

// POST - Create a new date block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId, startDate, endDate, type, reason, createdBy } = body

    // Validate required fields
    if (!propertyId || !startDate || !endDate || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, startDate, endDate, type' },
        { status: 400 }
      )
    }

    // Validate date order
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Validate block type
    const validTypes: DateBlockType[] = ['maintenance', 'owner_use', 'booking', 'other']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid block type' },
        { status: 400 }
      )
    }

    const block = addDateBlock({
      propertyId,
      startDate,
      endDate,
      type,
      reason,
      createdBy: createdBy || 'admin'
    })

    return NextResponse.json({ 
      success: true,
      block 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating date block:', error)
    return NextResponse.json(
      { error: 'Failed to create date block' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a date block
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('id')

    if (!blockId) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 }
      )
    }

    const success = removeDateBlock(blockId)

    if (!success) {
      return NextResponse.json(
        { error: 'Date block not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting date block:', error)
    return NextResponse.json(
      { error: 'Failed to delete date block' },
      { status: 500 }
    )
  }
}
