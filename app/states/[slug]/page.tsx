import type { Metadata } from 'next'
import data from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'
import { getAvailableStates, getStateHistory } from '@/lib/data/selectors'
import { StateDetailPageClient } from '@/components/pages/StateDetailPageClient'
import { findLabelBySlug, slugifyLabel } from '@/lib/utils/slug'

interface StateDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

const DATASET = data as EpaDataset

export async function generateStaticParams() {
  return getAvailableStates(DATASET).map((state) => ({
    slug: slugifyLabel(state),
  }))
}

export async function generateMetadata({ params }: StateDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const stateName = findLabelBySlug(getAvailableStates(DATASET), slug)

  if (!stateName) {
    return {
      title: 'State not found',
    }
  }

  const history = getStateHistory(DATASET, stateName)
  const latestPoint = history.at(-1)

  return {
    title: `${stateName} Emissions`,
    description: latestPoint
      ? `Explore ${stateName} emissions history, national rank, and reporting trends in the EPA greenhouse gas dataset.`
      : `Explore ${stateName} in the EPA greenhouse gas reporting dataset.`,
  }
}

export default async function StateDetailPage({ params }: StateDetailPageProps) {
  const { slug } = await params

  return <StateDetailPageClient slug={slug} />
}
