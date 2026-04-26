import { type HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  featured?: boolean
}

export function Card({ className = '', featured = false, ...props }: CardProps) {
  const palette = featured
    ? 'border-green-700 bg-green-900 text-white'
    : 'border-green-100 bg-white text-charcoal'

  return (
    <div
      className={['rounded-[14px] border p-5 shadow-card', palette, className].join(' ')}
      {...props}
    />
  )
}
