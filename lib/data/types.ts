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
  name: SectorName
  mt: number
  pct: number
  color: string
}

export interface YearValuePoint {
  year: number
  value: number
  rank: number | null
}

export interface FacilityRankingItem {
  name: string
  mt: number
  rank: number
}

export interface FacilityDetailRecord {
  rank: number
  facilityId: number
  frsId: string | null
  name: string
  city: string | null
  state: string
  zip: string | null
  address: string | null
  county: string | null
  latitude: number | null
  longitude: number | null
  naics: string | null
  subparts: string[]
  sectors: string[]
  totalMt: number
  co2Mt: number | null
  methaneMt: number | null
  n2oMt: number | null
  parentCompany: string | null
  parentCompanyOwnership: number | null
}

export interface StateDetailRecord {
  state: string
  totalMt: number
  facilities: number
  rank: number
  sharePct: number
}

export interface CompanyRankingRecord {
  name: string
  totalMt: number
  facilities: number
  states: number
  topFacility: string
  averageOwnership: number | null
}

export interface Recommendation {
  id: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  potentialReductionPct: number
  sector: SectorName
  tags: string[]
  horizon: string
  owner: string
  implementation: string[]
  kpis: string[]
}
