import { PropertyCategoryPage } from '@/components/properties/property-category-page'

export default function RiadsPage() {
  return (
    <PropertyCategoryPage
      config={{
        type: 'riad',
        title: 'Our Riads',
        subtitle: 'Traditional Luxury',
        description: 'Experience authentic Moroccan hospitality in our collection of restored riads, where traditional craftsmanship meets modern comfort.',
        heroImage: '/images/categories/riads.jpg',
        pluralName: 'riads',
      }}
    />
  )
}
