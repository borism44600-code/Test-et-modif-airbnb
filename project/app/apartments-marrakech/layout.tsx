import type { Metadata } from 'next'
import { generateSEOMetadata, generateOrganizationSchema, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Apartments in Marrakech - Modern Apartment Rentals Gueliz',
  description: 'Book modern apartments in Marrakech Gueliz and Hivernage. Fully equipped with WiFi, kitchen, and contemporary amenities. Perfect for couples and business travelers.',
  keywords: [...SEO_KEYWORDS.apartments, 'Gueliz apartment rental', 'modern apartment Marrakech', 'short term rental'],
  path: '/apartments-marrakech'
})

export default function ApartmentsMarrakechLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
      />
      {children}
    </>
  )
}
