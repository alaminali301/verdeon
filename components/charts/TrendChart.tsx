'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dataset from '@/lib/data/epa-data.json'
import { getTrendSeries } from '@/lib/data/selectors'
import { formatFacilities, formatMt } from '@/lib/utils/format'

export interface TrendPoint {
  year: number
  total: number
}

export interface TrendChartProps {
  data?: TrendPoint[]
  activeYear?: number
  facilityCounts?: Record<number, number>
  onYearSelect?: (year: number) => void
  className?: string
}

interface TrendDotProps {
  cx?: number
  cy?: number
  payload?: TrendPoint
}

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: TrendPoint }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-[4px] bg-green-800 px-3 py-2 text-xs font-semibold text-white shadow-lift">
      {formatMt(payload[0].payload.total)}
    </div>
  )
}

export function TrendChart({
  data = getTrendSeries(dataset),
  activeYear,
  facilityCounts,
  onYearSelect,
  className = '',
}: TrendChartProps) {
  const resolvedActiveYear = activeYear ?? data.at(-1)?.year ?? 2023
  const currentPoint = data.find((point) => point.year === resolvedActiveYear) ?? data.at(-1)
  const resolvedFacilityCounts =
    facilityCounts ??
    Object.fromEntries(
      Object.entries(dataset.years).map(([year, yearData]) => [Number(year), yearData.facilities]),
    )

  function TrendDot({ cx, cy, payload }: TrendDotProps) {
    if (cx === undefined || cy === undefined || !payload) {
      return null
    }

    const isActive = payload.year === resolvedActiveYear

    return (
      <g
        onClick={() => onYearSelect?.(payload.year)}
        style={{ cursor: onYearSelect ? 'pointer' : 'default' }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 5 : 3}
          fill={isActive ? '#1a5c38' : '#3aad6b'}
          stroke={isActive ? '#ffffff' : 'none'}
          strokeWidth={isActive ? 2 : 0}
        />
      </g>
    )
  }

  return (
    <div className={['rounded-lg border border-green-100 bg-green-50 p-6', className].join(' ')}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted">
            Total US reported emissions
          </p>
          <p className="font-display text-[1.9rem] font-bold leading-none tracking-[-0.03em] text-green-900">
            {currentPoint ? formatMt(currentPoint.total) : '0 Mt'}
          </p>
          <p className="mt-1 text-[0.72rem] text-muted">
            CO₂e · {resolvedActiveYear} ·{' '}
            {currentPoint ? formatFacilities(resolvedFacilityCounts[resolvedActiveYear] ?? 0) : '0 facilities'}
          </p>
        </div>
      </div>

      <div className="h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 6, left: 6, bottom: 14 }}>
            <defs>
              <linearGradient id="verdeonTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(45,148,89,.2)" />
                <stop offset="100%" stopColor="rgba(45,148,89,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(45,148,89,.08)" strokeDasharray="2 4" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#6b7a72', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={1}
              tickFormatter={(value: number) => (value % 2 === 0 ? String(value) : '')}
            />
            <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
            <Tooltip content={<TrendTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2d9459"
              strokeWidth={2}
              fill="url(#verdeonTrendFill)"
              dot={<TrendDot />}
              activeDot={<TrendDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {data.map((point) => {
          const isActive = point.year === resolvedActiveYear

          return (
            <button
              key={point.year}
              type="button"
              onClick={() => onYearSelect?.(point.year)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-muted hover:border-green-400 hover:text-green-900',
              ].join(' ')}
            >
              {point.year}
            </button>
          )
        })}
      </div>
    </div>
  )
}
