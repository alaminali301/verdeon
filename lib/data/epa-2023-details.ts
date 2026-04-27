import details from '@/lib/data/epa-2023-details.json'
import type {
  CompanyRankingRecord,
  FacilityDetailRecord,
  StateDetailRecord,
} from '@/lib/data/types'

type Epa2023Details = {
  source: {
    workbook: string
    parentWorkbook: string
  }
  totalMt: number
  facilities: FacilityDetailRecord[]
  states: StateDetailRecord[]
  companies: CompanyRankingRecord[]
}

const EPA_2023_DETAILS = details as Epa2023Details
const RAW_TO_DISPLAY = 1_000_000

function normalizeMt(value: number | null) {
  return value === null ? null : value / RAW_TO_DISPLAY
}

export function get2023FacilityDetails() {
  return EPA_2023_DETAILS.facilities
    .slice()
    .sort((a, b) => b.totalMt - a.totalMt)
    .map((facility, index) => ({
      ...facility,
      totalMt: normalizeMt(facility.totalMt) ?? facility.totalMt,
      co2Mt: normalizeMt(facility.co2Mt),
      methaneMt: normalizeMt(facility.methaneMt),
      n2oMt: normalizeMt(facility.n2oMt),
      rank: index + 1,
    }))
}

export function get2023FacilityNames() {
  return get2023FacilityDetails().map((facility) => facility.name)
}

export function find2023FacilityDetail(name: string) {
  const rankedFacilities = get2023FacilityDetails()
  return rankedFacilities.find((facility) => facility.name === name) ?? null
}

export function get2023StateDetails() {
  return EPA_2023_DETAILS.states.slice().sort((a, b) => a.rank - b.rank).map((state) => ({
    ...state,
    totalMt: normalizeMt(state.totalMt) ?? state.totalMt,
  }))
}

export function get2023StateNames() {
  return get2023StateDetails().map((state) => state.state)
}

export function find2023StateDetail(state: string) {
  return EPA_2023_DETAILS.states.find((entry) => entry.state === state) ?? null
}

export function get2023CompanyDetails() {
  return EPA_2023_DETAILS.companies.slice().sort((a, b) => b.totalMt - a.totalMt).map((company) => ({
    ...company,
    totalMt: normalizeMt(company.totalMt) ?? company.totalMt,
  }))
}

export function get2023DetailsSummary() {
  return {
    ...EPA_2023_DETAILS,
    totalMt: normalizeMt(EPA_2023_DETAILS.totalMt) ?? EPA_2023_DETAILS.totalMt,
  }
}
