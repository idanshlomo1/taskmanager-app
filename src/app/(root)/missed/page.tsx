"use client"

import React, { useState, useEffect } from 'react'
import { isAfter, startOfDay, parseISO } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGlobalState } from '@/lib/hooks'
import TaskItem from '@/components/TaskItem'
import { Task } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function MissedTasksPage() {
    const { tasks } = useGlobalState()
    const [missedTasks, setMissedTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const filterMissedTasks = () => {
            const filtered = tasks.filter(task => 
                !task.isCompleted && isAfter(startOfDay(new Date()), startOfDay(parseISO(task.date)))
            )
            setMissedTasks(filtered)
            setIsLoading(false)
        }

        filterMissedTasks()
    }, [tasks])

    const sortedMissedTasks = [...missedTasks].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Missed Tasks</h1>
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold">
                        Tasks that are overdue and not completed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : missedTasks.length > 0 ? (
                        <ScrollArea className="h-[60vh]">
                            <div className="space-y-4 pr-4">
                                {sortedMissedTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No missed tasks. Great job staying on top of things!
                        </p>
                    )}
                </CardContent>
            </Card>
            {missedTasks.length > 0 && (
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => window.print()}>
                        Print Missed Tasks
                    </Button>
                </div>
            )}
        </div>
    )
}