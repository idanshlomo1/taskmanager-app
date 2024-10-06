"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '@/lib/hooks'
import Tasks from '@/components/Tasks'

const CompletedPage = () => {
    const { tasks } = useGlobalState()
    const completedTasks = tasks.filter((task) => task.isCompleted)

    return (
        <motion.div 
            className="space-y-4 pb-20 md:pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary text-center md:text-left w-full md:w-auto">
                    Completed Tasks
                </h1>
            </div>
            <Tasks tasks={completedTasks} />
        </motion.div>
    )
}

export default CompletedPage