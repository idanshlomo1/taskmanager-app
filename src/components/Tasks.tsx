"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useGlobalState } from '@/lib/hooks'
import { Task } from '@/lib/types'
import TaskItem from './TaskItem'
import { usePathname } from 'next/navigation'

interface TasksProps {
  tasks: Task[]
}

export default function Tasks({ tasks }: TasksProps) {
  const { isInitialLoading } = useGlobalState()
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getEmptyMessage = () => {
    if (searchQuery) {
      return "No tasks found matching your search."
    }
    switch (pathname) {
      case '/':
        return "No tasks found. Create a new task to get started."
      case '/calendar':
        return "No tasks scheduled. Add tasks to your calendar to see them here."
      case '/important':
        return "No important tasks. Mark tasks as important to see them here."
      case '/completed':
        return "No completed tasks. Tasks you finish will appear here."
      case '/incomplete':
        return "All tasks are completed. Great job!"
      case '/missed':
        return "No missed tasks. Keep up the good work!"
      default:
        return "No tasks found."
    }
  }

  return (
    <div className="w-full border flex flex-col bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md">
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <ScrollArea className="flex-grow h-[calc(100vh-16rem)]">
        <div className="p-4">
          {isInitialLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <TaskItemSkeleton key={index} />
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <AnimatePresence initial={false}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filteredTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {getEmptyMessage()}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function TaskItemSkeleton() {
  return (
    <div className="w-full h-24 bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}