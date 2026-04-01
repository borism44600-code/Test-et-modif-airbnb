'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag, Share2, Facebook, Twitter } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { getBlogPost, getRelatedBlogPosts, blogCategories } from '@/lib/blog'
import { useI18n } from '@/i18n/provider'
import ReactMarkdown from 'react-markdown'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { locale } = useI18n()
  const post = getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedBlogPosts(slug, 3)
  const category = blogCategories.find(c => c.id === post.category)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <span>/</span>
            <span className="text-foreground">{post.title[locale] || post.title.en}</span>
          </nav>
        </div>

        {/* Hero */}
        <article>
          <header className="container mx-auto px-6 py-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {category?.name[locale] || post.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold luxury-heading mb-6">
                {post.title[locale] || post.title.en}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt[locale] || post.excerpt.en}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
                <span>By {post.author.name}</span>
              </div>
            </motion.div>
          </header>

          {/* Cover Image */}
          <div className="relative w-full aspect-[21/9] mb-12">
            <Image
              src={post.coverImage}
              alt={post.title[locale] || post.title.en}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            >
              <ReactMarkdown>
                {post.content[locale] || post.content.en}
              </ReactMarkdown>
            </motion.div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t">
              <span className="text-sm text-muted-foreground">Share this article:</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-9 h-9">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-secondary/20 mt-16">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-semibold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-background rounded-xl overflow-hidden"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title[locale] || relatedPost.title.en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title[locale] || relatedPost.title.en}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Ready to Experience Marrakech?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse our collection of handpicked riads, villas, and apartments 
              for your perfect Marrakech stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg">Browse Properties</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
