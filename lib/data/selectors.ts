import { SECTOR_COLORS } from '@/lib/utils/colors'
import type { EpaDataset, EpaYearData, SectorBreakdownItem } from '@/lib/data/types'

function getYearData(data: EpaDataset, year: number): EpaYearData {
  const yearData = data.years[String(year)]

  if (!yearData) {
    throw new Error(`EPA data unavailable for year ${year}`)
  }

  return yearData
}

export function getSectorBreakdown(data: EpaDataset, year: number): SectorBreakdownItem[] {
  const yearData = getYearData(data, year)

  return Object.entries(yearData.sectors)
    .map(([name, mt]) => ({
      name,
      mt,
      pct: yearData.total_mt === 0 ? 0 : (mt / yearData.total_mt) * 100,
      color: SECTOR_COLORS[name] ?? SECTOR_COLORS.Other,
    }))
    .sort((a, b) => b.mt - a.mt)
}

export function getTrendSeries(data: EpaDataset) {
  return Object.entries(data.years)
    .map(([year, yearData]) => ({
      year: Number(year),
      total: yearData.total_mt,
    }))
    .sort((a, b) => a.year - b.year)
}

export function getYoyChange(data: EpaDataset, from: number, to: number) {
  const fromYear = getYearData(data, from)
  const toYear = getYearData(data, to)
  const absolute = toYear.total_mt - fromYear.total_mt

  return {
    absolute,
    percent: fromYear.total_mt === 0 ? 0 : (absolute / fromYear.total_mt) * 100,
  }
}

export function getTopFacilities(data: EpaDataset, year: number, n = 10) {
  const yearData = getYearData(data, year)

  return yearData.top_facilities
    .slice()
    .sort((a, b) => b.mt - a.mt)
    .slice(0, n)
}

export function getStateRanking(data: EpaDataset, year: number) {
  const yearData = getYearData(data, year)

  return Object.entries(yearData.top_states)
    .map(([state, mt]) => ({ state, mt }))
    .sort((a, b) => b.mt - a.mt)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

export function getCumulativeReduction(data: EpaDataset, baseYear: number, targetYear: number) {
  const { percent } = getYoyChange(data, baseYear, targetYear)
  return percent
}
