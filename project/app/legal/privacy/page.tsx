import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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

            <h1 className="font-serif text-4xl mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none">
              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Booking details and preferences</li>
                  <li>Communications with our team</li>
                  <li>Identity verification documents when required</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use collected information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Process and manage your bookings</li>
                  <li>Communicate with you about your reservation</li>
                  <li>Provide customer support</li>
                  <li>Send relevant updates and marketing communications (with consent)</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Property owners and managers (as needed for your stay)</li>
                  <li>Service providers (payment processors, email services)</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">4. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate security measures to protect your personal information, 
                  including encryption, secure servers, and regular security assessments. However, 
                  no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground mb-4">
                  We retain your personal information for as long as necessary to provide our services 
                  and comply with legal obligations. Booking records are typically retained for 7 years 
                  for accounting purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">7. International Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Your information may be transferred to and processed in countries other than Morocco. 
                  We ensure appropriate safeguards are in place to protect your data in accordance 
                  with applicable laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-serif text-2xl mb-4">8. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  For privacy-related inquiries, please contact our Data Protection Officer at 
                  privacy@marrakechriadsrent.com.
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
