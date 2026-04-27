'use client'

import { Download } from 'lucide-react'
import { FacilityTable } from '@/components/data/FacilityTable'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
  const facilities = getTopFacilities(data, activeYear, 10)
  const topFacility = facilities.find((facility) => facility.name === selectedFacility) ?? facilities[0]

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
                facilities.map((facility, index) => [index + 1, facility.name, facility.mt.toFixed(3)]),
              )
            }
          >
            <Download size={14} />
            Export ranking CSV
          </Button>
        </div>

        <Card featured className="mb-8 rounded-[24px] p-8 shadow-lift">
          <div className="text-[0.75rem] uppercase tracking-[0.08em] text-green-300">{activeYear} · #1 emitter</div>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,3.4rem)] tracking-[-0.04em] text-white">
            {topFacility?.name}
          </h2>
          <p className="mt-3 text-sm text-green-200">EPA GHGRP facility ranking leader for the selected year.</p>
          <div className="mt-6 font-display text-[2.2rem] tracking-[-0.03em] text-green-300">
            {topFacility ? `${topFacility.mt.toFixed(3)} Mt` : '0 Mt'}
          </div>
        </Card>

        <FacilityTable
          rows={facilities}
          activeFacility={topFacility?.name}
          onSelectFacility={setSelectedFacility}
        />
      </PageWrapper>
    </main>
  )
}
