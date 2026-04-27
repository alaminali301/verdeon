'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/lib/store/useAuthStore'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter()
  const pathname = usePathname()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const currentUser = useAuthStore((state) => state.currentUser)

  useEffect(() => {
    if (hasHydrated && !currentUser) {
      router.replace(`/auth?mode=signin&next=${encodeURIComponent(pathname)}`)
    }
  }, [currentUser, hasHydrated, pathname, router])

  if (!hasHydrated) {
    return <main className="px-6 py-12 pt-28" />
  }

  if (!currentUser) {
    return (
      <main className="px-6 py-12 pt-28">
        <PageWrapper className="max-w-[560px]">
          <Card className="rounded-[24px] p-8 shadow-lift">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Sign in required</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.8rem)] tracking-[-0.03em] text-green-950">
              Create an account to use the app
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Verdeon&apos;s inner dashboards are behind a lightweight demo auth flow in this build.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/auth?mode=signin&next=${encodeURIComponent(pathname)}`}>
                <Button>Sign in</Button>
              </Link>
              <Link href={`/auth?mode=signup&next=${encodeURIComponent(pathname)}`}>
                <Button variant="outline">Sign up</Button>
              </Link>
            </div>
          </Card>
        </PageWrapper>
      </main>
    )
  }

  return <>{children}</>
}
