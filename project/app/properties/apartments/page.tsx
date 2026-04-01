import { PropertyCategoryPage } from '@/components/properties/property-category-page'

export default function ApartmentsPage() {
  return (
    <PropertyCategoryPage
      config={{
        type: 'apartment',
        title: 'Our Apartments',
        subtitle: 'Modern Living',
        description: 'Contemporary residences in prime locations, perfect for the modern traveler seeking style and convenience.',
        heroImage: '/images/categories/apartments.jpg',
        pluralName: 'apartments',
      }}
    />
  )
}
