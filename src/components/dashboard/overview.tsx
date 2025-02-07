'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

interface MonthlyData {
  name: string
  income: number
  expenses: number
}

interface OverviewProps {
  data: Transaction[]
}

export function Overview({ data }: OverviewProps) {
  // Process data to group by month
  const monthlyData = data.reduce((acc: MonthlyData[], transaction) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })
    
    const existingMonth = acc.find(item => item.name === month)
    
    if (existingMonth) {
      if (transaction.transaction_type === 'income') {
        existingMonth.income += transaction.value
      } else {
        existingMonth.expenses += transaction.value
      }
    } else {
      acc.push({
        name: month,
        income: transaction.transaction_type === 'income' ? transaction.value : 0,
        expenses: transaction.transaction_type === 'expense' ? transaction.value : 0,
      })
    }
    
    return acc
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
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
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="income"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
          name="Income"
        />
        <Bar
          dataKey="expenses"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          name="Expenses"
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 