import { Property, Partner, Service, BookingAddon } from './types'

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Riad Jardin Secret',
    slug: 'riad-jardin-secret',
    type: 'riad',
    status: 'published',
    subtitle: 'Authentic Moroccan Riad with Mountain Views',
    description: 'Nestled in the heart of the ancient Medina, Riad Jardin Secret is a masterpiece of traditional Moroccan architecture. This stunning property features intricate zellige tilework, hand-carved cedar wood ceilings, and a tranquil central courtyard with a refreshing plunge pool. Each of the five suites has been meticulously restored to showcase authentic craftsmanship while offering modern comforts. Wake up to the sound of birds in the orange trees and enjoy breakfast on the sun-drenched terrace with panoramic views of the Atlas Mountains.',
    shortDescription: 'An exquisite 5-bedroom riad in the heart of the Medina with stunning mountain views.',
    pricePerNight: 450,
    currency: 'EUR',
    priceDisplayNote: 'Includes breakfast & daily housekeeping',
    location: {
      city: 'Marrakech',
      district: 'Medina of Marrakech',
      subDistrict: 'Mouassine'
    },
    features: {
      heatedPool: false,
      unheatedPool: false,
      heatedPlungePool: true,
      unheatedPlungePool: false,
      jacuzzi: true,
      hammam: true,
      bathtub: true,
      fireplace: true,
      terrace: true,
      rooftop: true,
      privateTerminate: true,
      wifi: true,
      airConditioning: true,
      breakfastPossible: true,
      mealsPossible: true,
      airportTransferPossible: true,
      privateDriverPossible: true,
      excursionsPossible: true,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: true,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      mountainView: true,
      koutboubiaView: false,
      mouleyYazidView: false,
      monumentsView: true,
      souks: true
    },
    parking: 'walk-3-min',
    images: [
      '/images/properties/riad-1-1.jpg',
      '/images/properties/riad-1-2.jpg',
      '/images/properties/riad-1-3.jpg',
      '/images/properties/riad-1-4.jpg'
    ],
    numberOfBedrooms: 5,
    bathrooms: 5,
    bedroomGuestCapacity: 8,
    additionalGuestCapacity: 2,
    totalGuestCapacity: 10,
    sleepingArrangements: [
      {
        roomName: 'Bedroom 1',
        roomType: 'bedroom',
        beds: [
          { type: 'king', quantity: 1 },
          { type: 'single', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'both'
      },
      {
        roomName: 'Bedroom 2',
        roomType: 'bedroom',
        beds: [
          { type: 'single', quantity: 1 },
          { type: 'sofa-bed-single', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 3',
        roomType: 'bedroom',
        beds: [
          { type: 'queen', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'bathtub'
      },
      {
        roomName: 'Bedroom 4',
        roomType: 'bedroom',
        beds: [
          { type: 'double', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 5',
        roomType: 'bedroom',
        beds: [
          { type: 'single', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Living Room',
        roomType: 'living-room',
        beds: [
          { type: 'sofa-bed-double', quantity: 1 }
        ],
        notes: 'Additional sleeping space'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Daily Housekeeping', 'Concierge Service', 'Airport Transfer Available'],
    availability: [
      { start: '2026-01-01', end: '2026-04-10' },
      { start: '2026-04-20', end: '2026-06-30' },
      { start: '2026-07-15', end: '2026-12-31' }
    ],
    featured: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '2',
    title: 'Villa Palmeraie Oasis',
    type: 'villa',
    description: 'Experience the ultimate in luxury living at Villa Palmeraie Oasis. Set within the legendary Palmeraie palm grove, this magnificent villa spans over 2000 square meters of manicured gardens. The property features a heated infinity pool, private tennis court, and extensive outdoor entertainment areas. Inside, find six elegantly appointed bedrooms, a gourmet kitchen, and living spaces that seamlessly blend Moroccan artistry with contemporary design. The dedicated staff ensures an impeccable experience throughout your stay.',
    shortDescription: 'A magnificent 6-bedroom villa in the Palmeraie with private pool and tennis court.',
    pricePerNight: 1200,
    location: {
      district: 'Palmeraie',
      distanceFromCenter: 'less-15-min'
    },
    features: {
      heatedPool: true,
      unheatedPool: false,
      jacuzzi: true,
      hammam: true,
      bathtub: true,
      fireplace: true,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: true,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      privateTerminate: true,
      terrace: true,
      mountainView: true,
      koutboubiaView: false,
      mouleyYazidView: false,
      monumentsView: false,
      souks: false
    },
    parking: 'private',
    images: [
      '/images/properties/villa-1-1.jpg',
      '/images/properties/villa-1-2.jpg',
      '/images/properties/villa-1-3.jpg',
      '/images/properties/villa-1-4.jpg'
    ],
    numberOfBedrooms: 6,
    bathrooms: 7,
    bedroomGuestCapacity: 10,
    additionalGuestCapacity: 2,
    totalGuestCapacity: 12,
    sleepingArrangements: [
      {
        roomName: 'Master Suite',
        roomType: 'bedroom',
        beds: [{ type: 'king', quantity: 1 }],
        ensuite: true,
        bathroomType: 'both'
      },
      {
        roomName: 'Bedroom 2',
        roomType: 'bedroom',
        beds: [{ type: 'king', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 3',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 4',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'bathtub'
      },
      {
        roomName: 'Bedroom 5',
        roomType: 'bedroom',
        beds: [
          { type: 'single', quantity: 2 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 6',
        roomType: 'bedroom',
        beds: [
          { type: 'single', quantity: 2 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Living Room',
        roomType: 'living-room',
        beds: [{ type: 'sofa-bed-double', quantity: 1 }],
        notes: 'Additional sleeping space'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Private Chef Available', 'Tennis Court', 'Daily Housekeeping', 'Security'],
    availability: [
      { start: '2026-01-01', end: '2026-03-31' },
      { start: '2026-04-11', end: '2026-07-14' },
      { start: '2026-08-01', end: '2026-12-31' }
    ],
    featured: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '3',
    title: 'Apartment Hivernage Elite',
    type: 'apartment',
    description: 'Located in the prestigious Hivernage district, this sophisticated apartment offers the perfect blend of location and luxury. Just steps from the finest restaurants and boutiques, the property features floor-to-ceiling windows, designer furnishings, and a private balcony overlooking the gardens. The two-bedroom layout provides ample space for couples or small families seeking an upscale urban retreat.',
    shortDescription: 'A chic 2-bedroom apartment in prestigious Hivernage with designer finishes.',
    pricePerNight: 180,
    location: {
      district: 'Hivernage'
    },
    features: {
      heatedPool: false,
      unheatedPool: false,
      jacuzzi: false,
      hammam: false,
      bathtub: true,
      fireplace: false,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: true,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      privateTerminate: true,
      terrace: false,
      mountainView: false,
      koutboubiaView: false,
      mouleyYazidView: false,
      monumentsView: false,
      souks: false
    },
    parking: 'private',
    images: [
      '/images/properties/apt-1-1.jpg',
      '/images/properties/apt-1-2.jpg',
      '/images/properties/apt-1-3.jpg'
    ],
    numberOfBedrooms: 2,
    bathrooms: 2,
    bedroomGuestCapacity: 3,
    additionalGuestCapacity: 1,
    totalGuestCapacity: 4,
    sleepingArrangements: [
      {
        roomName: 'Master Bedroom',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Bedroom 2',
        roomType: 'bedroom',
        beds: [{ type: 'single', quantity: 1 }],
        ensuite: false
      },
      {
        roomName: 'Living Room',
        roomType: 'living-room',
        beds: [{ type: 'sofa-bed-single', quantity: 1 }],
        notes: 'Pull-out sofa bed'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Gym Access', 'Concierge', 'Underground Parking'],
    availability: [
      { start: '2026-01-01', end: '2026-12-31' }
    ],
    featured: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '4',
    title: 'Riad Ambre & Épices',
    type: 'riad',
    description: 'A hidden gem tucked away in the enchanting Derb el Bacha quarter, Riad Ambre & Épices captivates with its warm ochre walls and aromatic gardens filled with jasmine and rose. The four intimate suites feature antique Berber textiles, copper lanterns, and the finest Egyptian cotton linens. Enjoy traditional mint tea by the fountain or dine under the stars on the romantic rooftop terrace.',
    shortDescription: 'An intimate 4-bedroom riad with aromatic gardens in Derb el Bacha.',
    pricePerNight: 320,
    location: {
      district: 'Medina of Marrakech',
      subDistrict: 'Derb el Bacha'
    },
    features: {
      heatedPool: false,
      unheatedPool: true,
      jacuzzi: false,
      hammam: true,
      bathtub: true,
      fireplace: true,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: false,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      privateTerminate: false,
      terrace: true,
      mountainView: false,
      koutboubiaView: true,
      mouleyYazidView: false,
      monumentsView: true,
      souks: true
    },
    parking: 'walk-5-min',
    images: [
      '/images/properties/riad-2-1.jpg',
      '/images/properties/riad-2-2.jpg',
      '/images/properties/riad-2-3.jpg'
    ],
    numberOfBedrooms: 4,
    bathrooms: 4,
    bedroomGuestCapacity: 6,
    additionalGuestCapacity: 2,
    totalGuestCapacity: 8,
    sleepingArrangements: [
      {
        roomName: 'Ambre Suite',
        roomType: 'bedroom',
        beds: [{ type: 'king', quantity: 1 }],
        ensuite: true,
        bathroomType: 'both'
      },
      {
        roomName: 'Épices Suite',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Rose Room',
        roomType: 'bedroom',
        beds: [{ type: 'double', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Jasmine Room',
        roomType: 'bedroom',
        beds: [{ type: 'single', quantity: 2 }],
        ensuite: true,
        bathroomType: 'bathtub'
      },
      {
        roomName: 'Salon',
        roomType: 'living-room',
        beds: [{ type: 'sofa-bed-double', quantity: 1 }],
        notes: 'Traditional Moroccan salon with sofa bed'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Daily Housekeeping', 'Breakfast Included'],
    availability: [
      { start: '2026-01-01', end: '2026-12-31' }
    ],
    featured: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '5',
    title: 'Villa Atlas Retreat',
    type: 'villa',
    description: 'Perched on the foothills of the Atlas Mountains, this extraordinary villa offers unparalleled views and absolute privacy. The contemporary Moroccan design features clean lines accented with traditional craftsmanship. Four luxurious suites, an infinity pool that seems to merge with the horizon, and extensive gardens create the perfect setting for unforgettable moments. A private chef and butler service ensure every detail is attended to.',
    shortDescription: 'A contemporary 4-bedroom villa with breathtaking Atlas Mountain views.',
    pricePerNight: 950,
    location: {
      district: 'Atlas Foothills',
      distanceFromCenter: 'less-30-min'
    },
    features: {
      heatedPool: true,
      unheatedPool: false,
      jacuzzi: true,
      hammam: true,
      bathtub: true,
      fireplace: true,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: true,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      privateTerminate: true,
      terrace: true,
      mountainView: true,
      koutboubiaView: false,
      mouleyYazidView: false,
      monumentsView: false,
      souks: false
    },
    parking: 'private',
    images: [
      '/images/properties/villa-2-1.jpg',
      '/images/properties/villa-2-2.jpg',
      '/images/properties/villa-2-3.jpg',
      '/images/properties/villa-2-4.jpg'
    ],
    numberOfBedrooms: 4,
    bathrooms: 5,
    bedroomGuestCapacity: 7,
    additionalGuestCapacity: 1,
    totalGuestCapacity: 8,
    sleepingArrangements: [
      {
        roomName: 'Master Suite',
        roomType: 'bedroom',
        beds: [{ type: 'king', quantity: 1 }],
        ensuite: true,
        bathroomType: 'both'
      },
      {
        roomName: 'Mountain View Suite',
        roomType: 'bedroom',
        beds: [{ type: 'king', quantity: 1 }],
        ensuite: true,
        bathroomType: 'both'
      },
      {
        roomName: 'Garden Suite',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Pool Suite',
        roomType: 'bedroom',
        beds: [
          { type: 'single', quantity: 1 },
          { type: 'sofa-bed-single', quantity: 1 }
        ],
        ensuite: true,
        bathroomType: 'shower'
      },
      {
        roomName: 'Living Pavilion',
        roomType: 'living-room',
        beds: [{ type: 'sofa-bed-single', quantity: 1 }],
        notes: 'Day bed that converts to single'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Private Chef', 'Butler Service', 'Helipad', 'Daily Housekeeping'],
    availability: [
      { start: '2026-01-01', end: '2026-12-31' }
    ],
    featured: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '6',
    title: 'Apartment Guéliz Moderne',
    type: 'apartment',
    description: 'In the vibrant heart of Guéliz, this modern apartment offers a stylish base for exploring the new city. The open-plan living space features contemporary art, a fully equipped kitchen, and a sunny balcony perfect for morning coffee. Walking distance to galleries, cafes, and the famous Majorelle Garden, this is ideal for culture enthusiasts and urban explorers.',
    shortDescription: 'A stylish 1-bedroom apartment in trendy Guéliz near Majorelle Garden.',
    pricePerNight: 120,
    location: {
      district: 'Guéliz'
    },
    features: {
      heatedPool: false,
      unheatedPool: false,
      jacuzzi: false,
      hammam: false,
      bathtub: false,
      fireplace: false,
      gasStove: true,
      washingMachine: true,
      iron: true,
      dishwasher: true,
      oven: true,
      coffeeMachine: true,
      fridge: true,
      privateTerminate: true,
      terrace: false,
      mountainView: false,
      koutboubiaView: false,
      mouleyYazidView: false,
      monumentsView: false,
      souks: false
    },
    parking: 'nearby',
    images: [
      '/images/properties/apt-2-1.jpg',
      '/images/properties/apt-2-2.jpg',
      '/images/properties/apt-2-3.jpg'
    ],
    numberOfBedrooms: 1,
    bathrooms: 1,
    bedroomGuestCapacity: 2,
    additionalGuestCapacity: 0,
    totalGuestCapacity: 2,
    sleepingArrangements: [
      {
        roomName: 'Bedroom',
        roomType: 'bedroom',
        beds: [{ type: 'queen', quantity: 1 }],
        ensuite: true,
        bathroomType: 'shower'
      }
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Balcony'],
    availability: [
      { start: '2026-01-01', end: '2026-12-31' }
    ],
    featured: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  }
]

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'La Mamounia Restaurant',
    category: 'restaurant',
    description: 'Experience exceptional Moroccan and international cuisine in one of the world\'s most legendary hotels. Our partnership ensures priority reservations and a complimentary welcome drink.',
    image: '/images/partners/restaurant-1.jpg',
    website: 'https://www.mamounia.com',
    discountCode: 'RIADSRENT15'
  },
  {
    id: '2',
    name: 'Spa Mythique',
    category: 'spa',
    description: 'Indulge in traditional hammam rituals and luxury spa treatments. Exclusive packages available for our guests including signature massages and beauty treatments.',
    image: '/images/partners/spa-1.jpg',
    website: 'https://www.spamythique.com',
    discountCode: 'RIADSWELLNESS'
  },
  {
    id: '3',
    name: 'Atlas Excursions',
    category: 'tour',
    description: 'Discover the beauty of Morocco with our expert guides. From desert adventures to mountain treks, we curate unforgettable experiences tailored to your interests.',
    image: '/images/partners/tour-1.jpg',
    website: 'https://www.atlasexcursions.com'
  },
  {
    id: '4',
    name: 'Quad & Camel Adventures',
    category: 'activity',
    description: 'Experience the thrill of the desert with quad biking excursions and authentic camel rides through the Palmeraie. Perfect for adventure seekers.',
    image: '/images/partners/activity-1.jpg',
    website: 'https://www.quadcameladventures.com'
  },
  {
    id: '5',
    name: 'Elite Transfer Marrakech',
    category: 'transport',
    description: 'Premium airport transfers and private chauffeur services. Our fleet of luxury vehicles ensures comfortable and stylish transportation throughout your stay.',
    image: '/images/partners/transport-1.jpg',
    bookingProcedure: 'Contact us 24h in advance for airport pickup. Private day hire available.'
  }
]

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Gourmet Breakfast',
    description: 'Start your day with a traditional Moroccan breakfast served in your riad. Fresh-baked msemen, beghrir, local honey, seasonal fruits, and aromatic mint tea.',
    image: '/images/services/breakfast.jpg',
    category: 'breakfast'
  },
  {
    id: '2',
    name: 'Private Chef Service',
    description: 'Experience authentic Moroccan cuisine prepared by our talented chefs. From traditional tagines to modern fusion dishes, customized to your preferences.',
    image: '/images/services/chef.jpg',
    category: 'meals'
  },
  {
    id: '3',
    name: 'Desert Excursion',
    description: 'Journey into the Agafay Desert for an unforgettable experience. Includes camel rides, sunset views, and a traditional Berber dinner under the stars.',
    image: '/images/services/desert.jpg',
    category: 'excursion'
  },
  {
    id: '4',
    name: 'In-Riad Spa',
    description: 'Bring the spa to you with our in-property massage and beauty treatments. Professional therapists provide hammam rituals and relaxation therapies.',
    image: '/images/services/spa.jpg',
    category: 'spa'
  },
  {
    id: '5',
    name: 'Airport Transfer',
    description: 'Seamless arrivals and departures with our premium airport transfer service. Meet and greet at the terminal with luxury vehicle transport.',
    image: '/images/services/transfer.jpg',
    category: 'transport'
  },
  {
    id: '6',
    name: 'Private Driver',
    description: 'Explore Marrakech and beyond with your own dedicated driver. Available for half-day, full-day, or multi-day excursions.',
    image: '/images/services/driver.jpg',
    category: 'transport'
  }
]

export const mockAddons: BookingAddon[] = [
  {
    id: '1',
    name: 'Breakfast Service',
    description: 'Traditional Moroccan breakfast served daily',
    pricePerPerson: 25,
    image: '/images/addons/breakfast.jpg'
  },
  {
    id: '2',
    name: 'Airport Transfer',
    description: 'Private transfer to/from Marrakech Menara Airport',
    priceFlat: 45,
    image: '/images/addons/transfer.jpg'
  },
  {
    id: '3',
    name: 'Private Chef (per meal)',
    description: 'Gourmet Moroccan meal prepared in your property',
    pricePerPerson: 60,
    image: '/images/addons/chef.jpg'
  },
  {
    id: '4',
    name: 'In-Room Massage',
    description: '60-minute relaxation massage',
    pricePerPerson: 80,
    image: '/images/addons/massage.jpg'
  },
  {
    id: '5',
    name: 'Daily Driver',
    description: 'Private driver for full day excursions',
    priceFlat: 150,
    image: '/images/addons/driver.jpg'
  }
]

// Aliases for consistent naming across the app
export const properties = mockProperties
export const partners = mockPartners
export const services = mockServices
export const addons = mockAddons
