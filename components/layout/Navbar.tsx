'use client'

import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useAuthStore } from '@/lib/store/useAuthStore'

const primaryLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/explorer', label: 'Explorer' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/states', label: 'States' },
  { href: '/compare', label: 'Compare' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/recommendations', label: 'Recommendations' },
] as const

function VerdeonLeafMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2C9 2 4 5.5 4 10.5C4 13.5 6.2 16 9 16C11.8 16 14 13.5 14 10.5C14 5.5 9 2 9 2Z" fill="#5ec48a" />
      <path d="M9 7L9 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.5 10L9 7.5L11.5 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const currentUser = useAuthStore((state) => state.currentUser)
  const signOut = useAuthStore((state) => state.signOut)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b border-green-900/8 bg-white/85 backdrop-blur-xl transition-shadow duration-200',
        isScrolled ? 'shadow-card' : '',
      ].join(' ')}
    >
      <PageWrapper className="py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex items-center gap-3 text-green-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-900">
              <VerdeonLeafMark />
            </span>
            <span className="font-display text-[1.45rem] tracking-[-0.03em] text-green-900">Verdeon</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {primaryLinks.map((link) => {
              const active = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-[0.92rem] transition-colors',
                    active ? 'text-green-900' : 'text-muted hover:text-green-700',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            <div className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-green-700">
              Demo auth
            </div>
            {hasHydrated && currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm text-green-900"
                  aria-expanded={isProfileOpen}
                  aria-label="Open account menu"
                >
                  <span className="font-medium">{currentUser.name}</span>
                  <ChevronDown size={16} className={isProfileOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {isProfileOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-[18px] border border-green-100 bg-white p-4 shadow-lift">
                    <div className="text-sm font-medium text-green-900">{currentUser.name}</div>
                    <div className="mt-1 text-sm text-muted">{currentUser.email}</div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Link href="/dashboard" className="rounded-full px-3 py-2 text-sm text-green-900 hover:bg-green-50">
                        Dashboard
                      </Link>
                      <Link href="/upload" className="rounded-full px-3 py-2 text-sm text-green-900 hover:bg-green-50">
                        Upload data
                      </Link>
                      <button
                        type="button"
                        onClick={signOut}
                        className="rounded-full px-3 py-2 text-left text-sm text-green-900 hover:bg-green-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link href="/auth?mode=signin">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-green-200 bg-white text-green-900 md:hidden"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle navigation"
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isMobileOpen ? (
          <div className="mt-4 rounded-[14px] border border-green-100 bg-white p-4 shadow-card md:hidden">
            <nav className="flex flex-col gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'rounded-full px-3 py-2 text-sm transition-colors',
                    pathname === link.href
                      ? 'bg-green-900 text-white'
                      : 'text-green-900 hover:bg-green-50',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <div className="rounded-[14px] border border-green-100 bg-green-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-green-700">
                Demo auth
              </div>
              {hasHydrated && currentUser ? (
                <>
                  <div className="rounded-[14px] border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-900">
                    Signed in as <span className="font-medium">{currentUser.name}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-center" onClick={signOut}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth?mode=signin">
                    <Button variant="outline" className="w-full justify-center">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <Button className="w-full justify-center">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </PageWrapper>
    </header>
  )
}
