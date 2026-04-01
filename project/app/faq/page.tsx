import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const faqCategories = [
  {
    title: 'Booking & Reservations',
    questions: [
      {
        question: 'How do I make a reservation?',
        answer: 'You can make a reservation directly through our website by selecting your desired property, choosing your dates, and completing the booking form. Alternatively, you can contact us via email or WhatsApp for personalized assistance.'
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation is available until 15 days before check-in (3:00 PM Marrakech time). For cancellations made more than 15 days before check-in, a portion of your stay will be retained based on the length of your booking: 1-2 nights are non-refundable, 3-7 nights retain 2 nights, 8-14 nights retain 3 nights, 15-21 nights retain 4 nights, 22-29 nights retain 5 nights, and 30+ nights retain 7 nights. Cancellations made less than 15 days before check-in are non-refundable (100% retained). The full cancellation policy is displayed during booking.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit cards (Visa, Mastercard, American Express), bank transfers, and PayPal. A deposit of 30% is required to confirm your booking, with the remaining balance due 14 days before arrival.'
      },
      {
        question: 'Can I modify my reservation after booking?',
        answer: 'Yes, modifications are possible subject to availability. Please contact us at least 7 days before your scheduled arrival. Date changes may be subject to price adjustments based on seasonal rates.'
      },
    ]
  },
  {
    title: 'Properties & Amenities',
    questions: [
      {
        question: 'What is included in the rental price?',
        answer: 'All rentals include: daily housekeeping, fresh linens and towels, WiFi, air conditioning, basic toiletries, welcome amenities (Moroccan tea, fruits, pastries), and 24/7 concierge support. Some properties also include breakfast or private chef services.'
      },
      {
        question: 'Are the properties suitable for children?',
        answer: 'Most of our properties are family-friendly. However, some riads with plunge pools or open terraces may require adult supervision. Please contact us for specific recommendations based on your children\'s ages.'
      },
      {
        question: 'Do properties have air conditioning and heating?',
        answer: 'Yes, all our properties are equipped with modern air conditioning. Most riads also have traditional fireplaces or modern heating for cooler winter evenings.'
      },
      {
        question: 'Is parking available?',
        answer: 'Parking varies by property. Medina properties typically have secure parking within a 2-5 minute walk. Villas usually have private parking. We can arrange airport transfers and recommend that guests use taxis within the Medina.'
      },
    ]
  },
  {
    title: 'Check-in & Check-out',
    questions: [
      {
        question: 'What are the check-in and check-out times?',
        answer: 'Standard check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in or late check-out can often be arranged based on availability - please inquire in advance.'
      },
      {
        question: 'How do I access the property upon arrival?',
        answer: 'Our team will meet you at a designated point (usually a nearby parking area for Medina properties) and escort you to the riad. For villas, we can provide direct access instructions. You\'ll receive detailed arrival information 48 hours before check-in.'
      },
      {
        question: 'Can you arrange airport transfers?',
        answer: 'Yes, we offer private airport transfers in comfortable vehicles. The journey from Marrakech Menara Airport to the Medina takes approximately 20-30 minutes. Please book at least 24 hours in advance.'
      },
    ]
  },
  {
    title: 'Services & Experiences',
    questions: [
      {
        question: 'Can you arrange a private chef or cooking classes?',
        answer: 'Absolutely! We work with talented local chefs who can prepare traditional Moroccan cuisine in your riad. Cooking classes are also available, including market visits to source fresh ingredients.'
      },
      {
        question: 'What excursions do you offer?',
        answer: 'We offer a wide range of excursions: Atlas Mountains day trips, desert adventures to Merzouga or Zagora, coastal visits to Essaouira, hot air balloon rides, quad biking, and guided tours of Marrakech\'s historic sites and souks.'
      },
      {
        question: 'Can you arrange spa treatments?',
        answer: 'Yes, we can arrange in-riad spa treatments including traditional hammam, massages, and beauty treatments. We also partner with the city\'s finest spas and wellness centers for those seeking a dedicated spa experience.'
      },
      {
        question: 'Do you provide recommendations for restaurants?',
        answer: 'Our concierge team has curated relationships with Marrakech\'s best restaurants and can make reservations on your behalf. We also provide a personalized guide based on your preferences.'
      },
    ]
  },
  {
    title: 'Property Owners',
    questions: [
      {
        question: 'How can I list my property with Marrakech Riads Rent?',
        answer: 'We\'re always looking for exceptional properties. Please visit our Partners page or contact us directly. Our team will arrange a property assessment and discuss our management services.'
      },
      {
        question: 'What management services do you provide?',
        answer: 'We offer comprehensive property management including: marketing and listing optimization, guest communication, booking management, housekeeping coordination, maintenance oversight, and financial reporting.'
      },
      {
        question: 'What are your commission rates?',
        answer: 'Our commission structure is competitive and depends on the level of services required. Please contact our partnerships team for a detailed proposal tailored to your property.'
      },
    ]
  },
]

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Find answers to common questions about booking, our properties, 
                services, and more.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12 last:mb-0">
                  <h2 className="font-serif text-2xl md:text-3xl mb-6">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${categoryIndex}-${index}`}
                        className="bg-card border border-border rounded-xl px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-6">
                          <span className="font-medium">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team is here to help. Reach out to us and we&apos;ll get back to you 
                as soon as possible.
              </p>
              <Link href="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
