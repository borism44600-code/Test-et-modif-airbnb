'use client'

import { LayoutGrid, Grid2x2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DisplayMode = 'large' | 'medium' | 'small'

interface DisplayModeToggleProps {
  mode: DisplayMode
  onModeChange: (mode: DisplayMode) => void
}

const modes: { value: DisplayMode; icon: typeof LayoutGrid; label: string }[] = [
  { value: 'large', icon: List, label: '1 Column' },
  { value: 'medium', icon: Grid2x2, label: '2 Columns' },
  { value: 'small', icon: LayoutGrid, label: '3 Columns' },
]

export function DisplayModeToggle({ mode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {modes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => onModeChange(value)}
          className={cn(
            'h-8 px-3 transition-all',
            mode === value 
              ? 'bg-background shadow-sm' 
              : 'hover:bg-transparent'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
}
