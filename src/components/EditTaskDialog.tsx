"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Loader } from "lucide-react";
import { Task } from "@/lib/types";
import { DatePickerDemo } from "./DatePickerDemo";
import toast from "react-hot-toast";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface EditTaskDialogProps {
  task: Task;
  onUpdateTask: (task: Task) => Promise<void>;
  disabled?: boolean
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

export default function EditTaskDialog({ task, onUpdateTask ,disabled = false}: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title" && value.length <= MAX_TITLE_LENGTH) {
      setEditedTask((prev) => ({ ...prev, title: value }));
    } else if (name === "description" && value.length <= MAX_DESCRIPTION_LENGTH) {
      setEditedTask((prev) => ({ ...prev, description: value }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setEditedTask((prev) => ({ ...prev, date: date?.toISOString() || "" }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedTask.title || editedTask.title.length < 3) {
      toast.error("Title must be at least 3 characters long");
      return;
    }

    if (!editedTask.description) {
      toast.error("Description is required");
      return;
    }

    if (!editedTask.date) {
      toast.error("Date is required");
      return;
    }

    setIsLoading(true);
    await onUpdateTask(editedTask);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button disabled={disabled} variant="ghost" size="icon" className="hover:bg-primary/10">
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Task</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-primary">Title</Label>
            <Input
              className="text-primary bg-background"
              type="text"
              id="title"
              name="title"
              value={editedTask.title}
              placeholder="e.g., Clean my room"
              onChange={handleInputChange}
              required
            />
            <span className="text-sm text-muted-foreground">
              {editedTask.title.length}/{MAX_TITLE_LENGTH} characters
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-primary">Description</Label>
            <Textarea
              className="text-primary bg-background"
              id="description"
              name="description"
              value={editedTask.description}
              rows={4}
              placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
              onChange={handleInputChange}
            />
            <span className="text-sm text-muted-foreground">
              {editedTask.description.length}/{MAX_DESCRIPTION_LENGTH} characters
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-primary">Due date</Label>
            <DatePickerDemo
              date={editedTask.date ? new Date(editedTask.date) : undefined}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCompleted"
              checked={editedTask.isCompleted}
              onChange={handleCheckboxChange("isCompleted")}
              className="text-primary"
            />
            <Label htmlFor="isCompleted" className="text-primary">Completed Task</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isImportant"
              checked={editedTask.isImportant}
              onChange={handleCheckboxChange("isImportant")}
              className="text-primary"
            />
            <Label htmlFor="isImportant" className="text-primary">Important Task</Label>
          </div>
          <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading || editedTask.title.length > MAX_TITLE_LENGTH || editedTask.description.length > MAX_DESCRIPTION_LENGTH}>
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}