import { useEmissionsData } from '@/lib/hooks/useEmissionsData'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { getYoyChange } from '@/lib/data/selectors'

export function useYearComparison() {
  const data = useEmissionsData()
  const activeYear = useEpaStore((state) => state.activeYear)
  const previousYear = Math.max(activeYear - 1, 2010)

  return getYoyChange(data, previousYear, activeYear)
}
