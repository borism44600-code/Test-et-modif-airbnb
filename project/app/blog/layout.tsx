import type { Metadata } from 'next'
import { generateSEOMetadata, generateOrganizationSchema } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Marrakech Travel Blog - Guides, Tips & Insights',
  description: 'Expert travel guides, insider tips, and comprehensive articles about Marrakech. Learn where to stay, what to do, and how to make the most of your trip.',
  keywords: ['Marrakech travel guide', 'Morocco travel tips', 'where to stay Marrakech', 'Marrakech blog', 'riad guide'],
  path: '/blog'
})

export default function BlogLayout({
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
