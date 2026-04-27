'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { get2023DetailsSummary, get2023FacilityDetails, get2023StateDetails } from '@/lib/data/epa-2023-details'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import type { SectorName } from '@/lib/data/types'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { sectors } from '@/constants/sectors'
import { getSectorBreakdown, getStateRanking, getTopFacilities } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'
import { downloadJson } from '@/lib/utils/export'
import { slugifyLabel } from '@/lib/utils/slug'

const SectorBarChart = dynamic(
  () => import('@/components/charts/SectorBarChart').then((mod) => mod.SectorBarChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[340px]" /> },
)
const TrendChart = dynamic(
  () => import('@/components/charts/TrendChart').then((mod) => mod.TrendChart),
  { ssr: false, loading: () => <ChartSkeleton className="min-h-[350px]" /> },
)

const YEARS = Array.from({ length: 14 }, (_, index) => 2010 + index)

export default function ExplorerPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const activeSector = useEpaStore((state) => state.activeSector)
  const activeState = useEpaStore((state) => state.activeState)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const setActiveSector = useEpaStore((state) => state.setActiveSector)
  const setActiveState = useEpaStore((state) => state.setActiveState)
  const [showStates, setShowStates] = useState(false)

  const yearData = data.years[String(activeYear)]
  const detailSummary = activeYear === 2023 ? get2023DetailsSummary() : null
  const allSectors = getSectorBreakdown(data, activeYear)
  const sectorItems = activeSector
    ? allSectors.filter((item) => item.name === activeSector)
    : allSectors
  const stateRows =
    activeYear === 2023
      ? get2023StateDetails().map((state) => ({
          state: state.state,
          rank: state.rank,
          mt: state.totalMt,
        }))
      : getStateRanking(data, activeYear)
  const facilityRows =
    activeYear === 2023
      ? get2023FacilityDetails().map((facility) => ({
          name: facility.name,
          rank: facility.rank,
          mt: facility.totalMt,
        }))
      : getTopFacilities(data, activeYear, 10)
  const handleSelectSector = (sector: SectorName | null) => {
    setActiveState(null)
    setActiveSector(sector)
  }

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Explorer</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Slice 14 years of EPA data by year and sector
          </h1>
          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() =>
                downloadJson(`verdeon-explorer-${activeYear}.json`, {
                  year: activeYear,
                  activeSector,
                  activeState,
                  sectors: allSectors,
                  states: stateRows,
                  facilities: facilityRows,
                })
              }
            >
              <Download size={14} />
              Export filtered view
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-[18px] border border-green-100 bg-white/90 p-4 text-sm leading-7 text-muted shadow-card">
          {activeYear === 2023
            ? '2023 is now backed by the full EPA workbook extract: 54 reporting jurisdictions, 6,470 direct emitters, and 2,294 parent companies.'
            : 'Bundled EPA summary scope: 15 states, 10 facilities, and 8 sectors per reporting year. Upload a workbook if you want a wider slice of data.'}
        </div>

        <div className="mb-8">
          <PreviewGate compact />
        </div>

        <div className="flex flex-wrap gap-2">
          {YEARS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setActiveYear(year)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                year === activeYear
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-muted hover:border-green-400 hover:text-green-900',
              ].join(' ')}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSelectSector(null)}
            className={[
              'rounded-full border px-4 py-2 text-sm transition-colors',
              activeSector === null
                ? 'border-green-900 bg-green-900 text-white'
                : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
            ].join(' ')}
          >
            All sectors
          </button>
          {sectors.map((sector) => (
            <button
              key={sector.name}
              type="button"
              onClick={() => handleSelectSector(activeSector === sector.name ? null : sector.name)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                activeSector === sector.name
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
              ].join(' ')}
            >
              {sector.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard
            label="Year total"
            value={formatMt(detailSummary?.totalMt ?? yearData.total_mt)}
            detail={`${activeYear} direct emitters total`}
          />
          <StatCard
            label="Facilities"
            value={(detailSummary?.facilities.length ?? yearData.facilities).toLocaleString()}
            detail="Reporting facilities in selected year"
          />
          <StatCard
            label="Dataset scope"
            value={`${stateRows.length} jurisdictions`}
            detail={
              activeYear === 2023
                ? `${facilityRows.length.toLocaleString()} facilities and ${detailSummary?.companies.length.toLocaleString() ?? 0} parent companies loaded`
                : `${facilityRows.length.toLocaleString()} facilities visible for this year`
            }
          />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_.9fr]">
          <TrendChart activeYear={activeYear} onYearSelect={setActiveYear} />
          <SectorBarChart data={sectorItems} year={activeYear} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[24px] border border-green-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-green-900">Top jurisdictions</h2>
                <p className="mt-1 text-sm text-muted">
                  {activeYear === 2023
                    ? 'The 2023 workbook extract includes all 54 reporting jurisdictions.'
                    : 'The bundled EPA summary includes the top 15 state totals per year.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStates((value) => !value)}
                className="text-sm font-medium text-green-700 underline-offset-4 hover:underline"
              >
                {showStates ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(showStates ? stateRows : stateRows.slice(0, 8)).map((state) => (
                <div key={state.state} className="flex items-center justify-between rounded-[14px] bg-green-50 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setActiveState(activeState === state.state ? null : state.state)}
                    className="text-sm font-medium text-green-900 underline-offset-4 hover:underline"
                  >
                    #{state.rank} {state.state}
                  </button>
                  <span className="text-sm text-muted">{formatMt(state.mt)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-green-100 bg-white p-5 shadow-card">
            <div>
              <h2 className="text-lg font-semibold text-green-900">Top facilities</h2>
              <p className="mt-1 text-sm text-muted">
                {activeYear === 2023
                  ? 'The 2023 EPA workbook now powers this list, including city, state, county, and parent company.'
                  : 'The bundled starter file includes the top 10 facilities per year in the dataset slice.'}
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {(activeYear === 2023 ? facilityRows.slice(0, 12) : facilityRows).map((facility) => (
                <div key={facility.name} className="flex items-center justify-between gap-4 rounded-[14px] bg-green-50 px-4 py-3">
                  <div>
                    <Link
                      href={`/facilities/${slugifyLabel(facility.name)}`}
                      className="text-sm font-medium text-green-900 underline-offset-4 hover:underline"
                    >
                      #{facility.rank} {facility.name}
                    </Link>
                    <div className="mt-1 text-xs text-muted">Open facility detail</div>
                  </div>
                  <span className="text-sm text-muted">{formatMt(facility.mt)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted">
              Need more coverage than the starter slice provides? Upload a broader workbook and rebuild the explorer around that file.
            </div>
          </div>
        </div>
      </PageWrapper>
    </main>
  )
}
