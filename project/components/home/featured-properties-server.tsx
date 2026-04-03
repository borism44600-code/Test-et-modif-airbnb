/**
 * Server wrapper pour FeaturedProperties.
 * Fetch les propriétés en vedette depuis Supabase, passe les données au composant client.
 * Si la DB est vide, affiche un état vide.
 */
import { fetchPublishedProperties } from '@/lib/data-fetcher'
import { FeaturedPropertiesClient } from './featured-properties-client'

export async function FeaturedProperties() {
  const properties = await fetchPublishedProperties()
  const featured = properties.filter(p => p.featured).slice(0, 3)
  return <FeaturedPropertiesClient properties={featured} />
}
