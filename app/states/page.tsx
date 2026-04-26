'use client'

import { StateGrid } from '@/components/data/StateGrid'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getStateRanking } from '@/lib/data/selectors'

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function StatesPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const ranking = getStateRanking(data, activeYear)
  const previousYear = Math.max(activeYear - 1, 2010)
  const previousStates = data.years[String(previousYear)]?.top_states ?? {}
  const items = ranking.map((state) => ({
    ...state,
    yoyDelta: state.mt - (previousStates[state.state] ?? state.mt),
  }))

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">States</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Geographic ranking of emissions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Hover a state card to compare the current reporting year with the prior year.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {YEARS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setActiveYear(year)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                year === activeYear
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-muted hover:border-green-400 hover:text-green-900',
              ].join(' ')}
            >
              {year}
            </button>
          ))}
        </div>

        <StateGrid items={items} />
      </PageWrapper>
    </main>
  )
}
