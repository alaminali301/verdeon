'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import dataset from '@/lib/data/epa-data.json'
import type { SectorBreakdownItem } from '@/lib/data/types'
import { getSectorBreakdown } from '@/lib/data/selectors'
import { formatMt } from '@/lib/utils/format'

export interface DonutChartProps {
  data?: SectorBreakdownItem[]
  year?: number
  className?: string
}

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: SectorBreakdownItem }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded-[8px] border border-green-100 bg-white px-3 py-2 text-xs text-green-900 shadow-card">
      <div className="font-semibold">{item.name}</div>
      <div className="mt-1 text-muted">
        {formatMt(item.mt)} · {item.pct.toFixed(1)}%
      </div>
    </div>
  )
}

export function DonutChart({
  data,
  year = 2023,
  className = '',
}: DonutChartProps) {
  const items = data ?? getSectorBreakdown(dataset, year)

  return (
    <div className={['rounded-[14px] border border-green-100 bg-white p-5 shadow-card', className].join(' ')}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-green-900">Sector share</h3>
        <span className="text-sm text-muted">{year}</span>
      </div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,220px)_1fr] md:items-center">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="mt"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                stroke="#ffffff"
                strokeWidth={3}
              >
                {items.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-green-900">{item.name}</span>
              </div>
              <span className="text-sm text-muted">
                {item.pct.toFixed(1)}% · {item.mt.toFixed(0)} Mt
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
