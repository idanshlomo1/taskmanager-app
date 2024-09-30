'use client'
import React, { ReactNode } from "react"
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Star, Clock, CheckCircle, Home, Calendar, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GuidePage() {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight">How to Use the App</h1>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6 pr-4">
          <GuideCard
            icon={<PlusCircle className="h-6 w-6 text-primary" />}
            title="Creating Tasks"
            description="Learn how to create and manage your tasks effectively."
            details={
              <ul className="list-disc pl-5 space-y-2">
                <li>Click on the &apos;New Task&apos; button in the top right corner of the main dashboard or calendar view.</li>
                <li>Fill in the task title, description, and set a due date using the date picker.</li>
                <li>Use the &apos;Important&apos; checkbox to mark high-priority tasks.</li>
                <li>Click &apos;Create&apos; to add the task to your list.</li>
                <li>Edit tasks anytime by clicking the edit icon next to each task.</li>
              </ul>
            }
          />
          <GuideCard
            icon={<Star className="h-6 w-6 text-orange-500" />}
            title="Important Tasks"
            description="Understand how to mark and prioritize important tasks."
            details={
              <ul className="list-disc pl-5 space-y-2">
                <li>Mark a task as important by checking the &apos;Important&apos; box when creating or editing a task.</li>
                <li>Important tasks are highlighted in orange for easy identification.</li>
                <li>View all important tasks by clicking on the &apos;Important&apos; link in the sidebar.</li>
                <li>Important tasks are prioritized in the &apos;All Tasks&apos; view and calendar.</li>
                <li>You can toggle the importance of a task at any time by editing it.</li>
              </ul>
            }
          />
          <GuideCard
            icon={<Clock className="h-6 w-6 text-primary" />}
            title="Task Scheduling"
            description="Discover how to set due dates and manage your task timeline."
            details={
              <ul className="list-disc pl-5 space-y-2">
                <li>Set a due date for each task using the date picker in the create/edit task form.</li>
                <li>View tasks on the calendar to get a clear overview of your schedule.</li>
                <li>Past due tasks are highlighted in red to draw attention.</li>
                <li>Use the calendar view to create tasks for specific dates by clicking on the desired day.</li>
                <li>Easily reschedule tasks by editing them and selecting a new due date.</li>
              </ul>
            }
          />
          <GuideCard
            icon={<CheckCircle className="h-6 w-6 text-green-500" />}
            title="Task Completion"
            description="Learn how to mark tasks as completed and update them."
            details={
              <ul className="list-disc pl-5 space-y-2">
                <li>Mark a task as completed by clicking the checkbox next to the task title.</li>
                <li>Completed tasks are visually distinguished with a strikethrough and green highlight.</li>
                <li>View all completed tasks by clicking on the &apos;Completed&apos; link in the sidebar.</li>
                <li>You can uncomplete a task by unchecking the completion box if needed.</li>
                <li>Completed tasks are moved to the bottom of the task list in the &apos;All Tasks&apos; view.</li>
              </ul>
            }
          />
          <GuideCard
            icon={<Home className="h-6 w-6 text-primary" />}
            title="Navigation"
            description="Understand how to use the app&apos;s navigation to manage your tasks efficiently."
            details={
              <ul className="list-disc pl-5 space-y-2">
                {[
                  { title: "All Tasks", icon: <Home size={20} />, link: "/", color: "text-primary" },
                  { title: "Calendar", icon: <Calendar size={20} />, link: "/calendar", color: "text-primary" },
                  { title: "Important", icon: <Star size={20} />, link: "/important", color: "text-orange-500" },
                  { title: "Completed", icon: <CheckCircle size={20} />, link: "/completed", color: "text-green-500" },
                  { title: "Incomplete", icon: <XCircle size={20} />, link: "/incomplete", color: "text-blue-500" },
                  { title: "Missed", icon: <AlertCircle size={20} />, link: "/missed", color: "text-red-500" },
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className={cn("flex items-center gap-2", item.color)}>
                      {item.icon}
                      {item.title}
                    </span>
                    : Navigate to {item.link} to view and manage {item.title.toLowerCase()}.
                  </li>
                ))}
              </ul>
            }
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
  details: ReactNode
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
        <div className="text-sm text-muted-foreground">{details}</div>
      </CardContent>
    </Card>
  )
}