import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getSectorBreakdown } from '@/lib/data/selectors'

export function useSectorBreakdown() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const activeSector = useEpaStore((state) => state.activeSector)
  const items = getSectorBreakdown(data, activeYear)

  return activeSector ? items.filter((item) => item.name === activeSector) : items
}
