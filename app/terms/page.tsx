import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Terms',
  description: 'Usage terms for Verdeon and its EPA data exploration workflow.',
}

export default function TermsPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Terms</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Use of the Verdeon site
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Verdeon is an exploratory interface for EPA greenhouse gas data. It is designed for browsing, comparing, and uploading structured files, but it is not a compliance system or a legal reporting service.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Acceptable use</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. Use the site to inspect public data, compare views, and preview uploads.</p>
              <p>2. Do not upload data you are not authorized to share.</p>
              <p>3. Do not rely on the site as the sole source of truth for regulatory or legal decisions.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Uploads and accounts</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Uploaded files are processed to build aggregates and rankings. Account access in this build is browser-based and intended to support the current product experience. Production authentication should use a real provider and server session layer.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Source data</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              EPA GHGRP data is public source material. Verdeon transforms that material into a more navigable interface. Source methodology lives on the{' '}
              <Link href="/methodology" className="text-green-700 underline-offset-4 hover:underline">
                methodology page
              </Link>
              .
            </p>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
