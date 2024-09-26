"use client"

import { DatePickerDemo } from '@/components/DatePickerDemo'
import Tasks from '@/components/Tasks'
import { useGlobalState } from '@/lib/hooks'
import React from 'react'
import { motion } from 'framer-motion'

const HomePage = () => {
    const { tasks } = useGlobalState();
    return (
        <motion.main 
            className='h-full pt-12 md:pt-0'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Tasks tasks={tasks} title='All tasks' />
        </motion.main>
    )
}

export default HomePage