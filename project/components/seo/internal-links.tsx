'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { PROPERTY_TYPES, LOCATIONS } from '@/lib/seo'

interface InternalLinksProps {
  currentType?: 'riad' | 'villa' | 'apartment'
  currentLocation?: string
  showPropertyTypes?: boolean
  showLocations?: boolean
  className?: string
}

export function InternalLinks({
  currentType,
  currentLocation,
  showPropertyTypes = true,
  showLocations = true,
  className = ''
}: InternalLinksProps) {
  const { locale } = useI18n()

  const propertyTypeLinks = [
    { href: '/riads-marrakech', label: 'Riads in Marrakech', type: 'riad' },
    { href: '/villas-marrakech', label: 'Villas in Marrakech', type: 'villa' },
    { href: '/apartments-marrakech', label: 'Apartments in Marrakech', type: 'apartment' },
  ]

  const locationLinks = Object.entries(LOCATIONS).map(([key, location]) => ({
    href: `/riads-marrakech-${location.slug}`,
    label: `Riads in ${location.name.en}`,
    location: key
  }))

  return (
    <aside className={`bg-secondary/30 rounded-xl p-6 ${className}`}>
      {showPropertyTypes && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Browse by Property Type
          </h3>
          <ul className="space-y-2">
            {propertyTypeLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between text-sm hover:text-primary transition-colors ${
                    currentType === link.type ? 'text-primary font-medium' : ''
                  }`}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showLocations && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Browse by Location
          </h3>
          <ul className="space-y-2">
            {locationLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between text-sm hover:text-primary transition-colors ${
                    currentLocation === link.location ? 'text-primary font-medium' : ''
                  }`}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

// Related properties component for property detail pages
interface RelatedLinksProps {
  propertyType: 'riad' | 'villa' | 'apartment'
  location?: string
  className?: string
}

export function RelatedLinks({ propertyType, location, className = '' }: RelatedLinksProps) {
  const typeSlug = propertyType === 'riad' ? 'riads' : propertyType === 'villa' ? 'villas' : 'apartments'
  
  const links = [
    { href: `/${typeSlug}-marrakech`, label: `More ${typeSlug} in Marrakech` },
    { href: '/properties', label: 'All properties' },
    { href: '/blog', label: 'Travel guides & tips' },
  ]

  if (location) {
    links.unshift({
      href: `/${typeSlug}-marrakech-${location}`,
      label: `${typeSlug} in ${location}`
    })
  }

  return (
    <nav className={`${className}`}>
      <h3 className="font-semibold mb-4">You might also like</h3>
      <ul className="flex flex-wrap gap-2">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm hover:bg-secondary transition-colors"
            >
              {link.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Breadcrumb component with structured data
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://marrakechriadsrent.com${item.href}` : undefined
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
