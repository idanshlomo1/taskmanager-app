"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGlobalState } from '@/lib/hooks'
import Tasks from '@/components/Tasks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Plus, PlusCircle } from 'lucide-react'
import CreateContent from '@/components/CreateContent'

const HomePage = () => {
    const { tasks } = useGlobalState()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold tracking-tight">All Tasks</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>


            </div>

            <Tasks tasks={tasks} />

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogTitle>Create New Task</DialogTitle>
                    <CreateContent handleCloseDialog={() => setIsCreateDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}

export default HomePage