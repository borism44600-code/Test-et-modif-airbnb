import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { FileText, Shield, Cookie, Scale } from 'lucide-react'

const legalPages = [
  {
    title: 'Terms of Service',
    description: 'Our terms and conditions governing the use of our services and platform.',
    href: '/legal/terms',
    icon: FileText,
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information.',
    href: '/legal/privacy',
    icon: Shield,
  },
  {
    title: 'Cookie Policy',
    description: 'Information about the cookies we use and how to manage them.',
    href: '/legal/cookies',
    icon: Cookie,
  },
  {
    title: 'Rental Agreement',
    description: 'Standard rental terms and conditions for property bookings.',
    href: '/legal/rental-agreement',
    icon: Scale,
  },
]

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">
                Legal Information
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Important legal documents and policies governing our services.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Pages Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {legalPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <page.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                      {page.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Company Information */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl mb-8 text-center">Company Information</h2>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Company Name</dt>
                    <dd className="font-medium">Marrakech Riads Rent SARL</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Registration Number</dt>
                    <dd className="font-medium">RC 12345 - Marrakech</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Tax ID (ICE)</dt>
                    <dd className="font-medium">001234567890123</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Registered Address</dt>
                    <dd className="font-medium">123 Avenue Mohammed V, Gueliz, Marrakech 40000, Morocco</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Contact Email</dt>
                    <dd className="font-medium">legal@marrakechriadsrent.com</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
