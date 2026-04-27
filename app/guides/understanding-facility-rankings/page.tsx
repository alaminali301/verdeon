import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Understanding Facility Rankings',
  description:
    'Learn how to interpret top facility rankings in EPA GHGRP data and how Verdeon structures facility detail pages.',
}

export default function UnderstandingFacilityRankingsGuidePage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Understanding facility rankings
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Facility rankings are a fast way to find the biggest reported sources in a given year. The trick is using them as a starting point, not the full story.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What a rank means</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              A lower rank number means a higher reported emissions total for that selected year.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What to look for</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. Whether the same facility stays near the top over multiple years.</p>
              <p>2. Whether the gap between facilities is large or small.</p>
              <p>3. Whether the trend is moving up, down, or staying flat.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Next step in Verdeon</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Open the facilities page to browse the top emitters for a year, then jump into the detail route for a year-by-year ranking history.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/facilities" className="text-green-700 underline-offset-4 hover:underline">
                Browse facilities
              </Link>
              <Link href="/compare?mode=facility" className="text-green-700 underline-offset-4 hover:underline">
                Compare facilities
              </Link>
            </div>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
