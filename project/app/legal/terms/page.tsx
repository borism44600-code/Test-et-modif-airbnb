import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { ArrowLeft, Clock, AlertCircle, Calendar, CreditCard, Shield, Phone } from 'lucide-react'

export default function TermsPage() {
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

            <h1 className="font-serif text-4xl mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none">
              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome to Marrakech Riads Rent. These Terms of Service govern your use of our website, 
                  services, and rental properties. By accessing our platform or making a booking, you agree 
                  to be bound by these terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  2. Booking and Reservations
                </h2>
                <p className="text-muted-foreground mb-4">
                  When you make a booking through our platform, you enter into a rental agreement with 
                  Marrakech Riads Rent. Bookings are subject to availability and confirmation.
                </p>
                
                <h3 className="font-medium text-lg mt-6 mb-3">2.1 Booking Confirmation</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>A deposit of 30% is required to confirm your booking</li>
                  <li>The remaining balance is due 14 days before arrival</li>
                  <li>Bookings made within 14 days of arrival require full payment</li>
                  <li>All prices are quoted in Euros (EUR) unless otherwise stated</li>
                </ul>

                <h3 className="font-medium text-lg mt-6 mb-3">2.2 Check-in and Check-out</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Check-in:</strong> From 3:00 PM (15:00) Marrakech time</li>
                  <li><strong>Check-out:</strong> By 11:00 AM (11:00) Marrakech time</li>
                  <li>Early check-in or late check-out may be available upon request and may incur additional charges</li>
                </ul>

                <h3 className="font-medium text-lg mt-6 mb-3">2.3 Payment Methods</h3>
                <p className="text-muted-foreground mb-4">
                  We accept the following payment methods:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Credit/Debit cards (Visa, Mastercard, American Express)</li>
                  <li>PayPal</li>
                  <li>Bank transfer (for bookings made more than 30 days in advance)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  3. Cancellation Policy
                </h2>
                <p className="text-muted-foreground mb-4">
                  Our cancellation policy is designed to be fair to both guests and property owners. 
                  All times reference Marrakech time (Africa/Casablanca timezone).
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Free Cancellation Period
                  </h3>
                  <p className="text-muted-foreground">
                    <strong>Free cancellation is available until 15 days before check-in (3:00 PM Marrakech time).</strong> 
                    {' '}During this period, cancellation fees are based on the length of your stay as detailed below.
                  </p>
                </div>

                <h3 className="font-medium text-lg mt-6 mb-3">3.1 Cancellation Fees (More than 15 days before check-in)</h3>
                <p className="text-muted-foreground mb-4">
                  When cancelling more than 15 days before check-in at 3:00 PM Marrakech time, 
                  the following nights are retained based on the total length of your booking:
                </p>
                
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Booking Duration</th>
                        <th className="text-left py-3 px-4 font-medium">Nights Retained</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">1-2 nights</td>
                        <td className="py-3 px-4">100% retained (non-refundable)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">3-7 nights</td>
                        <td className="py-3 px-4">2 nights retained</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">8-14 nights</td>
                        <td className="py-3 px-4">3 nights retained</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">15-21 nights</td>
                        <td className="py-3 px-4">4 nights retained</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">22-29 nights</td>
                        <td className="py-3 px-4">5 nights retained</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 px-4">30+ nights</td>
                        <td className="py-3 px-4">7 nights retained</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-medium text-lg mt-6 mb-3">3.2 Late Cancellation (Less than 15 days before check-in)</h3>
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-6">
                  <p className="text-muted-foreground">
                    <strong>Cancellations made less than 15 days before check-in (3:00 PM Marrakech time) 
                    are non-refundable.</strong> The full booking amount (100%) will be retained.
                  </p>
                </div>

                <h3 className="font-medium text-lg mt-6 mb-3">3.3 Refund Processing</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Refunds for eligible cancellations are processed within 5-10 business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>PayPal refunds are processed back to your PayPal account</li>
                  <li>Bank transfer refunds may take up to 14 business days to appear in your account</li>
                </ul>

                <h3 className="font-medium text-lg mt-6 mb-3">3.4 No-Show Policy</h3>
                <p className="text-muted-foreground mb-4">
                  If you fail to arrive at the property on your check-in date without prior notice, 
                  you will be considered a &quot;no-show&quot; and no refund will be provided. The property 
                  may be released for other bookings after 24 hours.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                  4. Services and Extras
                </h2>
                <p className="text-muted-foreground mb-4">
                  Additional services can be booked during your stay or at the time of reservation.
                </p>

                <h3 className="font-medium text-lg mt-6 mb-3">4.1 Available Services</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Breakfast:</strong> Daily breakfast service (25 EUR per person)</li>
                  <li><strong>Meals:</strong> Traditional Moroccan lunch (45 EUR/adult, 25 EUR/child) and dinner (60 EUR/adult, 35 EUR/child)</li>
                  <li><strong>Airport Transfers:</strong> Private transfer to/from Marrakech Menara Airport (25-45 EUR depending on group size)</li>
                  <li><strong>Private Driver:</strong> Half-day (100 EUR) or full-day (150 EUR) private driver service</li>
                  <li><strong>Excursions:</strong> Day trips to Atlas Mountains, Essaouira, Ourika Valley, and more</li>
                  <li><strong>Spa &amp; Wellness:</strong> Traditional hammam, massages, and wellness treatments</li>
                </ul>

                <h3 className="font-medium text-lg mt-6 mb-3">4.2 Service Modification</h3>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                  <p className="text-muted-foreground">
                    <strong>Services can be modified or cancelled until 3:00 PM (Marrakech time) the day before 
                    the scheduled service.</strong> After this deadline, services are considered confirmed and 
                    cannot be refunded.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">5. Guest Responsibilities</h2>
                <p className="text-muted-foreground mb-4">
                  As a guest, you agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Treat the property with care and respect</li>
                  <li>Not exceed the maximum occupancy stated in your booking</li>
                  <li>Comply with house rules and local regulations</li>
                  <li>Report any damage or issues promptly</li>
                  <li>Leave the property in a reasonable condition</li>
                  <li>Not use the property for commercial purposes or events without prior approval</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  6. Liability and Insurance
                </h2>
                <p className="text-muted-foreground mb-4">
                  While we take every precaution to ensure your safety and comfort, Marrakech Riads Rent 
                  is not liable for personal injury, loss, or damage to personal belongings during your stay. 
                  We strongly recommend guests obtain appropriate travel insurance that covers:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Trip cancellation and interruption</li>
                  <li>Medical emergencies and evacuation</li>
                  <li>Personal liability</li>
                  <li>Loss or theft of personal belongings</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">7. Property Descriptions</h2>
                <p className="text-muted-foreground mb-4">
                  We strive to provide accurate descriptions and photographs of all properties. However, 
                  minor variations may occur. If a property differs significantly from its description, 
                  please contact us immediately upon arrival.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">8. Force Majeure</h2>
                <p className="text-muted-foreground mb-4">
                  Neither party shall be liable for failure to perform obligations due to circumstances 
                  beyond their reasonable control, including but not limited to natural disasters, pandemics, 
                  war, terrorism, government actions, or travel restrictions. In such cases, we will work 
                  with you to reschedule your booking or provide alternative solutions.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">9. Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  This agreement is governed by the laws of the Kingdom of Morocco. Any disputes 
                  shall be subject to the exclusive jurisdiction of the courts of Marrakech.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time. Changes will be posted on this 
                  page with an updated revision date. Continued use of our services after changes 
                  constitutes acceptance of the modified terms. Material changes will be communicated 
                  to registered users via email.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-primary" />
                  11. Contact
                </h2>
                <p className="text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mb-4">
                  <li><strong>Email:</strong> legal@marrakechriadsrent.com</li>
                  <li><strong>Phone:</strong> +212 5 24 XX XX XX</li>
                  <li><strong>Address:</strong> Marrakech, Morocco</li>
                </ul>
                <p className="text-muted-foreground">
                  You can also reach us through our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
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
