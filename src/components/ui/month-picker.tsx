'use client'

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

interface MonthPickerProps {
  date: Date
  onChange: (date: Date) => void
  className?: string
}

export function MonthPicker({ date, onChange, className }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 26 }, (_, i) => currentYear + 25 - i) // This will give us years from currentYear+25 down to currentYear
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal w-[200px]",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <ScrollArea className="h-80">
          <div className="space-y-4 p-4">
            {years.map((year) => (
              <div key={year} className="space-y-2">
                <div className="font-medium">{year}</div>
                <div className="grid grid-cols-4 gap-2">
                  {months.map((month, index) => {
                    const currentDate = new Date(year, index)
                    const isSelected = 
                      date.getMonth() === index && 
                      date.getFullYear() === year

                    return (
                      <Button
                        key={month}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          onChange(currentDate)
                          setIsOpen(false)
                        }}
                      >
                        {format(currentDate, "MMM")}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 