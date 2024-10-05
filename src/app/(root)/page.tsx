"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '@/lib/hooks'
import Tasks from '@/components/Tasks'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import BottomSheetTaskCreator from '@/components/BottomSheetTaskCreator'

const HomePage = () => {
    const { tasks } = useGlobalState()
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

    const openBottomSheet = () => setIsBottomSheetOpen(true)
    const closeBottomSheet = () => setIsBottomSheetOpen(false)



    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">All Tasks</h1>
                <Button onClick={openBottomSheet} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
            </div>

            <Tasks tasks={tasks} />

            <BottomSheetTaskCreator
                isOpen={isBottomSheetOpen}
                onClose={closeBottomSheet}
                initialDate={new Date()}
            />
        </motion.div>
    )
}

export default HomePage



