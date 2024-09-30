"use client"

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format, isAfter, startOfDay } from 'date-fns'
import { Star, ChevronDown, ChevronUp, Calendar, Circle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Task } from '@/lib/types'
import { useGlobalUpdate } from '@/lib/hooks'
import EditTaskDialog from './EditTaskDialog'
import DeleteTaskDialog from './DeleteTaskDialog'
import { useToast } from '@/hooks/use-toast'

interface TaskItemProps {
    task: Task
    isExpanded?: boolean
}

export default function TaskItem({ task: initialTask, isExpanded: initialIsExpanded = false }: TaskItemProps) {
    const [task, setTask] = useState(initialTask)
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(initialIsExpanded)
    const { updateTask, deleteTask } = useGlobalUpdate()
    const { toast } = useToast()

    const handleToggleCompleted = useCallback(async () => {
        setIsLoading(true)
        try {
            await updateTask({ ...task, isCompleted: !task.isCompleted })
            setTask(prevTask => ({ ...prevTask, isCompleted: !prevTask.isCompleted }))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task completion status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [task, updateTask, toast])

    const handleToggleImportant = useCallback(async () => {
        setIsLoading(true)
        try {
            await updateTask({ ...task, isImportant: !task.isImportant })
            setTask(prevTask => ({ ...prevTask, isImportant: !prevTask.isImportant }))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task importance. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [task, updateTask, toast])

    const handleUpdateTask = useCallback(async (updatedTask: Task) => {
        setIsLoading(true)
        try {
            await updateTask(updatedTask)
            setTask(updatedTask)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [updateTask, toast])

    const handleDelete = useCallback(async () => {
        setIsLoading(true)
        try {
            await deleteTask(task.id)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete task. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }, [deleteTask, task.id, toast])

    const toggleExpand = () => setIsExpanded(!isExpanded)

    const isPastDue = isAfter(startOfDay(new Date()), startOfDay(new Date(task.date))) && !task.isCompleted

    return (
        <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn(
                "transition-all duration-300 bg-gradient-to-br from-background to-background/90 backdrop-blur-sm shadow-md hover:shadow-lg border-l-4",
                task.isCompleted ? "border-l-green-500" : isPastDue ? "border-l-red-500" : task.isImportant ? "border-l-orange-500" : "border-l-blue-500",
                isLoading && "opacity-70"
            )}>
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                )}
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-grow min-w-0 space-y-1">
                            <h3 className={cn(
                                "text-lg font-semibold text-primary break-words",
                                task.isCompleted && "line-through text-muted-foreground"
                            )}>
                                {task.title}
                            </h3>
                            <div className={cn(
                                "text-sm text-muted-foreground",
                                isExpanded ? "" : "line-clamp-2"
                            )}>
                                <p className="break-words">{task.description}</p>
                            </div>
                            {task.description.length > 100 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-primary hover:text-primary-foreground hover:bg-primary/90"
                                    onClick={toggleExpand}
                                >
                                    {isExpanded ? (
                                        <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                                    ) : (
                                        <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                                    )}
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge 
                                variant={task.isCompleted ? "secondary" : "default"}
                                className={cn(
                                    "whitespace-nowrap",
                                    task.isCompleted ? "bg-green-100 text-green-800" : 
                                    isPastDue ? "bg-red-100 text-red-800" : 
                                    task.isImportant ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                                )}
                            >
                                {task.isCompleted ? "Completed" : isPastDue ? "Past Due" : task.isImportant ? "Priority" : "In Progress"}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.date), 'PPP')}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-4 py-2 flex justify-between items-center flex-wrap gap-2 bg-muted/50">
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleCompleted}
                            disabled={isLoading}
                            className="hover:bg-primary/10"
                        >
                            {task.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                                <Circle className={cn("h-4 w-4", isPastDue ? "text-red-500" : task.isImportant ? "text-orange-500" : "text-blue-500")} />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleImportant}
                            disabled={isLoading}
                            className="hover:bg-primary/10"
                        >
                            <Star className={cn("h-4 w-4", task.isImportant ? "fill-orange-500 text-orange-500" : "text-muted-foreground")} />
                        </Button>
                        <EditTaskDialog task={task} onUpdateTask={handleUpdateTask} disabled={isLoading} />
                        <DeleteTaskDialog task={task} onDelete={handleDelete} disabled={isLoading} />
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}