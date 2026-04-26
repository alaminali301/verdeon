import { type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

export interface StatCardProps {
  label: string
  value: string
  source?: string
  detail?: string
  icon?: ReactNode
  featured?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  source,
  detail,
  icon,
  featured = false,
  className = '',
}: StatCardProps) {
  return (
    <Card featured={featured} className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={[
              'text-[0.75rem] font-semibold uppercase tracking-[0.1em]',
              featured ? 'text-green-300' : 'text-green-600',
            ].join(' ')}
          >
            {label}
          </p>
          <p
            className={[
              'mt-3 font-display text-[2.4rem] font-bold leading-none tracking-[-0.03em]',
              featured ? 'text-white' : 'text-green-950',
            ].join(' ')}
          >
            {value}
          </p>
          {detail ? (
            <p className={['mt-3 text-sm leading-6', featured ? 'text-green-100' : 'text-muted'].join(' ')}>
              {detail}
            </p>
          ) : null}
          {source ? (
            <p className={['mt-2 text-xs font-medium', featured ? 'text-green-300' : 'text-muted'].join(' ')}>
              {source}
            </p>
          ) : null}
        </div>
        {icon ? (
          <div
            className={[
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              featured ? 'bg-white/10 text-green-300' : 'bg-green-100 text-green-700',
            ].join(' ')}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
