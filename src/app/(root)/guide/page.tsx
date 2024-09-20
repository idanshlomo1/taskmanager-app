import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  return (
    <main className="h-full pt-12 md:pt-0">
      <div className="h-[80vh]  border flex flex-col bg-background rounded-lg ">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Guide</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
              </Button>
            </Link>
          </div>
        </div>
        <ScrollArea className="flex-grow p-6">
          <div className="grid gap-6 md:grid-cols-1">
            <GuideCard
              icon={<CheckCircle className="h-6 w-6 text-green-500" />}
              title="Creating Tasks"
              description="Learn how to create and manage your tasks effectively."
              details="To create a task, go to the 'Tasks' section, click on 'Add Task', fill in the necessary details like title, description, and due date, and then save it. You can also categorize tasks and assign priority levels."
            />
            <GuideCard
              icon={<Star className="h-6 w-6 text-yellow-500" />}
              title="Important Tasks"
              description="Understand how to mark and prioritize important tasks."
              details="Mark a task as important by clicking the star icon next to the task title. Important tasks are highlighted and will appear at the top of your task list for better visibility."
            />
            <GuideCard
              icon={<Clock className="h-6 w-6 text-blue-500" />}
              title="Task Scheduling"
              description="Discover how to set due dates and manage your task timeline."
              details="You can set due dates for each task in the 'Add Task' or 'Edit Task' forms. Once a due date is set, tasks will appear on your calendar view, helping you manage deadlines effectively."
            />
            <GuideCard
              icon={<BookOpen className="h-6 w-6 text-purple-500" />}
              title="Best Practices"
              description="Explore tips and tricks for optimal task management."
              details="Organize tasks by category, prioritize them based on importance and deadlines, and review your task list daily to stay on track. Use tags to quickly filter tasks and stay productive."
            />
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

type GuideCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;  // New prop for detailed content
};

function GuideCard({ icon, title, description, details }: GuideCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{details}</p>
      </CardContent>
    </Card>
  );
}
