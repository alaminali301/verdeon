import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { sectors } from '@/constants/sectors'
import data from '@/lib/data/epa-data.json'
import { getSectorBreakdown, getSectorHistory } from '@/lib/data/selectors'
import { formatMt, formatPct } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

interface SectorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return sectors.map((sector) => ({
    slug: slugifyLabel(sector.name),
  }))
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params
  const sector = sectors.find((entry) => slugifyLabel(entry.name) === slug)

  if (!sector) {
    return { title: 'Sector not found' }
  }

  return {
    title: `${sector.name} Emissions`,
    description: `Explore ${sector.name} emissions trends in the EPA greenhouse gas reporting dataset.`,
  }
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params
  const sector = sectors.find((entry) => slugifyLabel(entry.name) === slug)

  if (!sector) {
    notFound()
  }

  const latest = getSectorBreakdown(data, 2023).find((entry) => entry.name === sector.name)
  const history = getSectorHistory(data, sector.name)
  const firstPoint = history[0]
  const lastPoint = history.at(-1)
  const changePct =
    firstPoint && firstPoint.value > 0 && lastPoint
      ? ((lastPoint.value - firstPoint.value) / firstPoint.value) * 100
      : 0

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Sector page</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            {sector.name} emissions
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            {sector.description} This page gives a sector-specific view of how reported emissions moved across the EPA dataset over time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link href="/sectors" className="text-green-700 underline-offset-4 hover:underline">
              Back to sectors
            </Link>
            <Link href="/compare" className="text-green-700 underline-offset-4 hover:underline">
              Open compare view
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Latest year" value="2023" detail={latest ? `${formatMt(latest.mt)} reported` : 'No value available'} />
          <StatCard label="Share of total" value={latest ? formatPct(latest.pct) : '0%'} detail="Portion of 2023 reported U.S. total" />
          <StatCard label="Since first visible year" value={formatPct(changePct)} detail={firstPoint ? `${formatMt(firstPoint.value)} in ${firstPoint.year}` : 'No baseline'} />
          <StatCard label="Years visible" value={String(history.length)} detail="Years with non-zero sector totals in the starter dataset" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Why this sector matters</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Sector pages are one of the easiest ways to understand where reported emissions are concentrated. They make it easier to compare broad industrial categories before drilling into state or facility rankings.
            </p>
          </Card>

          <div className="overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-card">
            <div className="border-b border-green-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-green-900">Year-by-year sector totals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-green-50 text-green-900">
                  <tr>
                    <th className="px-6 py-4 font-medium">Year</th>
                    <th className="px-6 py-4 font-medium">Reported emissions</th>
                    <th className="px-6 py-4 font-medium">Sector rank</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((point) => (
                    <tr key={point.year} className="border-t border-green-100">
                      <td className="px-6 py-4 text-green-900">
                        <Link href={`/years/${point.year}`} className="underline-offset-4 hover:underline">
                          {point.year}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted">{formatMt(point.value)}</td>
                      <td className="px-6 py-4 text-muted">{point.rank ? `#${point.rank}` : 'Not ranked'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
