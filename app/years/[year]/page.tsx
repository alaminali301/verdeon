import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import data from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'
import { getSectorBreakdown, getStateRanking, getTopFacilities } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

interface YearPageProps {
  params: Promise<{
    year: string
  }>
}

const AVAILABLE_YEARS = Object.keys(data.years).map(Number).sort((a, b) => a - b)
const DATASET = data as EpaDataset

export async function generateStaticParams() {
  return AVAILABLE_YEARS.map((year) => ({
    year: String(year),
  }))
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const { year } = await params

  return {
    title: `${year} EPA Emissions`,
    description: `Explore facility, state, and sector reporting highlights for ${year} in the EPA greenhouse gas dataset.`,
  }
}

export default async function YearPage({ params }: YearPageProps) {
  const { year } = await params
  const numericYear = Number(year)
  const yearData = DATASET.years[year]

  if (!yearData || Number.isNaN(numericYear)) {
    notFound()
  }

  const sectors = getSectorBreakdown(DATASET, numericYear).slice(0, 4)
  const states = getStateRanking(DATASET, numericYear).slice(0, 5)
  const facilities = getTopFacilities(DATASET, numericYear, 5)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Year page</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            EPA emissions in {numericYear}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Use this page as a single-year view of the EPA dataset, with quick access to the strongest sector, state, and facility signals in {numericYear}.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Reported total" value={formatMt(yearData.total_mt)} detail={`${numericYear} direct emitter total`} />
          <StatCard label="Facilities" value={yearData.facilities.toLocaleString()} detail="Facilities visible in the starter dataset" />
          <StatCard label="Top state" value={states[0]?.state ?? 'N/A'} detail={states[0] ? formatMt(states[0].mt) : 'No value'} />
          <StatCard label="Top facility" value={facilities[0]?.name ?? 'N/A'} detail={facilities[0] ? formatMt(facilities[0].mt) : 'No value'} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Top sectors</h2>
            <div className="mt-4 space-y-3">
              {sectors.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between gap-4">
                  <Link href={`/sectors/${slugifyLabel(sector.name)}`} className="text-sm text-green-900 underline-offset-4 hover:underline">
                    {sector.name}
                  </Link>
                  <span className="text-sm text-muted">{formatMt(sector.mt)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Top states</h2>
            <div className="mt-4 space-y-3">
              {states.map((state) => (
                <div key={state.state} className="flex items-center justify-between gap-4">
                  <Link href={`/states/${state.state.toLowerCase()}`} className="text-sm text-green-900 underline-offset-4 hover:underline">
                    {state.state}
                  </Link>
                  <span className="text-sm text-muted">{formatMt(state.mt)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Top facilities</h2>
            <div className="mt-4 space-y-3">
              {facilities.map((facility) => (
                <div key={facility.name} className="flex items-center justify-between gap-4">
                  <Link
                    href={`/facilities/${slugifyLabel(facility.name)}`}
                    className="text-sm text-green-900 underline-offset-4 hover:underline"
                  >
                    {facility.name}
                  </Link>
                  <span className="text-sm text-muted">{formatMt(facility.mt)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
