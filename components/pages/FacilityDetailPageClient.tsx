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
import { find2023FacilityDetail, get2023FacilityNames } from '@/lib/data/epa-2023-details'
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
  const facilityNames = useMemo(() => {
    return Array.from(new Set([...getAvailableFacilityNames(data), ...get2023FacilityNames()]))
  }, [data])
  const facilityName = findLabelBySlug(facilityNames, slug)
  const detail = facilityName ? find2023FacilityDetail(facilityName) : null

  if (!facilityName) {
    return (
      <main className="px-6 py-12 pt-28">
        <PageWrapper className="max-w-[760px]">
            <Card className="rounded-[24px] p-8 shadow-lift">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Facility not found</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
              That facility is not in the bundled EPA data.
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted">
              Try another facility from the rankings page or upload a different workbook with facility-level emissions.
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
  const latestPoint =
    history.find((point) => point.year === activeYear) ??
    history.at(-1) ??
    (detail ? { year: 2023, value: detail.totalMt, rank: detail.rank } : { year: activeYear, value: 0, rank: null })
  const peakPoint = history.length
    ? history.reduce((best, point) => (point.value > best.value ? point : best), history[0])
    : latestPoint
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
              {detail
                ? ` The 2023 workbook also identifies ${detail.city ?? 'the reported city'}${detail.state ? `, ${detail.state}` : ''}${detail.parentCompany ? ` and parent company ${detail.parentCompany}` : ''}.`
                : ' This view focuses on trend and rank history for the bundled EPA data.'}
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
          <StatCard label="Latest visible year" value={String(latestPoint.year)} detail="Most recent year this facility appears in the bundled EPA data" />
          <StatCard label="Latest emissions" value={formatMt(latestPoint.value)} detail={latestPoint.rank ? `Ranked #${latestPoint.rank} in that year` : 'No active rank available'} />
          <StatCard label="Peak year" value={String(peakPoint.year)} detail={formatMt(peakPoint.value)} />
          <StatCard label="Best rank" value={bestRank ? `#${bestRank}` : 'N/A'} detail={`${history.length} reporting years visible`} />
        </div>

        {detail ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="City / State" value={[detail.city, detail.state].filter(Boolean).join(', ')} detail={detail.county ?? 'County not listed'} />
            <StatCard label="Parent company" value={detail.parentCompany ?? 'Unlisted'} detail={detail.parentCompanyOwnership ? `${detail.parentCompanyOwnership.toFixed(0)}% ownership` : 'Ownership not listed'} />
            <StatCard label="NAICS" value={detail.naics ?? 'Unknown'} detail="Primary industry code from EPA workbook" />
            <StatCard label="Location" value={detail.latitude && detail.longitude ? 'Mapped' : 'Not mapped'} detail={detail.latitude && detail.longitude ? `${detail.latitude.toFixed(2)}, ${detail.longitude.toFixed(2)}` : 'No coordinates available'} />
          </div>
        ) : null}

        {history.length > 0 ? (
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
        ) : detail ? (
          <Card className="mt-10 rounded-[24px] p-8 shadow-card">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">2023 record</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
              {facilityName} appears in the 2023 EPA workbook
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              This facility is present in the full 2023 EPA dataset, but the bundled history view only contains yearly trend lines for facilities that appear in the multi-year summary.
            </p>
          </Card>
        ) : null}

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
                {history.length ? (
                  history.map((point) => (
                    <tr key={point.year} className="border-t border-green-100">
                      <td className="px-6 py-4 text-green-900">{point.year}</td>
                      <td className="px-6 py-4 text-muted">{formatMt(point.value)}</td>
                      <td className="px-6 py-4 text-muted">{point.rank ? `#${point.rank}` : 'Not ranked'}</td>
                    </tr>
                  ))
                ) : detail ? (
                  <tr className="border-t border-green-100">
                    <td className="px-6 py-4 text-green-900">2023</td>
                    <td className="px-6 py-4 text-muted">{formatMt(detail.totalMt)}</td>
                    <td className="px-6 py-4 text-muted">#{detail.rank}</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
