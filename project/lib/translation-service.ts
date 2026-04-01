'use server'

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, Locale, isRTL } from '@/i18n/config'

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, Map<Locale, string>>()

/**
 * Translate text using AI (OpenAI-compatible API)
 */
export async function translateText(
  text: string,
  targetLocale: Locale,
  sourceLocale: Locale = DEFAULT_LOCALE
): Promise<string> {
  if (!text || text.trim() === '') return ''
  if (targetLocale === sourceLocale) return text

  // Check cache first
  const cacheKey = `${sourceLocale}:${text}`
  const cached = translationCache.get(cacheKey)?.get(targetLocale)
  if (cached) return cached

  // Language names for the prompt
  const languageNames: Record<Locale, string> = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    ar: 'Arabic',
    ma: 'Moroccan Darija (Arabic dialect)',
    zh: 'Simplified Chinese'
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in luxury hospitality and travel content. 
Translate the following text from ${languageNames[sourceLocale]} to ${languageNames[targetLocale]}.
Keep the tone elegant and professional, appropriate for a luxury villa rental service in Marrakech.
Only return the translated text, nothing else.
Preserve any HTML tags or special formatting in the text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      console.error('Translation API error:', response.status)
      return text // Fallback to original text
    }

    const data = await response.json()
    const translatedText = data.choices?.[0]?.message?.content?.trim() || text

    // Cache the result
    if (!translationCache.has(cacheKey)) {
      translationCache.set(cacheKey, new Map())
    }
    translationCache.get(cacheKey)!.set(targetLocale, translatedText)

    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    return text // Fallback to original text
  }
}

/**
 * Translate text to all supported languages
 */
export async function translateToAllLanguages(
  text: string,
  sourceLocale: Locale = DEFAULT_LOCALE
): Promise<Record<Locale, string>> {
  const translations: Partial<Record<Locale, string>> = {
    [sourceLocale]: text
  }

  const targetLocales = SUPPORTED_LOCALES.filter(l => l !== sourceLocale)
  
  // Translate in parallel
  const results = await Promise.all(
    targetLocales.map(async (locale) => ({
      locale,
      text: await translateText(text, locale, sourceLocale)
    }))
  )

  for (const result of results) {
    translations[result.locale] = result.text
  }

  return translations as Record<Locale, string>
}

/**
 * Translate an object with multiple text fields
 */
export async function translateContentObject<T extends Record<string, string>>(
  content: T,
  fieldsToTranslate: (keyof T)[],
  sourceLocale: Locale = DEFAULT_LOCALE
): Promise<Record<Locale, T>> {
  const translations: Partial<Record<Locale, T>> = {}

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) {
      translations[locale] = content
      continue
    }

    const translatedContent = { ...content } as T
    
    for (const field of fieldsToTranslate) {
      const originalText = content[field]
      if (typeof originalText === 'string' && originalText) {
        (translatedContent as Record<string, string>)[field as string] = 
          await translateText(originalText, locale, sourceLocale)
      }
    }
    
    translations[locale] = translatedContent
  }

  return translations as Record<Locale, T>
}

// Type for multilingual content
export interface MultilingualContent {
  en: string
  fr: string
  es: string
  ar: string
  ma: string
  zh: string
}

/**
 * Create empty multilingual content object
 */
export function createEmptyMultilingualContent(): MultilingualContent {
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
 * Get text for current locale with fallback
 */
export function getLocalizedText(
  content: Partial<MultilingualContent> | string | undefined,
  locale: Locale,
  fallbackLocale: Locale = 'en'
): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  
  return content[locale] || content[fallbackLocale] || content.en || ''
}
