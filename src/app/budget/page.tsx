'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddTransactionDialog } from "@/components/budget/add-transaction-dialog"
import { AddBudgetDialog } from "@/components/budget/add-budget-dialog"
import { BudgetOverview } from "@/components/budget/budget-overview"
import { TransactionsTable } from "@/components/budget/transactions-table"
import { Plus } from "lucide-react"
import { MonthPicker } from "@/components/ui/month-picker"

export default function BudgetPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddBudget, setShowAddBudget] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Budget</h2>
          <p className="text-sm text-muted-foreground">
            Manage your monthly budget and track your spending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthPicker
            date={date}
            onChange={setDate}
          />
          <Button onClick={() => setShowAddTransaction(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
          <Button onClick={() => setShowAddBudget(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Set Budget
          </Button>
        </div>
      </div>

      <BudgetOverview date={date} />

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable date={date} />
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        date={date}
      />
      
      <AddBudgetDialog
        open={showAddBudget}
        onOpenChange={setShowAddBudget}
        date={date}
      />
    </div>
  )
} 