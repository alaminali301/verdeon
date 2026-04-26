import { type HTMLAttributes } from 'react'

export function PageWrapper({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mx-auto w-full max-w-7xl px-6 ${className}`} {...props} />
}
