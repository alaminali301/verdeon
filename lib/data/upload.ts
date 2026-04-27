import * as XLSX from 'xlsx'
import baseDataset from '@/lib/data/epa-data.json'
import type { EpaDataset, SectorName } from '@/lib/data/types'

export interface UploadPreview {
  fileName: string
  detectedYears: number[]
  facilityCount: number | null
  sheetName: string
  rowCount: number
  columns: string[]
  sampleRows: Record<string, unknown>[]
  parsedRows: number
}

const SECTOR_NAMES: SectorName[] = [
  'Power Plants',
  'Chemicals',
  'Petroleum & Gas',
  'Minerals',
  'Waste',
  'Metals',
  'Refineries',
  'Other',
]

function createEmptyDataset(): EpaDataset {
  const years = Object.keys(baseDataset.years).reduce<EpaDataset['years']>((acc, year) => {
    acc[year] = {
      total_mt: 0,
      facilities: 0,
      sectors: Object.fromEntries(SECTOR_NAMES.map((sector) => [sector, 0])),
      top_states: {},
      top_facilities: [],
    }
    return acc
  }, {})

  return {
    meta: {
      ...baseDataset.meta,
      source: baseDataset.meta.source,
    },
    years,
  }
}

function getStringValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

function getNumberValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const raw = row[key]
    if (raw === null || raw === undefined || raw === '') continue
    const normalized =
      typeof raw === 'string'
        ? raw.replace(/,/g, '').replace(/\s+/g, '')
        : raw
    const value = Number(normalized)
    if (!Number.isNaN(value)) {
      return value
    }
  }

  return null
}

function normalizeSector(rawSector: string | null): SectorName {
  if (!rawSector) return 'Other'

  const value = rawSector.toLowerCase()

  if (value.includes('power')) return 'Power Plants'
  if (value.includes('chem')) return 'Chemicals'
  if (value.includes('petroleum') || value.includes('gas') || value.includes('natural gas')) return 'Petroleum & Gas'
  if (value.includes('mineral') || value.includes('cement') || value.includes('lime')) return 'Minerals'
  if (value.includes('waste') || value.includes('landfill')) return 'Waste'
  if (value.includes('metal') || value.includes('steel') || value.includes('aluminum')) return 'Metals'
  if (value.includes('refiner')) return 'Refineries'

  return 'Other'
}

function normalizeState(rawState: string | null) {
  return rawState ? rawState.trim().toUpperCase() : null
}

function normalizeRow(row: Record<string, unknown>) {
  const lowered = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.toLowerCase().trim(), value]),
  ) as Record<string, unknown>

  const year = getNumberValue(lowered, ['year', 'reporting_year', 'report_year'])
  const emissions = getNumberValue(lowered, [
    'total_mt',
    'total',
    'emissions_mt',
    'mtco2e',
    'co2e_mt',
    'ghg_quantity',
    'ghg quantity',
    'ghg emissions',
    'total reported direct emissions',
  ])
  const facility = getStringValue(lowered, [
    'facility',
    'facility_name',
    'facility name',
    'name',
  ])
  const state = normalizeState(
    getStringValue(lowered, ['state', 'state_code', 'state code', 'location_state']),
  )
  const sector = normalizeSector(
    getStringValue(lowered, [
      'sector',
      'industry sector',
      'industry_sector',
      'subsector',
      'sector_name',
    ]),
  )

  return {
    year: year === null ? null : Math.trunc(year),
    emissions,
    facility,
    state,
    sector,
  }
}

export function buildDatasetFromRows(
  rows: Record<string, unknown>[],
  fileName = 'uploaded-file',
): { dataset: EpaDataset; preview: UploadPreview } {
  const dataset = createEmptyDataset()
  const stateTotals = new Map<number, Map<string, number>>()
  const facilityTotals = new Map<number, Map<string, number>>()
  const facilitySets = new Map<number, Set<string>>()
  const detectedYears = new Set<number>()
  let parsedRows = 0

  rows.forEach((row) => {
    const normalized = normalizeRow(row)

    if (
      normalized.year === null ||
      !dataset.years[String(normalized.year)] ||
      normalized.emissions === null
    ) {
      return
    }

    const yearKey = String(normalized.year)
    const yearData = dataset.years[yearKey]
    const emissions = normalized.emissions

    detectedYears.add(normalized.year)
    parsedRows += 1
    yearData.total_mt += emissions
    yearData.sectors[normalized.sector] += emissions

    if (normalized.state) {
      const states = stateTotals.get(normalized.year) ?? new Map<string, number>()
      states.set(normalized.state, (states.get(normalized.state) ?? 0) + emissions)
      stateTotals.set(normalized.year, states)
    }

    if (normalized.facility) {
      const facilities = facilityTotals.get(normalized.year) ?? new Map<string, number>()
      facilities.set(normalized.facility, (facilities.get(normalized.facility) ?? 0) + emissions)
      facilityTotals.set(normalized.year, facilities)

      const facilitySet = facilitySets.get(normalized.year) ?? new Set<string>()
      facilitySet.add(normalized.facility)
      facilitySets.set(normalized.year, facilitySet)
    }
  })

  for (const [year, yearData] of Object.entries(dataset.years)) {
    const numericYear = Number(year)
    const states = stateTotals.get(numericYear)
    const facilities = facilityTotals.get(numericYear)
    const facilitySet = facilitySets.get(numericYear)

    yearData.total_mt = Number(yearData.total_mt.toFixed(3))
    yearData.sectors = Object.fromEntries(
      Object.entries(yearData.sectors).map(([sector, value]) => [sector, Number(value.toFixed(3))]),
    )
    yearData.facilities = facilitySet?.size ?? 0
    yearData.top_states = Object.fromEntries(
      Array.from(states?.entries() ?? [])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([state, mt]) => [state, Number(mt.toFixed(3))]),
    )
    yearData.top_facilities = Array.from(facilities?.entries() ?? [])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, mt]) => ({
        name,
        mt: Number(mt.toFixed(3)),
      }))
  }

  dataset.meta = {
    ...dataset.meta,
    source: `Uploaded workbook: ${fileName}`,
  }

  return {
    dataset,
    preview: {
      fileName,
      detectedYears: Array.from(detectedYears).sort((a, b) => a - b),
      facilityCount: Array.from(facilitySets.values()).reduce((sum, items) => sum + items.size, 0) || null,
      sheetName: 'Worksheet 1',
      rowCount: rows.length,
      columns: Object.keys(rows[0] ?? {}).slice(0, 8),
      sampleRows: rows.slice(0, 3),
      parsedRows,
    },
  }
}

export function normalizeUploadedDataset(
  workbook: XLSX.WorkBook,
  fileName: string,
): { dataset: EpaDataset; preview: UploadPreview } {
  const firstSheetName = workbook.SheetNames[0]
  const firstSheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: null })
  const result = buildDatasetFromRows(rows, fileName)

  return {
    dataset: result.dataset,
    preview: {
      ...result.preview,
      sheetName: firstSheetName,
    },
  }
}
