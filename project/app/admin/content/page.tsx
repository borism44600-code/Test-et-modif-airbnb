'use client'

import { useState } from 'react'
import { 
  FileText,
  Edit,
  Save,
  Eye,
  ChevronRight,
  Home,
  Building2,
  Users,
  HelpCircle,
  Scale,
  Mail,
  BookOpen,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/admin-layout'

interface PageContent {
  id: string
  name: string
  path: string
  icon: React.ElementType
  sections: {
    id: string
    name: string
    fields: {
      id: string
      name: string
      type: 'text' | 'textarea' | 'rich-text'
      value: string
    }[]
  }[]
  lastUpdated?: string
}

const pagesContent: PageContent[] = [
  {
    id: 'homepage',
    name: 'Homepage',
    path: '/',
    icon: Home,
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        fields: [
          { id: 'hero-title', name: 'Main Title', type: 'text', value: 'Discover Marrakech' },
          { id: 'hero-subtitle', name: 'Subtitle', type: 'text', value: 'Luxury Riads, Villas & Apartments' },
          { id: 'hero-description', name: 'Description', type: 'textarea', value: 'Experience the magic of Marrakech in our handpicked collection of authentic riads, stunning villas, and modern apartments.' },
        ]
      },
      {
        id: 'about',
        name: 'About Section',
        fields: [
          { id: 'about-title', name: 'Section Title', type: 'text', value: 'Your Gateway to Authentic Marrakech' },
          { id: 'about-content', name: 'Content', type: 'textarea', value: 'We curate the finest properties in Marrakech...' },
        ]
      },
      {
        id: 'cta',
        name: 'Call to Action',
        fields: [
          { id: 'cta-title', name: 'CTA Title', type: 'text', value: 'Ready for Your Marrakech Adventure?' },
          { id: 'cta-button', name: 'Button Text', type: 'text', value: 'Browse Properties' },
        ]
      },
    ],
    lastUpdated: '2026-03-15T10:30:00Z',
  },
  {
    id: 'riads',
    name: 'Riads Page',
    path: '/riads',
    icon: Building2,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'riads-title', name: 'Page Title', type: 'text', value: 'Authentic Riads' },
          { id: 'riads-description', name: 'Description', type: 'textarea', value: 'Discover our collection of traditional Moroccan riads in the heart of Marrakech Medina.' },
        ]
      },
    ],
    lastUpdated: '2026-03-10T14:20:00Z',
  },
  {
    id: 'villas',
    name: 'Villas Page',
    path: '/villas',
    icon: Building2,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'villas-title', name: 'Page Title', type: 'text', value: 'Luxury Villas' },
          { id: 'villas-description', name: 'Description', type: 'textarea', value: 'Escape to our stunning villas in the Palmeraie and Atlas Mountains.' },
        ]
      },
    ],
  },
  {
    id: 'apartments',
    name: 'Apartments Page',
    path: '/apartments',
    icon: Building2,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'apartments-title', name: 'Page Title', type: 'text', value: 'Modern Apartments' },
          { id: 'apartments-description', name: 'Description', type: 'textarea', value: 'Contemporary apartments in Gueliz and Hivernage.' },
        ]
      },
    ],
  },
  {
    id: 'about',
    name: 'About / Concept',
    path: '/about',
    icon: BookOpen,
    sections: [
      {
        id: 'main',
        name: 'Main Content',
        fields: [
          { id: 'about-page-title', name: 'Page Title', type: 'text', value: 'About Marrakech Riads Rent' },
          { id: 'about-page-intro', name: 'Introduction', type: 'textarea', value: 'We are passionate about sharing the beauty of Marrakech...' },
          { id: 'about-page-mission', name: 'Our Mission', type: 'textarea', value: 'To provide exceptional accommodation experiences...' },
        ]
      },
    ],
  },
  {
    id: 'services',
    name: 'Experiences / Services',
    path: '/services',
    icon: Globe,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'services-title', name: 'Page Title', type: 'text', value: 'Concierge Services' },
          { id: 'services-description', name: 'Description', type: 'textarea', value: 'Enhance your stay with our premium concierge services.' },
        ]
      },
    ],
  },
  {
    id: 'partners',
    name: 'Partners Page',
    path: '/partners',
    icon: Users,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'partners-title', name: 'Page Title', type: 'text', value: 'Our Partners' },
          { id: 'partners-description', name: 'Description', type: 'textarea', value: 'We work with the best local partners to enhance your experience.' },
        ]
      },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ',
    path: '/faq',
    icon: HelpCircle,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'faq-title', name: 'Page Title', type: 'text', value: 'Frequently Asked Questions' },
          { id: 'faq-description', name: 'Description', type: 'textarea', value: 'Find answers to common questions about booking and staying with us.' },
        ]
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Page',
    path: '/contact',
    icon: Mail,
    sections: [
      {
        id: 'header',
        name: 'Page Header',
        fields: [
          { id: 'contact-title', name: 'Page Title', type: 'text', value: 'Contact Us' },
          { id: 'contact-description', name: 'Description', type: 'textarea', value: 'Get in touch with our team for any inquiries.' },
        ]
      },
      {
        id: 'info',
        name: 'Contact Information',
        fields: [
          { id: 'contact-email', name: 'Email', type: 'text', value: 'contact@marrakechriads.com' },
          { id: 'contact-phone', name: 'Phone', type: 'text', value: '+212 5 00 00 00 00' },
          { id: 'contact-address', name: 'Address', type: 'textarea', value: 'Marrakech, Morocco' },
        ]
      },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Pages',
    path: '/legal',
    icon: Scale,
    sections: [
      {
        id: 'privacy',
        name: 'Privacy Policy',
        fields: [
          { id: 'privacy-title', name: 'Page Title', type: 'text', value: 'Privacy Policy' },
          { id: 'privacy-content', name: 'Content', type: 'rich-text', value: 'Your privacy is important to us...' },
        ]
      },
      {
        id: 'terms',
        name: 'Terms of Service',
        fields: [
          { id: 'terms-title', name: 'Page Title', type: 'text', value: 'Terms of Service' },
          { id: 'terms-content', name: 'Content', type: 'rich-text', value: 'By using our services, you agree to...' },
        ]
      },
    ],
  },
  {
    id: 'footer',
    name: 'Footer',
    path: '#footer',
    icon: FileText,
    sections: [
      {
        id: 'main',
        name: 'Footer Content',
        fields: [
          { id: 'footer-tagline', name: 'Tagline', type: 'text', value: 'Your Gateway to Authentic Marrakech' },
          { id: 'footer-copyright', name: 'Copyright Text', type: 'text', value: '2026 Marrakech Riads Rent. All rights reserved.' },
        ]
      },
      {
        id: 'social',
        name: 'Social Links',
        fields: [
          { id: 'social-instagram', name: 'Instagram URL', type: 'text', value: 'https://instagram.com/marrakechriads' },
          { id: 'social-facebook', name: 'Facebook URL', type: 'text', value: 'https://facebook.com/marrakechriads' },
        ]
      },
    ],
  },
]

export default function AdminContentPage() {
  const [pages, setPages] = useState<PageContent[]>(pagesContent)
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<PageContent['sections'][0] | null>(null)
  const [editingFields, setEditingFields] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const openEditDialog = (page: PageContent, section: PageContent['sections'][0]) => {
    setSelectedPage(page)
    setEditingSection(section)
    const fields: Record<string, string> = {}
    section.fields.forEach(field => {
      fields[field.id] = field.value
    })
    setEditingFields(fields)
    setEditDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedPage || !editingSection) return
    
    setIsSaving(true)
    
    // In production, this would save to the database/CMS
    console.log('Saving content:', editingFields)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update local state
    setPages(pages.map(page => {
      if (page.id !== selectedPage.id) return page
      return {
        ...page,
        lastUpdated: new Date().toISOString(),
        sections: page.sections.map(section => {
          if (section.id !== editingSection.id) return section
          return {
            ...section,
            fields: section.fields.map(field => ({
              ...field,
              value: editingFields[field.id] || field.value
            }))
          }
        })
      }
    }))
    
    setIsSaving(false)
    setEditDialogOpen(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AdminLayout title="Content Management">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Page Content Editor
          </h3>
          <p className="text-sm text-muted-foreground">
            Edit text content for each page of the website. Changes will be reflected on the public site after saving.
            For image management, use the Media section.
          </p>
        </div>

        {/* Pages List */}
        <div className="bg-card rounded-xl border border-border">
          <Accordion type="single" collapsible className="w-full">
            {pages.map((page) => (
              <AccordionItem key={page.id} value={page.id} className="border-b last:border-b-0">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <page.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-muted-foreground">{page.path}</p>
                    </div>
                    {page.lastUpdated && (
                      <Badge variant="outline" className="ml-auto mr-4 text-xs">
                        Updated {formatDate(page.lastUpdated)}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 pt-2">
                    {page.sections.map((section) => (
                      <div 
                        key={section.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{section.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {section.fields.length} field{section.fields.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(page, section)}
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit {editingSection?.name}
              {selectedPage && (
                <Badge variant="secondary" className="ml-2">
                  {selectedPage.name}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>Update the content for this section.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {editingSection?.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.name}</Label>
                {field.type === 'text' ? (
                  <Input
                    id={field.id}
                    value={editingFields[field.id] || ''}
                    onChange={(e) => setEditingFields({
                      ...editingFields,
                      [field.id]: e.target.value
                    })}
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={editingFields[field.id] || ''}
                    onChange={(e) => setEditingFields({
                      ...editingFields,
                      [field.id]: e.target.value
                    })}
                    rows={field.type === 'rich-text' ? 8 : 4}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
