'use client'

import { useState, useCallback } from 'react'
import { Globe, Loader2, Check, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Locale, SUPPORTED_LOCALES, localeNames, localeFlags } from '@/i18n/config'
import { MultilingualText, createEmptyMultilingualText, hasAllTranslations, getMissingTranslations } from '@/lib/multilingual-content'

interface MultilingualFieldProps {
  label: string
  value: MultilingualText
  onChange: (value: MultilingualText) => void
  type?: 'input' | 'textarea'
  placeholder?: string
  required?: boolean
  className?: string
  rows?: number
  sourceLocale?: Locale
  autoTranslateEnabled?: boolean
}

export function MultilingualField({
  label,
  value,
  onChange,
  type = 'input',
  placeholder,
  required = false,
  className,
  rows = 4,
  sourceLocale = 'fr',
  autoTranslateEnabled = true
}: MultilingualFieldProps) {
  const [activeTab, setActiveTab] = useState<Locale>(sourceLocale)
  const [isTranslating, setIsTranslating] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [lastTranslatedFrom, setLastTranslatedFrom] = useState<string>('')

  const handleChange = useCallback((locale: Locale, text: string) => {
    onChange({
      ...value,
      [locale]: text
    })
  }, [value, onChange])

  const handleAutoTranslate = useCallback(async () => {
    const sourceText = value[sourceLocale]
    if (!sourceText || sourceText.trim() === '') {
      return
    }

    // Don't re-translate if source hasn't changed
    if (sourceText === lastTranslatedFrom) {
      return
    }

    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLocale,
          targetLocales: SUPPORTED_LOCALES.filter(l => l !== sourceLocale)
        })
      })

      if (response.ok) {
        const { translations } = await response.json()
        onChange({
          ...value,
          ...translations
        })
        setLastTranslatedFrom(sourceText)
      }
    } catch (error) {
      console.error('Auto-translate error:', error)
    } finally {
      setIsTranslating(false)
    }
  }, [value, sourceLocale, lastTranslatedFrom, onChange])

  const missingTranslations = getMissingTranslations(value)
  const isComplete = hasAllTranslations(value)

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Globe className="w-4 h-4 text-muted-foreground" />
          {isComplete ? (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Check className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertCircle className="w-3 h-3 mr-1" />
              {missingTranslations.length} missing
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {autoTranslateEnabled && value[sourceLocale] && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoTranslate}
              disabled={isTranslating || !value[sourceLocale]}
              className="text-xs"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Auto-translate
                </>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                All languages
              </>
            )}
          </Button>
        </div>
      </div>

      {!expanded ? (
        // Compact view - only show source language
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getFlagEmoji(localeFlags[sourceLocale])}</span>
            <span>{localeNames[sourceLocale]} (default)</span>
          </div>
          {type === 'textarea' ? (
            <Textarea
              value={value[sourceLocale] || ''}
              onChange={(e) => handleChange(sourceLocale, e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="resize-none"
            />
          ) : (
            <Input
              value={value[sourceLocale] || ''}
              onChange={(e) => handleChange(sourceLocale, e.target.value)}
              placeholder={placeholder}
            />
          )}
        </div>
      ) : (
        // Expanded view - show all languages in tabs
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Locale)}>
          <TabsList className="grid grid-cols-6 h-auto p-1">
            {SUPPORTED_LOCALES.map((locale) => (
              <TabsTrigger
                key={locale}
                value={locale}
                className={cn(
                  'text-xs py-2 px-3 flex items-center gap-1.5',
                  !value[locale] && 'text-muted-foreground'
                )}
              >
                <span>{getFlagEmoji(localeFlags[locale])}</span>
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
                {!value[locale] && (
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {SUPPORTED_LOCALES.map((locale) => (
            <TabsContent key={locale} value={locale} className="mt-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {localeNames[locale]}
                    {locale === sourceLocale && ' (source)'}
                  </span>
                  {value[locale] && locale !== sourceLocale && (
                    <Badge variant="outline" className="text-xs">
                      Translated
                    </Badge>
                  )}
                </div>
                {type === 'textarea' ? (
                  <Textarea
                    value={value[locale] || ''}
                    onChange={(e) => handleChange(locale, e.target.value)}
                    placeholder={`${placeholder || label} in ${localeNames[locale]}`}
                    rows={rows}
                    className="resize-none"
                    dir={locale === 'ar' || locale === 'ma' ? 'rtl' : 'ltr'}
                  />
                ) : (
                  <Input
                    value={value[locale] || ''}
                    onChange={(e) => handleChange(locale, e.target.value)}
                    placeholder={`${placeholder || label} in ${localeNames[locale]}`}
                    dir={locale === 'ar' || locale === 'ma' ? 'rtl' : 'ltr'}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

// Hook for managing multilingual form state
export function useMultilingualForm<T extends Record<string, MultilingualText>>(
  initialState: T
) {
  const [formData, setFormData] = useState<T>(initialState)
  const [isTranslating, setIsTranslating] = useState(false)

  const updateField = useCallback((field: keyof T, value: MultilingualText) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const translateAllFields = useCallback(async (sourceLocale: Locale = 'fr') => {
    setIsTranslating(true)
    try {
      const fieldsToTranslate: Record<string, string> = {}
      
      for (const [key, value] of Object.entries(formData)) {
        if (value[sourceLocale]) {
          fieldsToTranslate[key] = value[sourceLocale]
        }
      }

      const response = await fetch('/api/translate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: fieldsToTranslate,
          sourceLocale
        })
      })

      if (response.ok) {
        const { fields } = await response.json()
        setFormData(prev => {
          const updated = { ...prev }
          for (const [key, translations] of Object.entries(fields)) {
            if (updated[key as keyof T]) {
              updated[key as keyof T] = translations as MultilingualText
            }
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Batch translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }, [formData])

  const reset = useCallback((newState: T) => {
    setFormData(newState)
  }, [])

  return {
    formData,
    setFormData,
    updateField,
    translateAllFields,
    isTranslating,
    reset
  }
}
