'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { blogPosts, blogCategories, getFeaturedBlogPosts } from '@/lib/blog'
import { useI18n } from '@/i18n/provider'

export default function BlogPage() {
  const { locale } = useI18n()
  const featuredPosts = getFeaturedBlogPosts()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-6 text-center">
            <p className="luxury-subheading text-gold mb-3">Marrakech Insights</p>
            <h1 className="text-4xl md:text-5xl font-semibold luxury-heading mb-4">
              Travel Guides & Tips
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert advice, insider tips, and comprehensive guides to help you 
              plan the perfect Marrakech experience.
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      <Image
                        src={post.coverImage}
                        alt={post.title[locale] || post.title.en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                          {blogCategories.find(c => c.id === post.category)?.name[locale] || post.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title[locale] || post.title.en}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt[locale] || post.excerpt.en}
                    </p>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16 bg-secondary/20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-8">Browse by Category</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {blogCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="bg-background rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{category.name[locale] || category.name.en}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description[locale] || category.description.en}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-8">All Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-secondary/20 rounded-xl overflow-hidden"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.coverImage}
                        alt={post.title[locale] || post.title.en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {blogCategories.find(c => c.id === post.category)?.name[locale] || post.category}
                        </span>
                        <span>{post.readingTime} min</span>
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title[locale] || post.title.en}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt[locale] || post.excerpt.en}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Get Marrakech Travel Tips in Your Inbox
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Subscribe to our newsletter for exclusive guides, special offers, 
              and insider knowledge about Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
