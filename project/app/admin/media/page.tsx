'use client'

import { useState } from 'react'
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
  FileText,
  Film,
  Plus,
  Filter,
  Check
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminLayout } from '@/components/admin/admin-layout'
import { cn } from '@/lib/utils'

// Mock media items
const mockMedia = [
  { id: '1', name: 'riad-jardin-exterior.jpg', type: 'image', size: '2.4 MB', url: '/placeholder.svg?height=400&width=600', folder: 'properties', uploadedAt: '2025-12-01', usedIn: ['Property: Riad Jardin Secret'] },
  { id: '2', name: 'villa-pool.jpg', type: 'image', size: '3.1 MB', url: '/placeholder.svg?height=400&width=600', folder: 'properties', uploadedAt: '2025-12-02', usedIn: ['Property: Villa Majorelle Gardens'] },
  { id: '3', name: 'hammam-spa.jpg', type: 'image', size: '1.8 MB', url: '/placeholder.svg?height=400&width=600', folder: 'amenities', uploadedAt: '2025-12-03', usedIn: [] },
  { id: '4', name: 'terrace-view.jpg', type: 'image', size: '2.2 MB', url: '/placeholder.svg?height=400&width=600', folder: 'properties', uploadedAt: '2025-12-04', usedIn: ['Property: Apartment Hivernage Elite'] },
  { id: '5', name: 'bedroom-suite.jpg', type: 'image', size: '1.9 MB', url: '/placeholder.svg?height=400&width=600', folder: 'properties', uploadedAt: '2025-12-05', usedIn: ['Property: Riad Jardin Secret', 'Property: Riad Ambre & Épices'] },
  { id: '6', name: 'moroccan-breakfast.jpg', type: 'image', size: '1.5 MB', url: '/placeholder.svg?height=400&width=600', folder: 'experiences', uploadedAt: '2025-12-06', usedIn: ['Partner: Chef Hassan'] },
  { id: '7', name: 'atlas-mountains.jpg', type: 'image', size: '4.2 MB', url: '/placeholder.svg?height=400&width=600', folder: 'activities', uploadedAt: '2025-12-07', usedIn: ['Activity: Atlas Day Trip'] },
  { id: '8', name: 'cooking-class.jpg', type: 'image', size: '2.0 MB', url: '/placeholder.svg?height=400&width=600', folder: 'activities', uploadedAt: '2025-12-08', usedIn: ['Activity: Cooking Class'] },
]

const folders = [
  { id: 'all', name: 'All Files', count: 8 },
  { id: 'properties', name: 'Properties', count: 4 },
  { id: 'amenities', name: 'Amenities', count: 1 },
  { id: 'experiences', name: 'Experiences', count: 1 },
  { id: 'activities', name: 'Activities', count: 2 },
]

export default function AdminMediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMedia = mockMedia.filter(item => {
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
            {viewMode === 'grid' ? (
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
