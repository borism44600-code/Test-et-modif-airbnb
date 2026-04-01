'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Sparkles, Mountain, Activity, Car, ExternalLink, Tag } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { mockPartners } from '@/lib/data'
import { useTranslations } from '@/i18n/provider'

export default function PartnersPage() {
  const t = useTranslations('partners')
  const tServices = useTranslations('services')
  const tContact = useTranslations('contact')

  const categoryInfo = {
    restaurant: {
      icon: Utensils,
      title: tServices('meals'),
      description: t('description')
    },
    spa: {
      icon: Sparkles,
      title: tServices('spaWellness'),
      description: t('description')
    },
    tour: {
      icon: Mountain,
      title: tServices('excursions'),
      description: t('description')
    },
    activity: {
      icon: Activity,
      title: tServices('title'),
      description: t('description')
    },
    transport: {
      icon: Car,
      title: tServices('airportTransfer'),
      description: t('description')
    }
  }
  const groupedPartners = mockPartners.reduce((acc, partner) => {
    if (!acc[partner.category]) {
      acc[partner.category] = []
    }
    acc[partner.category].push(partner)
    return acc
  }, {} as Record<string, typeof mockPartners>)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/experiences/sunset.jpg"
              alt="Our Partners"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <p className="luxury-subheading text-white/80 mb-4">{t('subtitle')}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </section>

        {/* Partners by Category */}
        <section className="py-24">
          <div className="container mx-auto px-6 space-y-20">
            {Object.entries(groupedPartners).map(([category, partners]) => {
              const info = categoryInfo[category as keyof typeof categoryInfo]
              const IconComponent = info?.icon || Activity
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
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

                  {/* Partners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partners.map((partner, index) => (
                      <motion.article
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-card rounded-lg overflow-hidden border border-border flex flex-col md:flex-row"
                      >
                        <div className="relative md:w-48 aspect-video md:aspect-auto flex-shrink-0">
                          <Image
                            src={partner.image}
                            alt={partner.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                            {partner.description}
                          </p>
                          
                          {/* Discount Code */}
                          {partner.discountCode && (
                            <div className="flex items-center gap-2 mt-4 p-3 bg-gold/10 rounded-lg">
                              <Tag className="w-4 h-4 text-gold" />
                              <span className="text-sm">
                                Use code: <span className="font-mono font-semibold">{partner.discountCode}</span>
                              </span>
                            </div>
                          )}

                          {/* Booking Procedure */}
                          {partner.bookingProcedure && (
                            <p className="mt-4 text-sm text-muted-foreground italic">
                              {partner.bookingProcedure}
                            </p>
                          )}
                          
                          {/* Website Link */}
                          {partner.website && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-4 text-primary text-sm hover:underline"
                            >
                              {tContact('title')}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Become a Partner CTA */}
        <section className="bg-foreground text-background py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {t('subtitle')}
            </h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              {t('description')}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                {tContact('title')}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
