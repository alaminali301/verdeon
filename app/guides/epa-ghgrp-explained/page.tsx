import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'EPA GHGRP Explained',
  description:
    'A plain-language guide to what the EPA Greenhouse Gas Reporting Program is, what the data covers, and how Verdeon uses it.',
}

export default function GhgrpGuidePage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            EPA GHGRP explained in plain language
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            The EPA Greenhouse Gas Reporting Program, or GHGRP, is one of the main public U.S. sources for facility-level greenhouse gas reporting. Verdeon uses that public data to make facilities, states, sectors, and year-by-year changes easier to explore.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What is the EPA GHGRP?</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              The GHGRP is the EPA&apos;s reporting program for large greenhouse gas emitters and suppliers in the United States. It makes it possible to inspect reported emissions at the facility level across many industrial categories.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What can you learn from it?</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. Which facilities report the largest emissions in a given year.</p>
              <p>2. Which states contribute the most reported emissions.</p>
              <p>3. How major sectors such as power plants or refineries changed over time.</p>
              <p>4. How current reporting compares with earlier years like 2010 or 2023.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What GHGRP data does not automatically tell you</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. It does not by itself explain why emissions changed.</p>
              <p>2. It does not represent every source of emissions everywhere.</p>
              <p>3. It does not replace broader lifecycle, policy, or financial analysis.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Why Verdeon exists</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Public emissions data is useful, but the raw experience can be slow and fragmented. Verdeon focuses on one narrower job: helping people inspect EPA-style emissions data quickly, transparently, and without enterprise software.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button>Open dashboard</Button>
              </Link>
              <Link href="/methodology">
                <Button variant="outline">Read methodology</Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline">Try upload flow</Button>
              </Link>
            </div>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
