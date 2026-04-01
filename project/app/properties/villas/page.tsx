import { PropertyCategoryPage } from '@/components/properties/property-category-page'

export default function VillasPage() {
  return (
    <PropertyCategoryPage
      config={{
        type: 'villa',
        title: 'Our Villas',
        subtitle: 'Private Estates',
        description: 'Discover spacious private estates with stunning pools, gardens, and breathtaking views of the Atlas Mountains.',
        heroImage: '/images/categories/villas.jpg',
        pluralName: 'villas',
      }}
    />
  )
}
