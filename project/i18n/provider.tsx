'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { locales, defaultLocale, type Locale, getDirection, SUPPORTED_LOCALES } from './config'
import { MultilingualText, getLocalizedText as getLocalizedTextUtil } from '@/lib/multilingual-content'

// Import messages
import en from './messages/en.json'
import fr from './messages/fr.json'
import es from './messages/es.json'
import ar from './messages/ar.json'
import ma from './messages/ma.json'
import zh from './messages/zh.json'

const messages: Record<Locale, typeof en> = { en, fr, es, ar, ma, zh }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  direction: 'ltr' | 'rtl'
  getLocalizedText: (content: MultilingualText | string | undefined | null, fallback?: string) => string
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let value: unknown = obj
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      // Fallback to English if key not found in current locale
      return path
    }
  }
  return typeof value === 'string' ? value : path
}

function getNestedValueWithFallback(
  locale: Locale, 
  path: string, 
  msgs: Record<Locale, typeof en>
): string {
  // Try current locale first
  let value = getNestedValue(msgs[locale] as unknown as Record<string, unknown>, path)
  
  // If not found (returns the path), try English fallback
  if (value === path && locale !== 'en') {
    value = getNestedValue(msgs.en as unknown as Record<string, unknown>, path)
  }
  
  // If still not found, try French
  if (value === path && locale !== 'fr') {
    value = getNestedValue(msgs.fr as unknown as Record<string, unknown>, path)
  }
  
  return value
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get locale from cookie or browser
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale | undefined

    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
    } else {
      // Detect from browser
      const browserLang = navigator.language.split('-')[0] as Locale
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    setLocaleState(newLocale)
    // Update document direction
    document.documentElement.dir = getDirection(newLocale)
    document.documentElement.lang = newLocale
    // Force re-render by triggering storage event
    window.dispatchEvent(new Event('languagechange'))
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = getNestedValueWithFallback(locale, key, messages)
    
    // Replace parameters like {name} with actual values
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value))
      })
    }
    
    return text
  }, [locale])

  // Get localized text for dynamic multilingual content
  const getLocalizedText = useCallback((
    content: MultilingualText | string | undefined | null, 
    fallback: string = ''
  ): string => {
    return getLocalizedTextUtil(content, locale, fallback)
  }, [locale])

  const direction = getDirection(locale)
  const isRTL = direction === 'rtl'

  // Update document attributes when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = direction
      document.documentElement.lang = locale
      // Add class for RTL styling
      if (isRTL) {
        document.documentElement.classList.add('rtl')
      } else {
        document.documentElement.classList.remove('rtl')
      }
    }
  }, [locale, direction, mounted, isRTL])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, direction, getLocalizedText, isRTL }}>
      {children}
    </I18nContext.Provider>
  )
}

// Default values for SSR/prerender when context is not available
const defaultI18nValues: I18nContextType = {
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
  direction: 'ltr',
  getLocalizedText: (content, fallback = '') => {
    if (typeof content === 'string') return content
    if (content && typeof content === 'object' && 'en' in content) return (content as Record<string, string>).en || fallback
    return fallback
  },
  isRTL: false
}

export function useI18n() {
  const context = useContext(I18nContext)
  // Return default values during SSR/prerender instead of throwing
  if (!context) {
    return defaultI18nValues
  }
  return context
}

export function useTranslations(namespace?: string) {
  const { t, locale } = useI18n()
  
  return (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey, params)
  }
}

// Hook for getting localized dynamic content
export function useLocalizedContent() {
  const { getLocalizedText, locale, isRTL } = useI18n()
  return { getLocalizedText, locale, isRTL }
}

// Hook to listen for language changes
export function useLanguageChange(callback: (locale: Locale) => void) {
  const { locale } = useI18n()
  
  useEffect(() => {
    callback(locale)
  }, [locale, callback])
}
