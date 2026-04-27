import { describe, expect, it } from 'vitest'
import { buildDatasetFromRows } from '@/lib/data/upload'

describe('upload dataset builder', () => {
  it('rebuilds totals, sectors, states, and facilities from uploaded rows', () => {
    const rows = [
      {
        Reporting_Year: 2023,
        Facility_Name: 'Alpha Plant',
        State: 'tx',
        Sector: 'Power Plants',
        Emissions_MT: 12.5,
      },
      {
        Reporting_Year: 2023,
        Facility_Name: 'Beta Chemical',
        State: 'LA',
        Sector: 'Chemicals',
        Emissions_MT: 7.25,
      },
      {
        Reporting_Year: 2023,
        Facility_Name: 'Alpha Plant',
        State: 'TX',
        Sector: 'Power Plants',
        Emissions_MT: 2.5,
      },
      {
        Reporting_Year: 2022,
        Facility_Name: 'Gamma Landfill',
        State: 'OH',
        Sector: 'Waste',
        Emissions_MT: 5.1,
      },
    ]

    const { dataset, preview } = buildDatasetFromRows(rows, 'demo.xlsx')

    expect(preview.detectedYears).toEqual([2022, 2023])
    expect(preview.parsedRows).toBe(4)
    expect(dataset.meta.source).toBe('Uploaded workbook: demo.xlsx')

    expect(dataset.years['2023'].total_mt).toBe(22.25)
    expect(dataset.years['2023'].facilities).toBe(2)
    expect(dataset.years['2023'].sectors['Power Plants']).toBe(15)
    expect(dataset.years['2023'].sectors.Chemicals).toBe(7.25)
    expect(dataset.years['2023'].top_states).toEqual({
      TX: 15,
      LA: 7.25,
    })
    expect(dataset.years['2023'].top_facilities).toEqual([
      { name: 'Alpha Plant', mt: 15 },
      { name: 'Beta Chemical', mt: 7.25 },
    ])

    expect(dataset.years['2022'].total_mt).toBe(5.1)
    expect(dataset.years['2022'].top_states).toEqual({ OH: 5.1 })
    expect(dataset.years['2022'].top_facilities).toEqual([{ name: 'Gamma Landfill', mt: 5.1 }])
  })
})
