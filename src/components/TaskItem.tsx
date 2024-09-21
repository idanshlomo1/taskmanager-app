"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle, Circle, Star, Pencil, Trash2, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Task } from '@/lib/types'
import { useGlobalUpdate } from '@/lib/hooks'
import EditTaskDialog from './EditTaskDialog'
import DeleteTaskDialog from './DeleteTaskDialog'

interface TaskItemProps {
    task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
    const { id, title, description, date, isCompleted, isImportant } = task
    const [isCompletedLoading, setIsCompletedLoading] = useState(false)
    const [isImportantLoading, setIsImportantLoading] = useState(false)
    const { updateTask, deleteTask } = useGlobalUpdate()

    const handleToggleCompleted = async () => {
        setIsCompletedLoading(true)
        await updateTask({ ...task, isCompleted: !isCompleted })
        setIsCompletedLoading(false)
    }

    const handleToggleImportant = async () => {
        setIsImportantLoading(true)
        await updateTask({ ...task, isImportant: !isImportant })
        setIsImportantLoading(false)
    }

    const handleUpdateTask = async (updatedTask: Task) => {
        await updateTask(updatedTask)
    }

    const handleDelete = async () => {
        await deleteTask(id)
    }

    return (
        <motion.div
            className='max-w-4xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn("transition-all duration-300 bg-accent shadow-sm hover:shadow-lg  ", isCompleted && "opacity-60 bg-accent")}>
                <CardHeader className="pb-2 ">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold line-clamp-1 break-words">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent >
                    <p className="text-sm text-muted-foreground mb-2 break-words">{description}</p>
                    <p className="text-xs text-muted-foreground">Due: {format(new Date(date), 'PPP')}</p>
                </CardContent>
                <CardFooter className="w-full flex justify-between">
                    <div className="flex space-x-2">

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleToggleCompleted}
                                        disabled={isCompletedLoading}
                                    >
                                        {isCompletedLoading ? (
                                            <Loader className="h-4 w-4 animate-spin" />
                                        ) : isCompleted ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Circle className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isCompleted ? "Mark as incomplete" : "Mark as complete"}</p>
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
                                        disabled={isImportantLoading}
                                    >
                                        {isImportantLoading ? (
                                            <Loader className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Star className={cn("h-4 w-4", isImportant && "fill-yellow-400 text-yellow-400")} />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isImportant ? "Remove importance" : "Mark as important"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <EditTaskDialog task={task} onUpdateTask={handleUpdateTask} />
                        <DeleteTaskDialog task={task} onDelete={handleDelete} />


                    </div>
                    <Badge variant={isCompleted ? "secondary" : "default"}>
                        {isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                </CardFooter>
            </Card>
        </motion.div>
    )
}