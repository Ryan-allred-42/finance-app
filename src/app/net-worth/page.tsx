'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Plus } from "lucide-react"
import { NetWorthChart } from "@/components/dashboard/net-worth-chart"
import { EmptyState } from "@/components/ui/empty-state"
import { supabase } from "@/lib/supabase/client"
import { AddNetWorthDialog } from "@/components/net-worth/add-net-worth-dialog"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface NetWorthLog {
  id: string
  date: string
  title: string
  value: number
}

export default function NetWorthPage() {
  const [loading, setLoading] = useState(true)
  const [netWorthLogs, setNetWorthLogs] = useState<NetWorthLog[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchNetWorthLogs()
  }, [])

  async function fetchNetWorthLogs() {
    try {
      const { data, error } = await supabase
        .from('net_worth_log')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: true })

      if (error) throw error
      setNetWorthLogs(data || [])
    } catch (error) {
      console.error('Error fetching net worth logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentNetWorth = netWorthLogs.length > 0 
    ? netWorthLogs[netWorthLogs.length - 1].value 
    : 0

  const previousNetWorth = netWorthLogs.length > 1 
    ? netWorthLogs[netWorthLogs.length - 2].value 
    : 0

  const netWorthChange = previousNetWorth === 0 
    ? 0 
    : ((currentNetWorth - previousNetWorth) / previousNetWorth) * 100

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
          <h2 className="text-2xl font-semibold tracking-tight">Net Worth</h2>
          <p className="text-sm text-muted-foreground">
            Track your net worth over time
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Net Worth Entry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Net Worth</CardTitle>
            <LineChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentNetWorth.toFixed(2)}</div>
            <p className={cn(
              "text-xs",
              netWorthChange > 0 ? "text-green-500" : "text-red-500"
            )}>
              {netWorthChange > 0 ? '+' : ''}{netWorthChange.toFixed(1)}% from last entry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Entry</CardTitle>
            <LineChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {netWorthLogs.length > 0 && (
              <>
                <div className="text-2xl font-bold">
                  {netWorthLogs[netWorthLogs.length - 1].title}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(netWorthLogs[netWorthLogs.length - 1].date), 'MMM d, yyyy')}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth History</CardTitle>
        </CardHeader>
        <CardContent>
          {netWorthLogs.length === 0 ? (
            <EmptyState
              icon={LineChart}
              title="No net worth data"
              description="Add your first net worth entry to start tracking."
              className="min-h-[350px]"
            />
          ) : (
            <NetWorthChart data={netWorthLogs} />
          )}
        </CardContent>
      </Card>

      <AddNetWorthDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchNetWorthLogs}
      />
    </div>
  )
} 