'use client'

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase/client"
import { EmptyState } from "@/components/ui/empty-state"
import { DollarSign } from "lucide-react"

interface Transaction {
  id: string
  transaction_type: 'income' | 'expense'
  title: string
  value: number
  category: string
  date: string
}

interface TransactionsTableProps {
  date: Date
}

export function TransactionsTable({ date }: TransactionsTableProps) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .is('deleted_at', null)
          .eq('date', format(date, 'yyyy-MM-dd'))
          .order('date', { ascending: false })

        if (error) throw error
        setTransactions(data || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [date])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={DollarSign}
        title="No transactions"
        description="No transactions found for this period."
        className="min-h-[200px]"
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
            <TableCell>{transaction.title}</TableCell>
            <TableCell className="capitalize">{transaction.category}</TableCell>
            <TableCell className={`text-right ${
              transaction.transaction_type === 'income' 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {transaction.transaction_type === 'income' ? '+' : '-'}
              ${transaction.value.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 