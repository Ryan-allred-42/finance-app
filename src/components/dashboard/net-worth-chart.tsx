'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface NetWorthLog {
  id: string
  date: string
  title: string
  value: number
}

interface NetWorthChartProps {
  data: NetWorthLog[]
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  // Format data for the chart
  const chartData = data.map(log => ({
    name: new Date(log.date).toLocaleDateString('default', { 
      month: 'short',
      day: 'numeric',
    }),
    value: log.value,
  }))

  // Calculate min and max values for better axis display
  const minValue = Math.min(...chartData.map(d => d.value))
  const maxValue = Math.max(...chartData.map(d => d.value))
  const valueRange = maxValue - minValue
  const yAxisMin = Math.floor(minValue - valueRange * 0.1)
  const yAxisMax = Math.ceil(maxValue + valueRange * 0.1)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          domain={[yAxisMin, yAxisMax]}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Net Worth']}
          cursor={{ stroke: '#888888' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4ade80"
          fill="url(#gradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
} 