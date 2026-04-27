import { describe, expect, it } from 'vitest'
import data from '@/lib/data/epa-data.json'
import {
  getCumulativeReduction,
  getSectorBreakdown,
  getStateRanking,
  getTopFacilities,
  getTrendSeries,
  getYoyChange,
} from '@/lib/data/selectors'

describe('selectors', () => {
  it('builds sector breakdown with percentages and descending sort', () => {
    const breakdown = getSectorBreakdown(data, 2023)

    expect(breakdown).toHaveLength(8)
    expect(breakdown[0]).toMatchObject({
      name: 'Power Plants',
      mt: 1403.94,
      color: '#0e3320',
    })
    expect(breakdown[0].pct).toBeCloseTo(58.92, 2)
    expect(breakdown.at(-1)).toMatchObject({
      name: 'Metals',
      mt: 59.17,
    })
  })

  it('returns trend series sorted from 2010 through 2023', () => {
    const trend = getTrendSeries(data)

    expect(trend).toHaveLength(14)
    expect(trend[0]).toEqual({ year: 2010, total: 3196.57 })
    expect(trend.at(-1)).toEqual({ year: 2023, total: 2382.84 })
  })

  it('computes year-over-year change values', () => {
    const change = getYoyChange(data, 2010, 2023)

    expect(change.absolute).toBeCloseTo(-813.73, 2)
    expect(change.percent).toBeCloseTo(-25.46, 2)
  })

  it('returns the top facilities for a year and respects n', () => {
    const topThree = getTopFacilities(data, 2023, 3)

    expect(topThree).toEqual([
      { name: 'James H Miller Jr', mt: 16.558, rank: 1 },
      { name: 'Labadie', mt: 15.389, rank: 2 },
      { name: 'Gen J M Gavin', mt: 13.451, rank: 3 },
    ])
  })

  it('ranks states in descending order with 1-based rank', () => {
    const ranking = getStateRanking(data, 2023)

    expect(ranking[0]).toEqual({ state: 'TX', mt: 379.85, rank: 1 })
    expect(ranking[1]).toEqual({ state: 'LA', mt: 144.32, rank: 2 })
    expect(ranking).toHaveLength(15)
  })

  it('returns cumulative reduction as the percent change between two years', () => {
    expect(getCumulativeReduction(data, 2010, 2023)).toBeCloseTo(-25.46, 2)
  })

  it('throws when a requested year is missing', () => {
    expect(() => getSectorBreakdown(data, 2009)).toThrow('EPA data unavailable for year 2009')
  })
})
