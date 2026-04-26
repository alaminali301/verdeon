'use client'

import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import dataset from '@/lib/data/epa-data.json'
import type { SectorBreakdownItem } from '@/lib/data/types'
import { getSectorBreakdown } from '@/lib/data/selectors'

export interface SectorBarChartProps {
  data?: SectorBreakdownItem[]
  year?: number
  className?: string
}

interface MotionBarShapeProps {
  fill?: string
  height?: number
  width?: number
  x?: number
  y?: number
}

function MotionBarShape({ fill, height = 0, width = 0, x = 0, y = 0 }: MotionBarShapeProps) {
  return (
    <motion.rect
      x={x}
      y={y}
      height={height}
      rx={999}
      ry={999}
      fill={fill}
      initial={{ width: 0 }}
      animate={{ width }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    />
  )
}

export function SectorBarChart({
  data,
  year = 2023,
  className = '',
}: SectorBarChartProps) {
  const items = data ?? getSectorBreakdown(dataset, year)
  const chartData = items.map((item) => ({
    ...item,
    label: `${item.mt.toFixed(0)} Mt`,
  }))

  return (
    <div className={['rounded-[14px] border border-green-100 bg-white p-5 shadow-card', className].join(' ')}>
      <h3 className="mb-5 text-base font-semibold text-green-900">
        Emissions by sector <span className="text-sm font-normal text-muted">· {year}</span>
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 28, left: 22, bottom: 0 }} barCategoryGap={16}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={108}
              tick={{ fill: '#1c1c1e', fontSize: 12 }}
            />
            <Bar dataKey="mt" radius={[999, 999, 999, 999]} shape={<MotionBarShape />}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <LabelList
                dataKey="label"
                position="right"
                offset={10}
                style={{ fill: '#6b7a72', fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 space-y-3">
        {chartData.map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-green-900">{item.name}</span>
              </div>
              <span className="text-sm text-muted">
                {item.mt.toFixed(0)} Mt · {item.pct.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
