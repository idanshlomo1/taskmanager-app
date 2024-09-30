"use client"

import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useGlobalState } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import TaskItem from '@/components/TaskItem'
import CreateContent from '@/components/CreateContent'
import { Calendar } from "@/components/ui/calendar"

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { tasks } = useGlobalState()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setCurrentDate(date || new Date())
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {currentDate ? format(currentDate, "MMM yyyy") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={currentDate}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            </div>

            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</CardTitle>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={goToNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-semibold mb-1 sm:mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                            <div key={day} className="text-xs sm:text-sm text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {monthDays.map((day) => {
                            const dayTasks = tasks.filter((task) => isSameDay(new Date(task.date), day))
                            const hasImportantTask = dayTasks.some(task => task.isImportant)
                            return (
                                <Dialog key={day.toISOString()}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-12 sm:h-20 p-1 font-normal text-xs sm:text-sm flex flex-col items-start justify-start",
                                                !isSameMonth(day, monthStart) && "text-muted-foreground opacity-50",
                                                isToday(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                                                dayTasks.length > 0 && "bg-secondary/50",
                                                hasImportantTask && "ring-2 ring-yellow-400"
                                            )}
                                        >
                                            <time dateTime={format(day, 'yyyy-MM-dd')} className="font-semibold">
                                                {format(day, 'd')}
                                            </time>
                                            <div className="w-full mt-1">
                                                {dayTasks.slice(0, 2).map((task, index) => (
                                                    <div key={index} className="text-[0.6rem] sm:text-xs truncate text-left">
                                                        {task.title}
                                                    </div>
                                                ))}
                                                {dayTasks.length > 2 && (
                                                    <div className="text-[0.6rem] sm:text-xs text-muted-foreground">
                                                        +{dayTasks.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>{format(day, 'MMMM d, yyyy')}</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[60vh] pr-4">
                                            <div className="space-y-4">
                                                {dayTasks.length > 0 ? (
                                                    dayTasks.map((task) => (
                                                        <TaskItem key={task.id} task={task} />
                                                    ))
                                                ) : (
                                                    <p className="text-center text-muted-foreground py-4">No tasks for this day.</p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <CreateContent handleCloseDialog={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}