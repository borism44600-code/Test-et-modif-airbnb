'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ContentBlockFormData {
  page_id: string
  section_id: string
  language?: string
  title?: string
  subtitle?: string
  body?: string
  cta_text?: string
  cta_url?: string
  image_url?: string
  image_alt?: string
  metadata?: Record<string, unknown>
}

// Get all content blocks
export async function getContentBlocks() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('page_id', { ascending: true })
    .order('section_id', { ascending: true })
  
  if (error) {
    console.error('Error fetching content blocks:', error)
    throw new Error('Failed to fetch content blocks')
  }
  
  return data
}

// Get content for a specific page
export async function getPageContent(pageId: string, language?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('site_content')
    .select('*')
    .eq('page_id', pageId)
    .order('section_id', { ascending: true })
  
  if (language) {
    query = query.eq('language', language)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching page content:', error)
    return []
  }
  
  return data
}

// Get single content block
export async function getContentBlock(pageId: string, sectionId: string, language: string = 'en') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page_id', pageId)
    .eq('section_id', sectionId)
    .eq('language', language)
    .single()
  
  if (error) {
    // Return null if not found, don't throw
    return null
  }
  
  return data
}

// Create or update content block (upsert)
export async function upsertContentBlock(formData: ContentBlockFormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_content')
    .upsert({
      page_id: formData.page_id,
      section_id: formData.section_id,
      language: formData.language || 'en',
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      cta_text: formData.cta_text,
      cta_url: formData.cta_url,
      image_url: formData.image_url,
      image_alt: formData.image_alt,
      metadata: formData.metadata,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page_id,section_id,language'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting content block:', error)
    throw new Error('Failed to save content block')
  }
  
  // Revalidate the affected page
  revalidatePath('/admin/content')
  revalidatePath(`/${formData.page_id === 'home' ? '' : formData.page_id}`)
  
  return data
}

// Delete content block
export async function deleteContentBlock(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting content block:', error)
    throw new Error('Failed to delete content block')
  }
  
  revalidatePath('/admin/content')
  
  return true
}

// Get all content organized by page
export async function getContentByPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('page_id', { ascending: true })
    .order('section_id', { ascending: true })
  
  if (error) {
    console.error('Error fetching content by page:', error)
    return {}
  }
  
  const grouped = data.reduce((acc, content) => {
    if (!acc[content.page_id]) acc[content.page_id] = {}
    acc[content.page_id][content.section_id] = content
    return acc
  }, {} as Record<string, Record<string, typeof data[0]>>)
  
  return grouped
}

// Bulk update multiple content blocks
export async function bulkUpdateContent(blocks: ContentBlockFormData[]) {
  const supabase = await createClient()
  
  const results = await Promise.all(
    blocks.map(block => 
      supabase
        .from('site_content')
        .upsert({
          page_id: block.page_id,
          section_id: block.section_id,
          language: block.language || 'en',
          title: block.title,
          subtitle: block.subtitle,
          body: block.body,
          cta_text: block.cta_text,
          cta_url: block.cta_url,
          image_url: block.image_url,
          image_alt: block.image_alt,
          metadata: block.metadata,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id,section_id,language'
        })
    )
  )
  
  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    console.error('Errors in bulk update:', errors)
    throw new Error('Some content blocks failed to save')
  }
  
  revalidatePath('/admin/content')
  revalidatePath('/')
  
  return true
}
