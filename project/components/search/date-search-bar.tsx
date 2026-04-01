'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X, Search, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { calculateNights, formatDateShort } from '@/lib/availability'

interface DateSearchBarProps {
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  onDatesChange: (checkIn: Date | null, checkOut: Date | null) => void
  onGuestsChange: (guests: number) => void
  onSearch: () => void
  className?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function DateSearchBar({
  checkIn,
  checkOut,
  guests,
  onDatesChange,
  onGuestsChange,
  onSearch,
  className
}: DateSearchBarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)
  const [selectingCheckIn, setSelectingCheckIn] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const calendarRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setIsGuestsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateInPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date: Date) => {
    if (!checkIn) return false
    const dateTime = date.getTime()
    const startTime = checkIn.getTime()
    if (!checkOut) return dateTime === startTime
    const endTime = checkOut.getTime()
    return dateTime >= startTime && dateTime <= endTime
  }

  const isStartDate = (date: Date) => checkIn && date.getTime() === checkIn.getTime()
  const isEndDate = (date: Date) => checkOut && date.getTime() === checkOut.getTime()

  const handleDateClick = (date: Date) => {
    if (isDateInPast(date)) return

    if (selectingCheckIn) {
      onDatesChange(date, null)
      setSelectingCheckIn(false)
    } else {
      if (checkIn && date < checkIn) {
        onDatesChange(date, checkIn)
      } else {
        onDatesChange(checkIn, date)
      }
      setSelectingCheckIn(true)
      setIsCalendarOpen(false)
    }
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const clearDates = () => {
    onDatesChange(null, null)
    setSelectingCheckIn(true)
  }

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const isPast = isDateInPast(date)
    const isSelected = isDateSelected(date)
    const isStart = isStartDate(date)
    const isEnd = isEndDate(date)

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        disabled={isPast}
        className={cn(
          'h-9 w-9 rounded-full text-sm font-medium transition-all flex items-center justify-center',
          isPast && 'text-muted-foreground/30 cursor-not-allowed',
          !isPast && 'hover:bg-gold/20 cursor-pointer',
          isSelected && !isStart && !isEnd && 'bg-gold/10',
          (isStart || isEnd) && 'bg-gold text-black'
        )}
      >
        {day}
      </button>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Bar */}
      <div className="bg-card border border-border rounded-2xl shadow-lg p-2 flex flex-wrap md:flex-nowrap items-center gap-2">
        {/* Check-in */}
        <button
          onClick={() => {
            setIsCalendarOpen(true)
            setSelectingCheckIn(true)
            setIsGuestsOpen(false)
          }}
          className={cn(
            'flex-1 min-w-[140px] px-4 py-3 rounded-xl text-left transition-colors',
            isCalendarOpen && selectingCheckIn ? 'bg-gold/10' : 'hover:bg-secondary'
          )}
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Check-in</p>
          <p className="font-medium">
            {checkIn ? formatDateShort(checkIn) : 'Add date'}
          </p>
        </button>

        <div className="hidden md:block w-px h-10 bg-border" />

        {/* Check-out */}
        <button
          onClick={() => {
            setIsCalendarOpen(true)
            setSelectingCheckIn(false)
            setIsGuestsOpen(false)
          }}
          className={cn(
            'flex-1 min-w-[140px] px-4 py-3 rounded-xl text-left transition-colors',
            isCalendarOpen && !selectingCheckIn ? 'bg-gold/10' : 'hover:bg-secondary'
          )}
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Check-out</p>
          <p className="font-medium">
            {checkOut ? formatDateShort(checkOut) : 'Add date'}
          </p>
        </button>

        <div className="hidden md:block w-px h-10 bg-border" />

        {/* Guests */}
        <div ref={guestsRef} className="relative flex-1 min-w-[120px]">
          <button
            onClick={() => {
              setIsGuestsOpen(!isGuestsOpen)
              setIsCalendarOpen(false)
            }}
            className={cn(
              'w-full px-4 py-3 rounded-xl text-left transition-colors',
              isGuestsOpen ? 'bg-gold/10' : 'hover:bg-secondary'
            )}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Guests</p>
            <p className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </p>
          </button>

          <AnimatePresence>
            {isGuestsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border rounded-xl shadow-xl z-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Guests</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">{guests}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => onGuestsChange(guests + 1)}
                      disabled={guests >= 20}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Button */}
        {(checkIn || checkOut) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearDates}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Search Button */}
        <Button
          onClick={onSearch}
          className="flex-shrink-0 bg-gold hover:bg-gold/90 text-black gap-2 px-6"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Nights Indicator */}
      <AnimatePresence>
        {nights > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
          >
            <span className="text-sm text-gold font-medium">
              {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-6 bg-card border border-border rounded-2xl shadow-xl z-50"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Selecting Indicator */}
            <div className="text-center mb-4">
              <span className="text-sm text-muted-foreground">
                {selectingCheckIn ? 'Select check-in date' : 'Select check-out date'}
              </span>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="h-9 flex items-center justify-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
