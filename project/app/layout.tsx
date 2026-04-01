// Root layout - cache invalidation v4
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Noto_Sans_Arabic, Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/i18n/provider'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic'
})

const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-chinese'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://marrakechriadsrent.com'),
  title: {
    default: 'Marrakech Riads Rent | Luxury Riads, Villas & Apartments',
    template: '%s | Marrakech Riads Rent'
  },
  description: 'Book luxury riads, villas, and apartments in Marrakech. Handpicked properties in the Medina, Palmeraie, and Gueliz. Personal service, competitive rates, and authentic Moroccan hospitality.',
  keywords: [
    'riad Marrakech',
    'riad Marrakech rental',
    'villa Marrakech rental',
    'apartment Marrakech rental',
    'luxury riad Marrakech',
    'Marrakech vacation rental',
    'location riad Marrakech',
    'hébergement Marrakech',
    'riads medina Marrakech',
    'villa palmeraie Marrakech'
  ],
  authors: [{ name: 'Marrakech Riads Rent' }],
  creator: 'Marrakech Riads Rent',
  publisher: 'Marrakech Riads Rent',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'es': '/es',
      'ar': '/ar',
      'ar-MA': '/ma',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    title: 'Marrakech Riads Rent | Luxury Riads, Villas & Apartments',
    description: 'Book luxury riads, villas, and apartments in Marrakech. Handpicked properties with personal service.',
    url: 'https://marrakechriadsrent.com',
    siteName: 'Marrakech Riads Rent',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Luxury Riad in Marrakech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marrakech Riads Rent | Luxury Riads, Villas & Apartments',
    description: 'Book luxury riads, villas, and apartments in Marrakech.',
    images: ['/images/og-image.svg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'travel',
}

export const viewport: Viewport = {
  themeColor: '#C4A77D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} ${notoArabic.variable} ${notoSC.variable}`}
    >
      <body className="font-sans antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
