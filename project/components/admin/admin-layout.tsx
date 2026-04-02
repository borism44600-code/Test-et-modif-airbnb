'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/session-provider'
import { adminLogoutAction } from '@/app/admin/actions'
import {
  Home,
  Building2,
  Calendar,
  RefreshCw,
  Users,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Shield,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Building2, label: 'Properties', href: '/admin/properties' },
  { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
  { icon: Users, label: 'Partners', href: '/admin/partners' },
  { icon: FileText, label: 'Content', href: '/admin/content' },
  { icon: ImageIcon, label: 'Media', href: '/admin/media' },
  { icon: DollarSign, label: 'Pricing & Extras', href: '/admin/pricing' },
  { icon: RefreshCw, label: 'Availability Sync', href: '/admin/calendar' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, name, isLoading } = useAuth()

  const handleSignOut = async () => {
    await adminLogoutAction()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2" target="_blank">
              <span className="font-serif text-lg font-semibold">Marrakech Riads</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{name || 'User'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  {role && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                      {role === 'admin' ? (
                        <><Shield className="w-2.5 h-2.5 mr-0.5" />Admin</>
                      ) : (
                        'Editor'
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 mt-2 text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
