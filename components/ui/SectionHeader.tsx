import { EyebrowLabel } from '@/components/ui/EyebrowLabel'

export interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={['flex flex-col', alignment, className].join(' ')}>
      <EyebrowLabel>{eyebrow}</EyebrowLabel>
      <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] font-bold tracking-[-0.025em] text-green-950">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-[1.05rem] leading-7 text-muted">{description}</p>
      ) : null}
    </div>
  )
}
