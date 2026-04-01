'use server'

import { cookies } from 'next/headers'
import { type Locale, defaultLocale } from '@/i18n/config'

const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return (cookieStore.get(COOKIE_NAME)?.value as Locale) || defaultLocale
}

export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
}
