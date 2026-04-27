'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { PageWrapper } from '@/components/layout/PageWrapper'

const primaryLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/explorer', label: 'Explorer' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/states', label: 'States' },
  { href: '/compare', label: 'Compare' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/methodology', label: 'Methodology' },
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpenPath, setMobileOpenPath] = useState<string | null>(null)
  const isMobileOpen = mobileOpenPath === pathname

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
            <Link href="/upload">
              <Button>Upload data</Button>
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-green-200 bg-white text-green-900 md:hidden"
            onClick={() => setMobileOpenPath((current) => (current === pathname ? null : pathname))}
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
              <Link href="/upload">
                <Button className="w-full justify-center">Upload data</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </PageWrapper>
    </header>
  )
}
