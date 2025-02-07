'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ListTodo, Calculator, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { supabase } from "@/lib/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ListItem {
  id: string
  list_id: string
  values: Record<string, string | number>
}

interface FinancialList {
  id: string
  title: string
  columns: Array<{
    id: string
    name: string
    type: 'text' | 'number'
  }>
}

export default function ListsPage() {
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState<FinancialList[]>([])
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [items, setItems] = useState<ListItem[]>([])
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<'text' | 'number'>('text')
  const [newListTitle, setNewListTitle] = useState("")
  const [calculations, setCalculations] = useState<Record<string, { type: string; value: number }>>({})

  useEffect(() => {
    fetchLists()
  }, [])

  useEffect(() => {
    if (selectedList) {
      fetchItems(selectedList)
    }
  }, [selectedList])

  async function fetchLists() {
    try {
      const { data, error } = await supabase
        .from('financial_lists')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLists(data || [])
      if (data?.[0]) {
        setSelectedList(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching lists:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchItems(listId: string) {
    try {
      const { data, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  async function createList() {
    if (!newListTitle.trim()) return

    try {
      const { data, error } = await supabase
        .from('financial_lists')
        .insert([
          { 
            title: newListTitle.trim(),
            columns: []
          }
        ])
        .select()

      if (error) throw error
      if (data?.[0]) {
        setSelectedList(data[0].id)
      }
      setNewListTitle("")
      fetchLists()
    } catch (error) {
      console.error('Error creating list:', error)
    }
  }

  async function addColumn() {
    if (!newColumnName.trim() || !selectedList) return

    const list = lists.find(l => l.id === selectedList)
    if (!list) return

    const newColumn = {
      id: crypto.randomUUID(),
      name: newColumnName.trim(),
      type: newColumnType
    }

    try {
      const { error } = await supabase
        .from('financial_lists')
        .update({
          columns: [...list.columns, newColumn]
        })
        .eq('id', selectedList)

      if (error) throw error
      setNewColumnName("")
      fetchLists()
    } catch (error) {
      console.error('Error adding column:', error)
    }
  }

  async function addItem() {
    if (!selectedList) return

    try {
      const { error } = await supabase
        .from('list_items')
        .insert([
          {
            list_id: selectedList,
            values: {}
          }
        ])

      if (error) throw error
      fetchItems(selectedList)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function updateItemValue(itemId: string, column: string, value: string) {
    try {
      const item = items.find(i => i.id === itemId)
      if (!item) return

      const { error } = await supabase
        .from('list_items')
        .update({
          values: {
            ...item.values,
            [column]: value
          }
        })
        .eq('id', itemId)

      if (error) throw error
      fetchItems(selectedList!)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  function calculateColumnStats(columnId: string, type: 'sum' | 'average' | 'min' | 'max') {
    const values = items
      .map(item => parseFloat(item.values[columnId] as string))
      .filter(value => !isNaN(value))

    if (values.length === 0) return

    let result: number
    switch (type) {
      case 'sum':
        result = values.reduce((a, b) => a + b, 0)
        break
      case 'average':
        result = values.reduce((a, b) => a + b, 0) / values.length
        break
      case 'min':
        result = Math.min(...values)
        break
      case 'max':
        result = Math.max(...values)
        break
    }

    setCalculations(prev => ({
      ...prev,
      [columnId]: { type, value: result }
    }))
  }

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

  const selectedListData = lists.find(l => l.id === selectedList)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Lists</h2>
          <p className="text-sm text-muted-foreground">
            Manage your financial lists and calculations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="New list name..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <Button onClick={createList}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {lists.map((list) => (
                    <Button
                      key={list.id}
                      variant={selectedList === list.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedList(list.id)}
                    >
                      <ListTodo className="h-4 w-4 mr-2" />
                      {list.title}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          {selectedListData ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedListData.title}</CardTitle>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New column name..."
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                    />
                    <Select
                      value={newColumnType}
                      onValueChange={(value: 'text' | 'number') => setNewColumnType(value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Column type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addColumn}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </Button>
                  </div>
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedListData.columns.length === 0 ? (
                  <EmptyState
                    icon={ListTodo}
                    title="No columns yet"
                    description="Add columns to your list to get started."
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4" style={{
                      gridTemplateColumns: `repeat(${selectedListData.columns.length}, 1fr)`
                    }}>
                      {selectedListData.columns.map((column) => (
                        <div key={column.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">{column.name}</Label>
                            {column.type === 'number' && (
                              <Select
                                onValueChange={(value) => calculateColumnStats(column.id, value as any)}
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Calculate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sum">Sum</SelectItem>
                                  <SelectItem value="average">Average</SelectItem>
                                  <SelectItem value="min">Min</SelectItem>
                                  <SelectItem value="max">Max</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          {items.map((item) => (
                            <Input
                              key={`${item.id}-${column.id}`}
                              type={column.type === 'number' ? 'number' : 'text'}
                              value={item.values[column.id] || ''}
                              onChange={(e) => updateItemValue(item.id, column.id, e.target.value)}
                            />
                          ))}
                          {calculations[column.id] && (
                            <div className="text-sm text-muted-foreground">
                              {calculations[column.id].type}: {calculations[column.id].value.toFixed(2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={ListTodo}
              title="No list selected"
              description="Select or create a list to get started."
              className="min-h-[200px]"
            />
          )}
        </div>
      </div>
    </div>
  )
} 