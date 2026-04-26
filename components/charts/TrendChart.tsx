export interface TrendPoint {
  year: number
  total: number
}

export interface TrendChartProps {
  data?: TrendPoint[]
  onYearSelect?: (year: number) => void
}

export function TrendChart(_: TrendChartProps) {
  return <div className="rounded-md border border-dashed border-green-200 p-6">TrendChart scaffold</div>
}
