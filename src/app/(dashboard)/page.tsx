'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { NetWorthChart } from "@/components/dashboard/net-worth-chart"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, LineChart } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

// Define the Transaction type
interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

// Define the NetWorthLog type
interface NetWorthLog {
  id: string
  date: string
  title: string
  value: number
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [netWorthLogs, setNetWorthLogs] = useState<NetWorthLog[]>([])

  useEffect(() => {
    // Fetch transactions
    const fetchTransactions = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    // Fetch net worth logs
    const fetchNetWorthLogs = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/net-worth-logs')
        const data = await response.json()
        setNetWorthLogs(data)
      } catch (error) {
        console.error('Error fetching net worth logs:', error)
      }
    }

    fetchTransactions()
    fetchNetWorthLogs()
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,456.78</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <LineChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$123,456.00</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231.89</div>
            <p className="text-xs text-muted-foreground">45% remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {transactions.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No transactions yet"
                description="Add your first transaction to see your income and expenses overview."
                className="min-h-[350px]"
              />
            ) : (
              <Overview data={transactions} />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions data={transactions.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Net Worth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <NetWorthChart data={netWorthLogs} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesByCategory data={transactions.filter(t => t.transaction_type === 'expense')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 