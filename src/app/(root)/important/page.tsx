
"use client"
import Tasks from '@/components/Tasks';
import { useGlobalState } from '@/lib/hooks';
import React from 'react'

const ImpotantPage = () => {
    const { tasks } = useGlobalState();
    const completedTasks = tasks.filter((task) => task.isImportant);

    return (
        <main className='h-full pt-12 md:pt-0'>
            <Tasks tasks={completedTasks} title='Important Tasks' />
        </main>
    );
}

export default ImpotantPage
