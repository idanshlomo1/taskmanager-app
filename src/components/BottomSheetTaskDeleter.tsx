"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader } from 'lucide-react'
import { Task } from '@/lib/types'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface BottomSheetTaskDeleterProps {
  task: Task
  onDelete: (id: string) => Promise<void>
  disabled?: boolean
}

export default function BottomSheetTaskDeleter({ task, onDelete, disabled = false }: BottomSheetTaskDeleterProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    setIsOpen(false)
    
    // Delay the actual deletion to allow time for the exit animation
    setTimeout(async () => {
      await onDelete(task.id)
      setIsLoading(false)
    }, 300) // Adjust this delay to match your animation duration
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button disabled={disabled} variant="ghost" size="icon" className="hover:bg-primary/10">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent side="bottom" className="sm:max-w-2xl rounded-lg sm:mx-auto">
        <SheetHeader>
          <SheetTitle>Delete Task</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold text-primary">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="text-primary border-primary hover:bg-primary/10">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}