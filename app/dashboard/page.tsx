'use client'

import { Download } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { getJurisdictionName } from '@/constants/jurisdictions'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useYearComparison } from '@/lib/hooks/useYearComparison'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getSectorBreakdown, getStateRanking } from '@/lib/data/selectors'
import { formatFacilities, formatMt, formatPct } from '@/lib/utils/format'
import { downloadCsv, downloadJson } from '@/lib/utils/export'
import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'

const DonutChart = dynamic(
  () => import('@/components/charts/DonutChart').then((mod) => mod.DonutChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[280px]" /> },
)

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function DashboardPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const activeState = useEpaStore((state) => state.activeState)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const setActiveState = useEpaStore((state) => state.setActiveState)
  const yoy = useYearComparison()
  const yearData = data.years[String(activeYear)]
  const powerPlantShare = (yearData.sectors['Power Plants'] / yearData.total_mt) * 100
  const sectors = getSectorBreakdown(data, activeYear)
  const states = getStateRanking(data, activeYear)
  const focusedState = states.find((state) => state.state === activeState) ?? states[0]
  const leadingSector = sectors[0]

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Dashboard</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            National emissions snapshot
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Explore total reported emissions, sector contribution, and top-emitting states using the current active year.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv(
                  `verdeon-dashboard-${activeYear}.csv`,
                  ['metric', 'value'],
                  [
                    ['total_emissions_mt', yearData.total_mt],
                    ['facilities', yearData.facilities],
                    ['yoy_percent', yoy.percent.toFixed(1)],
                    ['power_plant_share_percent', powerPlantShare.toFixed(1)],
                  ],
                )
              }
            >
              <Download size={14} />
              Export metrics CSV
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                downloadJson(`verdeon-dashboard-${activeYear}.json`, {
                  year: activeYear,
                  summary: yearData,
                  sectors,
                  states,
                })
              }
            >
              <Download size={14} />
              Export snapshot JSON
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <PreviewGate compact />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Facilities" value={yearData.facilities.toLocaleString()} detail={formatFacilities(yearData.facilities)} />
          <StatCard label="YoY change" value={formatPct(yoy.percent)} detail={`${yoy.absolute > 0 ? '+' : ''}${yoy.absolute.toFixed(1)} Mt versus prior year`} />
          <StatCard label="Power plants" value={`${powerPlantShare.toFixed(1)}%`} detail="Share of total reported emissions" />
          <StatCard
            label="Leading sector"
            value={leadingSector?.name ?? 'N/A'}
            detail={leadingSector ? formatMt(leadingSector.mt) : 'No sector available'}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <DonutChart data={sectors} year={activeYear} />
          <div className="rounded-[14px] border border-green-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-green-900">Reporting jurisdictions · {activeYear}</h2>
              {focusedState ? (
                <div className="text-sm text-green-700">
                  Focus: <span className="font-semibold">{focusedState.state}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-5 space-y-3">
              {states.map((state) => (
                <button
                  key={state.state}
                  type="button"
                  onClick={() => setActiveState(state.state)}
                  className={[
                    'flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-left transition-colors',
                    activeState === state.state ? 'bg-green-900 text-white' : 'bg-green-50',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                        activeState === state.state ? 'bg-white text-green-900' : 'bg-green-900 text-white',
                      ].join(' ')}
                    >
                      {state.rank}
                    </span>
                    <span
                      className={[
                        'text-sm font-medium',
                        activeState === state.state ? 'text-white' : 'text-green-900',
                      ].join(' ')}
                    >
                      {activeState === state.state ? getJurisdictionName(state.state) : state.state}
                    </span>
                  </div>
                  <span className={['text-sm', activeState === state.state ? 'text-green-100' : 'text-muted'].join(' ')}>
                    {formatMt(state.mt)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
