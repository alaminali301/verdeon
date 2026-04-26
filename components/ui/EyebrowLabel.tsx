import { type HTMLAttributes } from 'react'

export interface EyebrowLabelProps extends HTMLAttributes<HTMLParagraphElement> {}

export function EyebrowLabel({ className = '', ...props }: EyebrowLabelProps) {
  return (
    <p
      className={[
        'mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
