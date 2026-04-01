'use client'

import { useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'

interface LanguageSelectorProps {
  variant?: 'default' | 'transparent'
  className?: string
}

export function LanguageSelector({ variant = 'default', className }: LanguageSelectorProps) {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-1.5 px-2.5 transition-all duration-300',
            variant === 'transparent' && 'text-white hover:bg-white/10 hover:text-white',
            className
          )}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {localeNames[locale]}
          </span>
          <ChevronDown className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background/95 backdrop-blur-md border-border/50"
      >
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              'flex items-center justify-between cursor-pointer py-2.5 px-3',
              locale === loc && 'bg-primary/10'
            )}
          >
            <span className={cn(
              'text-sm',
              locale === loc ? 'font-semibold text-primary' : 'text-foreground'
            )}>
              {localeNames[loc]}
            </span>
            {locale === loc && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
