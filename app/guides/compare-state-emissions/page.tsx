import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Compare State Emissions',
  description:
    'A guide to comparing U.S. state emissions in EPA GHGRP data and how to use Verdeon state pages.',
}

export default function CompareStateEmissionsGuidePage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Compare state emissions in the EPA dataset
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            State-to-state comparison is one of the clearest ways to understand where reported emissions are concentrated. It also gives you a useful entry point into deeper facility and sector analysis.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Start with the ranking</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Use the state ranking pages to see which states reported the most emissions in a selected year.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Then compare the trend</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Once you know the leaders, compare two states across time to see whether the gap is widening or narrowing.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/states" className="text-green-700 underline-offset-4 hover:underline">
                Open state rankings
              </Link>
              <Link href="/compare?mode=state" className="text-green-700 underline-offset-4 hover:underline">
                Compare two states
              </Link>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Why this matters for traffic</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Pages like this target search intent that sits close to the product. People searching for state emissions comparisons are already looking for a data exploration workflow, not a generic climate summary.
            </p>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
