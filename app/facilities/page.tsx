'use client'

import { useDeferredValue, useState } from 'react'
import { Download } from 'lucide-react'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { FacilityTable } from '@/components/data/FacilityTable'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { get2023FacilityDetails } from '@/lib/data/epa-2023-details'
import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getTopFacilities } from '@/lib/data/selectors'
import { downloadCsv } from '@/lib/utils/export'

const YEARS = Array.from({ length: 14 }, (_, index) => 2023 - index)

export default function FacilitiesPage() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const selectedFacility = useEpaStore((state) => state.selectedFacility)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const setSelectedFacility = useEpaStore((state) => state.setSelectedFacility)
  const facilityRows =
    activeYear === 2023
      ? get2023FacilityDetails().map((facility) => ({
          rank: facility.rank,
          name: facility.name,
          mt: facility.totalMt,
          city: facility.city,
          state: facility.state,
          county: facility.county,
          parentCompany: facility.parentCompany,
        }))
      : getTopFacilities(data, activeYear, 25).map((facility) => ({
          rank: facility.rank,
          name: facility.name,
          mt: facility.mt,
          city: null,
          state: null,
          county: null,
          parentCompany: null,
        }))
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const filteredFacilities = facilityRows.filter((facility) =>
    [
      facility.name,
      facility.city,
      facility.state,
      facility.parentCompany,
      facility.county,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(deferredSearch.toLowerCase()),
  )
  const visibleFacilities = filteredFacilities.slice(0, activeYear === 2023 ? 100 : 25)
  const selectedFacilityRow =
    facilityRows.find((facility) => facility.name === selectedFacility) ?? filteredFacilities[0] ?? facilityRows[0]

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Facilities</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
              Top emitters by reporting year
            </h1>
          </div>
          <label className="flex items-center gap-3 text-sm text-muted">
            Select year:
            <select
              value={activeYear}
              onChange={(event) => setActiveYear(Number(event.target.value))}
              className="rounded-full border border-green-200 bg-white px-4 py-2 text-sm text-green-900 outline-none"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-5">
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv(
                `verdeon-facilities-${activeYear}.csv`,
                ['rank', 'facility', 'emissions_mt'],
                facilityRows.map((facility) => [facility.rank, facility.name, facility.mt.toFixed(3)]),
              )
            }
          >
            <Download size={14} />
            Export ranking CSV
          </Button>
        </div>

        <div className="mb-8">
          <PreviewGate compact description="Inspect facility rankings, export the table, and compare years in the public view." />
        </div>

        <div className="mb-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-green-900">Search facilities</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={activeYear === 2023 ? 'Search by facility, city, state, or company' : 'Search top emitters in the selected year'}
              className="w-full rounded-[16px] border border-green-200 bg-white px-4 py-3 text-sm text-green-900 outline-none focus:border-green-600"
            />
          </label>
        </div>

        <Card featured className="mb-8 rounded-[24px] p-8 shadow-lift">
          <div className="text-[0.75rem] uppercase tracking-[0.08em] text-green-300">
            {activeYear} · {selectedFacility ? `#${selectedFacilityRow?.rank ?? 1} selected` : '#1 current leader'}
          </div>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,3.4rem)] tracking-[-0.04em] text-white">
            {selectedFacilityRow?.name}
          </h2>
          <p className="mt-3 text-sm text-green-200">
            {selectedFacility
              ? 'Selected facility in the current reporting year.'
              : 'Current facility ranking leader for the selected year.'}
          </p>
          <p className="mt-2 text-xs text-green-300">
            {activeYear === 2023
              ? `${facilityRows.length.toLocaleString()} facilities loaded from the 2023 EPA workbook`
              : 'Starter dataset slice for this year'}
          </p>
          <div className="mt-6 font-display text-[2.2rem] tracking-[-0.03em] text-green-300">
            {selectedFacilityRow ? `${selectedFacilityRow.mt.toFixed(3)} Mt` : '0 Mt'}
          </div>
        </Card>

          <FacilityTable
          rows={visibleFacilities}
          activeFacility={selectedFacilityRow?.name}
          onSelectFacility={setSelectedFacility}
        />
      </PageWrapper>
    </main>
  )
}
