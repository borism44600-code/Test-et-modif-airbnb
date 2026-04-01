'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, Users, Home, Heart, TrendingUp, Building2, Shield, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/provider'

export default function AboutPage() {
  const t = useTranslations('about')
  const tProperties = useTranslations('properties')
  const tContact = useTranslations('contact')

  const stats = [
    { number: '30+', label: tProperties('title') },
    { number: '500+', label: tProperties('guests') },
    { number: '6+', label: t('story') },
    { number: '24/7', label: t('teamText') },
  ]

  const values = [
    {
      icon: Award,
      title: t('mission'),
      description: t('missionText')
    },
    {
      icon: Users,
      title: t('team'),
      description: t('teamText')
    },
    {
      icon: Home,
      title: t('story'),
      description: t('storyText')
    },
    {
      icon: Heart,
      title: t('subtitle'),
      description: t('storyText')
    },
  ]

const investmentBenefits = [
    {
      icon: TrendingUp,
      title: t('mission'),
      description: t('missionText')
    },
    {
      icon: Building2,
      title: tProperties('title'),
      description: t('storyText')
    },
    {
      icon: Shield,
      title: t('team'),
      description: t('teamText')
    },
  ]
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="/images/hero.jpg"
              alt="About Marrakech Riads Rent"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center text-white px-6">
            <p className="luxury-subheading text-white/80 mb-4">{t('story')}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold luxury-heading">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="luxury-subheading text-muted-foreground mb-4">Our Story</p>
                <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                  A Small Team, A Considered Approach
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Marrakech Riads Rent began when we fell in love with this city - the winding 
                    medina streets, the warmth of Moroccan hospitality, and the beauty of 
                    traditional architecture. We started helping friends find places to stay, 
                    and it grew from there.
                  </p>
                  <p>
                    Today, we work with a carefully chosen selection of riads, villas, and 
                    apartments across Marrakech. We intentionally keep our collection small 
                    so we can know each property well and offer genuine recommendations.
                  </p>
                  <p>
                    We believe that finding the right place to stay makes all the difference 
                    to a trip. That&apos;s why we take the time to understand what each guest 
                    is looking for and match them with properties that suit.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  <Image
                    src="/images/categories/riads.jpg"
                    alt="Traditional Riad"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold/20 rounded-lg -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-terracotta text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-semibold mb-2">{stat.number}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="luxury-subheading text-muted-foreground mb-4">What Drives Us</p>
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading">
                Our Values
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Section */}
        <section id="invest" className="bg-foreground text-background py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="luxury-subheading text-background/60 mb-4">Thinking of Investing?</p>
                <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                  Property Opportunities in Marrakech
                </h2>
                <p className="text-background/70 leading-relaxed mb-8">
                  If you&apos;re considering purchasing a property in Marrakech - whether for 
                  personal use, rental income, or both - we&apos;re happy to share what we&apos;ve 
                  learned over the years. We can help with finding properties, navigating 
                  the process, and managing rentals if you choose to let.
                </p>
                
                <div className="space-y-6">
                  {investmentBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-background/60 text-sm">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link href="/contact" className="inline-block mt-8">
                  <Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2">
                    Discuss Investment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/categories/villas.jpg"
                    alt="Investment Property"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold luxury-heading mb-6">
                Planning a Trip to Marrakech?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Browse our properties or get in touch - we&apos;re always happy 
                to help you find the right place for your stay.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/properties">
                  <Button size="lg" className="gap-2">
                    Explore Properties
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
