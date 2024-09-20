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
import { Loader as Spinner } from "lucide-react"; // Import the loader (Spinner)

interface CreateContentProps {
    handleCloseDialog: () => void; // Add the close function as a prop
}


const CreateContent = ({ handleCloseDialog }: CreateContentProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isCompleted, setIsCompleted] = useState(false);
    const [isImportant, setIsImportant] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // Local loading state

    const { createTask } = useGlobalUpdate();

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (field === "title") {
            setTitle(value);
        } else if (field === "description") {
            setDescription(value);
        }
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
    };

    const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (field === "isCompleted") {
            setIsCompleted(checked);
        } else if (field === "isImportant") {
            setIsImportant(checked);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Client-side validation
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

        setIsCreating(true); // Set loading state to true

        const formattedDate = date ? date.toISOString() : ""; // Convert date to ISO string format
        const newTask: Task = {
            id: "none", // This will be automatically generated by Prisma
            title,
            description,
            date: formattedDate,
            isCompleted,
            isImportant,
            createdAt: "none", // This will be automatically generated by Prisma
            updatedAt: "none", // This will be automatically generated by Prisma
            userId: "none", // This will be automatically generated by Prisma
        };

        if (createTask) {
            await createTask(newTask); // Use the createTask method from the context
        }

        setIsCreating(false); // Set loading state to false
        handleCloseDialog()

    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    className="text-primary"
                    type="text"
                    id="title"
                    value={title}
                    placeholder="e.g., Clean my room"
                    onChange={handleChange("title")}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    className="text-primary"
                    id="description"
                    value={description}
                    rows={4}
                    placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
                    onChange={handleChange("description")}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="date">Due date</Label>
                <DatePickerDemo date={date} onDateChange={handleDateChange} />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isCompleted"
                    checked={isCompleted}
                    onChange={handleCheckboxChange("isCompleted")}
                />
                <Label htmlFor="isCompleted">Completed Task</Label>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isImportant"
                    checked={isImportant}
                    onChange={handleCheckboxChange("isImportant")}
                />
                <Label htmlFor="isImportant">Important Task</Label>
            </div>
            <Button className="mt-4" disabled={isCreating}>
                {isCreating ? (
                    <Spinner size={20} className="animate-spin" /> // Reuse the Spinner here
                ) : (
                    "Create"
                )}
            </Button>
        </form>
    );
};

export default CreateContent;
