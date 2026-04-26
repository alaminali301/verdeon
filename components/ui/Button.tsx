import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'solid' | 'outline' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  solid: 'bg-green-800 text-white hover:bg-green-900',
  outline: 'border border-green-700 text-green-800 hover:bg-green-50',
  ghost: 'border border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.12]',
}

export function Button({ className = '', variant = 'solid', ...props }: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold',
        'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    />
  )
}
