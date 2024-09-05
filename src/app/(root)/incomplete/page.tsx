"use client"
import Tasks from '@/components/Tasks';
import { useGlobalState } from '@/lib/hooks';
import React from 'react'

const IncompletePage = () => {
    const { tasks } = useGlobalState();
    const completedTasks = tasks.filter((task) => !task.isCompleted);

    return (
        <main className='h-full pt-12 md:pt-0'>
            <Tasks tasks={completedTasks} title='Incomplete Tasks' />

        </main>
    );
}

export default IncompletePage
