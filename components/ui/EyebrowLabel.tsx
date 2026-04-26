import { type HTMLAttributes } from 'react'

export function EyebrowLabel({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600 ${className}`}
      {...props}
    />
  )
}
