import { Task } from '@/lib/types';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { formatDate } from '@/lib/convertions';
import { CheckIcon, Pencil, Star, Trash, XIcon, Loader as Spinner, StarOffIcon, StarHalf, StarIcon } from 'lucide-react';
import { useGlobalUpdate } from '@/lib/hooks';

interface Props {
    task: Task;
}

const TaskItem = ({ task }: Props) => {
    const { id, title, description, date, isCompleted, isImportant } = task;
    const [isButtonLoading, setIsButtonLoading] = useState(false); // Local loading state for the completion toggle
    const [isDeleting, setIsDeleting] = useState(false); // Local state for deletion
    const [isImportantLoading, setIsImportantLoading] = useState(false); // Local loading state for the important toggle
    const { deleteTask, updateTask } = useGlobalUpdate();

    const handleDelete = async (id: string) => {
        setIsDeleting(true); // Start delete animation
        await deleteTask(id);
        setIsDeleting(false); // Reset deletion state
    };

    const handleToggleCompleted = async () => {
        setIsButtonLoading(true); // Set local loading state for completion toggle
        await updateTask({ ...task, isCompleted: !isCompleted }); // Update task with toggled isCompleted
        setIsButtonLoading(false); // Reset local loading state
    };

    const handleToggleImportant = async () => {
        setIsImportantLoading(true); // Set local loading state for important toggle
        await updateTask({ ...task, isImportant: !isImportant }); // Update task with toggled isImportant
        setIsImportantLoading(false); // Reset local loading state
    };

    return (
        <div className={`border bg-slate-400/20 p-4 shadow-sm rounded-lg flex flex-col justify-between h-full ${isDeleting ? 'animate-pulse bg-red-400/20' : ''}`}> {/* Add animate-pulse if deleting */}
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
                            className='text-green-500 hover:text-green-500 flex gap-2'
                            size={'sm'}
                            variant={'outline'}
                            disabled={isButtonLoading} // Disable button when loading completion
                        >
                            Completed {isButtonLoading ? <Spinner size={15} className="animate-spin" /> : <CheckIcon size={15} />}
                        </Button>
                    ) : (
                        <Button
                            className='text-blue-500 hover:text-blue-500 flex gap-2'
                            size={'sm'}
                            variant={'outline'}
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
                        className='text-muted-foreground'
                        onClick={handleToggleImportant}
                        disabled={isImportantLoading} // Disable star button when loading important
                    >
                        {isImportantLoading ? (
                            <Spinner size={15} className="animate-spin" />
                        ) : isImportant ? (
                            <Star size={15} className="text-yellow-500" />
                        ) : (
                            <Star size={15} className="text-muted-foreground" />
                        )}
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        className='text-muted-foreground'
                    >
                        <Pencil size={15} />
                    </Button>
                    <Button
                        onClick={() => handleDelete(id)}
                        size={'sm'}
                        variant={'ghost'}
                        className='text-muted-foreground'
                        disabled={isDeleting} // Disable delete button when loading or deleting
                    >
                        {isDeleting ? <Spinner size={15} className="animate-spin" /> : <Trash size={15} />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
