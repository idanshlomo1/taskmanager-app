"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader } from 'lucide-react'
import { Task } from '@/lib/types'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip' // Import tooltip components

interface DeleteTaskDialogProps {
  task: Task
  onDelete: () => Promise<void>
}

export default function DeleteTaskDialog({ task, onDelete }: DeleteTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    await onDelete()
    setIsLoading(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
