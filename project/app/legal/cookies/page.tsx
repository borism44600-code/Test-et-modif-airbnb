import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/legal" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Legal
            </Link>

            <h1 className="font-serif text-4xl mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none">
              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">What Are Cookies?</h2>
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files stored on your device when you visit our website. 
                  They help us provide a better user experience by remembering your preferences 
                  and understanding how you use our site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">Types of Cookies We Use</h2>
                
                <h3 className="font-semibold text-lg mb-2 mt-6">Essential Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  Required for the website to function properly. These cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Booking process functionality</li>
                </ul>

                <h3 className="font-semibold text-lg mb-2 mt-6">Analytics Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  Help us understand how visitors interact with our website.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages</li>
                  <li>Error tracking</li>
                </ul>

                <h3 className="font-semibold text-lg mb-2 mt-6">Functional Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  Remember your preferences and settings.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Language preferences</li>
                  <li>Currency selection</li>
                  <li>Recently viewed properties</li>
                </ul>

                <h3 className="font-semibold text-lg mb-2 mt-6">Marketing Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  Used to deliver relevant advertisements and track campaign effectiveness.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can control cookies through your browser settings. Note that disabling 
                  certain cookies may affect website functionality.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Chrome: Settings &gt; Privacy and Security &gt; Cookies</li>
                  <li>Firefox: Options &gt; Privacy &amp; Security &gt; Cookies</li>
                  <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
                  <li>Edge: Settings &gt; Privacy &gt; Cookies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We use services from third parties that may set their own cookies:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Google Analytics (website analytics)</li>
                  <li>Stripe (payment processing)</li>
                  <li>Google Maps (property locations)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">Contact</h2>
                <p className="text-muted-foreground mb-4">
                  For questions about our use of cookies, contact us at privacy@marrakechriadsrent.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
