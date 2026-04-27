import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Privacy',
  description: 'How Verdeon handles account data, uploads, and browser storage.',
}

export default function PrivacyPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Privacy</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            How Verdeon handles data
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Verdeon is built to keep public EPA data easy to inspect while minimizing what it stores. The current deployment uses local browser state for UI preferences, and uploaded files are parsed in the browser before being aggregated into the app&apos;s working dataset.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What we collect</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              In the current build, UI preferences are stored locally in your browser. When you upload a file, Verdeon reads the file in the browser and extracts only the rows it can map into year, emissions, state, sector, and facility aggregates.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">What we do not do</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>1. We do not store raw uploads on a server in this build.</p>
              <p>2. We do not require full street addresses for any current feature.</p>
              <p>3. We do not log uploaded row contents or address-like fields to the console.</p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Recommended production setup</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              If Verdeon later accepts sensitive business data at scale, the production version should move authentication to a real provider and add a clear retention policy for uploaded files and derived datasets.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Questions</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              For issues about privacy or data handling, use the{' '}
              <Link href="/contact" className="text-green-700 underline-offset-4 hover:underline">
                contact page
              </Link>
              .
            </p>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
