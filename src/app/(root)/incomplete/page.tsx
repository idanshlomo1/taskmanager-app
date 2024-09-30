"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '@/lib/hooks'
import Tasks from '@/components/Tasks'

const IncompletePage = () => {
    const { tasks } = useGlobalState()
    const incompleteTasks = tasks.filter((task) => !task.isCompleted)

    return (
        <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold tracking-tight">Incomplete Tasks</h1>
            <Tasks tasks={incompleteTasks} />
        </motion.div>
    )
}

export default IncompletePage