'use client'

import { useMemo } from 'react'
import { AlertCircle, CheckCircle2, Calendar, Clock, Info } from 'lucide-react'
import { 
  formatCancellationPolicy, 
  getCancellationDeadline, 
  formatMarrakechDate,
  formatCurrency 
} from '@/lib/booking-rules'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface CancellationPolicyProps {
  nights: number
  checkInDate: Date | string | null
  nightlyRate?: number
  className?: string
  variant?: 'compact' | 'full' | 'summary'
}

export function CancellationPolicy({
  nights,
  checkInDate,
  nightlyRate,
  className,
  variant = 'full'
}: CancellationPolicyProps) {
  const policy = useMemo(() => {
    if (!nights || nights <= 0) return null
    return formatCancellationPolicy(nights)
  }, [nights])

  const deadline = useMemo(() => {
    if (!checkInDate) return null
    return getCancellationDeadline(checkInDate)
  }, [checkInDate])

  if (!policy) return null

  // Compact variant - just a single line
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span>Free cancellation until 15 days before check-in</span>
      </div>
    )
  }

  // Summary variant - for booking confirmation page
  if (variant === 'summary') {
    return (
      <div className={cn('bg-muted/50 rounded-lg p-4', className)}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-medium">Cancellation Policy</h4>
            <p className="text-sm text-muted-foreground">{policy.summary}</p>
            {deadline && (
              <p className="text-sm">
                <span className="font-medium">Free cancellation deadline:</span>{' '}
                {formatMarrakechDate(deadline, true)}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Full variant - detailed accordion
  return (
    <div className={cn('rounded-lg border border-border', className)}>
      <Accordion type="single" collapsible defaultValue="policy">
        <AccordionItem value="policy" className="border-0">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">Cancellation Policy</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Main Policy */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Free cancellation available
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Cancel up to 15 days before check-in (by 3:00 PM Marrakech time)
                    </p>
                  </div>
                </div>

                {deadline && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Your cancellation deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {formatMarrakechDate(deadline, true)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Policy Details */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Refund Details
                </h5>
                <ul className="space-y-2">
                  {policy.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Retained Amount Preview */}
              {nightlyRate && nights > 2 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    If you cancel more than 15 days before check-in, you would be refunded{' '}
                    <span className="font-medium text-foreground">
                      {formatCurrency((nights - getRetainedNights(nights)) * nightlyRate)}
                    </span>{' '}
                    (accommodation cost minus {getRetainedNights(nights)} retained night{getRetainedNights(nights) > 1 ? 's' : ''}).
                  </p>
                </div>
              )}

              {/* Late Cancellation Warning */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Late cancellation
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Cancellations made less than 15 days before check-in are non-refundable.
                  </p>
                </div>
              </div>

              {/* Timezone Notice */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>All times are in Marrakech time (GMT+1)</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

// Helper function to get retained nights
function getRetainedNights(nights: number): number {
  if (nights <= 2) return nights
  if (nights >= 3 && nights <= 7) return 2
  if (nights >= 8 && nights <= 14) return 3
  if (nights >= 15 && nights <= 21) return 4
  if (nights >= 22 && nights <= 29) return 5
  return 7
}
