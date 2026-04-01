import type { Metadata } from 'next'
import { locales, type Locale, localeNames } from '@/i18n/config'

// Base URL for the site
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marrakechriadsrent.com'
export const SITE_NAME = 'Marrakech Riads Rent'

// SEO Keywords by category
export const SEO_KEYWORDS = {
  main: [
    'riad Marrakech',
    'riad Marrakech rental',
    'villa Marrakech rental',
    'apartment Marrakech rental',
    'luxury riad Marrakech',
    'Marrakech vacation rental',
    'short-term rental Marrakech',
    'location riad Marrakech',
    'location villa Marrakech',
    'hébergement Marrakech'
  ],
  riads: [
    'riad Marrakech',
    'traditional riad Marrakech',
    'luxury riad Marrakech medina',
    'authentic riad Morocco',
    'riad with pool Marrakech',
    'boutique riad Marrakech'
  ],
  villas: [
    'villa Marrakech',
    'luxury villa Marrakech',
    'villa with pool Marrakech',
    'private villa Marrakech',
    'villa rental Palmeraie',
    'villa vacances Marrakech'
  ],
  apartments: [
    'apartment Marrakech',
    'appartement Marrakech',
    'luxury apartment Gueliz',
    'modern apartment Marrakech',
    'studio Marrakech rental'
  ],
  locations: {
    medina: ['riad medina Marrakech', 'hébergement medina', 'stay in medina Marrakech'],
    kasbah: ['riad kasbah Marrakech', 'location kasbah', 'luxury stay kasbah'],
    hivernage: ['apartment hivernage', 'luxury hivernage Marrakech', 'modern stay hivernage'],
    palmeraie: ['villa palmeraie Marrakech', 'luxury villa palmeraie', 'pool villa palmeraie'],
    gueliz: ['apartment gueliz Marrakech', 'modern gueliz rental', 'city center Marrakech stay']
  }
}

// Location data for SEO pages
export const LOCATIONS = {
  medina: {
    slug: 'medina',
    name: { en: 'Medina', fr: 'Médina', es: 'Medina', ar: 'المدينة القديمة', ma: 'المدينة', zh: '麦地那' },
    description: {
      en: 'The ancient heart of Marrakech, a UNESCO World Heritage site filled with winding alleys, historic palaces, and traditional riads.',
      fr: 'Le cœur historique de Marrakech, classé au patrimoine mondial de l\'UNESCO, avec ses ruelles sinueuses, palais historiques et riads traditionnels.',
      es: 'El corazón antiguo de Marrakech, Patrimonio de la Humanidad de la UNESCO, lleno de callejones sinuosos, palacios históricos y riads tradicionales.',
      ar: 'قلب مراكش التاريخي، موقع تراث عالمي لليونسكو مليء بالأزقة المتعرجة والقصور التاريخية والرياضات التقليدية.',
      ma: 'قلب مراكش القديم، تراث عالمي ديال اليونسكو فيه الزنقات والقصور والرياضات التقليدية.',
      zh: '马拉喀什的古老心脏，联合国教科文组织世界遗产，充满蜿蜒的小巷、历史悠久的宫殿和传统庭院。'
    }
  },
  kasbah: {
    slug: 'kasbah',
    name: { en: 'Kasbah', fr: 'Kasbah', es: 'Kasbah', ar: 'القصبة', ma: 'القصبة', zh: '卡斯巴' },
    description: {
      en: 'The royal quarter of Marrakech, home to the Saadian Tombs and El Badi Palace, offering a prestigious address with rich history.',
      fr: 'Le quartier royal de Marrakech, abritant les tombeaux saadiens et le palais El Badi, offrant une adresse prestigieuse chargée d\'histoire.',
      es: 'El barrio real de Marrakech, hogar de las Tumbas Saadíes y el Palacio El Badi, ofreciendo una dirección prestigiosa con rica historia.',
      ar: 'الحي الملكي في مراكش، موطن مقابر السعديين وقصر البديع، يقدم عنوانًا مرموقًا بتاريخ غني.',
      ma: 'الحي الملكي ديال مراكش، فيه قبور السعديين وقصر البديع، عنوان مرموق وتاريخ كبير.',
      zh: '马拉喀什的皇家区，萨迪安陵墓和巴迪宫所在地，提供历史悠久的尊贵地址。'
    }
  },
  hivernage: {
    slug: 'hivernage',
    name: { en: 'Hivernage', fr: 'Hivernage', es: 'Hivernage', ar: 'الحيفرناج', ma: 'ليفرناج', zh: '希维纳日' },
    description: {
      en: 'The upscale neighborhood of Marrakech, known for luxury hotels, fine dining, and modern amenities just steps from the Medina.',
      fr: 'Le quartier chic de Marrakech, réputé pour ses hôtels de luxe, sa gastronomie raffinée et ses commodités modernes à deux pas de la Médina.',
      es: 'El barrio exclusivo de Marrakech, conocido por hoteles de lujo, alta gastronomía y comodidades modernas a pasos de la Medina.',
      ar: 'الحي الراقي في مراكش، المعروف بفنادقه الفاخرة ومطاعمه الراقية ووسائل الراحة الحديثة على بعد خطوات من المدينة.',
      ma: 'الحي الشيك ديال مراكش، معروف بالفنادق الفاخرة والماكلة الراقية قريب من المدينة.',
      zh: '马拉喀什的高档街区，以豪华酒店、精致餐饮和现代设施著称，距麦地那仅几步之遥。'
    }
  },
  palmeraie: {
    slug: 'palmeraie',
    name: { en: 'Palmeraie', fr: 'Palmeraie', es: 'Palmeraie', ar: 'النخيل', ma: 'لبالميري', zh: '棕榈园' },
    description: {
      en: 'A lush oasis of palm groves on the outskirts of Marrakech, perfect for spacious villas with private pools and gardens.',
      fr: 'Une oasis luxuriante de palmeraies aux portes de Marrakech, idéale pour des villas spacieuses avec piscines privées et jardins.',
      es: 'Un oasis exuberante de palmeras en las afueras de Marrakech, perfecto para villas espaciosas con piscinas privadas y jardines.',
      ar: 'واحة خضراء من أشجار النخيل على أطراف مراكش، مثالية للفيلات الفسيحة مع مسابح وحدائق خاصة.',
      ma: 'واحة خضراء ديال النخيل على أطراف مراكش، مزيانة للفيلات الكبار بالمسابح والجنان.',
      zh: '马拉喀什郊区郁郁葱葱的棕榈绿洲，是带私人泳池和花园的宽敞别墅的理想之地。'
    }
  },
  gueliz: {
    slug: 'gueliz',
    name: { en: 'Gueliz', fr: 'Guéliz', es: 'Gueliz', ar: 'جيليز', ma: 'كيليز', zh: '盖利兹' },
    description: {
      en: 'The modern city center of Marrakech, featuring contemporary architecture, trendy cafes, boutiques, and excellent restaurants.',
      fr: 'Le centre-ville moderne de Marrakech, avec son architecture contemporaine, ses cafés branchés, ses boutiques et ses excellents restaurants.',
      es: 'El centro moderno de Marrakech, con arquitectura contemporánea, cafés de moda, boutiques y excelentes restaurantes.',
      ar: 'وسط مدينة مراكش الحديث، يتميز بالهندسة المعمارية المعاصرة والمقاهي العصرية والبوتيكات والمطاعم الممتازة.',
      ma: 'وسط مراكش الجديد، فيه العمارة الحديثة والقهاوي والبوتيكات والريسطورات المزيانين.',
      zh: '马拉喀什的现代市中心，拥有当代建筑、时尚咖啡馆、精品店和优秀餐厅。'
    }
  }
}

// Property types for SEO
export const PROPERTY_TYPES = {
  riads: {
    slug: 'riads-marrakech',
    name: { en: 'Riads', fr: 'Riads', es: 'Riads', ar: 'رياضات', ma: 'الرياضات', zh: '庭院' },
    singular: { en: 'Riad', fr: 'Riad', es: 'Riad', ar: 'رياض', ma: 'رياض', zh: '庭院' },
    description: {
      en: 'Traditional Moroccan houses with interior courtyards, offering an authentic experience in the heart of Marrakech.',
      fr: 'Maisons marocaines traditionnelles avec patios intérieurs, offrant une expérience authentique au cœur de Marrakech.',
      es: 'Casas tradicionales marroquíes con patios interiores, ofreciendo una experiencia auténtica en el corazón de Marrakech.',
      ar: 'منازل مغربية تقليدية مع أفنية داخلية، تقدم تجربة أصيلة في قلب مراكش.',
      ma: 'ديار مغربية تقليدية بالوسط ديالهم، تجربة أصيلة فوسط مراكش.',
      zh: '带内部庭院的传统摩洛哥房屋，在马拉喀什中心提供真实的体验。'
    }
  },
  villas: {
    slug: 'villas-marrakech',
    name: { en: 'Villas', fr: 'Villas', es: 'Villas', ar: 'فيلات', ma: 'الفيلات', zh: '别墅' },
    singular: { en: 'Villa', fr: 'Villa', es: 'Villa', ar: 'فيلا', ma: 'فيلا', zh: '别墅' },
    description: {
      en: 'Spacious private villas with pools, gardens, and modern amenities for a luxurious Marrakech retreat.',
      fr: 'Villas privées spacieuses avec piscines, jardins et équipements modernes pour une retraite luxueuse à Marrakech.',
      es: 'Villas privadas espaciosas con piscinas, jardines y comodidades modernas para un retiro lujoso en Marrakech.',
      ar: 'فيلات خاصة فسيحة مع مسابح وحدائق ووسائل راحة حديثة لإقامة فاخرة في مراكش.',
      ma: 'فيلات خاصة كبار بالمسابح والجنان ومعدات حديثة باش تستمتع فمراكش.',
      zh: '宽敞的私人别墅，配有泳池、花园和现代设施，是马拉喀什的豪华度假胜地。'
    }
  },
  apartments: {
    slug: 'apartments-marrakech',
    name: { en: 'Apartments', fr: 'Appartements', es: 'Apartamentos', ar: 'شقق', ma: 'لابارطمونات', zh: '公寓' },
    singular: { en: 'Apartment', fr: 'Appartement', es: 'Apartamento', ar: 'شقة', ma: 'لابارطمون', zh: '公寓' },
    description: {
      en: 'Modern apartments in prime locations, perfect for travelers seeking comfort and convenience in Marrakech.',
      fr: 'Appartements modernes dans des emplacements de choix, parfaits pour les voyageurs recherchant confort et commodité à Marrakech.',
      es: 'Apartamentos modernos en ubicaciones privilegiadas, perfectos para viajeros que buscan comodidad y conveniencia en Marrakech.',
      ar: 'شقق حديثة في مواقع متميزة، مثالية للمسافرين الباحثين عن الراحة والملاءمة في مراكش.',
      ma: 'لابارطمونات حديثة فأماكن مزيانة، مناسبة للناس اللي بغاو الراحة فمراكش.',
      zh: '位于黄金地段的现代公寓，非常适合在马拉喀什寻求舒适和便利的旅客。'
    }
  }
}

// Generate metadata for a page
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  path = '',
  locale = 'en',
  type = 'website',
  images = [],
  noIndex = false
}: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  locale?: Locale
  type?: 'website' | 'article'
  images?: string[]
  noIndex?: boolean
}): Metadata {
  const url = `${SITE_URL}${path}`
  const defaultImage = `${SITE_URL}/images/og-image.jpg`

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: [...SEO_KEYWORDS.main, ...keywords],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map(loc => [loc, `${SITE_URL}/${loc}${path}`])
      )
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ar' || locale === 'ma' ? 'ar_MA' : locale,
      type,
      images: images.length > 0 ? images : [defaultImage]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length > 0 ? images : [defaultImage]
    }
  }
}

// Generate hreflang tags
export function generateHreflangTags(path: string): Record<string, string> {
  const tags: Record<string, string> = {
    'x-default': `${SITE_URL}${path}`
  }
  
  locales.forEach(locale => {
    const hreflangCode = locale === 'ma' ? 'ar-MA' : locale === 'zh' ? 'zh-CN' : locale
    tags[hreflangCode] = `${SITE_URL}/${locale}${path}`
  })
  
  return tags
}

// Generate JSON-LD structured data for a property
export function generatePropertySchema(property: {
  id: string
  name: string
  description: string
  pricePerNight: number
  images: string[]
  location: {
    district: string
    address?: string
  }
  numberOfBedrooms: number
  numberOfBathrooms: number
  totalGuestCapacity: number
  rating?: number
  reviewCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/properties/${property.id}`,
    name: property.name,
    description: property.description,
    image: property.images.map(img => `${SITE_URL}${img}`),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marrakech',
      addressRegion: property.location.district,
      addressCountry: 'MA',
      streetAddress: property.location.address || ''
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6295,
      longitude: -7.9811
    },
    priceRange: `€${property.pricePerNight} - €${property.pricePerNight * 2}`,
    numberOfRooms: property.numberOfBedrooms,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Bedrooms', value: property.numberOfBedrooms },
      { '@type': 'LocationFeatureSpecification', name: 'Bathrooms', value: property.numberOfBathrooms },
      { '@type': 'LocationFeatureSpecification', name: 'Max Guests', value: property.totalGuestCapacity }
    ],
    ...(property.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: property.rating,
        reviewCount: property.reviewCount || 0,
        bestRating: 5,
        worstRating: 1
      }
    })
  }
}

// Generate JSON-LD for organization
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: 'Premium vacation rentals in Marrakech - Riads, Villas, and Apartments',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marrakech',
      addressCountry: 'MA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-XXX-XXXXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Arabic', 'Spanish']
    },
    sameAs: [
      'https://www.instagram.com/marrakechriadsrent',
      'https://www.facebook.com/marrakechriadsrent'
    ]
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  }
}

// Generate FAQ schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// SEO-friendly slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Get localized content
export function getLocalizedContent<T extends Record<string, unknown>>(
  content: T,
  locale: Locale,
  fallbackLocale: Locale = 'en'
): string {
  const localeKey = locale as keyof T
  const fallbackKey = fallbackLocale as keyof T
  return (content[localeKey] as string) || (content[fallbackKey] as string) || ''
}
