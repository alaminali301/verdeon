'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { SectorList } from '@/components/data/SectorList'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { sectors } from '@/constants/sectors'
import { getSectorBreakdown, getStateRanking } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { downloadJson } from '@/lib/utils/export'

const SectorBarChart = dynamic(
  () => import('@/components/charts/SectorBarChart').then((mod) => mod.SectorBarChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[340px]" /> },
)
const TrendChart = dynamic(
  () => import('@/components/charts/TrendChart').then((mod) => mod.TrendChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[350px]" /> },
)

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function ExplorerPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const activeSector = useEpaStore((state) => state.activeSector)
  const activeState = useEpaStore((state) => state.activeState)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const setActiveSector = useEpaStore((state) => state.setActiveSector)
  const setActiveState = useEpaStore((state) => state.setActiveState)
  const [showStates, setShowStates] = useState(false)

  const yearData = data.years[String(activeYear)]
  const allSectors = getSectorBreakdown(data, activeYear)
  const sectorItems = activeSector
    ? allSectors.filter((item) => item.name === activeSector)
    : allSectors
  const states = getStateRanking(data, activeYear)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Explorer</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Slice 14 years of EPA data by year and sector
          </h1>
          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() =>
                downloadJson(`verdeon-explorer-${activeYear}.json`, {
                  year: activeYear,
                  activeSector,
                  activeState,
                  sectors: allSectors,
                  states,
                })
              }
            >
              <Download size={14} />
              Export filtered view
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSector(null)}
            className={[
              'rounded-full border px-4 py-2 text-sm transition-colors',
              activeSector === null
                ? 'border-green-900 bg-green-900 text-white'
                : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
            ].join(' ')}
          >
            All sectors
          </button>
          {sectors.map((sector) => (
            <button
              key={sector.name}
              type="button"
              onClick={() => setActiveSector(activeSector === sector.name ? null : sector.name)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                activeSector === sector.name
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
              ].join(' ')}
            >
              {sector.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Year total" value={formatMt(yearData.total_mt)} detail={`${activeYear} direct emitters total`} />
          <StatCard label="Facilities" value={yearData.facilities.toLocaleString()} detail="Reporting facilities in selected year" />
          <StatCard label="Sector focus" value={activeSector ?? 'All'} detail={activeSector ? 'Filtered sector breakdown' : 'All sectors active'} />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_.9fr]">
          <TrendChart activeYear={activeYear} onYearSelect={setActiveYear} />
          <SectorBarChart data={sectorItems} year={activeYear} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <SectorList items={allSectors} activeSector={activeSector} />
          <div className="rounded-[14px] border border-green-100 bg-white p-5 shadow-card">
            <button
              type="button"
              onClick={() => setShowStates((value) => !value)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-base font-semibold text-green-900">State rankings · {activeYear}</span>
              <span className="text-sm text-green-700">{showStates ? 'Hide' : 'Show'}</span>
            </button>
            {showStates ? (
              <div className="mt-4 space-y-3">
                {states.map((state) => (
                  <div key={state.state} className="flex items-center justify-between rounded-[14px] bg-green-50 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setActiveState(activeState === state.state ? null : state.state)}
                      className="text-sm font-medium text-green-900 underline-offset-4 hover:underline"
                    >
                      #{state.rank} {state.state}
                    </button>
                    <span className="text-sm text-muted">{formatMt(state.mt)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
