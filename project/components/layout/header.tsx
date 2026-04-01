'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/provider'
import { LanguageSelector } from './language-selector'

export function Header() {
  const t = useTranslations('header')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/properties', label: t('properties') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/partners', label: t('partners') },
    { href: '/contact', label: t('contact') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className={cn(
            'text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300',
            isScrolled ? 'text-foreground' : 'text-white'
          )}>
            Marrakech Riads
          </span>
          <span className={cn(
            'text-xs tracking-[0.3em] uppercase transition-colors duration-300',
            isScrolled ? 'text-muted-foreground' : 'text-white/80'
          )}>
            Rent
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm tracking-wide hover:opacity-70 transition-all duration-300',
                isScrolled ? 'text-foreground' : 'text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language Selector, Booking Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector */}
          <LanguageSelector 
            variant={isScrolled ? 'default' : 'transparent'}
          />

          <Link href="/booking" className="hidden sm:block">
            <Button
              variant={isScrolled ? 'default' : 'outline'}
              className={cn(
                'gap-2 transition-all duration-300',
                !isScrolled && 'border-white/50 text-white hover:bg-white/10 hover:text-white'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookNow')}</span>
            </Button>
          </Link>
          
          {/* Mobile Booking Icon */}
          <Link href="/booking" className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'transition-colors duration-300',
                !isScrolled && 'text-white hover:bg-white/10'
              )}
            >
              <Calendar className="w-5 h-5" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 transition-colors duration-300',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500 z-40',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="container mx-auto px-6 py-12 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-light text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
            <Button size="lg" className="mt-6 w-full gap-2">
              <Calendar className="w-5 h-5" />
              {t('bookYourStay')}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
