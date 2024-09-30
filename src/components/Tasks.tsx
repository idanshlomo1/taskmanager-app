"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useGlobalState } from '@/lib/hooks'
import { Task } from '@/lib/types'
import TaskItem from './TaskItem'
import CreateContent from './CreateContent'

interface TasksProps {
  title: string
  tasks: Task[]
}

export default function Tasks({ title, tasks }: TasksProps) {
  const { isInitialLoading } = useGlobalState()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full md:h-[80vh] mx-auto border flex flex-col bg-background/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={handleOpen} size="sm" className="gap-2 whitespace-nowrap">
            <PlusCircle className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow p-4">
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
              className="space-y-4 mx-auto"
            >
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery ? "No tasks found matching your search." : "No tasks found. Create a new task to get started."}
          </p>
        )}
      </ScrollArea>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Create New Task</DialogTitle>
          <CreateContent handleCloseDialog={handleClose} />
        </DialogContent>
      </Dialog>
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