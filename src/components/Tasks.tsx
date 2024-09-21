"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
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

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <div className="w-full md:h-[80vh] mx-auto border flex flex-col bg-background rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <Button onClick={handleOpen} size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Task
        </Button>
      </div>


      <ScrollArea className="flex-grow p-4">
        {isInitialLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <TaskItemSkeleton key={index} />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4  mx-auto"
            >
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No tasks found. Create a new task to get started.
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