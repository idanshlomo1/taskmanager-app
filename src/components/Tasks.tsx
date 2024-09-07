import React from 'react';
import TaskItem from './TaskItem';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import CreateContent from './CreateContent';
import { useGlobalState } from '@/lib/hooks';
import { Skeleton } from './ui/skeleton';
import { Task } from '@/lib/types';

interface Props {
    title: string;
    tasks: Task[];
}

const Tasks = ({ title, tasks }: Props) => {
    const { isInitialLoading } = useGlobalState(); // Get the new `isInitialLoading` state
    const skeletonArray = Array(3).fill(0); // Adjust the number of skeletons based on your grid

    return (
        <div className='w-full border rounded-lg p-8 flex flex-col h-[80vh]'>
            <div className='flex w-full gap-4 md:gap-0 justify-between items-center mb-8'>
                <h1 className='text-2xl font-bold'>
                    {title}
                </h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className='flex gap-2' variant={'default'}>
                            New Task <PlusCircle size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent >
                        <DialogTitle>Create Task</DialogTitle>
                        <CreateContent />
                        <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            </div>

            {!isInitialLoading ? (
                <>
                    <div className='flex-1 overflow-y-auto'>
                        {tasks.length > 0 ? (
                            <div className='grid grid-cols-1 gap-8'>
                                {tasks.map((task) => (
                                    <TaskItem key={task.id} task={{ ...task }} />
                                ))}
                            </div>
                        ) : (
                            <p className='text-muted-foreground'>{title} will be displayed here...</p>
                        )}
                    </div>
                </>
            ) : (
                <div className='flex-1 overflow-y-auto'>
                    <div className="grid grid-cols-1 gap-8">
                        {skeletonArray.map((_, index) => (
                            <Skeleton key={index} className="h-36 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
