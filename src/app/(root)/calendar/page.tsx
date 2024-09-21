'use client'

import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { Task } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useGlobalState } from '@/lib/hooks'
import TaskItem from '@/components/TaskItem'

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { tasks } = useGlobalState();

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    return (
        <main className="h-full pt-12 md:pt-0">
            <div className="h-[80vh] border flex flex-col bg-background rounded-lg">
                <div className="flex items-center justify-between p-4 md:p-6 border-b">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Back to Tasks</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-4 border-b">
                    <h2 className="text-lg md:text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={goToNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <ScrollArea className="flex-grow p-2 md:p-6 ">
                    <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                            <div key={day} className="text-center font-semibold text-sm md:text-base">
                                {day}
                            </div>
                        ))}
                        {monthDays.map((day) => {
                            const dayTasks = tasks.filter((task) => isSameDay(new Date(task.date), day))
                            const hasImportantTask = dayTasks.some(task => task.isImportant)
                            return (
                                <Card key={day.toISOString()} className={cn(
                                    "min-h-[60px] md:min-h-[100px] relative",
                                    !isSameMonth(day, monthStart) && "opacity-50",
                                    dayTasks.length > 0 && "bg-primary/5",
                                    hasImportantTask && "ring-2 ring-yellow-400"
                                )}>
                                    <CardHeader className="p-1 md:p-2">
                                        <CardTitle className="text-right text-sm md:text-base">{format(day, 'd')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-1 md:p-2">
                                        {dayTasks.length > 0 && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full h-full absolute inset-0 p-0">
                                                        <div className="flex flex-col items-start w-full h-full">
                                                            {dayTasks.slice(0, 3).map((task, index) => (
                                                                <div key={task.id} className="w-full text-left truncate text-xs md:text-sm">
                                                                    {task.isImportant && <Star className="inline h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />}
                                                                    {task.title}
                                                                </div>
                                                            ))}
                                                            {dayTasks.length > 3 && (
                                                                <div className="text-xs md:text-sm text-muted-foreground">
                                                                    +{dayTasks.length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>{format(day, 'MMMM d, yyyy')}</DialogTitle>
                                                    </DialogHeader>
                                                    <ScrollArea className="max-h-[60vh]">
                                                        <div className="flex flex-col gap-2">
                                                            {dayTasks.map((task) => (
                                                                <TaskItem key={task.id} task={task} />
                                                            ))}
                                                        </div>
                                                    </ScrollArea>

                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>
            </div>
        </main>
    )
}