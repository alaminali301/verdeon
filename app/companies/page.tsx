'use client'

import { useDeferredValue, useState } from 'react'
import { Download } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PreviewGate } from '@/components/auth/PreviewGate'
import { get2023CompanyDetails } from '@/lib/data/epa-2023-details'
import { downloadCsv } from '@/lib/utils/export'
import { formatMt, formatPct } from '@/lib/utils/format'

export default function CompaniesPage() {
  const companies = get2023CompanyDetails()
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const filtered = companies.filter((company) =>
    company.name.toLowerCase().includes(deferredSearch.toLowerCase()),
  )
  const visible = filtered.slice(0, 120)

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Companies</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
              Parent companies behind the 2023 facilities
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              This page is built from EPA&apos;s parent-company workbook so you can see who owns the biggest emitting facilities in the 2023 data slice.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv(
                'verdeon-companies-2023.csv',
                ['rank', 'company', 'emissions_mt', 'facilities', 'states', 'top_facility', 'avg_ownership_pct'],
                visible.map((company, index) => [
                  index + 1,
                  company.name,
                  company.totalMt.toFixed(2),
                  company.facilities,
                  company.states,
                  company.topFacility,
                  company.averageOwnership !== null ? company.averageOwnership.toFixed(1) : '',
                ]),
              )
            }
          >
            <Download size={14} />
            Export company CSV
          </Button>
        </div>

        <div className="mb-6">
          <PreviewGate compact description="Browse the parent-company ranking, compare footprints, and inspect which companies control the largest 2023 facility emissions." />
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <Card className="rounded-[18px] p-5 shadow-card">
            <div className="text-sm text-muted">Companies loaded</div>
            <div className="mt-2 font-display text-[2rem] tracking-[-0.03em] text-green-950">{companies.length.toLocaleString()}</div>
          </Card>
          <Card className="rounded-[18px] p-5 shadow-card">
            <div className="text-sm text-muted">Searchable firms</div>
            <div className="mt-2 font-display text-[2rem] tracking-[-0.03em] text-green-950">{filtered.length.toLocaleString()}</div>
          </Card>
          <Card className="rounded-[18px] p-5 shadow-card">
            <div className="text-sm text-muted">Top footprint</div>
            <div className="mt-2 font-display text-[2rem] tracking-[-0.03em] text-green-950">{formatMt(companies[0]?.totalMt ?? 0)}</div>
          </Card>
        </div>

        <div className="mb-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-green-900">Search companies</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search parent companies"
              className="w-full rounded-[16px] border border-green-200 bg-white px-4 py-3 text-sm text-green-900 outline-none focus:border-green-600"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-green-100 bg-white shadow-card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-5 py-4 font-medium">#</th>
                <th className="px-5 py-4 font-medium">Company</th>
                <th className="px-5 py-4 font-medium">Emissions</th>
                <th className="px-5 py-4 font-medium">Facilities</th>
                <th className="px-5 py-4 font-medium">States</th>
                <th className="px-5 py-4 font-medium">Top facility</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((company, index) => (
                <tr key={company.name} className="border-t border-green-100">
                  <td className="px-5 py-4 text-green-900">{index + 1}</td>
                  <td className="px-5 py-4 text-green-900">
                    <div className="font-medium">{company.name}</div>
                    {company.averageOwnership !== null ? (
                      <div className="mt-1 text-xs text-muted">Avg ownership {formatPct(company.averageOwnership)}</div>
                    ) : (
                      <div className="mt-1 text-xs text-muted">Ownership not listed</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted">{formatMt(company.totalMt)}</td>
                  <td className="px-5 py-4 text-muted">{company.facilities.toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted">{company.states.toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted">{company.topFacility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWrapper>
    </main>
  )
}
