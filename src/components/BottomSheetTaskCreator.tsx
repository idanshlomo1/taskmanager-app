"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerDemo } from "./DatePickerDemo"
import { useGlobalUpdate } from "@/lib/hooks"
import { Task } from "@/lib/types"
import { Loader, Star, CheckCircle2, Circle, X } from "lucide-react"
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

interface BottomSheetTaskCreatorProps {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date
}

const MAX_TITLE_LENGTH = 50
const MAX_DESCRIPTION_LENGTH = 500

export default function BottomSheetTaskCreator({ isOpen, onClose, initialDate }: BottomSheetTaskCreatorProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date())
  const [isCompleted, setIsCompleted] = useState(false)
  const [isImportant, setIsImportant] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { createTask } = useGlobalUpdate()

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    if (field === "title" && value.length <= MAX_TITLE_LENGTH) {
      setTitle(value)
    } else if (field === "description" && value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
    }
  }

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
  }

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    if (field === "isCompleted") {
      setIsCompleted(checked)
    } else if (field === "isImportant") {
      setIsImportant(checked)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || title.length < 3) {
      toast.error("Title must be at least 3 characters long")
      return
    }

    if (!description) {
      toast.error("Description is required")
      return
    }

    if (!date) {
      toast.error("Date is required")
      return
    }

    setIsCreating(true)

    const formattedDate = date ? date.toISOString() : ""
    const newTask: Task = {
      id: "none",
      title,
      description,
      date: formattedDate,
      isCompleted,
      isImportant,
      createdAt: "none",
      updatedAt: "none",
      userId: "none",
    }

    if (createTask) {
      await createTask(newTask)
    }

    setIsCreating(false)
    onClose()
  }

  const getTaskColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (date && isAfter(startOfDay(new Date()), startOfDay(date))) return 'bg-red-500'
    if (isImportant) return 'bg-orange-500'
    return 'bg-blue-500'
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="sm:max-w-2xl rounded-lg sm:mx-auto">
        <SheetHeader>
          <SheetTitle>Create New Task</SheetTitle>
          <SheetDescription>Add a new task to your list</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className={cn("w-2 self-stretch rounded-l-md", getTaskColor())} />
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleChange("title")}
                  placeholder="e.g., Clean my room"
                  maxLength={MAX_TITLE_LENGTH}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {title.length}/{MAX_TITLE_LENGTH} characters
                </p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleChange("description")}
                  placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </p>
              </div>
              <div>
                <Label>Due date</Label>
                <DatePickerDemo date={date} onDateChange={handleDateChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCompleted"
                  checked={isCompleted}
                  onCheckedChange={handleCheckboxChange("isCompleted")}
                />
                <Label htmlFor="isCompleted" className="flex items-center space-x-2">
                  {isCompleted ? (
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
                  checked={isImportant}
                  onCheckedChange={handleCheckboxChange("isImportant")}
                />
                <Label htmlFor="isImportant" className="flex items-center space-x-2">
                  <Star className={cn("h-4 w-4", isImportant ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
                  <span>Important Task</span>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isCreating || title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH}
              >
                {isCreating ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Task
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}