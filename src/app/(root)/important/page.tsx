"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '@/lib/hooks'
import Tasks from '@/components/Tasks'

const ImportantPage = () => {
    const { tasks } = useGlobalState()
    const importantTasks = tasks.filter((task) => task.isImportant)

    return (
        <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold tracking-tight">Important Tasks</h1>
            <Tasks tasks={importantTasks} />
        </motion.div>
    )
}

export default ImportantPage