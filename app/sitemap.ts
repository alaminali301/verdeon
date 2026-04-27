import type { MetadataRoute } from 'next'
import data from '@/lib/data/epa-data.json'
import { sectors } from '@/constants/sectors'
import { getAvailableFacilityNames, getAvailableStates } from '@/lib/data/selectors'
import { slugifyLabel } from '@/lib/utils/slug'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://verdeon.io'
  const staticRoutes = [
    '',
    '/dashboard',
    '/explorer',
    '/facilities',
    '/states',
    '/compare',
    '/upload',
    '/methodology',
    '/guides/epa-ghgrp-explained',
    '/sectors',
  ]

  const yearRoutes = Object.keys(data.years).map((year) => `/years/${year}`)
  const stateRoutes = getAvailableStates(data).map((state) => `/states/${slugifyLabel(state)}`)
  const facilityRoutes = getAvailableFacilityNames(data).map((facility) => `/facilities/${slugifyLabel(facility)}`)
  const sectorRoutes = sectors.map((sector) => `/sectors/${slugifyLabel(sector.name)}`)

  return [...staticRoutes, ...yearRoutes, ...stateRoutes, ...facilityRoutes, ...sectorRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
