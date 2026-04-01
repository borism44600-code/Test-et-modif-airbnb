'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import { useTranslations } from '@/i18n/provider'

export function Footer() {
  const t = useTranslations('footer')
  const tProperties = useTranslations('properties')

  const footerLinks = {
    properties: [
      { href: '/properties/riads', label: tProperties('riads') },
      { href: '/properties/villas', label: tProperties('villas') },
      { href: '/properties/apartments', label: tProperties('apartments') },
      { href: '/properties', label: tProperties('all') },
    ],
    services: [
      { href: '/services', label: t('services') },
      { href: '/partners', label: t('about') },
      { href: '/services#experiences', label: t('services') },
      { href: '/booking', label: t('subscribe') },
    ],
    company: [
      { href: '/about', label: t('about') },
      { href: '/contact', label: t('contact') },
      { href: '/faq', label: 'FAQ' },
    ],
    legal: [
      { href: '/legal/privacy', label: t('privacy') },
      { href: '/legal/terms', label: t('terms') },
      { href: '/legal/rental-agreement', label: t('rentalAgreement') },
    ],
  }

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-semibold tracking-tight">Marrakech Riads</h3>
              <p className="text-xs tracking-[0.3em] uppercase text-background/60 mt-1">Rent</p>
            </Link>
            <p className="mt-6 text-background/70 leading-relaxed max-w-sm">
              {t('description')}
            </p>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a href="mailto:contact@marrakechriadsrent.com" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@marrakechriadsrent.com</span>
              </a>
              <a href="tel:+212500000000" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+212 5 00 00 00 00</span>
              </a>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Marrakech, Morocco</span>
              </div>
            </div>
          </div>

          {/* Properties Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">{t('properties')}</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">{t('services')}</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">{t('legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/70 hover:text-background transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} Marrakech Riads Rent. {t('copyright')}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/50 hover:text-background transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
