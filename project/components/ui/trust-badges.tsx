'use client'

import { Shield, Star, Clock, BadgeCheck, Award, HeartHandshake } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n/provider'

interface TrustBadgesProps {
  variant?: 'horizontal' | 'vertical' | 'compact'
  className?: string
  theme?: 'light' | 'dark'
}

export function TrustBadges({ variant = 'horizontal', className, theme = 'light' }: TrustBadgesProps) {
  const t = useTranslations('properties')
  const tServices = useTranslations('services')
  const tBooking = useTranslations('booking')

  const badges = [
    {
      icon: Shield,
      title: t('featured'),
      description: t('description')
    },
    {
      icon: Star,
      title: tServices('title'),
      description: tServices('description')
    },
    {
      icon: Clock,
      title: tBooking('freeCancellation'),
      description: tBooking('cancellationPolicy')
    },
    {
      icon: BadgeCheck,
      title: tBooking('securePayment'),
      description: tServices('concierge')
    }
  ]

  const compactBadges = [
    { icon: Shield, label: t('featured') },
    { icon: Star, label: tServices('title') },
    { icon: Clock, label: tBooking('freeCancellation') },
    { icon: BadgeCheck, label: tBooking('securePayment') }
  ]
  const isDark = theme === 'dark'

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-4 md:gap-6', className)}>
        {compactBadges.map((badge) => (
          <div 
            key={badge.label}
            className={cn(
              'flex items-center gap-2 text-sm',
              isDark ? 'text-white/70' : 'text-muted-foreground'
            )}
          >
            <badge.icon className={cn('w-4 h-4', isDark ? 'text-gold' : 'text-primary')} />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {badges.map((badge, index) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg',
              isDark ? 'bg-white/5' : 'bg-secondary/50'
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              isDark ? 'bg-gold/20' : 'bg-primary/10'
            )}>
              <badge.icon className={cn('w-5 h-5', isDark ? 'text-gold' : 'text-primary')} />
            </div>
            <div>
              <p className={cn('font-medium text-sm', isDark ? 'text-white' : 'text-foreground')}>
                {badge.title}
              </p>
              <p className={cn('text-xs', isDark ? 'text-white/60' : 'text-muted-foreground')}>
                {badge.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}>
      {badges.map((badge, index) => (
        <motion.div
          key={badge.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3',
            isDark ? 'bg-white/10' : 'bg-primary/10'
          )}>
            <badge.icon className={cn('w-7 h-7', isDark ? 'text-gold' : 'text-primary')} />
          </div>
          <p className={cn('font-medium text-sm mb-1', isDark ? 'text-white' : 'text-foreground')}>
            {badge.title}
          </p>
          <p className={cn('text-xs', isDark ? 'text-white/60' : 'text-muted-foreground')}>
            {badge.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Standalone guarantee banner
export function GuaranteeBanner({ className }: { className?: string }) {
  const tBooking = useTranslations('booking')
  const tServices = useTranslations('services')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gold/10 border border-gold/20 rounded-lg',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Award className="w-8 h-8 text-gold" />
        <div>
          <p className="font-semibold text-sm">{tBooking('freeCancellation')}</p>
          <p className="text-xs text-muted-foreground">{tBooking('cancellationPolicy')}</p>
        </div>
      </div>
      <div className="hidden sm:block w-px h-10 bg-border" />
      <div className="flex items-center gap-3">
        <HeartHandshake className="w-8 h-8 text-gold" />
        <div>
          <p className="font-semibold text-sm">{tServices('concierge')}</p>
          <p className="text-xs text-muted-foreground">{tServices('description')}</p>
        </div>
      </div>
    </motion.div>
  )
}
