'use server'

import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'property-images'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

// Upload image to Supabase Storage
export async function uploadImage(
  file: File,
  folder: string = 'properties'
): Promise<UploadResult> {
  const supabase = await createClient()
  
  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${randomString}.${extension}`
  const path = `${folder}/${filename}`
  
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Error uploading image:', error)
    return { url: '', path: '', error: error.message }
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
  
  return {
    url: urlData.publicUrl,
    path: data.path
  }
}

// Upload multiple images
export async function uploadImages(
  files: File[],
  folder: string = 'properties'
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map(file => uploadImage(file, folder))
  )
  return results
}

// Delete image from storage
export async function deleteImage(path: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])
  
  if (error) {
    console.error('Error deleting image:', error)
    return false
  }
  
  return true
}

// Delete multiple images
export async function deleteImages(paths: string[]): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(paths)
  
  if (error) {
    console.error('Error deleting images:', error)
    return false
  }
  
  return true
}

// Get signed URL for private images (if needed)
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn)
  
  if (error) {
    console.error('Error creating signed URL:', error)
    return null
  }
  
  return data.signedUrl
}

// List files in a folder
export async function listFiles(folder: string): Promise<string[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })
  
  if (error) {
    console.error('Error listing files:', error)
    return []
  }
  
  return data.map(file => `${folder}/${file.name}`)
}
