'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpRight, Calendar, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AvailabilityCalendarProps {
  availability: { start: string; end: string }[]
  selectedDates?: { start: Date | null; end: Date | null }
  onDateSelect?: (dates: { start: Date | null; end: Date | null }) => void
  readOnly?: boolean
  onBookingClick?: () => void
  compact?: boolean
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function AvailabilityCalendar({ 
  availability, 
  selectedDates,
  onDateSelect,
  readOnly = false,
  onBookingClick,
  compact = false
}: AvailabilityCalendarProps) {
  // Use null for initial state to ensure consistent SSR/client rendering
  const [dateState, setDateState] = useState<{
    today: Date
    currentMonth: number
    currentYear: number
  } | null>(null)
  const [selectingStart, setSelectingStart] = useState(true)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  // Initialize date on client side only to avoid hydration mismatch
  useEffect(() => {
    const now = new Date()
    setDateState({
      today: now,
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear()
    })
  }, [])

  // Derived state with fallbacks
  const today = dateState?.today ?? new Date()
  const currentMonth = dateState?.currentMonth ?? 0
  const currentYear = dateState?.currentYear ?? 2024

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateAvailable = (date: Date) => {
    return availability.some(range => {
      const start = new Date(range.start)
      const end = new Date(range.end)
      return date >= start && date <= end
    })
  }

  const isDateInPast = (date: Date) => {
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayStart
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDates?.start) return false
    
    const dateTime = date.getTime()
    const startTime = selectedDates.start.getTime()
    
    if (!selectedDates.end) {
      return dateTime === startTime
    }
    
    const endTime = selectedDates.end.getTime()
    return dateTime >= startTime && dateTime <= endTime
  }

  const isInHoverRange = (date: Date) => {
    if (!selectedDates?.start || selectedDates.end || !hoverDate) return false
    const dateTime = date.getTime()
    const startTime = selectedDates.start.getTime()
    const hoverTime = hoverDate.getTime()
    
    if (hoverTime > startTime) {
      return dateTime > startTime && dateTime <= hoverTime
    } else {
      return dateTime >= hoverTime && dateTime < startTime
    }
  }

  const isStartDate = (date: Date) => {
    if (!selectedDates?.start) return false
    return date.getTime() === selectedDates.start.getTime()
  }

  const isEndDate = (date: Date) => {
    if (!selectedDates?.end) return false
    return date.getTime() === selectedDates.end.getTime()
  }

  const handleDateClick = (date: Date) => {
    if (readOnly || !onDateSelect || isDateInPast(date) || !isDateAvailable(date)) return

    if (selectingStart) {
      onDateSelect({ start: date, end: null })
      setSelectingStart(false)
    } else {
      if (selectedDates?.start && date < selectedDates.start) {
        onDateSelect({ start: date, end: selectedDates.start })
      } else {
        onDateSelect({ start: selectedDates?.start || null, end: date })
      }
      setSelectingStart(true)
    }
  }

  const goToPreviousMonth = () => {
    if (!dateState) return
    if (currentMonth === 0) {
      setDateState({ ...dateState, currentMonth: 11, currentYear: currentYear - 1 })
    } else {
      setDateState({ ...dateState, currentMonth: currentMonth - 1 })
    }
  }

  const goToNextMonth = () => {
    if (!dateState) return
    if (currentMonth === 11) {
      setDateState({ ...dateState, currentMonth: 0, currentYear: currentYear + 1 })
    } else {
      setDateState({ ...dateState, currentMonth: currentMonth + 1 })
    }
  }

  const calculateNights = () => {
    if (!selectedDates?.start || !selectedDates?.end) return 0
    const diff = selectedDates.end.getTime() - selectedDates.start.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const days = []
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className={cn(compact ? 'h-8' : 'h-10')} />)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const isPast = isDateInPast(date)
    const isAvailable = isDateAvailable(date)
    const isSelected = isDateSelected(date)
    const isStart = isStartDate(date)
    const isEnd = isEndDate(date)
    const isHoverRange = isInHoverRange(date)
    
    days.push(
      <motion.button
        key={day}
        onClick={() => handleDateClick(date)}
        onMouseEnter={() => setHoverDate(date)}
        onMouseLeave={() => setHoverDate(null)}
        disabled={readOnly || isPast || !isAvailable}
        whileHover={!readOnly && !isPast && isAvailable ? { scale: 1.1 } : {}}
        whileTap={!readOnly && !isPast && isAvailable ? { scale: 0.95 } : {}}
        className={cn(
          compact ? 'h-8 text-xs' : 'h-10 text-sm',
          'rounded-full font-medium transition-all relative flex items-center justify-center',
          isPast && 'text-muted-foreground/30 cursor-not-allowed',
          !isPast && !isAvailable && 'text-muted-foreground/40 cursor-not-allowed',
          !isPast && isAvailable && !readOnly && 'hover:bg-gold/20 cursor-pointer',
          !isPast && isAvailable && 'text-foreground',
          (isSelected || isHoverRange) && !isStart && !isEnd && 'bg-gold/10',
          isHoverRange && 'bg-gold/20',
          (isStart || isEnd) && 'bg-gold text-black font-semibold shadow-md shadow-gold/30'
        )}
      >
        {day}
        {!isPast && !isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-full h-px bg-muted-foreground/30 rotate-45 absolute" />
          </span>
        )}
      </motion.button>
    )
  }

  const handleDoubleClick = () => {
    if (readOnly && onBookingClick) {
      onBookingClick()
    }
  }

  // Show skeleton during SSR to avoid hydration mismatch with Date
  if (!dateState) {
    return (
      <div className={cn(
        "bg-card rounded-2xl border border-border overflow-hidden animate-pulse",
        compact ? "h-[300px]" : "h-[400px]"
      )}>
        <div className="bg-secondary/50 border-b border-border p-6">
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-2xl border border-border overflow-hidden",
        readOnly && onBookingClick && "cursor-pointer"
      )}
      onDoubleClick={handleDoubleClick}
    >
      {/* Header */}
      <div className={cn(
        "bg-secondary/50 border-b border-border",
        compact ? "p-4" : "p-6"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={cn("text-gold", compact ? "w-4 h-4" : "w-5 h-5")} />
            <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>
              {readOnly ? 'Availability' : 'Select Your Dates'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span 
              className={cn("font-medium min-w-[120px] text-center", compact ? "text-sm" : "")}
              suppressHydrationWarning
            >
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selection indicator */}
        {!readOnly && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              selectingStart ? "bg-gold text-black" : "bg-muted text-muted-foreground"
            )}>
              Check-in
            </span>
            <ArrowUpRight className="w-3 h-3 text-muted-foreground rotate-45" />
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              !selectingStart ? "bg-gold text-black" : "bg-muted text-muted-foreground"
            )}>
              Check-out
            </span>
          </motion.div>
        )}

        {/* Hint for read-only calendar */}
        {readOnly && onBookingClick && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            This calendar shows availability. To book, use the 
            <button 
              onClick={onBookingClick}
              className="inline-flex items-center gap-0.5 text-gold hover:underline font-medium"
            >
              Reserve Your Dates
              <ArrowUpRight className="w-3 h-3" />
            </button>
            button.
          </p>
        )}
      </div>

      <div className={cn(compact ? "p-4" : "p-6")}>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className={cn(
              "flex items-center justify-center text-muted-foreground font-medium",
              compact ? "h-6 text-[10px]" : "h-8 text-xs"
            )}>
              {compact ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Selected dates summary */}
        <AnimatePresence>
          {selectedDates?.start && selectedDates?.end && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Moon className="w-4 h-4 text-gold" />
                  <span>Your stay</span>
                </div>
                <span className="font-semibold text-gold">{nights} nights</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className={cn(
          "flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs",
          compact && "gap-3"
        )}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gold shadow-sm shadow-gold/30" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-background border border-border" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-muted relative overflow-hidden">
              <span className="w-full h-px bg-muted-foreground/50 rotate-45 absolute top-1/2 left-0" />
            </div>
            <span className="text-muted-foreground">Booked</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
