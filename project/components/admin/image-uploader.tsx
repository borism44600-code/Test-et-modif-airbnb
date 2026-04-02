'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
  Upload, X, GripVertical, Link2, Plus, ImageIcon,
  Star, Trash2, ExternalLink, Check, Loader2
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
import { uploadAndLinkImageAction } from '@/app/admin/actions'

interface ImageUploaderProps {
  /** ID de la propriété déjà sauvegardée — obligatoire pour l'upload réel */
  propertyId?: string
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
  propertyId,
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
  const [uploadingCount, setUploadingCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload un fichier vers Supabase Storage si propertyId est connu,
  // sinon retombe sur un blob URL temporaire (formulaire "nouvelle propriété" avant save).
  const processFile = useCallback(async (file: File): Promise<string> => {
    if (!propertyId) {
      // Pas encore d'ID → blob URL temporaire, remplacé après le save
      return URL.createObjectURL(file)
    }

    setUploadingCount(c => c + 1)
    try {
      const result = await uploadAndLinkImageAction(
        propertyId,
        file,
        { is_cover: images.length === 0, display_order: images.length }
      )
      if (result.error || !result.url) {
        console.error('Upload error:', result.error)
        return URL.createObjectURL(file)
      }
      return result.url
    } finally {
      setUploadingCount(c => c - 1)
    }
  }, [propertyId, images.length])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return

    const newUrls = await Promise.all(files.map(processFile))

    if (single) {
      onChange([newUrls[0]])
    } else {
      onChange([...images, ...newUrls].slice(0, maxImages))
    }
  }, [images, onChange, maxImages, single, processFile])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return

    const newUrls = await Promise.all(files.map(processFile))

    if (single) {
      onChange([newUrls[0]])
    } else {
      onChange([...images, ...newUrls].slice(0, maxImages))
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [images, onChange, maxImages, single, processFile])

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
    onChange(images.filter((_, i) => i !== index))
  }, [images, onChange])

  const setAsCover = useCallback((index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.unshift(moved)
    onChange(newImages)
  }, [images, onChange])

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

  const handleImageDragEnd = () => setDraggedIndex(null)

  const canAddMore = single ? images.length === 0 : images.length < maxImages
  const isUploading = uploadingCount > 0

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {!propertyId && (
            <p className="text-xs text-amber-600">
              Les images seront uploadées vers Supabase Storage après la sauvegarde initiale.
            </p>
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
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            isUploading && 'pointer-events-none opacity-60'
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={!single}
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <Loader2 className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
          ) : (
            <Upload className={cn('w-10 h-10 mx-auto mb-3 transition-colors', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          )}

          <p className="text-sm font-medium mb-1">
            {isUploading
              ? `Upload en cours (${uploadingCount})…`
              : isDragging
              ? 'Déposer les images ici'
              : 'Cliquer ou glisser pour uploader'}
          </p>
          <p className="text-xs text-muted-foreground">
            {single ? 'PNG, JPG jusqu\'à 10 Mo' : `PNG, JPG jusqu'à 10 Mo. ${images.length}/${maxImages} images`}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">ou</span>
            <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Ajouter depuis une URL
                </Button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Ajouter une image depuis une URL</DialogTitle>
                  <DialogDescription>Coller l&apos;URL d&apos;une image publique.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>URL de l&apos;image</Label>
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {urlInput && (
                    <div className="relative w-full h-40 bg-muted rounded-lg overflow-hidden">
                      <Image src={urlInput} alt="Aperçu" fill className="object-contain" onError={() => {}} />
                    </div>
                  )}
                  <Button onClick={addUrlImage} className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className={cn('grid gap-3', single ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4')}>
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
              <Image src={image} alt={`Image ${index + 1}`} fill className="object-cover" />

              {index === 0 && !single && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Cover
                </div>
              )}

              {!single && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!single && index !== 0 && (
                  <Button variant="secondary" size="sm" onClick={() => setAsCover(index)} title="Mettre en cover">
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => window.open(image, '_blank')} title="Voir en grand">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeImage(index)} title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {!single && images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ajouter</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
