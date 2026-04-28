import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Verdeon and its EPA data exploration workflow.',
}

export default function TermsPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[900px]">
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Terms of Service</p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] tracking-[-0.04em] text-green-950">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Verdeon is a free research and informational tool that visualizes publicly available EPA data. It is designed for browsing, comparing, and uploading structured files, but it is not a compliance system, accounting tool, or legal reporting service.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Free research and informational use</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <p>
                Verdeon is a free research and informational tool that visualizes publicly available EPA data. You may use it to inspect public EPA data, compare views, and preview uploads.
              </p>
              <p>
                The site may be updated, changed, or withdrawn at any time without notice.
              </p>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Public EPA data and verification</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Data may contain omissions, delays, processing errors, or interpretation errors. Users are responsible for verifying all information against original EPA sources before relying on it.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">No warranties and no advice</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Verdeon is not an official EPA service and is not affiliated with, endorsed by, or approved by the EPA. It does not provide legal, regulatory, compliance, accounting, or professional advice. The service is provided as-is without warranties.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Limitation of liability</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Verdeon shall not be liable for damages or losses resulting from use of the service, to the fullest extent permitted by law.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Third-party sources</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              EPA data and external links are provided for convenience only. Verdeon does not control third-party sites or sources, and the original EPA source should control if a discrepancy appears.
            </p>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Questions, corrections, or concerns can be sent to{' '}
              <a href="mailto:contact@verdeon.io" className="text-green-700 underline-offset-4 hover:underline">
                contact@verdeon.io
              </a>
              . Source methodology lives on the{' '}
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
