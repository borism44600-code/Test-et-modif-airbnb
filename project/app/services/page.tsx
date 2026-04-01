'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Car, Sparkles, Mountain, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { mockServices } from '@/lib/data'
import { useTranslations } from '@/i18n/provider'

export default function ServicesPage() {
  const t = useTranslations('services')
  const tHeader = useTranslations('header')
  const tContact = useTranslations('contact')

  const categoryInfo = {
    breakfast: {
      icon: Utensils,
      title: t('breakfast'),
      description: t('description')
    },
    meals: {
      icon: Utensils,
      title: t('meals'),
      description: t('description')
    },
    excursion: {
      icon: Mountain,
      title: t('excursions'),
      description: t('description')
    },
    spa: {
      icon: Sparkles,
      title: t('spaWellness'),
      description: t('description')
    },
    transport: {
      icon: Car,
      title: t('airportTransfer'),
      description: t('description')
    }
  }
  const groupedServices = mockServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof mockServices>)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/services/concierge.jpg"
              alt="Concierge Services"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <p className="luxury-subheading text-white/80 mb-4">{t('concierge')}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </section>

        {/* Services by Category */}
        <section className="py-24">
          <div className="container mx-auto px-6 space-y-24">
            {Object.entries(groupedServices).map(([category, services], categoryIndex) => {
              const info = categoryInfo[category as keyof typeof categoryInfo]
              const IconComponent = info?.icon || Sparkles
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  id={category}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-semibold">{info?.title || category}</h2>
                      <p className="text-muted-foreground">{info?.description}</p>
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                      <motion.article
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-card rounded-lg overflow-hidden border border-border group"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {t('subtitle')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" className="gap-2">
                  {tHeader('bookYourStay')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  {tContact('title')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
