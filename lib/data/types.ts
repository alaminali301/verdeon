export interface EpaYearData {
  total_mt: number
  facilities: number
  sectors: Record<string, number>
  top_states: Record<string, number>
  top_facilities: { name: string; mt: number }[]
}

export interface EpaDataset {
  meta: { source: string; url: string; years: string; unit: string }
  years: Record<string, EpaYearData>
}

export type SectorName =
  | 'Power Plants'
  | 'Chemicals'
  | 'Petroleum & Gas'
  | 'Minerals'
  | 'Waste'
  | 'Metals'
  | 'Refineries'
  | 'Other'

export interface SectorBreakdownItem {
  name: string
  mt: number
  pct: number
  color: string
}

export interface YearValuePoint {
  year: number
  value: number
  rank: number | null
}

export interface Recommendation {
  id: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  potentialReductionPct: number
  sector: SectorName
  tags: string[]
}
