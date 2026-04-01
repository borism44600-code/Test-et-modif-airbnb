import { notFound } from 'next/navigation'
import { getPropertyById } from '@/lib/services/properties'
import { requireAdmin } from '@/lib/services/auth'
import { PropertyEditForm } from '@/components/admin/property-edit-form'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  // Require admin authentication
  await requireAdmin()
  
  const { id } = await params
  
  // Fetch property data
  let property
  try {
    property = await getPropertyById(id)
  } catch {
    notFound()
  }
  
  if (!property) {
    notFound()
  }

  return <PropertyEditForm property={property} />
}
