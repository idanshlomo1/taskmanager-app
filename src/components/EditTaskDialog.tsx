"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Loader as Spinner } from "lucide-react"; // Reusing Spinner here for consistency
import { Task } from "@/lib/types";
import { DatePickerDemo } from "./DatePickerDemo";
import toast from "react-hot-toast"; // Import toast for error messages

interface EditTaskDialogProps {
  task: Task;
  onUpdateTask: (task: Task) => Promise<void>;
}

export default function EditTaskDialog({ task, onUpdateTask }: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setEditedTask((prev) => ({ ...prev, date: date?.toISOString() || "" }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
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
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              className="text-primary"
              type="text"
              id="title"
              name="title"
              value={editedTask.title}
              placeholder="e.g., Clean my room"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="text-primary"
              id="description"
              name="description"
              value={editedTask.description}
              rows={4}
              placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label> {/* Consistent with CreateContent */}
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
            />
            <Label htmlFor="isCompleted">Toggle Completed</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isImportant"
              checked={editedTask.isImportant}
              onChange={handleCheckboxChange("isImportant")}
            />
            <Label htmlFor="isImportant">Toggle Important</Label>
          </div>
          <Button className="mt-4" disabled={isLoading}>
            {isLoading ? (
              <Spinner size={20} className="animate-spin" /> // Reuse the Spinner here
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
