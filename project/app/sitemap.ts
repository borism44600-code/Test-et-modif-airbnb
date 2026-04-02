import { MetadataRoute } from 'next'
import { fetchPublishedProperties } from '@/lib/data-fetcher'
import { SITE_URL, LOCATIONS } from '@/lib/seo'
import { locales } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/services',
    '/partners',
    '/faq',
    '/booking',
    '/legal',
    '/legal/terms',
    '/legal/privacy',
    '/legal/cookies',
    '/legal/rental-agreement',
  ]

  // Category pages (SEO silos)
  const categoryPages = [
    '/riads-marrakech',
    '/villas-marrakech',
    '/apartments-marrakech',
    '/properties',
    '/properties/riads',
    '/properties/villas',
    '/properties/apartments',
  ]

  // Location-specific pages
  const locationPages = Object.values(LOCATIONS).flatMap(location => [
    `/riads-marrakech-${location.slug}`,
    `/villas-marrakech-${location.slug}`,
    `/apartments-marrakech-${location.slug}`,
  ])

  // Property detail pages from database
  const properties = await fetchPublishedProperties()
  const propertyPages = properties.map(property => `/properties/${property.id}`)

  // Blog/Guide pages
  const blogPages = [
    '/blog',
    '/blog/best-riads-marrakech',
    '/blog/where-to-stay-marrakech',
    '/blog/riad-vs-hotel-marrakech',
    '/blog/marrakech-neighborhood-guide',
    '/blog/luxury-travel-marrakech',
  ]

  // Combine all pages
  const allPages = [
    ...staticPages,
    ...categoryPages,
    ...locationPages,
    ...propertyPages,
    ...blogPages,
  ]

  // Generate sitemap entries with alternates for each locale
  const sitemapEntries: MetadataRoute.Sitemap = allPages.map(page => {
    const priority =
      page === '' ? 1.0 :
      page.startsWith('/riads-marrakech') || page.startsWith('/villas-marrakech') || page.startsWith('/apartments-marrakech') ? 0.9 :
      page.startsWith('/properties/') && !page.includes('riads') && !page.includes('villas') && !page.includes('apartments') ? 0.8 :
      page.startsWith('/blog') ? 0.7 :
      0.6

    const changeFrequency: 'daily' | 'weekly' | 'monthly' =
      page === '' ? 'daily' :
      page.startsWith('/properties/') ? 'weekly' :
      page.startsWith('/blog') ? 'weekly' :
      'monthly'

    return {
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map(locale => [
            locale === 'ma' ? 'ar-MA' : locale === 'zh' ? 'zh-CN' : locale,
            `${baseUrl}/${locale}${page}`
          ])
        )
      }
    }
  })

  return sitemapEntries
}
