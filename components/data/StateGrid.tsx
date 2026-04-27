import Link from 'next/link'
import { getJurisdictionName } from '@/constants/jurisdictions'
import { slugifyLabel } from '@/lib/utils/slug'

export interface StateGridItem {
  state: string
  mt: number
  rank: number
  yoyDelta?: number
}

export interface StateGridProps {
  items: StateGridItem[]
  activeState?: string | null
  onSelectState?: (state: string) => void
}

export function StateGrid({ items, activeState, onSelectState }: StateGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.state}
          className={[
            'group rounded-[18px] border p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
            activeState === item.state
              ? 'border-green-700 bg-green-50'
              : 'border-green-100 bg-white',
          ].join(' ')}
        >
          <button
            type="button"
            onClick={() => onSelectState?.(item.state)}
            className="w-full text-left"
            aria-pressed={activeState === item.state}
          >
            <div className="text-lg font-semibold text-green-900">
              {activeState === item.state ? getJurisdictionName(item.state) : item.state}
            </div>
            {activeState === item.state ? (
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-green-600">
                {item.state}
              </div>
            ) : null}
            <div className="mt-3 font-display text-[1.7rem] tracking-[-0.03em] text-green-950">
              {item.mt.toLocaleString()} Mt
            </div>
            <div className="mt-2 text-left text-sm text-muted">#{item.rank} in US</div>
            <div className="mt-3 text-left text-xs font-medium text-green-700 opacity-0 transition-opacity group-hover:opacity-100">
              {item.yoyDelta !== undefined
                ? `${item.yoyDelta > 0 ? '+' : ''}${item.yoyDelta.toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt vs prior year`
                : 'No 2022 value available in the bundled summary'}
            </div>
          </button>
          <Link
            href={`/states/${slugifyLabel(item.state)}`}
            className="mt-4 inline-flex text-xs font-medium text-green-700 underline-offset-4 hover:underline"
          >
            View details
          </Link>
        </div>
      ))}
    </div>
  )
}
