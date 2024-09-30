'use client'
import React, { ReactNode } from "react"
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Star, Clock, CheckCircle } from "lucide-react"

export default function GuidePage() {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight">How to Use the App</h1>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="grid gap-6 pr-4">
          <GuideCard
            icon={<PlusCircle className="h-6 w-6 text-green-500" />}
            title="Creating Tasks"
            description="Learn how to create and manage your tasks effectively."
            details="To create a task, click on the 'New Task' button, fill in the necessary details like title, description, and due date, and then save it. You can also categorize tasks and assign priority levels."
          />
          <GuideCard
            icon={<Star className="h-6 w-6 text-yellow-500" />}
            title="Important Tasks"
            description="Understand how to mark and prioritize important tasks."
            details="Mark a task as important by clicking the star icon next to the task title. Important tasks are highlighted and will appear in the 'Important Tasks' section for better visibility."
          />
          <GuideCard
            icon={<Clock className="h-6 w-6 text-blue-500" />}
            title="Task Scheduling"
            description="Discover how to set due dates and manage your task timeline."
            details="You can set due dates for each task in the 'Add Task' or 'Edit Task' forms. Once a due date is set, tasks will appear on your calendar view, helping you manage deadlines effectively."
          />
          <GuideCard
            icon={<CheckCircle className="h-6 w-6 text-purple-500" />}
            title="Task Completion"
            description="Learn how to mark tasks as completed and update them."
            details="Once you've finished a task, mark it as completed by clicking the checkbox next to the task. You can also edit any task details by selecting the task, making your changes, and saving them. Keep track of your progress by reviewing completed tasks in the 'Completed Tasks' section."
          />
        </div>
      </ScrollArea>
    </motion.div>
  )
}

type GuideCardProps = {
  icon: ReactNode
  title: string
  description: string
  details: string
}

function GuideCard({ icon, title, description, details }: GuideCardProps) {
  return (
    <Card className="bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{details}</p>
      </CardContent>
    </Card>
  )
}