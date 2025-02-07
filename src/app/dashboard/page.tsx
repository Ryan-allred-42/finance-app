'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpensesByCategory } from "@/components/dashboard/expenses-by-category"
import { NetWorthChart } from "@/components/dashboard/net-worth-chart"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, LineChart, PiggyBank } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { MonthPicker } from "@/components/ui/month-picker"

interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

interface NetWorthLog {
  id: string
  date: string
  title: string
  value: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [netWorthLogs, setNetWorthLogs] = useState<NetWorthLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    async function fetchData() {
      try {
        const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
        const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd')

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .is('deleted_at', null)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })

        if (transactionsError) throw transactionsError
        setTransactions(transactionsData || [])

        // Fetch net worth logs
        const { data: netWorthData, error: netWorthError } = await supabase
          .from('net_worth_log')
          .select('*')
          .is('deleted_at', null)
          .order('date', { ascending: true })

        if (netWorthError) throw netWorthError
        setNetWorthLogs(netWorthData || [])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedDate])

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.value, 0)

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.value, 0)

  const netWorth = netWorthLogs.length > 0 
    ? netWorthLogs[netWorthLogs.length - 1].value 
    : 0

  const monthlyBudget = 5000 // This should come from your planned_budget table

  // Calculate previous month's totals for comparison
  const previousMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const previousMonth = subMonths(selectedDate, 1)
    return isSameMonth(transactionDate, previousMonth)
  })

  const previousMonthIncome = previousMonthTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.value, 0)

  const previousMonthExpenses = previousMonthTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.value, 0)

  const incomeChange = previousMonthIncome === 0 
    ? 100 
    : ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100

  const expensesChange = previousMonthExpenses === 0 
    ? 100 
    : ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Your financial overview and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker
            date={selectedDate}
            onChange={setSelectedDate}
          />
          <Button>
            <PiggyBank className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className={cn(
              "h-4 w-4",
              incomeChange >= 0 ? "text-green-500" : "text-red-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              incomeChange >= 0 ? "text-green-500" : "text-red-500"
            )}>${totalIncome.toFixed(2)}</div>
            <p className={cn(
              "text-xs",
              incomeChange >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className={cn(
              "h-4 w-4",
              expensesChange <= 0 ? "text-green-500" : "text-red-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              expensesChange <= 0 ? "text-green-500" : "text-red-500"
            )}>${totalExpenses.toFixed(2)}</div>
            <p className={cn(
              "text-xs",
              expensesChange <= 0 ? "text-green-500" : "text-red-500"
            )}>
              {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <LineChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netWorth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((1 - totalExpenses / monthlyBudget) * 100)}% remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
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
            {transactions.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No recent transactions"
                description="Your recent transactions will appear here."
                className="min-h-[350px]"
              />
            ) : (
              <RecentTransactions data={transactions.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Net Worth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {netWorthLogs.length === 0 ? (
              <EmptyState
                icon={LineChart}
                title="No net worth data"
                description="Track your net worth over time to see it visualized here."
                className="min-h-[350px]"
              />
            ) : (
              <NetWorthChart data={netWorthLogs} />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.filter(t => t.transaction_type === 'expense').length === 0 ? (
              <EmptyState
                icon={PiggyBank}
                title="No expenses yet"
                description="Add expenses to see your spending by category."
                className="min-h-[350px]"
              />
            ) : (
              <ExpensesByCategory 
                data={transactions.filter(t => t.transaction_type === 'expense')} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 