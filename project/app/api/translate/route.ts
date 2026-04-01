import { NextRequest, NextResponse } from 'next/server'
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ar: 'Arabic',
  ma: 'Moroccan Darija (Arabic dialect spoken in Morocco)',
  zh: 'Simplified Chinese'
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLocales, sourceLocale = 'fr' } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const targets = targetLocales || SUPPORTED_LOCALES.filter(l => l !== sourceLocale)
    const translations: Partial<Record<Locale, string>> = {
      [sourceLocale as Locale]: text
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Return original text for all languages if no API key
      for (const locale of targets) {
        translations[locale as Locale] = text
      }
      return NextResponse.json({ 
        translations,
        warning: 'OpenAI API key not configured - returning original text'
      })
    }

    // Translate to each target language
    for (const targetLocale of targets) {
      if (targetLocale === sourceLocale) continue

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
                content: `You are a professional translator for a luxury villa rental service in Marrakech, Morocco.
Translate the following text from ${languageNames[sourceLocale as Locale]} to ${languageNames[targetLocale as Locale]}.
Keep the tone elegant, warm, and professional - appropriate for luxury hospitality.
Only return the translated text, nothing else.
Preserve any line breaks, HTML tags, or special formatting.
For Moroccan Darija, use authentic local expressions while keeping it understandable.`
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

        if (response.ok) {
          const data = await response.json()
          const translatedText = data.choices?.[0]?.message?.content?.trim()
          if (translatedText) {
            translations[targetLocale as Locale] = translatedText
          } else {
            translations[targetLocale as Locale] = text
          }
        } else {
          console.error(`Translation to ${targetLocale} failed:`, response.status)
          translations[targetLocale as Locale] = text
        }
      } catch (error) {
        console.error(`Translation to ${targetLocale} error:`, error)
        translations[targetLocale as Locale] = text
      }
    }

    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}

// Translate multiple fields at once
export async function PUT(request: NextRequest) {
  try {
    const { fields, sourceLocale = 'fr' } = await request.json()

    if (!fields || typeof fields !== 'object') {
      return NextResponse.json(
        { error: 'Fields object is required' },
        { status: 400 }
      )
    }

    const translatedFields: Record<string, Record<Locale, string>> = {}
    const targets = SUPPORTED_LOCALES.filter(l => l !== sourceLocale)

    for (const [fieldName, text] of Object.entries(fields)) {
      if (typeof text !== 'string' || !text.trim()) {
        translatedFields[fieldName] = {
          en: '',
          fr: '',
          es: '',
          ar: '',
          ma: '',
          zh: ''
        }
        continue
      }

      translatedFields[fieldName] = {
        [sourceLocale]: text
      } as Record<Locale, string>

      // If no API key, just copy the text
      if (!process.env.OPENAI_API_KEY) {
        for (const locale of targets) {
          translatedFields[fieldName][locale] = text
        }
        continue
      }

      // Translate to each language
      for (const targetLocale of targets) {
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
                  content: `Translate from ${languageNames[sourceLocale as Locale]} to ${languageNames[targetLocale as Locale]}.
Luxury villa rental in Marrakech context. Keep elegant tone. Return only the translation.`
                },
                { role: 'user', content: text }
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          })

          if (response.ok) {
            const data = await response.json()
            translatedFields[fieldName][targetLocale] = 
              data.choices?.[0]?.message?.content?.trim() || text
          } else {
            translatedFields[fieldName][targetLocale] = text
          }
        } catch {
          translatedFields[fieldName][targetLocale] = text
        }
      }
    }

    return NextResponse.json({ fields: translatedFields })
  } catch (error) {
    console.error('Batch translation error:', error)
    return NextResponse.json(
      { error: 'Batch translation failed' },
      { status: 500 }
    )
  }
}
