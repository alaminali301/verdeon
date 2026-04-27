import type { SectorBreakdownItem, SectorName } from '@/lib/data/types'

export interface SectorListProps {
  items: SectorBreakdownItem[]
  activeSector?: string | null
  onSelectSector?: (sector: SectorName) => void
}

export function SectorList({ items, activeSector, onSelectSector }: SectorListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => onSelectSector?.(item.name)}
          aria-pressed={activeSector === item.name}
          className={[
            'w-full rounded-[16px] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5',
            activeSector === item.name
              ? 'border-green-700 bg-green-50 shadow-[0_14px_30px_rgba(22,101,52,.08)]'
              : 'border-green-100 bg-white hover:border-green-300',
          ].join(' ')}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-green-900">{item.name}</span>
            </div>
            <span className="text-xs font-medium text-green-700">{activeSector === item.name ? 'Selected' : 'Select'}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-muted">{item.pct.toFixed(1)}% of total reported emissions</div>
            <span className="text-sm text-muted">{item.mt.toFixed(0)} Mt</span>
          </div>
        </button>
      ))}
    </div>
  )
}
