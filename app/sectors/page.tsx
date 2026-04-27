import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { sectors } from '@/constants/sectors'
import data from '@/lib/data/epa-data.json'
import { getSectorBreakdown } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

export const metadata: Metadata = {
  title: 'EPA Emissions Sectors',
  description:
    'Explore EPA greenhouse gas reporting sectors such as power plants, chemicals, refineries, waste, and metals.',
}

export default function SectorsIndexPage() {
  const breakdown = getSectorBreakdown(data, 2023)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Sectors</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Explore EPA emissions sectors
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Browse the major sector groupings used in the Verdeon dataset and move into deeper pages for sector-specific trend context.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sectors.map((sector) => {
            const item = breakdown.find((entry) => entry.name === sector.name)

            return (
              <Link key={sector.name} href={`/sectors/${slugifyLabel(sector.name)}`}>
                <Card className="h-full rounded-[24px] p-6 shadow-card transition-transform duration-200 hover:-translate-y-1">
                  <div className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-green-600">Sector</div>
                  <h2 className="mt-4 text-xl font-semibold text-green-900">{sector.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted">{sector.description}</p>
                  <div className="mt-5 text-sm text-green-800">
                    {item ? `${formatMt(item.mt)} in 2023` : 'No current value'}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </PageWrapper>
    </main>
  )
}
