import Link from 'next/link'
import { formatMt } from '@/lib/utils/format'
import { slugifyLabel } from '@/lib/utils/slug'

export interface FacilityRow {
  name: string
  mt: number
  rank: number
}

export interface FacilityTableProps {
  rows: FacilityRow[]
  activeFacility?: string | null
  onSelectFacility?: (facilityName: string) => void
}

export function FacilityTable({
  rows,
  activeFacility,
  onSelectFacility,
}: FacilityTableProps) {
  return (
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
          {rows.map((facility, index) => (
            <tr
              key={`${facility.name}-${index}`}
              className={[
                'border-t border-green-100 transition-colors',
                activeFacility === facility.name ? 'bg-green-50' : 'hover:bg-green-50/60',
              ].join(' ')}
            >
              <td className="px-5 py-4">
                <span
                  className={[
                    'inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold',
                    facility.rank <= 3 ? 'bg-green-900 text-white' : 'bg-green-50 text-green-900',
                  ].join(' ')}
                >
                  {facility.rank}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-green-900">
                <div className="flex flex-col items-start gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectFacility?.(facility.name)}
                    className="text-left underline-offset-4 hover:underline"
                  >
                    {facility.name}
                  </button>
                  <Link
                    href={`/facilities/${slugifyLabel(facility.name)}`}
                    className="text-xs font-medium text-green-700 underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{formatMt(facility.mt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
