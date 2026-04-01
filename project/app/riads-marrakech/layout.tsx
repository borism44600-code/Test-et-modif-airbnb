import type { Metadata } from 'next'
import { generateSEOMetadata, generatePropertySchema, generateOrganizationSchema, generateFAQSchema, SEO_KEYWORDS } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Riads in Marrakech - Traditional Moroccan Riad Rentals',
  description: 'Discover authentic riads in Marrakech medina. Book traditional Moroccan houses with courtyards, rooftop terraces, and personalized service. Best riads in Marrakech for your holiday.',
  keywords: [...SEO_KEYWORDS.riads, 'riad rental Marrakech', 'traditional riad Morocco', 'medina accommodation'],
  path: '/riads-marrakech'
})

// Structured data for the page
const structuredData = {
  organization: generateOrganizationSchema(),
  faq: generateFAQSchema([
    { question: 'What is the difference between a riad and a hotel in Marrakech?', answer: 'A riad offers a more intimate and authentic experience compared to a hotel. You get an entire traditional Moroccan house with personalized service, a private courtyard, and often a rooftop terrace.' },
    { question: 'Can I rent an entire riad in Marrakech?', answer: 'Yes! Many of our riads are available for exclusive rental, perfect for families, groups of friends, or special occasions.' },
    { question: 'How do I find a riad in the medina?', answer: 'We provide detailed directions and can arrange for someone to meet you at a landmark point. Many riads are just minutes from Jemaa el-Fna square on foot.' }
  ])
}

export default function RiadsMarrakechLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }}
      />
      {children}
    </>
  )
}
