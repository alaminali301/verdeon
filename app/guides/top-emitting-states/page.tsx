import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import data from '@/lib/data/epa-data.json'
import { getStateRanking } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

export const metadata: Metadata = {
  title: 'Top Emitting States',
  description:
    'Explore the highest-emitting states in the EPA greenhouse gas reporting dataset and move into state detail pages.',
}

export default function TopEmittingStatesGuidePage() {
  const states = getStateRanking(data, 2023).slice(0, 10)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Top emitting states in the EPA dataset
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            State rankings are one of the simplest ways to understand where reported emissions are concentrated in the U.S. dataset. Use this page as a quick entry point into the state detail views.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {states.map((state) => (
            <Link key={state.state} href={`/states/${slugifyLabel(state.state)}`}>
              <Card className="rounded-[20px] p-5 shadow-card transition-transform duration-200 hover:-translate-y-1">
                <div className="text-sm text-green-600">#{state.rank} in 2023</div>
                <div className="mt-2 text-xl font-semibold text-green-900">{state.state}</div>
                <div className="mt-3 text-sm text-muted">{formatMt(state.mt)}</div>
              </Card>
            </Link>
          ))}
        </div>
      </PageWrapper>
    </main>
  )
}
