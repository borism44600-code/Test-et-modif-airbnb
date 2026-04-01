'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone, Mail, Shield, Clock, Star, HeartHandshake } from 'lucide-react'
import { useTranslations } from '@/i18n/provider'

export function BookingCTA() {
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const tProperties = useTranslations('properties')
  const tContact = useTranslations('contact')

  const guarantees = [
    { icon: Shield, textKey: 'securePayment' },
    { icon: Clock, textKey: 'freeCancellation' },
    { icon: HeartHandshake, textKey: 'confirmBooking' },
    { icon: Star, textKey: 'bookingSummary' }
  ]

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/experiences/sunset.jpg"
          alt="Marrakech sunset — book your stay"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="luxury-subheading text-gold mb-4">{t('step1')}</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold luxury-heading max-w-3xl mx-auto text-balance">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">
            {t('confirmationMessage')}
          </p>
        </motion.div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {guarantees.map((item) => (
            <div key={item.textKey} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-gold" />
              <span className="text-sm text-white/80">{t(item.textKey as 'securePayment' | 'freeCancellation' | 'confirmBooking' | 'bookingSummary')}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/booking">
            <Button size="lg" className="text-base px-8 gap-2 bg-gold text-black hover:bg-gold/90 font-medium">
              {t('confirmBooking')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/properties">
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-white/50 text-white hover:bg-white/10 hover:text-white"
            >
              {tProperties('title')}
            </Button>
          </Link>
        </motion.div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-sm text-white/60 mb-4">{tContact('subtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
            <a href="tel:+212500000000" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4" />
              <span>+212 5 00 00 00 00</span>
            </a>
            <a href="mailto:contact@marrakechriadsrent.com" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4" />
              <span>contact@marrakechriadsrent.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
