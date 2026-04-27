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
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import {
  getAvailableFacilityNames,
  getFacilityHistory,
  getTopFacilities,
} from '@/lib/data/selectors'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { findLabelBySlug } from '@/lib/utils/slug'
import { formatMt } from '@/lib/utils/format'

const ComparisonChart = dynamic(
  () => import('@/components/charts/ComparisonChart').then((mod) => mod.ComparisonChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[360px]" /> },
)

export function FacilityDetailPageClient({ slug }: { slug: string }) {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const facilityNames = useMemo(() => getAvailableFacilityNames(data), [data])
  const facilityName = findLabelBySlug(facilityNames, slug)

  if (!facilityName) {
    return (
      <main className="px-6 py-12 pt-28">
        <PageWrapper className="max-w-[760px]">
          <Card className="rounded-[24px] p-8 shadow-lift">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Facility not found</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
              That facility is not in the current starter dataset.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Try another facility from the rankings page or upload a different workbook.
            </p>
            <div className="mt-6">
              <Link href="/facilities">
                <Button variant="outline">Back to facilities</Button>
              </Link>
            </div>
          </Card>
        </PageWrapper>
      </main>
    )
  }

  const history = getFacilityHistory(data, facilityName)
  const latestPoint = history.at(-1) ?? { year: activeYear, value: 0, rank: null }
  const peakPoint = history.reduce((best, point) => (point.value > best.value ? point : best), history[0])
  const bestRank = history.reduce<number | null>(
    (best, point) => (point.rank !== null && (best === null || point.rank < best) ? point.rank : best),
    null,
  )
  const comparisonTarget =
    getTopFacilities(data, latestPoint.year, 5).find((item) => item.name !== facilityName)?.name ??
    facilityNames.find((name) => name !== facilityName) ??
    facilityName

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/facilities" className="text-sm font-medium text-green-700 underline-offset-4 hover:underline">
              Back to facilities
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge>Facility detail</Badge>
              <Badge variant="LOW">Public preview</Badge>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
              {facilityName}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              National ranking history for this facility across the years where it appears in the bundled EPA dataset.
              This starter dataset includes facility names and emissions totals, so this view focuses on trend and rank history rather than facility metadata.
            </p>
          </div>
          <Link
            href={`/compare?mode=facility&a=${encodeURIComponent(facilityName)}&b=${encodeURIComponent(comparisonTarget)}`}
          >
            <Button>
              <ArrowLeftRight size={16} />
              Compare facilities
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <PreviewGate compact description="Inspect this facility's ranking history, compare it against another facility, and export the table." />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Latest visible year" value={String(latestPoint.year)} detail="Most recent year this facility appears in the starter bundle" />
          <StatCard label="Latest emissions" value={formatMt(latestPoint.value)} detail={latestPoint.rank ? `Ranked #${latestPoint.rank} in that year` : 'No active rank available'} />
          <StatCard label="Peak year" value={String(peakPoint.year)} detail={formatMt(peakPoint.value)} />
          <StatCard label="Best rank" value={bestRank ? `#${bestRank}` : 'N/A'} detail={`${history.length} reporting years visible`} />
        </div>

        <div className="mt-10">
          <ComparisonChart
            title="Facility trend over time"
            description="This line shows how the facility's reported emissions changed across the years where it appears in the dataset."
            series={[
              {
                label: facilityName,
                color: '#1a5c38',
                data: history.map((point) => ({ year: point.year, value: point.value })),
              },
              {
                label: 'Benchmark',
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
