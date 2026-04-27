'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useMemo } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import {
  getAvailableStates,
  getStateHistory,
  getStateRanking,
} from '@/lib/data/selectors'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { formatMt, formatPct } from '@/lib/utils/format'
import { findLabelBySlug } from '@/lib/utils/slug'

const ComparisonChart = dynamic(
  () => import('@/components/charts/ComparisonChart').then((mod) => mod.ComparisonChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[360px]" /> },
)

interface StateDetailPageProps {
  params: {
    slug: string
  }
}

export default function StateDetailPage({ params }: StateDetailPageProps) {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const states = useMemo(() => getAvailableStates(data), [data])
  const stateName = findLabelBySlug(states, params.slug)

  if (!stateName) {
    return (
      <main className="px-6 py-12 pt-28">
        <PageWrapper className="max-w-[760px]">
          <Card className="rounded-[24px] p-8 shadow-lift">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">State not found</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
              That state is not in the current starter dataset.
            </h1>
            <div className="mt-6">
              <Link href="/states">
                <Button variant="outline">Back to states</Button>
              </Link>
            </div>
          </Card>
        </PageWrapper>
      </main>
    )
  }

  const history = getStateHistory(data, stateName)
  const latestPoint = history.find((point) => point.year === activeYear) ?? history.at(-1) ?? { year: activeYear, value: 0, rank: null }
  const peakPoint = history.reduce((best, point) => (point.value > best.value ? point : best), history[0])
  const baselinePoint = history[0]
  const changePct =
    baselinePoint && baselinePoint.value > 0
      ? ((latestPoint.value - baselinePoint.value) / baselinePoint.value) * 100
      : 0
  const activeYearData = data.years[String(latestPoint.year)]
  const sharePct = activeYearData ? (latestPoint.value / activeYearData.total_mt) * 100 : 0
  const comparisonTarget =
    getStateRanking(data, latestPoint.year).find((item) => item.state !== stateName)?.state ??
    states.find((state) => state !== stateName) ??
    stateName

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/states" className="text-sm font-medium text-green-700 underline-offset-4 hover:underline">
              Back to states
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge>State detail</Badge>
              <Badge variant="LOW">Public preview</Badge>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
              {stateName}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              Track how this state moved through the national ranking over time and how large its share of reported emissions is in the current year.
            </p>
          </div>
          <Link
            href={`/compare?mode=state&a=${encodeURIComponent(stateName)}&b=${encodeURIComponent(comparisonTarget)}`}
          >
            <Button>
              <ArrowLeftRight size={16} />
              Compare states
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <PreviewGate compact description="Create an account to save this state, upload your own workbook, and export deeper comparisons." />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Current year" value={String(latestPoint.year)} detail="Synced with the shared active year when available" />
          <StatCard label="Reported emissions" value={formatMt(latestPoint.value)} detail={latestPoint.rank ? `Current national rank #${latestPoint.rank}` : 'No rank available'} />
          <StatCard label="Share of US total" value={formatPct(sharePct)} detail={`Based on ${latestPoint.year} reported total`} />
          <StatCard label="Since first visible year" value={formatPct(changePct)} detail={`Peak year ${peakPoint.year} · ${formatMt(peakPoint.value)}`} />
        </div>

        <div className="mt-10">
          <ComparisonChart
            title="State emissions trend"
            description="This view shows how the state's reported emissions changed across the bundled reporting years."
            series={[
              {
                label: stateName,
                color: '#1a5c38',
                data: history.map((point) => ({ year: point.year, value: point.value })),
              },
              {
                label: 'Peak baseline',
                color: '#8ecf9f',
                data: history.map((point) => ({ year: point.year, value: peakPoint.value })),
              },
            ]}
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-card">
          <div className="border-b border-green-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-green-900">Year-by-year ranking history</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-green-50 text-green-900">
                <tr>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Emissions</th>
                  <th className="px-6 py-4 font-medium">National rank</th>
                </tr>
              </thead>
              <tbody>
                {history.map((point) => (
                  <tr key={point.year} className="border-t border-green-100">
                    <td className="px-6 py-4 text-green-900">{point.year}</td>
                    <td className="px-6 py-4 text-muted">{formatMt(point.value)}</td>
                    <td className="px-6 py-4 text-muted">{point.rank ? `#${point.rank}` : 'Not ranked'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
