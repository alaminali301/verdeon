import { type HTMLAttributes } from 'react'
import type { SectorName } from '@/lib/data/types'

type BadgeVariant = 'HIGH' | 'MEDIUM' | 'LOW'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  sector?: SectorName
}

const variantClasses: Record<BadgeVariant, string> = {
  HIGH: 'border border-red-200 bg-red-50 text-red-700',
  MEDIUM: 'border border-amber-200 bg-amber-50 text-amber-700',
  LOW: 'border border-green-200 bg-green-50 text-green-700',
}

const sectorClasses: Record<SectorName, string> = {
  'Power Plants': 'border border-green-900/10 bg-green-900 text-white',
  Chemicals: 'border border-green-600/10 bg-green-600 text-white',
  'Petroleum & Gas': 'border border-green-500/10 bg-green-500 text-green-950',
  Minerals: 'border border-green-400/10 bg-green-400 text-green-950',
  Waste: 'border border-green-300/10 bg-green-300 text-green-950',
  Metals: 'border border-green-200 bg-green-200 text-green-950',
  Refineries: 'border border-green-700/10 bg-green-700 text-white',
  Other: 'border border-green-800/10 bg-green-800 text-white',
}

export function Badge({ className = '', variant = 'LOW', sector, ...props }: BadgeProps) {
  const palette = sector ? sectorClasses[sector] : variantClasses[variant]

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em]',
        palette,
        className,
      ].join(' ')}
      {...props}
    />
  )
}
