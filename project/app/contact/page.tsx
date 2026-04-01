'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare,
  Calendar,
  Home,
  Shield,
  Star,
  HeartHandshake
} from 'lucide-react'
import { useTranslations } from '@/i18n/provider'

export default function ContactPage() {
  const t = useTranslations('contact')
  const tCommon = useTranslations('common')

  const contactReasons = [
    { value: 'booking', label: t('subject'), icon: Calendar },
    { value: 'property', label: t('message'), icon: Home },
    { value: 'partnership', label: t('name'), icon: MessageSquare },
    { value: 'other', label: tCommon('more'), icon: Mail },
  ]

  const trustFeatures = [
    { icon: Clock, title: t('hours'), description: t('hoursValue') },
    { icon: Shield, title: t('subtitle'), description: t('description') },
    { icon: Star, title: t('title'), description: t('description') }
  ]
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="luxury-subheading text-gold mb-4">{t('subtitle')}</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty mb-8">
                {t('description')}
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                {trustFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-center gap-2 text-sm">
                    <feature.icon className="w-4 h-4 text-gold" />
                    <span className="text-muted-foreground">{feature.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-2xl md:text-3xl mb-8">Contact Information</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office Address</h3>
                      <p className="text-muted-foreground">
                        123 Avenue Mohammed V<br />
                        Gueliz, Marrakech 40000<br />
                        Morocco
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:+212524000000" className="hover:text-gold transition-colors">+212 5 24 XX XX XX</a><br />
                        <a href="tel:+212600000000" className="hover:text-gold transition-colors">+212 6 XX XX XX XX (WhatsApp)</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:info@marrakechriadsrent.com" className="hover:text-gold transition-colors">info@marrakechriadsrent.com</a><br />
                        <a href="mailto:bookings@marrakechriadsrent.com" className="hover:text-gold transition-colors">bookings@marrakechriadsrent.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 7:00 PM<br />
                        Saturday: 10:00 AM - 5:00 PM<br />
                        Sunday: By appointment
                      </p>
                      <p className="text-sm text-gold mt-2">Always available for our guests</p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Options */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Prefer to Talk?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Give us a call or send a WhatsApp message - we&apos;re happy to chat.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="tel:+212524000000">
                      <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:border-gold hover:text-gold">
                        <Phone className="w-5 h-5" />
                        <span className="text-sm">Call Us</span>
                      </Button>
                    </a>
                    <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:border-gold hover:text-gold">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">WhatsApp</span>
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Reassurance */}
                <div className="mt-6 p-4 bg-gold/10 border border-gold/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">A Real Person, Every Time</p>
                      <p className="text-xs text-muted-foreground">When you reach out, you&apos;ll hear from someone on our team who knows our properties and Marrakech well.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 border border-border shadow-lg"
              >
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4">Thank You</h3>
                    <p className="text-muted-foreground mb-2">
                      We&apos;ve received your message.
                    </p>
                    <p className="text-sm text-gold mb-8">
                      We&apos;ll be in touch soon.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl mb-2">Send us a Message</h2>
                      <p className="text-sm text-muted-foreground">Fill out the form below and we&apos;ll get back to you promptly.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            required
                            className="h-12"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="h-12"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 234 567 890"
                            className="h-12"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Inquiry Type *</Label>
                          <Select 
                            value={formData.reason}
                            onValueChange={(value) => setFormData({ ...formData, reason: value })}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                              {contactReasons.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  {reason.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your inquiry, travel dates, or any questions you have..."
                          rows={5}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full gap-2 bg-gold text-black hover:bg-gold/90">
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By submitting, you agree to our privacy policy. We never share your information.
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Find Us</h2>
              <p className="text-muted-foreground">
                Located in the heart of Gueliz, easily accessible from anywhere in Marrakech
              </p>
            </div>
            <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-card border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27134.04344830943!2d-8.028244!3d31.631782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee43a3e66a63%3A0x60e0a7cbab4ecfe1!2sGu%C3%A9liz%2C%20Marrakech%2C%20Morocco!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
