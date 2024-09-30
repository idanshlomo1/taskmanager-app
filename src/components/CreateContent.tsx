"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { DatePickerDemo } from "./DatePickerDemo";
import toast from "react-hot-toast";
import { useGlobalUpdate } from "@/lib/hooks";
import { Task } from "@/lib/types";
import { Loader, Star, CheckCircle2, Circle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { isAfter, startOfDay } from "date-fns";

interface CreateContentProps {
  handleCloseDialog: () => void;
  initialDate?: Date;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

const CreateContent = ({ handleCloseDialog, initialDate }: CreateContentProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { createTask } = useGlobalUpdate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (field === "title" && value.length <= MAX_TITLE_LENGTH) {
      setTitle(value);
    } else if (field === "description" && value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    if (field === "isCompleted") {
      setIsCompleted(checked);
    } else if (field === "isImportant") {
      setIsImportant(checked);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || title.length < 3) {
      toast.error("Title must be at least 3 characters long");
      return;
    }

    if (!description) {
      toast.error("Description is required");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    setIsCreating(true);

    const formattedDate = date ? date.toISOString() : "";
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
    };

    if (createTask) {
      await createTask(newTask);
    }

    setIsCreating(false);
    handleCloseDialog();
  };

  const getTaskColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (date && isAfter(startOfDay(new Date()), startOfDay(date))) return 'bg-red-500';
    if (isImportant) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <form className="flex gap-4" onSubmit={handleSubmit}>
      <div className={cn("w-2 self-stretch rounded-l-md", getTaskColor())} />
      <div className="flex-1 space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-primary">Title</Label>
          <Input
            className="text-primary bg-background"
            type="text"
            id="title"
            value={title}
            placeholder="e.g., Clean my room"
            onChange={handleChange("title")}
          />
          <span className="text-sm text-muted-foreground">
            {title.length}/{MAX_TITLE_LENGTH} characters
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-primary">Description</Label>
          <Textarea
            className="text-primary bg-background"
            id="description"
            value={description}
            rows={4}
            placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
            onChange={handleChange("description")}
          />
          <span className="text-sm text-muted-foreground">
            {description.length}/{MAX_DESCRIPTION_LENGTH} characters
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="text-primary">Due date</Label>
          <DatePickerDemo date={date} onDateChange={handleDateChange} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isCompleted"
            checked={isCompleted}
            onCheckedChange={handleCheckboxChange("isCompleted")}
          />
          <Label htmlFor="isCompleted" className="text-primary flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            Completed Task
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isImportant"
            checked={isImportant}
            onCheckedChange={handleCheckboxChange("isImportant")}
          />
          <Label htmlFor="isImportant" className="text-primary flex items-center gap-2">
            <Star className={cn("h-4 w-4", isImportant ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
            Important Task
          </Label>
        </div>
        <Button 
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 w-full" 
          disabled={isCreating || title.length > MAX_TITLE_LENGTH || description.length > MAX_DESCRIPTION_LENGTH}
        >
          {isCreating ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateContent;