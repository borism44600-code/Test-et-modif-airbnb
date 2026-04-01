import { fetchPublishedProperties } from '@/lib/data-fetcher'
import { PropertiesClient } from '@/components/properties/properties-client'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export default async function PropertiesPage() {
  // Fetch properties from database (falls back to mock data if empty)
  const properties = await fetchPublishedProperties()

  return <PropertiesClient initialProperties={properties} />
}
