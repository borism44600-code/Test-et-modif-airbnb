'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { 
  Upload, X, GripVertical, Link2, Plus, ImageIcon, 
  Star, Trash2, ExternalLink, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  single?: boolean
  label?: string
  description?: string
  accept?: string
  className?: string
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 20,
  single = false,
  label = 'Images',
  description,
  accept = 'image/*',
  className
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length === 0) return
    
    // Convert files to URLs (in production, upload to storage)
    const newUrls = files.map(file => URL.createObjectURL(file))
    
    if (single) {
      onChange([newUrls[0]])
    } else {
      const combined = [...images, ...newUrls].slice(0, maxImages)
      onChange(combined)
    }
  }, [images, onChange, maxImages, single])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length === 0) return
    
    // Convert files to URLs (in production, upload to storage)
    const newUrls = files.map(file => URL.createObjectURL(file))
    
    if (single) {
      onChange([newUrls[0]])
    } else {
      const combined = [...images, ...newUrls].slice(0, maxImages)
      onChange(combined)
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [images, onChange, maxImages, single])

  const addUrlImage = useCallback(() => {
    if (!urlInput.trim()) return
    
    if (single) {
      onChange([urlInput.trim()])
    } else {
      if (images.length >= maxImages) return
      onChange([...images, urlInput.trim()])
    }
    
    setUrlInput('')
    setShowUrlDialog(false)
  }, [urlInput, images, onChange, maxImages, single])

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }, [images, onChange])

  const setAsCover = useCallback((index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.unshift(moved)
    onChange(newImages)
  }, [images, onChange])

  // Drag and drop reordering
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newImages = [...images]
    const [moved] = newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, moved)
    onChange(newImages)
    setDraggedIndex(index)
  }

  const handleImageDragEnd = () => {
    setDraggedIndex(null)
  }

  const canAddMore = single ? images.length === 0 : images.length < maxImages

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={!single}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className={cn(
            'w-10 h-10 mx-auto mb-3 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )} />
          
          <p className="text-sm font-medium mb-1">
            {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
          </p>
          <p className="text-xs text-muted-foreground">
            {single ? 'PNG, JPG up to 10MB' : `PNG, JPG up to 10MB each. ${images.length}/${maxImages} images`}
          </p>
          
          {/* Add URL option */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">or</span>
            <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Add from URL
                </Button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
<DialogHeader>
  <DialogTitle>Add Image from URL</DialogTitle>
  <DialogDescription>Enter the URL of an image to add to the gallery.</DialogDescription>
  </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {urlInput && (
                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={urlInput}
                        alt="Preview"
                        fill
                        className="object-contain"
                        onError={() => {}}
                      />
                    </div>
                  )}
                  <Button onClick={addUrlImage} className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className={cn(
          'grid gap-3',
          single ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        )}>
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable={!single}
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={cn(
                'relative group rounded-lg overflow-hidden bg-muted border border-border',
                single ? 'aspect-video' : 'aspect-square',
                draggedIndex === index && 'opacity-50',
                !single && 'cursor-grab active:cursor-grabbing'
              )}
            >
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Cover badge */}
              {index === 0 && !single && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Cover
                </div>
              )}
              
              {/* Drag handle */}
              {!single && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}
              
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!single && index !== 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAsCover(index)}
                    title="Set as cover"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(image, '_blank')}
                  title="View full size"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Add more button */}
          {!single && images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
