import Image from 'next/image'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout } from '@/components/admin/admin-layout'
import { getProperties } from '@/lib/services/properties'
import { requireAdmin } from '@/lib/auth'
import { PropertiesTable } from '@/components/admin/properties-table'

export default async function AdminPropertiesPage() {
  // Require admin authentication
  await requireAdmin()
  
  // Fetch real properties from database
  const properties = await getProperties()

  return (
    <AdminLayout title="Properties">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {properties.length} properties in database
          </div>
          <Link href="/admin/properties/new">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Properties Table - Client Component for interactivity */}
        <PropertiesTable properties={properties} />
      </div>
    </AdminLayout>
  )
}
