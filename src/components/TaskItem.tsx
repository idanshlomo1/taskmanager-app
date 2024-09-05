import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { formatDate } from '@/lib/convertions';
import { CheckIcon, Pencil, Trash, XIcon, Loader as Spinner } from 'lucide-react';
import { useGlobalUpdate } from '@/lib/hooks';
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Task } from '@/lib/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DatePickerDemo } from './DatePickerDemo';

interface Props {
    task: Task;
}

const TaskItem = ({ task }: Props) => {
    const { id, title, description, date, isCompleted, isImportant } = task;
    const [isButtonLoading, setIsButtonLoading] = useState(false); // Local loading state for the completion toggle
    const [isDeletingLoading, setIsDeletingLoading] = useState(false); // Local state for deletion
    const [isImportantLoading, setIsImportantLoading] = useState(false); // Local loading state for the important toggle
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Dialog open state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isEditingLoading, setIsEditingLoading] = useState(false);

    const { deleteTask, updateTask } = useGlobalUpdate();

    // Edit form states
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);
    const [editedDate, setEditedDate] = useState<Date | undefined>(new Date(date));
    const [editedIsCompleted, setEditedIsCompleted] = useState(isCompleted);
    const [editedIsImportant, setEditedIsImportant] = useState(isImportant);

    // Effect to sync form values when the dialog is opened
    useEffect(() => {
        if (isEditDialogOpen) {
            setEditedTitle(title);
            setEditedDescription(description);
            setEditedDate(new Date(date));
            setEditedIsCompleted(isCompleted);
            setEditedIsImportant(isImportant);
        }
    }, [isEditDialogOpen, title, description, date, isCompleted, isImportant]);

    const handleDelete = async () => {
        setIsDeletingLoading(true);
        await deleteTask(id);
        setIsDeletingLoading(false);
        setIsDeleteDialogOpen(false);
    };

    const handleToggleCompleted = async () => {
        setIsButtonLoading(true);
        await updateTask({ ...task, isCompleted: !isCompleted });
        setIsButtonLoading(false);
    };

    const handleToggleImportant = async () => {
        setIsImportantLoading(true);
        await updateTask({ ...task, isImportant: !isImportant });
        setIsImportantLoading(false);
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (field === "editedTitle") {
            setEditedTitle(value);
        } else if (field === "editedDescription") {
            setEditedDescription(value);
        }
    };

    const handleDateChange = (selectedDate: Date | undefined) => {
        setEditedDate(selectedDate);
    };

    const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (field === "editedIsCompleted") {
            setEditedIsCompleted(checked);
        } else if (field === "editedIsImportant") {
            setEditedIsImportant(checked);
        }
    };

    const handleUpdateTask = async (e: any) => {
        e.preventDefault();
        setIsEditingLoading(true);

        const formattedDate = editedDate ? editedDate.toISOString() : ""; // Convert date to ISO string format

        await updateTask({
            id: task.id,
            title: editedTitle,
            description: editedDescription,
            date: formattedDate,
            isCompleted: editedIsCompleted,
            isImportant: editedIsImportant,
            createdAt: task.createdAt,
            updatedAt: new Date().toISOString(),
            userId: task.userId,
        });

        setIsEditingLoading(false);
        setIsEditDialogOpen(false);
    };

    return (
        <div className={`border  p-4 shadow-sm rounded-lg flex flex-col justify-between h-full ${isDeletingLoading ? 'animate-pulse bg-red-400/20' : ''}`}> {/* Add animate-pulse if deleting */}
            <div className='flex justify-between'>
                <h1 className='font-medium text-lg items-center justify-center flex gap-2'>
                    {title}
                </h1>
                <p className='text-sm'>{formatDate(date)}</p>
            </div>
            <p className='mt-2 mb-4'>{description}</p>

            <div className='flex justify-between items-end'>
                <div onClick={handleToggleCompleted}>
                    {isCompleted ? (
                        <Button
                            className='text-green-500 hover:text-green-500 flex w-44 gap-2'
                            size={'sm'}
                            variant={'secondary'}
                            disabled={isButtonLoading} // Disable button when loading completion
                        >
                            Completed {isButtonLoading ? <Spinner size={15} className="animate-spin" /> : <CheckIcon size={15} />}
                        </Button>
                    ) : (
                        <Button
                            className='text-blue-500 hover:text-blue-500 flex w-44 gap-2'
                            size={'sm'}
                            variant={'secondary'}
                            disabled={isButtonLoading} // Disable button when loading completion
                        >
                            Incomplete {isButtonLoading ? <Spinner size={15} className="animate-spin" /> : <XIcon size={15} />}
                        </Button>
                    )}
                </div>
                <div className='flex gap-2'>
                    {/* Star button for toggling isImportant */}
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        className='text-muted-foreground '
                        onClick={handleToggleImportant}
                        disabled={isImportantLoading} // Disable star button when loading important
                    >
                        {isImportantLoading ? (
                            <Spinner size={15} className="animate-spin" />
                        ) : isImportant ? (
                            <IoIosStar size={15} />
                        ) : (
                            <IoIosStarOutline size={15} />
                        )}
                    </Button>


                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size={'sm'} variant={'ghost'} className='text-muted-foreground'>
                                <Pencil size={15} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Edit Task</DialogTitle>
                            <form className="flex flex-col gap-4" onSubmit={handleUpdateTask}>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="editedTitle">Title</Label>
                                    <Input
                                        className="text-primary"
                                        type="text"
                                        id="editedTitle"
                                        value={editedTitle}
                                        placeholder="e.g., Clean my room"
                                        onChange={handleChange("editedTitle")}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="editedDescription">Description</Label>
                                    <Textarea
                                        className="text-primary"
                                        id="editedDescription"
                                        value={editedDescription}
                                        rows={4}
                                        placeholder="e.g., Clean my room thoroughly including dusting and vacuuming"
                                        onChange={handleChange("editedDescription")}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <DatePickerDemo date={editedDate} onDateChange={handleDateChange} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="editedIsCompleted"
                                        checked={editedIsCompleted}
                                        onChange={handleCheckboxChange("editedIsCompleted")}
                                    />
                                    <Label htmlFor="editedIsCompleted">Toggle Completed</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="editedIsImportant"
                                        checked={editedIsImportant}
                                        onChange={handleCheckboxChange("editedIsImportant")}
                                    />
                                    <Label htmlFor="editedIsImportant">Toggle Important</Label>
                                </div>
                                <Button className="mt-4" disabled={isEditingLoading}>
                                    {isEditingLoading ? <Spinner size={20} className="animate-spin" /> : 'Save Changes'}
                                </Button>
                            </form>
                            <DialogFooter>
                                <Button className='w-full' variant="secondary" onClick={() => setIsEditDialogOpen(false)} disabled={isEditingLoading}>
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Dialog trigger for delete confirmation */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size={'sm'}
                                variant={'ghost'}
                                className='text-muted-foreground'
                                disabled={isDeletingLoading} // Disable delete button when loading or deleting
                            >
                                <Trash size={15} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                            <p className="text-sm text-muted-foreground mb-4">Task: {title}</p> {/* Display the task title */}

                            <Button variant="destructive" onClick={handleDelete} disabled={isDeletingLoading}>
                                {isDeletingLoading ? <Spinner size={15} className="animate-spin" /> : 'Delete'}
                            </Button>
                            <DialogFooter>

                                <Button className='w-full' variant="secondary" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingLoading}>
                                    Cancel
                                </Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
