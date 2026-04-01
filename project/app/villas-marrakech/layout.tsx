import type { Metadata } from 'next'
import { generateSEOMetadata, generateOrganizationSchema, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Villas in Marrakech - Luxury Villa Rentals with Private Pool',
  description: 'Book luxury villas in Marrakech with private pools, gardens, and stunning Atlas Mountain views. Perfect for families and groups. Best villa rentals in Palmeraie and beyond.',
  keywords: [...SEO_KEYWORDS.villas, 'villa with pool Marrakech', 'luxury villa rental Morocco', 'Palmeraie villa'],
  path: '/villas-marrakech'
})

export default function VillasMarrakechLayout({
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
