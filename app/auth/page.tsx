import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Public Access',
  description: 'Verdeon is launching openly without an account wall.',
}

export default function AuthPage() {
  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper className="max-w-[760px]">
        <Card className="rounded-[24px] p-8 shadow-lift">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Accounts</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Public launch, no sign-in wall
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Verdeon is being launched openly so visitors can explore the public EPA data, compare views, and test the upload
            workflow without creating an account first. If the product later needs accounts, a real provider-based setup can be
            added then.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button>Open dashboard</Button>
            </Link>
            <Link href="/upload">
              <Button variant="outline">Try upload</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact</Button>
            </Link>
          </div>
        </Card>
      </PageWrapper>
    </main>
  )
}
