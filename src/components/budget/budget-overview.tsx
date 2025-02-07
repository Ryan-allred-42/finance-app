'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

interface BudgetOverviewProps {
  date: Date
}

export function BudgetOverview({ date }: BudgetOverviewProps) {
  // This will be replaced with real data from Supabase
  const budgetData = {
    income: {
      planned: 5000,
      actual: 4500,
    },
    expenses: {
      planned: 3000,
      actual: 2800,
    },
    categories: [
      {
        name: "Housing",
        planned: 1500,
        actual: 1450,
      },
      {
        name: "Food",
        planned: 600,
        actual: 580,
      },
      {
        name: "Transportation",
        planned: 400,
        actual: 350,
      },
      {
        name: "Entertainment",
        planned: 300,
        actual: 280,
      },
      {
        name: "Utilities",
        planned: 200,
        actual: 140,
      },
    ],
  }

  const netPlanned = budgetData.income.planned - budgetData.expenses.planned
  const netActual = budgetData.income.actual - budgetData.expenses.actual

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${budgetData.income.actual}</div>
          <Progress 
            value={(budgetData.income.actual / budgetData.income.planned) * 100} 
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            ${budgetData.income.actual} of ${budgetData.income.planned} planned
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${budgetData.expenses.actual}</div>
          <Progress 
            value={(budgetData.expenses.actual / budgetData.expenses.planned) * 100}
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            ${budgetData.expenses.actual} of ${budgetData.expenses.planned} planned
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Net</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${netActual}</div>
          <Progress 
            value={(netActual / netPlanned) * 100}
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            ${netActual} of ${netPlanned} planned
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{format(date, 'MMMM yyyy')}</div>
          <div className="mt-4 text-xs text-muted-foreground">
            Budget progress for the current month
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">
                    ${category.actual} of ${category.planned}
                  </span>
                </div>
                <Progress 
                  value={(category.actual / category.planned) * 100}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 