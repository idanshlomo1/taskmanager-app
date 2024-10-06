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
      className="container mx-auto px-4 py-8 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
          How to Use the App
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master your task management with our comprehensive guide
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <GuideCard
          icon={<PlusCircle className="h-8 w-8 text-primary" />}
          title="Creating Tasks"
          description="Learn how to create and manage your tasks effectively."
          details={
            <ul className="list-disc pl-5 space-y-2">
              <li>Click on the &apos;New Task&apos; button in the top right corner.</li>
              <li>Fill in the task details and set a due date.</li>
              <li>Use the &apos;Important&apos; checkbox for high-priority tasks.</li>
              <li>Click &apos;Create&apos; to add the task to your list.</li>
              <li>Edit tasks anytime by clicking the edit icon.</li>
            </ul>
          }
        />
        <GuideCard
          icon={<Star className="h-8 w-8 text-yellow-500" />}
          title="Important Tasks"
          description="Understand how to mark and prioritize important tasks."
          details={
            <ul className="list-disc pl-5 space-y-2">
              <li>Mark tasks as important when creating or editing.</li>
              <li>Important tasks are highlighted in yellow.</li>
              <li>View all important tasks in the sidebar.</li>
              <li>Important tasks are prioritized in all views.</li>
              <li>Toggle importance anytime by editing the task.</li>
            </ul>
          }
        />
        <GuideCard
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          title="Task Scheduling"
          description="Discover how to set due dates and manage your task timeline."
          details={
            <ul className="list-disc pl-5 space-y-2">
              <li>Set due dates using the date picker.</li>
              <li>View tasks on the calendar for a schedule overview.</li>
              <li>Past due tasks are highlighted in red.</li>
              <li>Create tasks for specific dates in calendar view.</li>
              <li>Easily reschedule by editing and selecting new dates.</li>
            </ul>
          }
        />
        <GuideCard
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
          title="Task Completion"
          description="Learn how to mark tasks as completed and update them."
          details={
            <ul className="list-disc pl-5 space-y-2">
              <li>Mark tasks complete by clicking the checkbox.</li>
              <li>Completed tasks have a strikethrough and green highlight.</li>
              <li>View all completed tasks in the sidebar.</li>
              <li>Uncomplete tasks by unchecking if needed.</li>
              <li>Completed tasks move to the bottom of lists.</li>
            </ul>
          }
        />
        <GuideCard
          icon={<Home className="h-8 w-8 text-primary" />}
          title="Navigation"
          description="Understand how to use the app's navigation efficiently."
          details={
            <ul className="list-disc pl-5 space-y-2">
              {[
                { title: "All Tasks", icon: <Home size={20} />, link: "/", color: "text-primary" },
                { title: "Calendar", icon: <Calendar size={20} />, link: "/calendar", color: "text-primary" },
                { title: "Important", icon: <Star size={20} />, link: "/important", color: "text-yellow-500" },
                { title: "Completed", icon: <CheckCircle size={20} />, link: "/completed", color: "text-green-500" },
                { title: "Incomplete", icon: <XCircle size={20} />, link: "/incomplete", color: "text-blue-500" },
                { title: "Missed", icon: <AlertCircle size={20} />, link: "/missed", color: "text-red-500" },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className={cn("flex items-center gap-2", item.color)}>
                    {item.icon}
                    {item.title}
                  </span>
                  : {item.link}
                </li>
              ))}
            </ul>
          }
        />
      </div>
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
    <Card className="bg-background/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-col items-center text-center gap-4">
        <div className="p-3 rounded-full bg-primary/10">
          {icon}
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold mb-2">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">{details}</div>
      </CardContent>
    </Card>
  )
}