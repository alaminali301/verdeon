'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { formatMt } from '@/lib/utils/format'

export interface ComparisonSeries {
  label: string
  color: string
  data: Array<{
    year: number
    value: number
  }>
}

export interface ComparisonChartProps {
  title: string
  description: string
  series: [ComparisonSeries, ComparisonSeries]
  className?: string
}

function ComparisonTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  label?: string | number
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-[12px] border border-green-100 bg-white px-3 py-3 text-xs text-green-900 shadow-card">
      <div className="font-semibold">{label}</div>
      <div className="mt-2 space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
            <span className="text-muted">{formatMt(item.value ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ComparisonChart({
  title,
  description,
  series,
  className = '',
}: ComparisonChartProps) {
  const mergedData = Array.from(
    new Set(series.flatMap((item) => item.data.map((point) => point.year))),
  )
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      [series[0].label]: series[0].data.find((point) => point.year === year)?.value ?? 0,
      [series[1].label]: series[1].data.find((point) => point.year === year)?.value ?? 0,
    }))

  return (
    <Card className={['rounded-[24px] p-6 shadow-card', className].join(' ')}>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-green-900">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
      </div>

      <div className="h-[300px] w-full" role="img" aria-label={`${title}. Comparison chart across reporting years.`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={mergedData} margin={{ top: 10, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="rgba(45,148,89,.08)" strokeDasharray="2 4" />
            <XAxis dataKey="year" tick={{ fill: '#6b7a72', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip content={<ComparisonTooltip />} />
            {series.map((item) => (
              <Line
                key={item.label}
                type="monotone"
                dataKey={item.label}
                stroke={item.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, stroke: '#ffffff', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {series.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2 text-sm text-green-900">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </Card>
  )
}
