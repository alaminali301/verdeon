import type { SectorBreakdownItem } from '@/lib/data/types'

export interface SectorListProps {
  items: SectorBreakdownItem[]
  activeSector?: string | null
}

export function SectorList({ items, activeSector }: SectorListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.name}
          className={[
            'rounded-[16px] border p-4 transition-colors',
            activeSector === item.name
              ? 'border-green-700 bg-green-50'
              : 'border-green-100 bg-white',
          ].join(' ')}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-green-900">{item.name}</span>
            </div>
            <span className="text-sm text-muted">{item.mt.toFixed(0)} Mt</span>
          </div>
          <div className="mt-2 text-xs text-muted">{item.pct.toFixed(1)}% of total reported emissions</div>
        </div>
      ))}
    </div>
  )
}
