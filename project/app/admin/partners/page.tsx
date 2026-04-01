import { getPartners } from '@/lib/services/partners'
import { requireAdmin } from '@/lib/services/auth'
import { PartnersAdmin } from '@/components/admin/partners-admin'

export default async function AdminPartnersPage() {
  // Require admin authentication
  await requireAdmin()
  
  // Fetch real partners from database
  const partners = await getPartners()

  return <PartnersAdmin initialPartners={partners} />
}
