"use client"

import * as React from "react"
import { format, isSameDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { addDays, startOfWeek } from "date-fns"

interface DatePickerDemoProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export default function DatePickerDemo({ date, onDateChange }: DatePickerDemoProps) {
  const [currentWeekStart, setCurrentWeekStart] = React.useState(() => startOfWeek(date || new Date()))

  const weekDates = React.useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  )

  const navigateWeek = (direction: 'prev' | 'next') => (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setCurrentWeekStart(prevDate => addDays(prevDate, direction === 'prev' ? -7 : 7))
  }

  const handleSelect = (selectedDate: Date) => (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    onDateChange(selectedDate.getTime() === date?.getTime() ? undefined : selectedDate)
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">
          {format(currentWeekStart, "MMMM yyyy")}
        </p>
      </div>
      <div className="flex items-center justify-between rounded-md border p-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={navigateWeek('prev')}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 grid grid-cols-7 gap-1">
          {weekDates.map((weekDate, index) => {
            const isSelected = date && isSameDay(weekDate, date)
            return (
              <Button
                key={index}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 font-normal",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                )}
                onClick={handleSelect(weekDate)}
              >
                <time dateTime={format(weekDate, "yyyy-MM-dd")}>
                  {format(weekDate, "d")}
                </time>
              </Button>
            )
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={navigateWeek('next')}
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        {date ? format(date, "PPP") : "Pick a date"}
      </p>
    </div>
  )
}