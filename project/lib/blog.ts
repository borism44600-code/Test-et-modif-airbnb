import { Locale } from '@/i18n/config'

export interface BlogPost {
  id: string
  slug: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  content: Record<Locale, string>
  coverImage: string
  category: 'guide' | 'neighborhood' | 'tips' | 'luxury' | 'comparison'
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt: string
  readingTime: number
  featured: boolean
  relatedPropertyTypes?: ('riad' | 'villa' | 'apartment')[]
  relatedLocations?: string[]
}

export interface BlogCategory {
  id: string
  slug: string
  name: Record<Locale, string>
  description: Record<Locale, string>
}

// Blog categories
export const blogCategories: BlogCategory[] = [
  {
    id: 'guide',
    slug: 'guides',
    name: {
      en: 'Travel Guides',
      fr: 'Guides de Voyage',
      es: 'Guías de Viaje',
      ar: 'دليل السفر',
      ma: 'دليل السفر',
      zh: '旅行指南'
    },
    description: {
      en: 'Comprehensive guides to help you plan your perfect Marrakech trip',
      fr: 'Guides complets pour planifier votre voyage parfait à Marrakech',
      es: 'Guías completas para planificar tu viaje perfecto a Marrakech',
      ar: 'أدلة شاملة لمساعدتك في التخطيط لرحلتك المثالية إلى مراكش',
      ma: 'أدلة شاملة باش تخطط لرحلتك المزيانة لمراكش',
      zh: '帮助您规划完美马拉喀什之旅的全面指南'
    }
  },
  {
    id: 'neighborhood',
    slug: 'neighborhoods',
    name: {
      en: 'Neighborhood Guides',
      fr: 'Guides des Quartiers',
      es: 'Guías de Barrios',
      ar: 'دليل الأحياء',
      ma: 'دليل الأحياء',
      zh: '社区指南'
    },
    description: {
      en: 'Discover the unique character of each Marrakech neighborhood',
      fr: 'Découvrez le caractère unique de chaque quartier de Marrakech',
      es: 'Descubre el carácter único de cada barrio de Marrakech',
      ar: 'اكتشف الطابع الفريد لكل حي في مراكش',
      ma: 'اكتشف شخصية كل حي فمراكش',
      zh: '发现马拉喀什每个社区的独特魅力'
    }
  },
  {
    id: 'tips',
    slug: 'tips',
    name: {
      en: 'Travel Tips',
      fr: 'Conseils de Voyage',
      es: 'Consejos de Viaje',
      ar: 'نصائح السفر',
      ma: 'نصائح السفر',
      zh: '旅行小贴士'
    },
    description: {
      en: 'Insider tips for making the most of your Marrakech stay',
      fr: 'Conseils d\'initiés pour profiter au maximum de votre séjour à Marrakech',
      es: 'Consejos de expertos para aprovechar al máximo tu estancia en Marrakech',
      ar: 'نصائح من الداخل للاستفادة القصوى من إقامتك في مراكش',
      ma: 'نصائح باش تستافد من إقامتك فمراكش',
      zh: '充分利用马拉喀什之行的内部提示'
    }
  },
  {
    id: 'comparison',
    slug: 'comparisons',
    name: {
      en: 'Comparisons',
      fr: 'Comparatifs',
      es: 'Comparaciones',
      ar: 'مقارنات',
      ma: 'مقارنات',
      zh: '比较'
    },
    description: {
      en: 'Helpful comparisons to choose the perfect accommodation',
      fr: 'Comparatifs utiles pour choisir l\'hébergement parfait',
      es: 'Comparaciones útiles para elegir el alojamiento perfecto',
      ar: 'مقارنات مفيدة لاختيار الإقامة المثالية',
      ma: 'مقارنات مفيدة باش تختار الإقامة المزيانة',
      zh: '选择理想住宿的实用比较'
    }
  }
]

// Sample blog posts for SEO
export const blogPosts: BlogPost[] = [
  {
    id: 'best-riads-marrakech',
    slug: 'best-riads-marrakech',
    title: {
      en: 'The Best Riads in Marrakech: A Complete Guide for 2024',
      fr: 'Les Meilleurs Riads de Marrakech : Guide Complet 2024',
      es: 'Los Mejores Riads de Marrakech: Guía Completa 2024',
      ar: 'أفضل رياضات مراكش: دليل شامل 2024',
      ma: 'أحسن الرياضات فمراكش: دليل كامل 2024',
      zh: '马拉喀什最佳庭院：2024年完整指南'
    },
    excerpt: {
      en: 'Discover our hand-picked selection of the finest riads in Marrakech, from intimate boutique properties to grand palatial homes.',
      fr: 'Découvrez notre sélection des plus beaux riads de Marrakech, des propriétés boutique intimistes aux grandes demeures palatiales.',
      es: 'Descubre nuestra selección de los mejores riads de Marrakech, desde propiedades boutique íntimas hasta grandes casas palaciegas.',
      ar: 'اكتشف مجموعتنا المختارة من أرقى رياضات مراكش، من العقارات البوتيكية الحميمة إلى القصور الفخمة.',
      ma: 'اكتشف تشكيلتنا ديال أحسن الرياضات فمراكش، من الرياضات الصغيرة للقصور الكبار.',
      zh: '发现我们精心挑选的马拉喀什最佳庭院，从私密精品酒店到宏伟宫殿式住宅。'
    },
    content: {
      en: `# The Best Riads in Marrakech

Marrakech's riads represent the pinnacle of traditional Moroccan architecture and hospitality. These centuries-old homes, built around serene interior courtyards, offer visitors an authentic glimpse into Moroccan life while providing modern comforts.

## What Makes a Great Riad?

When selecting our recommended riads, we consider several key factors:

### Location
The best riads are situated in prime medina locations—close enough to major attractions like Jemaa el-Fna and the souks, yet tucked away on quiet derbs (alleyways) for a peaceful night's sleep.

### Architecture & Design
Authentic architectural details are paramount: traditional zellige tilework, carved cedarwood, tadelakt plaster, and ornate plasterwork ceilings. The best riads preserve these features while thoughtfully incorporating modern updates.

### Service
From warm welcomes with mint tea to personalized breakfast service and helpful concierge assistance, the level of hospitality sets exceptional riads apart.

### Amenities
While maintaining traditional charm, top riads offer air conditioning, comfortable bedding, reliable WiFi, and often plunge pools or rooftop terraces with stunning views.

## Our Top Riad Picks

### For Romance
Intimate riads with just 3-5 rooms, rooftop dinners under the stars, and spa services create the perfect romantic getaway.

### For Families
Larger riads offering exclusive rental options provide privacy and space, with staff who welcome children and can arrange family-friendly activities.

### For Design Lovers
Restored by talented architects, some riads showcase exceptional interior design while respecting traditional elements.

### For Budget Travelers
Charming, well-maintained riads offer authentic experiences at accessible prices without sacrificing comfort or service.

## Tips for Booking Your Riad

1. **Book direct** when possible for better rates and service
2. **Ask about transfers** - navigation in the medina can be tricky
3. **Specify dietary requirements** for breakfast
4. **Inquire about rooftop access** and any private spaces
5. **Check recent reviews** for current service quality

## Conclusion

A riad stay is an essential Marrakech experience. Whether you're seeking romance, adventure, or simply a unique place to rest, there's a perfect riad waiting for you in the red city.`,
      fr: `# Les Meilleurs Riads de Marrakech

Les riads de Marrakech représentent l'apogée de l'architecture traditionnelle marocaine et de l'hospitalité. Ces maisons centenaires, construites autour de cours intérieures sereines, offrent aux visiteurs un aperçu authentique de la vie marocaine tout en proposant des conforts modernes.

## Qu'est-ce qui fait un excellent Riad ?

Pour sélectionner nos riads recommandés, nous considérons plusieurs facteurs clés :

### Emplacement
Les meilleurs riads sont situés dans des emplacements privilégiés de la médina—suffisamment proches des principales attractions comme Jemaa el-Fna et les souks, tout en étant nichés dans des derbs (ruelles) calmes pour une nuit paisible.

### Architecture & Design
Les détails architecturaux authentiques sont primordiaux : zellige traditionnel, bois de cèdre sculpté, enduit tadelakt et plafonds ornés de plâtre. Les meilleurs riads préservent ces caractéristiques tout en intégrant des mises à jour modernes.

### Service
De l'accueil chaleureux avec thé à la menthe au service de petit-déjeuner personnalisé et à l'assistance conciergerie, le niveau d'hospitalité distingue les riads exceptionnels.

### Équipements
Tout en maintenant le charme traditionnel, les meilleurs riads offrent climatisation, literie confortable, WiFi fiable, et souvent des piscines ou terrasses avec vues imprenables.

## Nos Meilleurs Choix de Riads

### Pour la Romance
Des riads intimistes de 3-5 chambres, des dîners sur le toit sous les étoiles et des services spa créent l'escapade romantique parfaite.

### Pour les Familles
Des riads plus grands offrant des options de location exclusive procurent intimité et espace, avec un personnel accueillant les enfants.

### Pour les Amoureux du Design
Restaurés par des architectes talentueux, certains riads mettent en valeur un design intérieur exceptionnel tout en respectant les éléments traditionnels.

## Conclusion

Un séjour en riad est une expérience essentielle à Marrakech. Que vous recherchiez la romance, l'aventure ou simplement un endroit unique pour vous reposer, le riad parfait vous attend dans la ville rouge.`,
      es: 'Contenido en español...',
      ar: 'المحتوى بالعربية...',
      ma: 'المحتوى بالدارجة...',
      zh: '中文内容...'
    },
    coverImage: '/images/blog/best-riads.jpg',
    category: 'guide',
    tags: ['riads', 'marrakech', 'accommodation', 'medina', 'luxury'],
    author: { name: 'Marrakech Riads Rent Team' },
    publishedAt: '2024-01-15',
    updatedAt: '2024-03-01',
    readingTime: 12,
    featured: true,
    relatedPropertyTypes: ['riad'],
    relatedLocations: ['medina', 'kasbah']
  },
  {
    id: 'where-to-stay-marrakech',
    slug: 'where-to-stay-marrakech',
    title: {
      en: 'Where to Stay in Marrakech: Neighborhood Guide',
      fr: 'Où Loger à Marrakech : Guide des Quartiers',
      es: 'Dónde Alojarse en Marrakech: Guía de Barrios',
      ar: 'أين تقيم في مراكش: دليل الأحياء',
      ma: 'فين تسكن فمراكش: دليل الأحياء',
      zh: '马拉喀什住宿指南：社区指南'
    },
    excerpt: {
      en: 'From the ancient medina to modern Gueliz, discover the best neighborhoods for your Marrakech stay based on your travel style.',
      fr: 'De la médina ancienne au Guéliz moderne, découvrez les meilleurs quartiers pour votre séjour à Marrakech selon votre style de voyage.',
      es: 'Desde la antigua medina hasta el moderno Gueliz, descubre los mejores barrios para tu estancia en Marrakech según tu estilo de viaje.',
      ar: 'من المدينة القديمة إلى جيليز الحديثة، اكتشف أفضل الأحياء لإقامتك في مراكش حسب أسلوب سفرك.',
      ma: 'من المدينة القديمة لكيليز الجديد، اكتشف أحسن الأحياء لإقامتك فمراكش.',
      zh: '从古老的麦地那到现代的盖利兹，根据您的旅行风格发现马拉喀什最佳住宿区域。'
    },
    content: {
      en: `# Where to Stay in Marrakech

Choosing where to stay in Marrakech is one of the most important decisions for your trip. Each neighborhood offers a distinct experience...`,
      fr: `# Où Loger à Marrakech

Choisir où séjourner à Marrakech est l'une des décisions les plus importantes pour votre voyage...`,
      es: 'Contenido en español...',
      ar: 'المحتوى بالعربية...',
      ma: 'المحتوى بالدارجة...',
      zh: '中文内容...'
    },
    coverImage: '/images/blog/neighborhoods.jpg',
    category: 'neighborhood',
    tags: ['neighborhoods', 'medina', 'gueliz', 'hivernage', 'palmeraie'],
    author: { name: 'Marrakech Riads Rent Team' },
    publishedAt: '2024-02-01',
    updatedAt: '2024-03-01',
    readingTime: 10,
    featured: true,
    relatedLocations: ['medina', 'gueliz', 'hivernage', 'palmeraie', 'kasbah']
  },
  {
    id: 'riad-vs-hotel-marrakech',
    slug: 'riad-vs-hotel-marrakech',
    title: {
      en: 'Riad vs Hotel in Marrakech: Which Should You Choose?',
      fr: 'Riad ou Hôtel à Marrakech : Lequel Choisir ?',
      es: 'Riad vs Hotel en Marrakech: ¿Cuál Elegir?',
      ar: 'رياض أم فندق في مراكش: أيهما تختار؟',
      ma: 'رياض ولا فندق فمراكش: شنو تختار؟',
      zh: '马拉喀什庭院vs酒店：如何选择？'
    },
    excerpt: {
      en: 'Understand the key differences between staying in a traditional riad versus a modern hotel to make the best choice for your Marrakech trip.',
      fr: 'Comprenez les différences clés entre un séjour dans un riad traditionnel et un hôtel moderne pour faire le meilleur choix.',
      es: 'Entiende las diferencias clave entre alojarse en un riad tradicional y un hotel moderno para elegir lo mejor.',
      ar: 'افهم الفروقات الرئيسية بين الإقامة في رياض تقليدي وفندق حديث لاتخاذ الخيار الأفضل.',
      ma: 'افهم الفرق بين السكن فرياض تقليدي وفندق عصري باش تختار المزيان.',
      zh: '了解传统庭院和现代酒店住宿的主要区别，为您的马拉喀什之旅做出最佳选择。'
    },
    content: {
      en: `# Riad vs Hotel in Marrakech

One of the first questions visitors ask when planning a trip to Marrakech is whether to stay in a riad or a hotel...`,
      fr: `# Riad ou Hôtel à Marrakech

L'une des premières questions que se posent les visiteurs lors de la planification d'un voyage à Marrakech est de savoir s'il faut séjourner dans un riad ou un hôtel...`,
      es: 'Contenido en español...',
      ar: 'المحتوى بالعربية...',
      ma: 'المحتوى بالدارجة...',
      zh: '中文内容...'
    },
    coverImage: '/images/blog/riad-vs-hotel.jpg',
    category: 'comparison',
    tags: ['riads', 'hotels', 'comparison', 'accommodation'],
    author: { name: 'Marrakech Riads Rent Team' },
    publishedAt: '2024-02-15',
    updatedAt: '2024-03-01',
    readingTime: 8,
    featured: false,
    relatedPropertyTypes: ['riad']
  }
]

// Helper to get blog post by slug
export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

// Helper to get posts by category
export function getBlogPostsByCategory(categoryId: string): BlogPost[] {
  return blogPosts.filter(post => post.category === categoryId)
}

// Helper to get featured posts
export function getFeaturedBlogPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured)
}

// Helper to get related posts
export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getBlogPost(currentSlug)
  if (!currentPost) return blogPosts.slice(0, limit)
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit)
}
