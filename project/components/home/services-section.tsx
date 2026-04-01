'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Car, Sparkles, Mountain, Users, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/provider'

export function ServicesSection() {
  const t = useTranslations('services')

  const services = [
    {
      icon: Utensils,
      titleKey: 'meals',
      descriptionKey: 'meals'
    },
    {
      icon: Car,
      titleKey: 'airportTransfer',
      descriptionKey: 'airportTransfer'
    },
    {
      icon: Sparkles,
      titleKey: 'spaWellness',
      descriptionKey: 'spaWellness'
    },
    {
      icon: Mountain,
      titleKey: 'excursions',
      descriptionKey: 'excursions'
    },
    {
      icon: Users,
      titleKey: 'concierge',
      descriptionKey: 'concierge'
    },
    {
      icon: Gift,
      titleKey: 'breakfast',
      descriptionKey: 'breakfast'
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="/images/services/concierge.jpg"
                alt={t('concierge')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gold/20 rounded-lg -z-10" />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="luxury-subheading text-muted-foreground mb-4">{t('concierge')}</p>
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                {t('subtitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                {t('description')}
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{t(service.titleKey as 'meals' | 'airportTransfer' | 'spaWellness' | 'excursions' | 'concierge' | 'breakfast')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('description')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10"
            >
              <Link href="/services">
                <Button size="lg">{t('title')}</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
