import { type HTMLAttributes } from 'react'

type BadgeVariant = 'HIGH' | 'MEDIUM' | 'LOW' | 'sector'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-green-100 text-green-700',
  sector: 'bg-green-100 text-green-800',
}

export function Badge({ className = '', variant = 'sector', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
