import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

/**
 * Multilingual text field - stores translations for all languages
 */
export interface MultilingualText {
  en: string
  fr: string
  es: string
  ar: string
  ma: string
  zh: string
}

/**
 * Create an empty multilingual text object
 */
export function createEmptyMultilingualText(): MultilingualText {
  return {
    en: '',
    fr: '',
    es: '',
    ar: '',
    ma: '',
    zh: ''
  }
}

/**
 * Create multilingual text from a single value (copies to all languages)
 */
export function createMultilingualText(text: string): MultilingualText {
  return {
    en: text,
    fr: text,
    es: text,
    ar: text,
    ma: text,
    zh: text
  }
}

/**
 * Get text for a specific locale with fallback chain
 * Falls back to: specified fallback -> English -> first available
 */
export function getLocalizedText(
  content: MultilingualText | string | undefined | null,
  locale: Locale,
  fallback: string = ''
): string {
  if (!content) return fallback
  if (typeof content === 'string') return content
  
  // Try requested locale
  if (content[locale]) return content[locale]
  
  // Fallback to English
  if (content.en) return content.en
  
  // Fallback to French (admin default)
  if (content.fr) return content.fr
  
  // Return first available
  for (const loc of SUPPORTED_LOCALES) {
    if (content[loc]) return content[loc]
  }
  
  return fallback
}

/**
 * Check if multilingual content has any translations
 */
export function hasAnyTranslation(content: MultilingualText | undefined | null): boolean {
  if (!content) return false
  return SUPPORTED_LOCALES.some(locale => content[locale] && content[locale].trim() !== '')
}

/**
 * Check if all translations are present
 */
export function hasAllTranslations(content: MultilingualText | undefined | null): boolean {
  if (!content) return false
  return SUPPORTED_LOCALES.every(locale => content[locale] && content[locale].trim() !== '')
}

/**
 * Get list of missing translations
 */
export function getMissingTranslations(content: MultilingualText | undefined | null): Locale[] {
  if (!content) return [...SUPPORTED_LOCALES]
  return SUPPORTED_LOCALES.filter(locale => !content[locale] || content[locale].trim() === '')
}

/**
 * Multilingual property content
 */
export interface MultilingualPropertyContent {
  name: MultilingualText
  description: MultilingualText
  shortDescription: MultilingualText
  neighborhood: MultilingualText
  amenitiesDescription?: MultilingualText
}

/**
 * Multilingual service content
 */
export interface MultilingualServiceContent {
  name: MultilingualText
  description: MultilingualText
  details?: MultilingualText
}

/**
 * Multilingual partner content
 */
export interface MultilingualPartnerContent {
  name: MultilingualText
  description: MultilingualText
  specialties?: MultilingualText
}

/**
 * Content with both static fields and multilingual fields
 */
export interface MultilingualEntity<T> {
  id: string
  content: T
  defaultLocale: Locale
  autoTranslated: Locale[]
  manuallyEdited: Locale[]
  lastUpdated: string
}

/**
 * Create entity wrapper for multilingual content
 */
export function createMultilingualEntity<T>(
  id: string,
  content: T,
  defaultLocale: Locale = DEFAULT_LOCALE
): MultilingualEntity<T> {
  return {
    id,
    content,
    defaultLocale,
    autoTranslated: [],
    manuallyEdited: [defaultLocale],
    lastUpdated: new Date().toISOString()
  }
}
