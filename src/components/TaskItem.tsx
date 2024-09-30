"use client"

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle, Star, ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Task } from '@/lib/types'
import { useGlobalUpdate } from '@/lib/hooks'
import EditTaskDialog from './EditTaskDialog'
import DeleteTaskDialog from './DeleteTaskDialog'
import { useToast } from '@/hooks/use-toast'

interface TaskItemProps {
    task: Task
}

export default function TaskItem({ task: initialTask }: TaskItemProps) {
    const [task, setTask] = useState(initialTask)
    const [isLoading, setIsLoading] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
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

    return (
        <motion.div
            className='w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn(
                "transition-all duration-300 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md",
                task.isCompleted && "opacity-60",
                isLoading && "animate-pulse"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-grow min-w-0 space-y-1">
                            <h3 className={cn(
                                "text-lg font-semibold text-primary break-words",
                                task.isCompleted && "line-through"
                            )}>
                                {task.isImportant && <Star className="inline-block h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />}
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
                                    className="p-0 h-auto text-primary hover:bg-primary/10"
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
                        <Badge variant={task.isCompleted ? "secondary" : "default"} className="whitespace-nowrap">
                            {task.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.date), 'PPP')}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(task.date), 'p')}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-4 py-2 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleToggleCompleted}
                                        disabled={isLoading}
                                        className="hover:bg-primary/10"
                                    >
                                        <CheckCircle className={cn("h-4 w-4", task.isCompleted ? "text-primary fill-primary" : "text-primary")} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{task.isCompleted ? "Mark as incomplete" : "Mark as complete"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleToggleImportant}
                                        disabled={isLoading}
                                        className="hover:bg-primary/10"
                                    >
                                        <Star className={cn("h-4 w-4", task.isImportant ? "fill-yellow-400 text-yellow-400" : "text-primary")} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{task.isImportant ? "Remove importance" : "Mark as important"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <EditTaskDialog task={task} onUpdateTask={handleUpdateTask} disabled={isLoading} />
                        <DeleteTaskDialog task={task} onDelete={handleDelete} disabled={isLoading} />
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}