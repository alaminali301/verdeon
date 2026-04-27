import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'How to Read EPA GHGRP Data',
  description:
    'Learn how to interpret EPA greenhouse gas reporting data by year, state, sector, and facility.',
}

export default function HowToReadGhgrpPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Guide</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            How to read EPA GHGRP data
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            If you are new to EPA greenhouse gas reporting data, start here. The key is understanding what the data shows clearly and what requires extra interpretation.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Start with the year</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Annual totals help you understand whether the reporting picture changed broadly before you drill into who or what drove that change.
            </p>
          </Card>
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Then compare sectors</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Sector views show whether the largest share comes from power plants, refineries, waste, or other industrial groups. This is usually the fastest way to understand the shape of a year.
            </p>
          </Card>
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Use state and facility rankings carefully</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Rankings are useful for identifying concentration, but they do not explain policy, economics, technology changes, or operational context by themselves.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href="/states" className="text-green-700 underline-offset-4 hover:underline">
                Browse state pages
              </Link>
              <Link href="/facilities" className="text-green-700 underline-offset-4 hover:underline">
                Browse facility pages
              </Link>
            </div>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
