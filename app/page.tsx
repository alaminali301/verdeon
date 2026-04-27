'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatCard } from '@/components/ui/StatCard'
import data from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'
import {
  getCumulativeReduction,
  getSectorBreakdown,
  getStateRanking,
  getTopFacilities,
} from '@/lib/data/selectors'
import { formatMt, formatPct } from '@/lib/utils/format'
import { SECTOR_COLORS } from '@/lib/utils/colors'

const MiniBarChart = dynamic(
  () => import('@/components/charts/MiniBarChart').then((mod) => mod.MiniBarChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[86px]" /> },
)
const SectorBarChart = dynamic(
  () => import('@/components/charts/SectorBarChart').then((mod) => mod.SectorBarChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[360px]" /> },
)
const TrendChart = dynamic(
  () => import('@/components/charts/TrendChart').then((mod) => mod.TrendChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[350px]" /> },
)

type FaqItem = {
  question: string
  answer: ReactNode
}

const YEARS = Object.keys(data.years).map(Number).sort((a, b) => a - b)
const DATASET: EpaDataset = data
const HERO_YEAR = 2023
const HERO_DATA = DATASET.years[String(HERO_YEAR)]
const BASELINE_YEAR = 2010
const REDUCTION_PERCENT = getCumulativeReduction(DATASET, BASELINE_YEAR, HERO_YEAR)
const REDUCTION_MT = HERO_DATA.total_mt - DATASET.years[String(BASELINE_YEAR)].total_mt
const POWER_PLANT_REDUCTION = (
  ((HERO_DATA.sectors['Power Plants'] - DATASET.years[String(BASELINE_YEAR)].sectors['Power Plants']) /
    DATASET.years[String(BASELINE_YEAR)].sectors['Power Plants']) *
  100
)
const PEAK_FACILITIES = Math.max(...Object.values(DATASET.years).map((yearData) => yearData.facilities))
const LOGO_ITEMS = [
  'EPA GHGRP',
  'Direct Emitters 2010–2023',
  'FLIGHT Tool',
  'Envirofacts',
  `${HERO_DATA.facilities.toLocaleString()} Facilities`,
  '8 Sectors',
]
const HOW_ITEMS = [
  {
    number: '01',
    icon: '📂',
    title: 'Open EPA-style files',
    description:
      'Bring in EPA-style CSV or Excel files and let Verdeon map year, emissions, state, sector, and facility fields into one consistent view.',
  },
  {
    number: '02',
    icon: '📊',
    title: 'Compare the public data',
    description:
      'Move through facility rankings, state views, sector mix, and year-by-year changes without digging through raw spreadsheets or legacy government interfaces.',
  },
  {
    number: '03',
    icon: '💡',
    title: 'Share what you find',
    description:
      'Use linked views, compare pages, and exports to turn public emissions data into something easier to explain, cite, and revisit.',
  },
]
const FAQS: FaqItem[] = [
  {
    question: 'What EPA data does Verdeon actually use?',
    answer: (
      <>
        Verdeon is built on the EPA GHGRP Direct Emitters dataset, 2010–2023. This covers facility-level emissions across 8 major sector categories and 6,000–7,000 facilities annually. Data sourced from{' '}
        <a
          href="https://www.epa.gov/ghgreporting/data-sets"
          target="_blank"
          rel="noreferrer"
          className="text-green-600"
        >
          epa.gov/ghgreporting/data-sets
        </a>
        .
      </>
    ),
  },
  {
    question: 'Do I need to clean the EPA files first?',
    answer:
      'Not always, but cleaner files help. Verdeon looks for common year, emissions, facility, state, and sector columns in the first worksheet and rebuilds the dataset from the rows it can map.',
  },
  {
    question: 'Why did emissions drop so much since 2010?',
    answer:
      'The biggest driver is Power Plants: from 2,295 Mt in 2010 to 1,404 Mt in 2023 (−38.8%), reflecting the coal-to-gas and coal-to-renewables shift. Other sectors like Chemicals and Petroleum & Gas have stayed more stable.',
  },
  {
    question: 'Why did emissions tick back up in 2021?',
    answer:
      '2020 was an anomalous low (2,403 Mt) due to COVID-19 industrial slowdown. The 2021 rebound to 2,524 Mt reflects economic recovery. Emissions then resumed declining in 2022 and 2023.',
  },
  {
    question: 'Can I export charts and reports?',
    answer:
      'You can export filtered views from the app. In this starter build, exports focus on data snapshots rather than polished reporting packages.',
  },
  {
    question: 'Is there an API for our own tools?',
    answer:
      'Not in this build. Verdeon is currently focused on making EPA-style emissions data easier to explore in the browser.',
  },
]
const VERDEON_CAPABILITIES = [
  {
    title: 'Explore national trends',
    eyebrow: '14-year timeline',
    features: [
      'Compare 2010 through 2023 reported emissions in one place',
      'Track sector shifts, state rankings, and total reductions over time',
      'Use interactive year switching across charts and data tables',
    ],
  },
  {
    title: 'Drill into facilities and states',
    eyebrow: 'Real facility data',
    features: [
      'Review top emitters by year with ranked facility tables',
      'Inspect state-by-state totals and year-over-year changes',
      'Keep filters synced across the dashboard, explorer, and rankings pages',
    ],
  },
  {
    title: 'Upload, compare, and export',
    eyebrow: 'Interactive workflow',
    features: [
      'Preview uploaded EPA-style workbooks before applying them',
      'Export filtered snapshots, state rankings, and facility views',
      'Share side-by-side comparisons with URL-synced state and facility views',
    ],
  },
] as const

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [activeYear, setActiveYear] = useState(HERO_YEAR)
  const [facilityYear, setFacilityYear] = useState(HERO_YEAR)
  const [openFaq, setOpenFaq] = useState(0)
  const activeFacilities = getTopFacilities(DATASET, facilityYear, 10)
  const facilityHighlight = activeFacilities[0]
  const activeStates = getStateRanking(DATASET, HERO_YEAR)
  const sectorBreakdown = getSectorBreakdown(DATASET, activeYear)
  const heroSectors = getSectorBreakdown(DATASET, HERO_YEAR).slice(0, 4)
  const heroMaxSector = heroSectors[0]?.mt ?? 1

  return (
    <div className="min-h-screen bg-white text-charcoal">
      <main className="overflow-x-hidden pt-24">
        <section className="relative px-6 pb-16 pt-10 md:pb-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-green-100 blur-3xl" />
            <div className="absolute right-[-8%] top-16 h-80 w-80 rounded-full bg-sand-100 blur-3xl" />
          </div>
          <PageWrapper className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
              <FadeIn>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/90 px-4 py-2 text-[0.76rem] font-semibold uppercase tracking-[0.1em] text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  U.S. EPA GHGRP · 2010–2023
                </div>
                <h1 className="font-display text-[clamp(2.9rem,6vw,4.7rem)] font-bold leading-[0.96] tracking-[-0.04em] text-green-950">
                  Explore EPA emissions data
                  <br />
                  <span className="text-green-600">without enterprise software</span>
                </h1>
                <p className="mt-6 max-w-xl text-[1.05rem] leading-8 text-muted">
                  Verdeon is a cleaner, faster interface for public U.S. greenhouse gas reporting data. It is built for researchers, journalists, and small teams that need to compare facilities, states, sectors, and long-term trends without fighting raw spreadsheets or legacy tools.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/dashboard">
                    <Button className="px-6 py-3.5">Open the dashboard</Button>
                  </Link>
                  <Link href="/guides/epa-ghgrp-explained">
                    <Button variant="outline" className="px-6 py-3.5">
                      Learn the dataset
                    </Button>
                  </Link>
                  <Link href="#data">
                    <Button variant="outline" className="px-6 py-3.5">
                      See the public data
                    </Button>
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {['EPA GHGRP', '2010–2023', '8 sectors', `${HERO_DATA.facilities.toLocaleString()} facilities`].map((item) => (
                      <div
                        key={item}
                        className="rounded-full border border-green-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-green-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted">
                    <strong className="text-green-900">Built for public-data explorers</strong>
                    <br />
                    researchers, journalists, and small teams
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={150}>
                <Card className="relative overflow-visible rounded-[24px] border-green-200 bg-white p-0 shadow-lift">
                  <div className="flex items-center gap-2 bg-green-900 px-6 py-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-auto text-[0.75rem] tracking-[0.04em] text-white/50">
                      Verdeon · EPA GHGRP · 2023 top facility
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-[14px] border border-green-100 bg-green-50 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted">
                          Total Emissions
                        </div>
                        <div className="mt-2 font-display text-[1.75rem] font-bold tracking-[-0.03em] text-green-950">
                          {formatMt(HERO_DATA.total_mt)}
                        </div>
                        <div className="mt-1 text-[0.75rem] text-green-700">
                          ▼ {Math.abs(REDUCTION_PERCENT).toFixed(1)}% since 2010
                        </div>
                      </div>
                      <div className="rounded-[14px] border border-green-100 bg-green-50 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted">
                          Facilities
                        </div>
                        <div className="mt-2 font-display text-[1.75rem] font-bold tracking-[-0.03em] text-green-950">
                          {HERO_DATA.facilities.toLocaleString()}
                        </div>
                        <div className="mt-1 text-[0.75rem] text-green-700">
                          ▼ from {PEAK_FACILITIES.toLocaleString()} peak
                        </div>
                      </div>
                      <div className="rounded-[14px] border border-green-100 bg-green-50 p-4">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted">
                          Power Plants
                        </div>
                        <div className="mt-2 font-display text-[1.75rem] font-bold tracking-[-0.03em] text-green-950">
                          {formatMt(HERO_DATA.sectors['Power Plants'])}
                        </div>
                        <div className="mt-1 text-[0.75rem] text-green-700">
                          ▼ {Math.abs(POWER_PLANT_REDUCTION).toFixed(1)}% since 2010
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <MiniBarChart activeYear={HERO_YEAR} />
                    </div>

                    <div className="mt-5 space-y-3">
                      {heroSectors.map((sector) => (
                        <div key={sector.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: SECTOR_COLORS[sector.name] }}
                          />
                          <div className="flex items-center gap-3">
                            <span className="min-w-[104px] text-sm text-green-900">
                              {sector.name === 'Petroleum & Gas' ? 'Petrol. & Gas' : sector.name}
                            </span>
                            <div className="h-2.5 flex-1 rounded-full bg-green-100">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(sector.mt / heroMaxSector) * 100}%`,
                                  backgroundColor: SECTOR_COLORS[sector.name],
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-muted">{formatMt(sector.mt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute -bottom-5 right-6 rounded-[16px] border border-green-200 bg-white px-4 py-3 shadow-lift">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                        📉
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-green-950">
                          {REDUCTION_MT.toFixed(0)} Mt since 2010
                        </div>
                        <div className="text-[0.75rem] text-muted">Verified EPA GHGRP data</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            </div>
          </PageWrapper>
        </section>

        <section className="border-y border-green-100 bg-sand-100/60 px-6 py-8">
          <PageWrapper>
            <FadeIn className="flex flex-wrap items-center gap-4">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-muted">
                Real data from
              </span>
              <span className="h-5 w-px bg-green-200" />
              <div className="flex flex-wrap gap-3">
                {LOGO_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm text-green-900"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>
          </PageWrapper>
        </section>

        <section id="how" className="px-6 py-20">
          <PageWrapper>
            <SectionHeader eyebrow="How it works" title="From public EPA files to usable analysis" />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {HOW_ITEMS.map((item, index) => (
                <FadeIn key={item.number} delay={index * 100}>
                  <Card className="h-full rounded-[24px] p-6">
                    <div className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-green-600">
                      {item.number}
                    </div>
                    <div className="mt-5 text-3xl">{item.icon}</div>
                    <h3 className="mt-5 text-xl font-semibold text-green-900">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </PageWrapper>
        </section>

        <section id="data" className="bg-green-50 px-6 py-20">
          <PageWrapper>
            <SectionHeader
              eyebrow="Data explorer"
              title="14 years of real EPA data"
              description="Every number below comes directly from EPA GHGRP data covering 2010 through 2023. Click any year to explore."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
              <FadeIn>
                <TrendChart activeYear={activeYear} onYearSelect={setActiveYear} />
              </FadeIn>
              <FadeIn delay={100}>
                <SectorBarChart data={sectorBreakdown} year={activeYear} />
              </FadeIn>
            </div>
          </PageWrapper>
        </section>

        <section id="facilities" className="px-6 py-20">
          <PageWrapper>
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              <div>
                <SectionHeader
                  eyebrow="Top emitters"
                  title="Biggest facilities by year"
                  description="Use the ranking view to see how the largest reporting facilities shift over time and jump into detail pages for trend history."
                />
              </div>
              <FadeIn>
                <Card featured className="rounded-[24px] p-6 shadow-lift">
                  <div className="text-[0.75rem] uppercase tracking-[0.08em] text-green-300">{facilityYear} · top reporting facility</div>
                  <div className="mt-4 font-display text-[2.3rem] leading-none tracking-[-0.03em] text-white">
                    {facilityHighlight?.name}
                  </div>
                  <div className="mt-2 text-sm text-green-200">EPA GHGRP top reporting facility</div>
                  <div className="mt-6 font-display text-[2rem] tracking-[-0.03em] text-green-300">
                    {facilityHighlight ? `${facilityHighlight.mt.toFixed(3)} Mt` : '0 Mt'}
                  </div>
                  <div className="mt-1 text-sm text-green-300">CO₂e · EPA GHGRP</div>
                </Card>
              </FadeIn>
            </div>

            <FadeIn className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="facility-year" className="text-sm text-muted">
                  Select year:
                </label>
                <select
                  id="facility-year"
                  className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm text-green-900 outline-none"
                  value={facilityYear}
                  onChange={(event) => setFacilityYear(Number(event.target.value))}
                >
                  {[...YEARS].reverse().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </FadeIn>

            <FadeIn className="mt-6">
              <div className="overflow-hidden rounded-[20px] border border-green-100 bg-white shadow-card">
                <table className="w-full border-collapse">
                  <thead className="bg-green-900 text-left text-sm text-white">
                    <tr>
                      <th className="px-5 py-4 font-medium">#</th>
                      <th className="px-5 py-4 font-medium">Facility</th>
                      <th className="px-5 py-4 font-medium">Emissions (Mt CO₂e)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFacilities.map((facility, index) => (
                      <tr key={facility.name} className="border-t border-green-100">
                        <td className="px-5 py-4">
                          <span
                            className={[
                              'inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold',
                              index < 3 ? 'bg-green-900 text-white' : 'bg-green-50 text-green-900',
                            ].join(' ')}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-green-900">{facility.name}</td>
                        <td className="px-5 py-4 text-sm text-muted">{facility.mt.toFixed(3)} Mt</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </PageWrapper>
        </section>

        <section id="states" className="bg-sand-100/50 px-6 py-20">
          <PageWrapper>
            <SectionHeader
              eyebrow="Geographic view"
              title="Top 15 states · 2023"
              description="Compare reported emissions by state and move from high-level ranking into state detail and comparison views."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {activeStates.map((state, index) => (
                <FadeIn key={state.state} delay={index * 40}>
                  <Card className="rounded-[18px] bg-white p-5">
                    <div className="text-lg font-semibold text-green-900">{state.state}</div>
                    <div className="mt-3 font-display text-[1.7rem] tracking-[-0.03em] text-green-950">
                      {state.mt.toFixed(0)} Mt
                    </div>
                    <div className="mt-2 text-sm text-muted">#{state.rank} in US</div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </PageWrapper>
        </section>

        <section id="stats" className="bg-green-900 px-6 py-20">
          <PageWrapper>
            <FadeIn>
              <h2 className="text-center font-display text-[clamp(2rem,3.8vw,3rem)] tracking-[-0.03em] text-white">
                The real numbers — straight from EPA GHGRP
              </h2>
            </FadeIn>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <FadeIn>
                <StatCard
                  featured
                  label="2010 baseline"
                  value={DATASET.years['2010'].total_mt.toFixed(0)}
                  detail="Mt CO₂e reported in 2010 — the baseline year"
                  source="EPA GHGRP Direct Emitters 2010"
                />
              </FadeIn>
              <FadeIn delay={80}>
                <StatCard
                  featured
                  label="Latest year"
                  value={HERO_DATA.total_mt.toFixed(0)}
                  detail="Mt CO₂e reported in 2023 — the most recent year"
                  source="EPA GHGRP Direct Emitters 2023"
                />
              </FadeIn>
              <FadeIn delay={160}>
                <StatCard
                  featured
                  label="Total reduction"
                  value={formatPct(REDUCTION_PERCENT)}
                  detail="Total reduction from 2010 to 2023 across all sectors"
                  source="Verdeon calculation · EPA data"
                />
              </FadeIn>
              <FadeIn delay={240}>
                <StatCard
                  featured
                  label="Facilities"
                  value={HERO_DATA.facilities.toLocaleString()}
                  detail="Facilities reporting to GHGRP in 2023"
                  source="EPA GHGRP Direct Emitters 2023"
                />
              </FadeIn>
            </div>
          </PageWrapper>
        </section>

        <section id="capabilities" className="px-6 py-20">
          <PageWrapper>
            <SectionHeader
              eyebrow="What you can do in Verdeon"
              title="A sharper niche than a general climate platform"
              description="Verdeon is strongest when it stays focused: public U.S. emissions data, transparent methods, fast comparisons, and a much lighter workflow than enterprise sustainability software."
              align="center"
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {VERDEON_CAPABILITIES.map((capability, index) => (
                <FadeIn key={capability.title} delay={index * 100}>
                  <Card className="relative h-full rounded-[24px] p-6">
                    <div className="text-green-600">{capability.eyebrow}</div>
                    <div className="mt-4 font-display text-[2rem] leading-none tracking-[-0.03em] text-green-950">
                      {capability.title}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {capability.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                          <span className="text-green-600">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/sectors" className="text-green-700 underline-offset-4 hover:underline">
                Browse sector pages
              </Link>
              <Link href="/years/2023" className="text-green-700 underline-offset-4 hover:underline">
                Explore 2023 summary
              </Link>
              <Link href="/guides/epa-ghgrp-explained" className="text-green-700 underline-offset-4 hover:underline">
                Read the EPA GHGRP guide
              </Link>
            </div>
            <div className="mt-8 rounded-[20px] border border-green-100 bg-white p-5 text-sm text-muted">
              <span className="font-medium text-green-900">Popular starting points:</span>{' '}
              <Link href="/guides/top-emitting-states" className="text-green-700 underline-offset-4 hover:underline">
                top states
              </Link>
              {', '}
              <Link href="/guides/largest-power-plant-emitters" className="text-green-700 underline-offset-4 hover:underline">
                biggest emitters
              </Link>
              {', '}
              <Link href="/guides/compare-state-emissions" className="text-green-700 underline-offset-4 hover:underline">
                compare states
              </Link>
              {', '}
              <Link href="/guides/how-to-read-epa-ghgrp-data" className="text-green-700 underline-offset-4 hover:underline">
                reading the data
              </Link>
            </div>
          </PageWrapper>
        </section>

        <section id="faq" className="px-6 py-20">
          <PageWrapper>
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <FadeIn>
                <SectionHeader eyebrow="FAQ" title="Questions & answers" />
                <p className="mt-4 text-base leading-7 text-muted">
                  Can&apos;t find what you need?{' '}
                  <Link href="/methodology" className="text-green-700">
                    review the data notes
                  </Link>{' '}
                  to see the source data, assumptions, and current limits of this build.
                </p>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="space-y-3">
                  {FAQS.map((item, index) => {
                    const open = openFaq === index

                    return (
                      <div key={item.question} className="rounded-[18px] border border-green-100 bg-white shadow-card">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? -1 : index)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="text-sm font-medium text-green-900">{item.question}</span>
                          <ChevronDown
                            size={18}
                            className={['shrink-0 text-muted transition-transform', open ? 'rotate-180' : ''].join(' ')}
                          />
                        </button>
                        {open ? (
                          <div className="border-t border-green-100 px-5 py-4 text-sm leading-7 text-muted">
                            {item.answer}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </FadeIn>
            </div>
          </PageWrapper>
        </section>

        <section id="cta" className="relative overflow-hidden bg-green-950 px-6 py-28 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(58,173,107,.18)_0%,transparent_70%)]" />
          <PageWrapper className="relative max-w-[660px]">
            <FadeIn>
              <span className="mb-6 block text-5xl">🌿</span>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em] text-white">
                Start exploring
                <br />
                <span className="text-green-300">EPA emissions data faster</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/55">
                Open the public dashboard, compare states and facilities, or upload an EPA-style file to rebuild the views around your own dataset.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-green-500 text-green-950 hover:bg-green-400">Open dashboard</Button>
                </Link>
                <Link href="/methodology">
                  <Button variant="ghost">Read data notes</Button>
                </Link>
              </div>
            </FadeIn>
          </PageWrapper>
        </section>
      </main>

    </div>
  )
}
