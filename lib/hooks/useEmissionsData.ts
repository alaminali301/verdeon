import { useEpaStore } from '@/lib/store/useEpaStore'
import dataset from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'

export function useEmissionsData() {
  const uploadedData = useEpaStore((state) => state.uploadedData)
  return (uploadedData ?? dataset) as EpaDataset
}
