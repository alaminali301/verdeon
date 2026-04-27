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
        <button
          key={item.state}
          type="button"
          onClick={() => onSelectState?.(item.state)}
          className={[
            'group rounded-[18px] border p-5 shadow-card transition-transform duration-200 hover:-translate-y-1',
            activeState === item.state
              ? 'border-green-700 bg-green-50'
              : 'border-green-100 bg-white',
          ].join(' ')}
          aria-pressed={activeState === item.state}
        >
          <div className="text-lg font-semibold text-green-900">{item.state}</div>
          <div className="mt-3 font-display text-[1.7rem] tracking-[-0.03em] text-green-950">
            {item.mt.toFixed(0)} Mt
          </div>
          <div className="mt-2 text-left text-sm text-muted">#{item.rank} in US</div>
          <div className="mt-3 text-left text-xs font-medium text-green-700 opacity-0 transition-opacity group-hover:opacity-100">
            {item.yoyDelta !== undefined
              ? `${item.yoyDelta > 0 ? '+' : ''}${item.yoyDelta.toFixed(1)} Mt vs prior year`
              : 'No prior-year comparison'}
          </div>
        </button>
      ))}
    </div>
  )
}
