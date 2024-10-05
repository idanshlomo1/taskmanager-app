"use client"

import React, { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO, isAfter, startOfDay } from 'date-fns'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useGlobalState } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import TaskItem from '@/components/TaskItem'
import BottomSheetTaskCreator from '@/components/BottomSheetTaskCreator'

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { tasks } = useGlobalState()
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<string | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setCurrentDate(date || new Date())
    }

    const handleCreateTask = (date: Date) => {
        setSelectedDate(date)
        setIsDateDialogOpen(false)
        setIsBottomSheetOpen(true)
    }

    const handleTaskClick = (taskId: string, taskDate: string) => {
        const date = parseISO(taskDate)
        setCurrentDate(date)
        setSelectedDate(date)
        setSelectedTask(taskId)
        setIsDateDialogOpen(true)
    }

    // Sort tasks by completion status and date
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.isCompleted && !b.isCompleted) return 1
            if (!a.isCompleted && b.isCompleted) return -1
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
    }, [tasks])

    const getTaskColor = (task: any) => {
        if (task.isCompleted) return 'bg-green-500'
        if (isAfter(startOfDay(new Date()), startOfDay(parseISO(task.date)))) return 'bg-red-500'
        if (task.isImportant) return 'bg-orange-500'
        return 'bg-blue-500'
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <Button onClick={() => setIsBottomSheetOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            </div>

            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold">All Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                            {sortedTasks.map((task) => (
                                <Button
                                    key={task.id}
                                    variant="outline"
                                    className={cn(
                                        "flex flex-col items-start space-y-1 rounded-lg p-3 relative overflow-hidden",
                                        task.isCompleted && "opacity-50"
                                    )}
                                    onClick={() => handleTaskClick(task.id, task.date)}
                                >
                                    <div className={cn("absolute left-0 top-0 w-1 h-full", getTaskColor(task))} />
                                    <div className="text-sm font-medium leading-none">{task.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {format(parseISO(task.date), 'MMM d, yyyy')}
                                    </div>
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>

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
                            const dayTasks = tasks.filter((task) => isSameDay(parseISO(task.date), day))
                            const hasCompletedTask = dayTasks.some(task => task.isCompleted)
                            const hasPastDueTask = dayTasks.some(task => isAfter(startOfDay(new Date()), startOfDay(parseISO(task.date))) && !task.isCompleted)
                            const hasImportantTask = dayTasks.some(task => task.isImportant && !task.isCompleted)
                            const hasInProgressTask = dayTasks.some(task => !task.isCompleted && !task.isImportant && !hasPastDueTask)
                            
                            const getBorderColor = () => {
                                if (hasPastDueTask) return 'border-l-red-500'
                                if (hasImportantTask) return 'border-l-orange-500'
                                if (hasInProgressTask) return 'border-l-blue-500'
                                if (hasCompletedTask) return 'border-l-green-500'
                                return ''
                            }

                            return (
                                <Dialog key={day.toISOString()} open={isDateDialogOpen && isSameDay(day, selectedDate || new Date())} onOpenChange={(open) => {
                                    if (open) {
                                        setSelectedDate(day)
                                    }
                                    setIsDateDialogOpen(open)
                                    if (!open) {
                                        setSelectedTask(null)
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-12 sm:h-20 p-1 font-normal text-xs sm:text-sm flex flex-col items-start justify-start overflow-hidden",
                                                "border-l-4 transition-all duration-300",
                                                !isSameMonth(day, monthStart) && "text-muted-foreground opacity-50",
                                                isToday(day) && "bg-primary/10 relative",
                                                dayTasks.length > 0 && "bg-secondary/50",
                                                getBorderColor()
                                            )}
                                        >
                                            {isToday(day) && (
                                                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-primary/20 -rotate-45 transform origin-top-left"></div>
                                                </div>
                                            )}
                                            {isToday(day) && (
                                                <span className="absolute top-0 left-0 bg-primary text-primary-foreground text-[0.6rem] sm:text-xs font-semibold px-1 py-0.5 rounded-br-md transform -rotate-12 origin-top-left">
                                                    Today
                                                </span>
                                            )}
                                            <time dateTime={format(day, 'yyyy-MM-dd')} className="font-semibold mt-3 sm:mt-4">
                                                {format(day, 'd')}
                                            </time>
                                            <div className="w-full mt-1">
                                                {dayTasks.slice(0, 2).map((task, index) => (
                                                    <div key={index} className={cn(
                                                        "text-[0.6rem] sm:text-xs truncate text-left",
                                                        task.isCompleted ? "text-green-500" :
                                                        isAfter(startOfDay(new Date()), startOfDay(parseISO(task.date))) ? "text-red-500 font-semibold" :
                                                        task.isImportant ? "text-orange-500 font-semibold" :
                                                        "text-blue-500"
                                                    )}>
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
                                                        <TaskItem
                                                            key={task.id}
                                                            task={task}
                                                            isExpanded={task.id === selectedTask}
                                                        />
                                                    ))
                                                ) : (
                                                    <p className="text-center text-muted-foreground py-4">No tasks for this day.</p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                        <Button onClick={() => handleCreateTask(day)} className="w-full mt-4">
                                            <Plus className="mr-2 h-4 w-4" /> Create Task for This Date
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <BottomSheetTaskCreator
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                initialDate={selectedDate}
            />
        </div>
    )
}