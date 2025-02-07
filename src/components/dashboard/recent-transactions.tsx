'use client'

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

interface RecentTransactionsProps {
  data: Transaction[]
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  return (
    <div className="space-y-8">
      {data.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div className={`${
            transaction.transaction_type === 'income' 
              ? 'bg-green-500/20' 
              : 'bg-red-500/20'
            } p-2 rounded-full mr-4`}
          >
            {transaction.transaction_type === 'income' ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.category}
            </p>
          </div>
          <div className={`${
            transaction.transaction_type === 'income'
              ? 'text-green-500'
              : 'text-red-500'
            } text-sm font-medium`}
          >
            {transaction.transaction_type === 'income' ? '+' : '-'}
            ${transaction.value.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
} 