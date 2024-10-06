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
        <div className="relative">
            <motion.div
                className="flex flex-col gap-4 pb-20 md:pb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary text-center md:text-left w-full md:w-auto">
                        All Tasks
                    </h1>
                    <Button 
                        onClick={openBottomSheet} 
                        className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90"
                    >
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

            {/* Fixed "New Task" button for small and medium screens */}
            <motion.div 
                className="fixed bottom-4 right-4 left-4 z-10 md:hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Button 
                    onClick={openBottomSheet} 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    size="lg"
                >
                    <Plus className="mr-2 h-5 w-5" /> New Task
                </Button>
            </motion.div>
        </div>
    )
}

export default HomePage