'use client'

import { useDeferredValue, useState } from 'react'
import { Download } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { StateGrid } from '@/components/data/StateGrid'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { get2023StateDetails } from '@/lib/data/epa-2023-details'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getStateRanking } from '@/lib/data/selectors'
import { downloadCsv } from '@/lib/utils/export'

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function StatesPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const activeState = useEpaStore((state) => state.activeState)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const setActiveState = useEpaStore((state) => state.setActiveState)
  const ranking = activeYear === 2023 ? get2023StateDetails() : getStateRanking(data, activeYear)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const previousYear = Math.max(activeYear - 1, 2010)
  const previousStates = data.years[String(previousYear)]?.top_states ?? {}
  const items = ranking
    .map((state) => {
      const mt = 'totalMt' in state ? state.totalMt : state.mt

      return {
        state: state.state,
        mt,
        rank: state.rank,
        yoyDelta: previousStates[state.state] !== undefined ? mt - previousStates[state.state] : undefined,
      }
    })
    .filter((item) => item.state.toLowerCase().includes(deferredSearch.toLowerCase()))

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">States</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Reporting jurisdiction ranking of emissions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {activeYear === 2023
              ? 'The 2023 EPA workbook now shows all 54 reporting jurisdictions in this dataset slice. Where 2022 values exist in the bundled summary, you can still compare year-over-year changes.'
              : 'Hover a state card to compare the current reporting year with the prior year.'}
          </p>
          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv(
                  `verdeon-states-${activeYear}.csv`,
                  ['rank', 'state', 'emissions_mt', 'yoy_delta_mt'],
                  items.map((item) => [item.rank, item.state, item.mt.toFixed(2), item.yoyDelta?.toFixed(2) ?? '0']),
                )
              }
            >
              <Download size={14} />
              Export state CSV
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <PreviewGate compact description="Explore the state ranking, export the view, and compare year-over-year changes." />
        </div>

        <div className="mb-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-green-900">Search states</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by state code or name"
              className="w-full rounded-[16px] border border-green-200 bg-white px-4 py-3 text-sm text-green-900 outline-none focus:border-green-600"
            />
          </label>
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

        <StateGrid items={items} activeState={activeState} onSelectState={setActiveState} />
      </PageWrapper>
    </main>
  )
}
