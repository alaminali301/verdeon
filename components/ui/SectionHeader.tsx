import { EyebrowLabel } from '@/components/ui/EyebrowLabel'

export interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div>
      <EyebrowLabel>{eyebrow}</EyebrowLabel>
      <h2 className="font-display text-4xl text-green-950">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{description}</p> : null}
    </div>
  )
}
