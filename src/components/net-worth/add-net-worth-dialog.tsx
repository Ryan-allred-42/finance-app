'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase/client"

interface AddNetWorthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface AssetCategory {
  name: string
  value: number
}

export function AddNetWorthDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddNetWorthDialogProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [userId, setUserId] = useState<string | null>(null)
  const [categories, setCategories] = useState<AssetCategory[]>([
    { name: 'Savings', value: 0 },
    { name: 'Investments', value: 0 },
    { name: '401k', value: 0 },
    { name: 'Roth IRA', value: 0 },
  ])

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    try {
      const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0)
      const title = categories
        .filter(cat => cat.value > 0)
        .map(cat => `${cat.name}: $${cat.value.toFixed(2)}`)
        .join(', ')

      const { error } = await supabase
        .from('net_worth_log')
        .insert({
          user_id: userId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          title: title || 'Net Worth Update',
          value: totalValue,
        })

      if (error) throw error

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error adding net worth entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories]
    newCategories[index].value = parseFloat(value) || 0
    setCategories(newCategories)
  }

  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0)
  const isFormValid = userId && selectedDate && totalValue > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Net Worth Entry</DialogTitle>
            <DialogDescription>
              Add a new net worth entry with your current assets.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
            {categories.map((category, index) => (
              <div key={category.name} className="grid gap-2">
                <Label htmlFor={`category-${index}`}>{category.name}</Label>
                <Input
                  id={`category-${index}`}
                  type="number"
                  step="0.01"
                  value={category.value || ''}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder={`Enter ${category.name.toLowerCase()} amount`}
                />
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t">
              <Label>Total Net Worth</Label>
              <div className="text-xl font-bold">${totalValue.toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? 'Adding...' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 