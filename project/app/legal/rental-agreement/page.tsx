import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { ArrowLeft, Clock, Home, Users, Shield, AlertTriangle, Scale } from 'lucide-react'

export default function RentalAgreementPage() {
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

            <h1 className="font-serif text-4xl mb-4">Rental Agreement</h1>
            <p className="text-muted-foreground mb-12">Standard Terms and Conditions for Property Rental</p>

            <div className="prose prose-neutral max-w-none">
              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">1. Parties to the Agreement</h2>
                <p className="text-muted-foreground mb-4">
                  This rental agreement is between Marrakech Riads Rent SARL (&quot;the Company&quot;) and 
                  the guest making the reservation (&quot;the Guest&quot;). By completing a booking, the Guest 
                  agrees to these terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  2. Rental Period
                </h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                  <ul className="list-none text-muted-foreground space-y-2">
                    <li><strong>Check-in:</strong> From 3:00 PM (15:00) Marrakech time</li>
                    <li><strong>Check-out:</strong> By 11:00 AM (11:00) Marrakech time</li>
                  </ul>
                </div>
                <p className="text-muted-foreground mb-4">
                  Early check-in or late check-out may be arranged in advance subject to availability 
                  and may incur additional charges.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  3. Occupancy
                </h2>
                <p className="text-muted-foreground mb-4">
                  The property may only be occupied by the number of guests specified in the booking. 
                  Additional guests require prior approval and may incur additional charges. 
                  Subletting is strictly prohibited.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Maximum occupancy is stated on each property listing</li>
                  <li>Children under 2 years are not counted toward occupancy limits</li>
                  <li>Visitors must leave the property by 10:00 PM unless otherwise arranged</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">4. Security Deposit</h2>
                <p className="text-muted-foreground mb-4">
                  A security deposit may be required for certain properties. This will be clearly 
                  stated at the time of booking.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Deposit amounts typically range from 200 EUR to 1,000 EUR depending on the property</li>
                  <li>The deposit is refundable within 7 days of checkout, subject to property inspection</li>
                  <li>Any damages or excessive cleaning required will be deducted from the deposit</li>
                  <li>If damages exceed the deposit amount, additional charges may apply</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  5. Property Care
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Guest agrees to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Treat the property and its contents with care and respect</li>
                  <li>Use all amenities and appliances as intended</li>
                  <li>Report any damage or malfunction immediately to our concierge team</li>
                  <li>Not remove any items from the property</li>
                  <li>Not make any alterations to the property or its furnishings</li>
                  <li>Ensure windows and doors are properly secured when leaving the property</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">6. House Rules</h2>
                <p className="text-muted-foreground mb-4">
                  Guests must comply with house rules, which include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>No smoking:</strong> Smoking is prohibited inside all properties. Designated outdoor areas may be available</li>
                  <li><strong>No parties or events:</strong> Parties, gatherings, or events require prior written approval</li>
                  <li><strong>Quiet hours:</strong> Please respect neighbors between 10:00 PM and 8:00 AM</li>
                  <li><strong>Pet policy:</strong> Pets are not allowed unless explicitly stated in the property listing</li>
                  <li><strong>Pool safety:</strong> Children must be supervised at all times near pools. No diving in plunge pools</li>
                  <li><strong>Roof terrace:</strong> Use of roof terraces after 10:00 PM should be mindful of noise levels</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  7. Damage and Liability
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Guest is liable for any damage caused to the property during their stay, 
                  whether by the Guest, their party, or any visitors.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Minor damages will be deducted from the security deposit</li>
                  <li>Major damages may require additional payment</li>
                  <li>Intentional damage or negligence may result in legal action</li>
                  <li>Lost keys will incur a replacement fee (typically 50-150 EUR)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  8. Insurance
                </h2>
                <p className="text-muted-foreground mb-4">
                  Guests are strongly advised to obtain comprehensive travel insurance covering:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Trip cancellation and interruption</li>
                  <li>Medical emergencies and evacuation</li>
                  <li>Personal liability</li>
                  <li>Loss or theft of personal belongings</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  The Company&apos;s property insurance does not cover guests&apos; personal belongings 
                  or personal injury.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">9. Cancellation Policy</h2>
                <p className="text-muted-foreground mb-4">
                  Please refer to our <Link href="/legal/terms" className="text-primary hover:underline">Terms of Service</Link> for 
                  the complete cancellation policy. Key points:
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li><strong>Free cancellation period:</strong> Until 15 days before check-in at 3:00 PM Marrakech time</li>
                    <li><strong>Cancellation fees:</strong> Based on booking duration (2-7 nights retained depending on length of stay)</li>
                    <li><strong>Late cancellation:</strong> Less than 15 days before check-in is non-refundable (100%)</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  10. Occupancy Conditions and Legal Compliance
                </h2>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6">
                  <p className="text-muted-foreground mb-4">
                    <strong>Important notice regarding Moroccan law:</strong> In accordance with current 
                    Moroccan legislation, it is strictly prohibited for an unmarried couple, where at least 
                    one occupant is of Moroccan nationality, to stay together in the same accommodation.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    An official marriage certificate may be required at check-in or at any time during the 
                    stay if this situation arises. In the absence of this document, access to the accommodation 
                    may be refused or the stay interrupted without the possibility of a refund.
                  </p>
                </div>
                <p className="text-muted-foreground mb-4">
                  <strong>Prostitution is strictly prohibited</strong> within the establishment.
                </p>
                <p className="text-muted-foreground mb-4">
                  Only persons declared at the time of booking and present at check-in are authorized to 
                  access and stay in the accommodation. Any invitation or presence of undeclared external 
                  persons is strictly prohibited.
                </p>
                <p className="text-muted-foreground mb-4">
                  Occupants also undertake to respect all safety rules, good neighborly relations, and, 
                  where applicable, condominium regulations. Access to common facilities is exclusively 
                  reserved for authorized occupants.
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-4">
                  <p className="text-muted-foreground mb-2">
                    <strong>Any behavior deemed dangerous, illegal, or likely to harm the safety of persons, 
                    property, or the neighborhood may result in:</strong>
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Immediate termination of the stay</li>
                    <li>Expulsion without refund</li>
                    <li>If necessary, reporting to the competent authorities</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  Management reserves the right to intervene at any time in case of non-compliance with 
                  these conditions.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">11. Force Majeure</h2>
                <p className="text-muted-foreground mb-4">
                  Neither party shall be liable for failure to perform obligations due to 
                  circumstances beyond their reasonable control, including natural disasters, 
                  pandemics, war, terrorism, government actions, or travel restrictions.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-primary" />
                  12. Governing Law
                </h2>
                <p className="text-muted-foreground mb-4">
                  This agreement is governed by the laws of the Kingdom of Morocco. Any disputes 
                  shall be subject to the exclusive jurisdiction of the courts of Marrakech.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">13. Contact</h2>
                <p className="text-muted-foreground mb-4">
                  For questions about this rental agreement, please contact:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mb-4">
                  <li><strong>Email:</strong> legal@marrakechriadsrent.com</li>
                  <li><strong>Phone:</strong> +212 5 24 XX XX XX</li>
                  <li><strong>24/7 Concierge:</strong> Available via WhatsApp during your stay</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
