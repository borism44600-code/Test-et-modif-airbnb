import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/session-provider'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Marrakech Riads Rent',
  description: 'Manage properties, bookings, and partners',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
