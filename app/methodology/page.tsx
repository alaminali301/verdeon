import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export default function MethodologyPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Methodology</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            How Verdeon uses EPA emissions data
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Verdeon is a visualization layer over EPA greenhouse gas reporting data. It organizes national totals, sector mix, state rankings, and facility rankings into a cleaner interface, but it does not claim to replace the original EPA source.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Primary source</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              The starter dataset in this project is based on EPA GHGRP direct emitter summaries covering reporting years 2010 through 2023. The app presents those values as annual totals, sector distributions, top states, and top facilities.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What Verdeon calculates</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. Year-over-year change is calculated from the reported total emissions for two selected years.</p>
              <p>2. Sector share is calculated as sector emissions divided by annual reported total emissions.</p>
              <p>3. State and facility rankings are ordered descending by aggregated reported emissions for the selected year.</p>
              <p>4. Uploaded files are aggregated from row-level values when recognizable year and emissions columns are available.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What Verdeon does not claim</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. Verdeon does not independently validate EPA submissions.</p>
              <p>2. It does not estimate lifecycle emissions, offsets, avoided emissions, or forecasted reductions by itself.</p>
              <p>3. If an uploaded file omits state, facility, or sector columns, Verdeon will not fabricate those missing dimensions.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Upload assumptions</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Upload parsing currently reads the first worksheet only. Recognized fields include common variants of year, emissions total, facility name, state, and sector. Mapped rows are grouped by year and aggregated into the same structure the rest of the site uses.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Why this page exists</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              The goal is to keep the product credible. Verdeon is strongest when it clearly separates source data, derived calculations, and current limitations instead of presenting polished charts without context.
            </p>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
