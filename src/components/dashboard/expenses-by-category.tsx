'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

interface ExpensesByCategoryProps {
  data: Transaction[]
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#a855f7", // purple
]

export function ExpensesByCategory({ data }: ExpensesByCategoryProps) {
  // Process data to group by category
  const categoryData = data.reduce((acc: { [key: string]: number }, transaction) => {
    const category = transaction.category
    if (acc[category]) {
      acc[category] += transaction.value
    } else {
      acc[category] = transaction.value
    }
    return acc
  }, {})

  const chartData = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {chartData.map((category, index) => (
          <div key={category.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {category.name}
              </p>
              <p className="text-xs text-muted-foreground">
                ${category.value.toFixed(2)} ({((category.value / total) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 