'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/lib/store/useAuthStore'

interface PreviewGateProps {
  title?: string
  description?: string
  compact?: boolean
}

export function PreviewGate({
  title = 'You are viewing a live preview',
  description = 'Create an account to upload files, export views, and unlock the full Verdeon workflow.',
  compact = false,
}: PreviewGateProps) {
  const pathname = usePathname()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (!hasHydrated || currentUser) {
    return null
  }

  const next = encodeURIComponent(pathname)

  if (compact) {
    return (
      <div className="rounded-[18px] border border-green-100 bg-green-50 px-4 py-4">
        <p className="text-sm font-medium text-green-900">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/auth?mode=signup&next=${next}`}>
            <Button>Sign up</Button>
          </Link>
          <Link href={`/auth?mode=signin&next=${next}`}>
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Card className="rounded-[24px] border-green-100 bg-green-50/90 p-6 shadow-card">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Preview mode</p>
      <h2 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.3rem)] tracking-[-0.03em] text-green-950">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`/auth?mode=signup&next=${next}`}>
          <Button>Sign up</Button>
        </Link>
        <Link href={`/auth?mode=signin&next=${next}`}>
          <Button variant="outline">Sign in</Button>
        </Link>
      </div>
    </Card>
  )
}
