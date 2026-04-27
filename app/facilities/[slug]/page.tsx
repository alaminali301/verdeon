import type { Metadata } from 'next'
import data from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'
import { getFacilityHistory } from '@/lib/data/selectors'
import { FacilityDetailPageClient } from '@/components/pages/FacilityDetailPageClient'
import { find2023FacilityDetail, get2023FacilityNames } from '@/lib/data/epa-2023-details'
import { findLabelBySlug, slugifyLabel } from '@/lib/utils/slug'

interface FacilityDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

const DATASET = data as EpaDataset

export async function generateStaticParams() {
  return get2023FacilityNames().slice(0, 150).map((facility) => ({
    slug: slugifyLabel(facility),
  }))
}

export async function generateMetadata({ params }: FacilityDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const facilityName = findLabelBySlug(get2023FacilityNames(), slug)

  if (!facilityName) {
    return {
      title: 'Facility not found',
    }
  }

  const history = getFacilityHistory(DATASET, facilityName)
  const latestPoint = history.at(-1)
  const detail = find2023FacilityDetail(facilityName)

  return {
    title: detail?.parentCompany ? `${facilityName} · ${detail.parentCompany}` : `${facilityName} Emissions`,
    description: latestPoint
      ? `Explore ${facilityName} emissions history and facility ranking trends in the EPA greenhouse gas reporting dataset.`
      : `Explore ${facilityName} in the EPA greenhouse gas reporting dataset.`,
  }
}

export default async function FacilityDetailPage({ params }: FacilityDetailPageProps) {
  const { slug } = await params

  return <FacilityDetailPageClient slug={slug} />
}
