'use client'

import type { Route } from 'next'
import dynamic from 'next/dynamic'
import { Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftRight, Copy, Search, Share2 } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { getJurisdictionName } from '@/constants/jurisdictions'
import {
  getAvailableFacilityNames,
  getAvailableStates,
  getFacilityHistory,
  getStateHistory,
} from '@/lib/data/selectors'
import {
  find2023FacilityDetail,
  find2023StateDetail,
  get2023FacilityNames,
  get2023StateNames,
} from '@/lib/data/epa-2023-details'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { formatMt } from '@/lib/utils/format'

const ComparisonChart = dynamic(
  () => import('@/components/charts/ComparisonChart').then((mod) => mod.ComparisonChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[360px]" /> },
)

type CompareMode = 'state' | 'facility'

const MODE_OPTIONS: CompareMode[] = ['state', 'facility']

export default function ComparePage() {
  return (
    <Suspense fallback={<main className="px-6 py-12 pt-28" />}>
      <ComparePageContent />
    </Suspense>
  )
}

function ComparePageContent() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const facilityNames = useMemo(
    () =>
      activeYear === 2023
        ? Array.from(new Set([...getAvailableFacilityNames(data), ...get2023FacilityNames()]))
        : getAvailableFacilityNames(data),
    [activeYear, data],
  )
  const stateNames = useMemo(
    () =>
      activeYear === 2023
        ? Array.from(new Set([...getAvailableStates(data), ...get2023StateNames()]))
        : getAvailableStates(data),
    [activeYear, data],
  )
  const requestedMode = searchParams.get('mode') === 'facility' ? 'facility' : 'state'
  const options = requestedMode === 'facility' ? facilityNames : stateNames
  const defaultA = options[0] ?? ''
  const defaultB = options[1] ?? options[0] ?? ''
  const selectedA = options.includes(searchParams.get('a') ?? '') ? (searchParams.get('a') as string) : defaultA
  const selectedB = options.includes(searchParams.get('b') ?? '') ? (searchParams.get('b') as string) : defaultB
  const [queryA, setQueryA] = useState(selectedA)
  const [queryB, setQueryB] = useState(selectedB)
  const deferredQueryA = useDeferredValue(queryA)
  const deferredQueryB = useDeferredValue(queryB)

  useEffect(() => {
    setQueryA(selectedA)
  }, [selectedA])

  useEffect(() => {
    setQueryB(selectedB)
  }, [selectedB])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let needsReplace = false

    if (!params.get('mode')) {
      params.set('mode', requestedMode)
      needsReplace = true
    }
    if (!params.get('a') && defaultA) {
      params.set('a', defaultA)
      needsReplace = true
    }
    if (!params.get('b') && defaultB) {
      params.set('b', defaultB)
      needsReplace = true
    }

    if (needsReplace) {
      router.replace((`/compare?${params.toString()}`) as Route)
    }
  }, [defaultA, defaultB, requestedMode, router, searchParams])

  function updateParams(next: { mode?: CompareMode; a?: string; b?: string }) {
    const mode = next.mode ?? requestedMode
    const nextOptions = mode === 'facility' ? facilityNames : stateNames
    const fallbackA = nextOptions[0] ?? ''
    const fallbackB = nextOptions[1] ?? nextOptions[0] ?? ''
    const a = next.a ?? (nextOptions.includes(selectedA) ? selectedA : fallbackA)
    const b = next.b ?? (nextOptions.includes(selectedB) ? selectedB : fallbackB)
    const params = new URLSearchParams()

    params.set('mode', mode)
    if (a) params.set('a', a)
    if (b) params.set('b', b)
    router.replace((`/compare?${params.toString()}`) as Route)
  }

  const filteredA = options
    .filter((option) => option.toLowerCase().includes(deferredQueryA.toLowerCase()))
    .slice(0, 6)
  const filteredB = options
    .filter((option) => option.toLowerCase().includes(deferredQueryB.toLowerCase()))
    .slice(0, 6)

  function resolveSelection(query: string, fallback: string) {
    const exact = options.find((option) => option.toLowerCase() === query.trim().toLowerCase())
    return exact ?? fallback
  }

  const seriesA = useMemo(() => {
    const history =
      requestedMode === 'facility'
        ? getFacilityHistory(data, selectedA)
        : getStateHistory(data, selectedA)

    if (history.length || activeYear !== 2023) {
      return history
    }

    if (requestedMode === 'facility') {
      const detail = find2023FacilityDetail(selectedA)
      return detail ? [{ year: 2023, value: detail.totalMt, rank: detail.rank }] : []
    }

    const detail = find2023StateDetail(selectedA)
    return detail ? [{ year: 2023, value: detail.totalMt, rank: detail.rank }] : []
  }, [activeYear, data, requestedMode, selectedA])

  const seriesB = useMemo(() => {
    const history =
      requestedMode === 'facility'
        ? getFacilityHistory(data, selectedB)
        : getStateHistory(data, selectedB)

    if (history.length || activeYear !== 2023) {
      return history
    }

    if (requestedMode === 'facility') {
      const detail = find2023FacilityDetail(selectedB)
      return detail ? [{ year: 2023, value: detail.totalMt, rank: detail.rank }] : []
    }

    const detail = find2023StateDetail(selectedB)
    return detail ? [{ year: 2023, value: detail.totalMt, rank: detail.rank }] : []
  }, [activeYear, data, requestedMode, selectedB])

  const activePointA = seriesA.find((point) => point.year === activeYear) ?? seriesA.at(-1) ?? { value: 0, rank: null }
  const activePointB = seriesB.find((point) => point.year === activeYear) ?? seriesB.at(-1) ?? { value: 0, rank: null }
  const gap = activePointA.value - activePointB.value

  async function copyShareUrl() {
    const params = new URLSearchParams()
    params.set('mode', requestedMode)
    params.set('a', selectedA)
    params.set('b', selectedB)
    const url = `${window.location.origin}/compare?${params.toString()}`

    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Compare</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
              Compare states or facilities side by side
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              This comparison view is shareable by URL. Switch modes, pick two entities, and keep the current active year synced across the app.
            </p>
          </div>
          <Button variant="outline" onClick={copyShareUrl}>
            {copied ? <Copy size={16} /> : <Share2 size={16} />}
            {copied ? 'Copied' : 'Copy share link'}
          </Button>
        </div>

        <div className="mb-8">
          <PreviewGate compact description="Preview comparisons publicly and share links to any state or facility view." />
        </div>

        <Card className="rounded-[24px] p-6 shadow-card">
          <div className="grid gap-5 xl:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] xl:items-end">
            <div>
              <div className="mb-2 text-sm font-medium text-green-900">Mode</div>
              <div className="flex flex-wrap gap-2">
                {MODE_OPTIONS.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateParams({ mode })}
                    className={[
                      'rounded-full border px-4 py-2 text-sm transition-colors',
                      requestedMode === mode
                        ? 'border-green-900 bg-green-900 text-white'
                        : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
                    ].join(' ')}
                  >
                    {mode === 'state' ? 'States' : 'Facilities'}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-green-900">Compare A</span>
              {requestedMode === 'state' && selectedA ? (
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-green-600">
                  {getJurisdictionName(selectedA)} · {selectedA}
                </div>
              ) : null}
              <div className="rounded-[18px] border border-green-200 bg-white p-3">
                <div className="flex items-center gap-2 rounded-[14px] border border-green-100 px-3 py-3">
                  <Search size={16} className="text-green-700" />
                  <input
                    value={queryA}
                    onChange={(event) => setQueryA(event.target.value)}
                    onBlur={() => setQueryA(resolveSelection(queryA, selectedA))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        updateParams({ a: resolveSelection(queryA, selectedA) })
                      }
                    }}
                    placeholder={requestedMode === 'facility' ? 'Search facility' : 'Search state'}
                    className="w-full bg-transparent text-sm text-green-900 outline-none placeholder:text-muted"
                    aria-label="Search first comparison item"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filteredA.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateParams({ a: option })}
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs transition-colors',
                        selectedA === option
                          ? 'border-green-900 bg-green-900 text-white'
                          : 'border-green-200 bg-green-50 text-green-900 hover:bg-green-100',
                      ].join(' ')}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </label>

            <div className="flex justify-center xl:pb-1">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-full px-0"
                onClick={() => updateParams({ a: selectedB, b: selectedA })}
                aria-label="Swap comparison selections"
              >
                <ArrowLeftRight size={16} />
              </Button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-green-900">Compare B</span>
              {requestedMode === 'state' && selectedB ? (
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-green-600">
                  {getJurisdictionName(selectedB)} · {selectedB}
                </div>
              ) : null}
              <div className="rounded-[18px] border border-green-200 bg-white p-3">
                <div className="flex items-center gap-2 rounded-[14px] border border-green-100 px-3 py-3">
                  <Search size={16} className="text-green-700" />
                  <input
                    value={queryB}
                    onChange={(event) => setQueryB(event.target.value)}
                    onBlur={() => setQueryB(resolveSelection(queryB, selectedB))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        updateParams({ b: resolveSelection(queryB, selectedB) })
                      }
                    }}
                    placeholder={requestedMode === 'facility' ? 'Search facility' : 'Search state'}
                    className="w-full bg-transparent text-sm text-green-900 outline-none placeholder:text-muted"
                    aria-label="Search second comparison item"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filteredB.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateParams({ b: option })}
                      className={[
                        'rounded-full border px-3 py-1.5 text-xs transition-colors',
                        selectedB === option
                          ? 'border-green-900 bg-green-900 text-white'
                          : 'border-green-200 bg-green-50 text-green-900 hover:bg-green-100',
                      ].join(' ')}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-green-900">Active year</span>
              <select
                value={activeYear}
                onChange={(event) => setActiveYear(Number(event.target.value))}
                className="w-full rounded-[14px] border border-green-200 bg-white px-4 py-3 text-sm text-green-900 outline-none"
              >
                {Object.keys(data.years).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label={selectedA || 'Selection A'} value={formatMt(activePointA.value)} detail={activePointA.rank ? `Rank #${activePointA.rank} in ${activeYear}` : 'No rank in active year'} />
          <StatCard label={selectedB || 'Selection B'} value={formatMt(activePointB.value)} detail={activePointB.rank ? `Rank #${activePointB.rank} in ${activeYear}` : 'No rank in active year'} />
          <StatCard label="Gap" value={formatMt(Math.abs(gap))} detail={gap >= 0 ? `${selectedA} is higher in ${activeYear}` : `${selectedB} is higher in ${activeYear}`} />
          <StatCard label="Shareable" value="URL synced" detail="Mode and selected entities persist in the query string" />
        </div>

        <div className="mt-10">
          <ComparisonChart
            title={requestedMode === 'facility' ? 'Facility comparison over time' : 'State comparison over time'}
            description="Both series stay pinned to the current URL state, so you can refresh or share the page without losing the comparison."
            series={[
              {
                label: selectedA,
                color: '#1a5c38',
                data: seriesA.map((point) => ({ year: point.year, value: point.value })),
              },
              {
                label: selectedB,
                color: '#5ec48a',
                data: seriesB.map((point) => ({ year: point.year, value: point.value })),
              },
            ]}
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-card">
          <div className="border-b border-green-100 px-6 py-5">
            <h2 className="text-lg font-semibold text-green-900">Year-by-year comparison table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-green-50 text-green-900">
                <tr>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">{selectedA}</th>
                  <th className="px-6 py-4 font-medium">{selectedB}</th>
                  <th className="px-6 py-4 font-medium">Gap</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Set([...seriesA.map((point) => point.year), ...seriesB.map((point) => point.year)]),
                )
                  .sort((a, b) => a - b)
                  .map((year) => {
                    const pointA = seriesA.find((point) => point.year === year)
                    const pointB = seriesB.find((point) => point.year === year)
                    const yearGap = (pointA?.value ?? 0) - (pointB?.value ?? 0)

                    return (
                      <tr key={year} className="border-t border-green-100">
                        <td className="px-6 py-4 text-green-900">{year}</td>
                        <td className="px-6 py-4 text-muted">{formatMt(pointA?.value ?? 0)}</td>
                        <td className="px-6 py-4 text-muted">{formatMt(pointB?.value ?? 0)}</td>
                        <td className="px-6 py-4 text-muted">
                          {yearGap >= 0 ? '+' : '-'}
                          {formatMt(Math.abs(yearGap))}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
