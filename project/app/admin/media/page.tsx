'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Upload,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Trash2,
  Download,
  Copy,
  FolderOpen,
  Image as ImageIcon,
  Plus,
  Filter,
  Check,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface MediaItem {
  id: string
  name: string
  type: string
  size: string
  url: string
  folder: string
  uploadedAt: string
  usedIn: string[]
}

const BUCKET_NAME = 'property-images'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export default function AdminMediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Fetch property_images rows to get usage info and metadata from the DB
      const { data: dbImages } = await supabase
        .from('property_images')
        .select('id, image_url, alt_text, category, created_at, property_id, properties(name)')
        .order('created_at', { ascending: false })

      // Build a lookup: image_url -> usage info
      const usageMap = new Map<string, string[]>()
      const dbMetaMap = new Map<string, { id: string; category: string; createdAt: string }>()
      if (dbImages) {
        for (const img of dbImages) {
          const url = img.image_url
          const propertyName = (img as any).properties?.name
          if (!usageMap.has(url)) {
            usageMap.set(url, [])
          }
          if (propertyName) {
            usageMap.get(url)!.push(`Property: ${propertyName}`)
          }
          if (!dbMetaMap.has(url)) {
            dbMetaMap.set(url, {
              id: img.id,
              category: img.category || 'general',
              createdAt: img.created_at,
            })
          }
        }
      }

      // List all folders in the bucket
      const { data: topLevel } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { limit: 100 })

      const folderNames: string[] = []
      if (topLevel) {
        for (const item of topLevel) {
          // Folders have null metadata (id is null) in Supabase storage
          if (item.id === null || !item.metadata) {
            folderNames.push(item.name)
          }
        }
      }

      // If no folders found, try common folder names
      const foldersToScan = folderNames.length > 0
        ? folderNames
        : ['properties', 'amenities', 'experiences', 'activities']

      const allMedia: MediaItem[] = []

      for (const folder of foldersToScan) {
        const { data: files } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folder, {
            limit: 200,
            sortBy: { column: 'created_at', order: 'desc' },
          })

        if (!files) continue

        for (const file of files) {
          // Skip placeholder entries (folders within folders)
          if (!file.metadata || file.id === null) continue

          const path = `${folder}/${file.name}`
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path)

          const publicUrl = urlData.publicUrl
          const dbMeta = dbMetaMap.get(publicUrl)

          allMedia.push({
            id: dbMeta?.id || file.id || path,
            name: file.name,
            type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 'file',
            size: formatFileSize(file.metadata?.size || 0),
            url: publicUrl,
            folder,
            uploadedAt: dbMeta?.createdAt
              ? new Date(dbMeta.createdAt).toISOString().split('T')[0]
              : new Date(file.created_at || Date.now()).toISOString().split('T')[0],
            usedIn: usageMap.get(publicUrl) || [],
          })
        }
      }

      // Also include DB images that may not have been found via storage listing
      // (e.g. externally hosted URLs)
      if (dbImages) {
        const storageUrls = new Set(allMedia.map((m) => m.url))
        for (const img of dbImages) {
          if (!storageUrls.has(img.image_url)) {
            const propertyName = (img as any).properties?.name
            allMedia.push({
              id: img.id,
              name: img.alt_text || img.image_url.split('/').pop() || 'image',
              type: 'image',
              size: '--',
              url: img.image_url,
              folder: img.category || 'general',
              uploadedAt: new Date(img.created_at).toISOString().split('T')[0],
              usedIn: propertyName ? [`Property: ${propertyName}`] : [],
            })
          }
        }
      }

      setMedia(allMedia)
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Compute folders dynamically from media items
  const folders = [
    { id: 'all', name: 'All Files', count: media.length },
    ...Object.entries(
      media.reduce<Record<string, number>>((acc, item) => {
        acc[item.folder] = (acc[item.folder] || 0) + 1
        return acc
      }, {})
    ).map(([id, count]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      count,
    })),
  ]

  const filteredMedia = media.filter(item => {
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const toggleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredMedia.map(m => m.id))
    }
  }

  return (
    <AdminLayout title="Media Library">
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Sidebar - Folders */}
        <div className="w-56 shrink-0 space-y-2">
          <Button
            className="w-full gap-2 mb-4"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </Button>

          <div className="space-y-1">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedFolder === folder.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  {folder.name}
                </span>
                <Badge variant="secondary" className={cn(
                  'text-xs',
                  selectedFolder === folder.id && 'bg-primary-foreground/20 text-primary-foreground'
                )}>
                  {folder.count}
                </Badge>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Plus className="w-4 h-4" />
              New Folder
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selectedItems.length} selected
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
              <div className="flex items-center border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Select All */}
          <div className="flex items-center gap-3 py-3 border-b border-border">
            <button
              onClick={selectAll}
              className={cn(
                'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                selectedItems.length === filteredMedia.length && filteredMedia.length > 0
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border hover:border-primary'
              )}
            >
              {selectedItems.length === filteredMedia.length && filteredMedia.length > 0 && (
                <Check className="w-3 h-3" />
              )}
            </button>
            <span className="text-sm text-muted-foreground">
              {filteredMedia.length} files
            </span>
          </div>

          {/* Grid / List View */}
          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-sm">Loading media files...</p>
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Upload className="w-12 h-12 mb-4" />
                <p className="font-medium text-foreground">No media files yet</p>
                <p className="text-sm mt-1">Upload your first image to get started</p>
                <Button className="mt-4 gap-2" onClick={() => setUploadOpen(true)}>
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Button>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-4" />
                <p className="font-medium text-foreground">No files in this folder</p>
                <p className="text-sm mt-1">
                  {searchQuery
                    ? `No files matching "${searchQuery}"`
                    : 'This folder is empty'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map(item => (
                  <div
                    key={item.id}
                    className={cn(
                      'group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all',
                      selectedItems.includes(item.id)
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <div className="aspect-square relative bg-muted">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className={cn(
                        'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity',
                        selectedItems.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      )}>
                        <div className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors',
                          selectedItems.includes(item.id)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-white'
                        )}>
                          {selectedItems.includes(item.id) && <Check className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMedia.map(item => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all',
                      selectedItems.includes(item.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <button
                      className={cn(
                        'w-5 h-5 rounded border flex items-center justify-center shrink-0',
                        selectedItems.includes(item.id)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border'
                      )}
                    >
                      {selectedItems.includes(item.id) && <Check className="w-3 h-3" />}
                    </button>
                    <div className="w-12 h-12 rounded-lg bg-muted relative overflow-hidden shrink-0">
                      <Image src={item.url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.folder} &middot; {item.size} &middot; {item.uploadedAt}
                      </p>
                    </div>
                    {item.usedIn.length > 0 && (
                      <Badge variant="outline" className="shrink-0">
                        Used in {item.usedIn.length} place{item.usedIn.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg">
<DialogHeader>
  <DialogTitle>Upload Files</DialogTitle>
  <DialogDescription>Upload images and documents to the media library.</DialogDescription>
  </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button>Upload</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
