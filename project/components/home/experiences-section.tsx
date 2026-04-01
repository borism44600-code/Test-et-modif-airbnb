'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from '@/i18n/provider'

export function ExperiencesSection() {
  const t = useTranslations('services')

  const experiences = [
    {
      title: t('meals'),
      description: t('description'),
      image: '/images/experiences/sunset.jpg'
    },
    {
      title: t('excursions'),
      description: t('description'),
      image: '/images/categories/villas.jpg'
    },
    {
      title: t('spaWellness'),
      description: t('description'),
      image: '/images/services/concierge.jpg'
    },
    {
      title: t('concierge'),
      description: t('description'),
      image: '/images/categories/riads.jpg'
    }
  ]
  return (
    <section className="py-24 md:py-32 bg-terracotta text-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="luxury-subheading text-white/70 mb-4">{t('subtitle')}</p>
          <h2 className="text-3xl md:text-5xl font-semibold luxury-heading">
            {t('title')}
          </h2>
        </motion.div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="/services" className="group block">
                <article className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h3 className="text-lg font-semibold mb-2 flex items-start gap-2">
                      <span>{exp.title}</span>
                      <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
