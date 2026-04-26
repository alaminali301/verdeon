import type { EpaDataset, SectorBreakdownItem } from '@/lib/data/types'

export function getSectorBreakdown(_: EpaDataset, __: number): SectorBreakdownItem[] {
  return []
}

export function getTrendSeries(_: EpaDataset) {
  return [] as { year: number; total: number }[]
}

export function getYoyChange(_: EpaDataset, __: number, ___: number) {
  return { absolute: 0, percent: 0 }
}

export function getTopFacilities(_: EpaDataset, __: number, ___ = 10) {
  return [] as { name: string; mt: number }[]
}

export function getStateRanking(_: EpaDataset, __: number) {
  return [] as { state: string; mt: number; rank: number }[]
}

export function getCumulativeReduction(_: EpaDataset, __: number, ___: number) {
  return 0
}
