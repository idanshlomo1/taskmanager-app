"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CheckCircle, Circle, Star, Pencil, Trash2, Loader, ChevronDown, ChevronUp } from 'lucide-react'
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
    const [isExpanded, setIsExpanded] = useState(false)
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

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

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
                isCompleted && "opacity-60"
            )}>
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <CardTitle className="text-lg font-semibold break-words text-primary">{title}</CardTitle>
                        <Badge variant={isCompleted ? "secondary" : "default"} className="self-start sm:self-center">
                            {isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground break-words">
                            {isExpanded ? description : truncateText(description, 100)}
                        </p>
                        <p className="text-xs text-muted-foreground">Due: {format(new Date(date), 'PPP')}</p>
                        {description.length > 100 && (
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
                </CardContent>
                <CardFooter className="w-full flex flex-wrap justify-between gap-2">
                    <div className="flex space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleToggleCompleted}
                                        disabled={isCompletedLoading}
                                        className="hover:bg-primary/10"
                                    >
                                        {isCompletedLoading ? (
                                            <Loader className="h-4 w-4 animate-spin text-primary" />
                                        ) : isCompleted ? (
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-primary" />
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
                                        className="hover:bg-primary/10"
                                    >
                                        {isImportantLoading ? (
                                            <Loader className="h-4 w-4 animate-spin text-primary" />
                                        ) : (
                                            <Star className={cn("h-4 w-4", isImportant ? "fill-yellow-400 text-yellow-400" : "text-primary")} />
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
                </CardFooter>
            </Card>
        </motion.div>
    )
}