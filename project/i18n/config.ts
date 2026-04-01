// Supported locales configuration
export const locales = ['en', 'fr', 'es', 'ar', 'ma', 'zh'] as const
export type Locale = (typeof locales)[number]

export const SUPPORTED_LOCALES = locales
export const DEFAULT_LOCALE: Locale = 'en'
export const defaultLocale: Locale = 'en'

// Check if locale is RTL
export function isRTL(locale: Locale): boolean {
  return locale === 'ar' || locale === 'ma'
}

// RTL languages
export const rtlLocales: Locale[] = ['ar', 'ma']

// Language display names (in their native language)
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية',
  ma: 'الدارجة المغربية',
  zh: '中文',
}

// Language flags/codes for display
export const localeFlags: Record<Locale, string> = {
  en: 'GB',
  fr: 'FR',
  es: 'ES',
  ar: 'SA',
  ma: 'MA',
  zh: 'CN',
}

// Check if a locale is RTL
export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

// Get direction for a locale
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr'
}
