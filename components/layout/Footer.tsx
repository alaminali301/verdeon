import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'

const footerColumns = [
  {
    title: 'Products',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/explorer', label: 'Explorer' },
      { href: '/facilities', label: 'Facilities' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/states', label: 'States' },
      { href: '/methodology', label: 'Data notes' },
      { href: '/guides/epa-ghgrp-explained', label: 'EPA GHGRP guide' },
      { href: '/upload', label: 'Upload data' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/', label: 'About Verdeon' },
      { href: '/compare', label: 'Compare views' },
      { href: '/companies', label: 'Companies' },
      { href: '/sectors', label: 'Sector pages' },
      { href: '/guides/compare-state-emissions', label: 'State comparison guide' },
      { href: 'https://www.epa.gov/ghgreporting/data-sets', label: 'EPA GHGRP source' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/contact', label: 'Contact' },
    ],
  },
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

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-green-950 px-6 py-12 text-white/40">
      <PageWrapper>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-[240px]">
            <Link href="/" className="mb-4 inline-flex items-center gap-3 text-green-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <VerdeonLeafMark />
              </span>
              <span className="font-display text-[1.4rem] tracking-[-0.03em] text-green-300">
                Verdeon
              </span>
            </Link>
            <p className="text-[0.83rem] leading-7 text-white/40">
              A cleaner interface for exploring U.S. EPA greenhouse gas reporting data by facility, state, sector, and year.
            </p>
            <div className="mt-4 inline-block rounded-sm border border-green-500/15 bg-green-500/8 px-3 py-2 text-[0.72rem] text-green-400">
              Data source: EPA GHGRP Direct Emitters, 2010–2023.
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h5 className="mb-4 text-[0.73rem] font-semibold uppercase tracking-[0.08em] text-white/55">
                {column.title}
              </h5>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.84rem] text-white/40 transition-colors hover:text-green-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/6 pt-8 text-[0.76rem] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>Verdeon helps people inspect EPA greenhouse gas reporting data without enterprise software.</p>
          <p>EPA attribution: figures sourced from EPA GHGRP Direct Emitters datasets and derived Verdeon calculations.</p>
        </div>
      </PageWrapper>
    </footer>
  )
}
