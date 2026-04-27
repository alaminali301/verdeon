import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Contact',
  description: 'Ways to reach the Verdeon maintainer for support and feedback.',
}

export default function ContactPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[760px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Contact</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Support and feedback
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            For bugs, feature requests, or privacy questions, use the project links below. Verdeon is still evolving, so direct feedback is useful.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Feedback and corrections</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Use this page for bugs, feature requests, privacy questions, or corrections to figures and copy.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Best for</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Questions about the EPA data explorer, upload behavior, or the public website itself.
            </p>
          </Card>
        </div>
      </PageWrapper>
    </main>
  )
}
