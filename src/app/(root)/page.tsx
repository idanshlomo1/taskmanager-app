"use client"
import { DatePickerDemo } from '@/components/DatePickerDemo'
import Tasks from '@/components/Tasks'
import { useGlobalState } from '@/lib/hooks'
import React from 'react'

const HomePage = () => {

    const { tasks } = useGlobalState();
    return (
        <main className='h-full pt-12 md:pt-0 '>
            <Tasks tasks={tasks} title='All tasks' />
        </main>
    )
}

export default HomePage
