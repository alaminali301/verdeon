import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import data from '@/lib/data/epa-data.json'
import { getTopFacilities } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

export const metadata: Metadata = {
  title: 'Largest Power Plant Emitters',
  description:
    'A guide to the largest facility emitters in the EPA greenhouse gas reporting dataset and how to inspect them in Verdeon.',
}

export default function LargestPowerPlantEmittersGuidePage() {
  const facilities = getTopFacilities(data, 2023, 10)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Largest facility emitters in the EPA dataset
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            The facility ranking pages help you move from national totals into specific names that appear at the top of the reporting dataset. This is often the fastest path for researchers or journalists looking for major emitters.
          </p>
        </div>

        <div className="grid gap-4">
          {facilities.map((facility, index) => (
            <Link key={facility.name} href={`/facilities/${slugifyLabel(facility.name)}`}>
              <Card className="rounded-[20px] p-5 shadow-card transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-green-600">#{index + 1} in 2023</div>
                <div className="mt-2 text-xl font-semibold text-green-900">{facility.name}</div>
                <div className="mt-3 text-sm text-muted">{formatMt(facility.mt)}</div>
              </Card>
            </Link>
          ))}
        </div>
      </PageWrapper>
    </main>
  )
}
