"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/lib/types"
import { Loader, Star, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { isAfter, startOfDay } from "date-fns"
import toast from "react-hot-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import DatePickerDemo from "./DatePickerDemo"

interface BottomSheetTaskEditorProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdateTask: (task: Task) => Promise<void>
}

const MAX_TITLE_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 500

export default function BottomSheetTaskEditor({ task, isOpen, onClose, onUpdateTask }: BottomSheetTaskEditorProps) {
  const [editedTask, setEditedTask] = useState(task)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (field === "title" && value.length <= MAX_TITLE_LENGTH) {
      setEditedTask(prev => ({ ...prev, title: value }))
    } else if (field === "description" && value.length <= MAX_DESCRIPTION_LENGTH) {
      setEditedTask(prev => ({ ...prev, description: value }))
    }
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    setEditedTask(prev => ({ ...prev, date: selectedDate ? selectedDate.toISOString() : "" }))
  }

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setEditedTask(prev => ({ ...prev, [field]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editedTask.title || editedTask.title.length < 3) {
      toast.error("Title must be at least 3 characters long")
      return
    }

    if (!editedTask.description) {
      toast.error("Description is required")
      return
    }

    if (!editedTask.date) {
      toast.error("Date is required")
      return
    }

    setIsUpdating(true)

    try {
      await onUpdateTask(editedTask)
      toast.success("Task updated successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setIsUpdating(false)
    }
  }

  const getTaskColor = () => {
    if (editedTask.isCompleted) return 'bg-green-500'
    if (editedTask.date && isAfter(startOfDay(new Date()), startOfDay(new Date(editedTask.date)))) return 'bg-red-500'
    if (editedTask.isImportant) return 'bg-orange-500'
    return 'bg-blue-500'
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="sm:max-w-2xl rounded-lg sm:mx-auto">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Make changes to your task</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className={cn("w-2 self-stretch rounded-l-md", getTaskColor())} />
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedTask.title}
                  onChange={handleChange("title")}
                  placeholder="e.g., Clean my room"
                  maxLength={MAX_TITLE_LENGTH}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {editedTask.title.length}/{MAX_TITLE_LENGTH} characters
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTask.description}
                  onChange={handleChange("description")}
                  placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {editedTask.description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </p>
              </div>
              <div>
                <Label>Due date</Label>
                <DatePickerDemo date={editedTask.date ? new Date(editedTask.date) : undefined} onDateChange={handleDateChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCompleted"
                  checked={editedTask.isCompleted}
                  onCheckedChange={handleCheckboxChange("isCompleted")}
                />
                <Label htmlFor="isCompleted" className="flex items-center space-x-2">
                  {editedTask.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Completed Task</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isImportant"
                  checked={editedTask.isImportant}
                  onCheckedChange={handleCheckboxChange("isImportant")}
                />
                <Label htmlFor="isImportant" className="flex items-center space-x-2">
                  <Star className={cn("h-4 w-4", editedTask.isImportant ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
                  <span>Important Task</span>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdating || editedTask.title.length > MAX_TITLE_LENGTH || editedTask.description.length > MAX_DESCRIPTION_LENGTH}
              >
                {isUpdating ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Task
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}