import { type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'solid' | 'outline' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  solid: 'bg-green-800 text-white hover:bg-green-900',
  outline: 'border border-green-700 text-green-800 hover:bg-green-50',
  ghost: 'border border-white/20 bg-white/10 text-white hover:bg-white/15',
}

export function Button({ className = '', variant = 'solid', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold transition ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
