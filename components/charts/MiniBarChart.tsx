'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import dataset from '@/lib/data/epa-data.json'
import { getTrendSeries } from '@/lib/data/selectors'

export interface MiniBarChartProps {
  activeYear?: number
  data?: { year: number; total: number }[]
  onYearSelect?: (year: number) => void
  className?: string
}

export function MiniBarChart({
  activeYear = 2023,
  data = getTrendSeries(dataset),
  onYearSelect,
  className = '',
}: MiniBarChartProps) {
  return (
    <div className={className}>
      <div className="mb-1 text-[0.72rem] font-medium text-muted">
        US emissions 2010–2023 (Mt CO₂e) — EPA GHGRP
      </div>
      <div className="h-[86px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap={3}>
            <XAxis dataKey="year" hide />
            <YAxis hide />
            <Bar dataKey="total" radius={[2, 2, 0, 0]}>
              {data.map((point, index) => {
                const fill =
                  point.year === activeYear
                    ? '#2d9459'
                    : index % 2 === 0
                      ? '#bfedcf'
                      : '#8fd9a8'

                return <Cell key={point.year} fill={fill} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-end gap-[3px]">
        {data.map((point) => (
          <button
            key={point.year}
            type="button"
            onClick={() => onYearSelect?.(point.year)}
            className={[
              'flex-1 text-center text-[0.64rem] leading-none',
              point.year === activeYear ? 'text-green-900' : 'text-muted',
            ].join(' ')}
          >
            {String(point.year).slice(2)}
          </button>
        ))}
      </div>
    </div>
  )
}
