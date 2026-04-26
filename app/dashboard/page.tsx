'use client'

import dynamic from 'next/dynamic'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatCard } from '@/components/ui/StatCard'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useYearComparison } from '@/lib/hooks/useYearComparison'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getSectorBreakdown, getStateRanking } from '@/lib/data/selectors'
import { formatFacilities, formatMt, formatPct } from '@/lib/utils/format'

const DonutChart = dynamic(
  () => import('@/components/charts/DonutChart').then((mod) => mod.DonutChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[280px]" /> },
)
const TrendChart = dynamic(
  () => import('@/components/charts/TrendChart').then((mod) => mod.TrendChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[350px]" /> },
)

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function DashboardPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const yoy = useYearComparison()
  const yearData = data.years[String(activeYear)]
  const powerPlantShare = (yearData.sectors['Power Plants'] / yearData.total_mt) * 100
  const sectors = getSectorBreakdown(data, activeYear)
  const states = getStateRanking(data, activeYear)

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
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total emissions" value={formatMt(yearData.total_mt)} detail={`${activeYear} reported total`} />
          <StatCard label="Facilities" value={yearData.facilities.toLocaleString()} detail={formatFacilities(yearData.facilities)} />
          <StatCard label="YoY change" value={formatPct(yoy.percent)} detail={`${yoy.absolute > 0 ? '+' : ''}${yoy.absolute.toFixed(1)} Mt versus prior year`} />
          <StatCard label="Power plants" value={`${powerPlantShare.toFixed(1)}%`} detail="Share of total reported emissions" />
        </div>

        <div className="mt-10">
          <TrendChart activeYear={activeYear} onYearSelect={setActiveYear} />
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
            <h2 className="text-base font-semibold text-green-900">State rankings · {activeYear}</h2>
            <div className="mt-5 space-y-3">
              {states.map((state) => (
                <div key={state.state} className="flex items-center justify-between rounded-[14px] bg-green-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-xs font-semibold text-white">
                      {state.rank}
                    </span>
                    <span className="text-sm font-medium text-green-900">{state.state}</span>
                  </div>
                  <span className="text-sm text-muted">{formatMt(state.mt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
