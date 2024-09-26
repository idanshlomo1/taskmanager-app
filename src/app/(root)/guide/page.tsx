import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle, Star, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  return (
    <main className="h-full pt-12 md:pt-0">
      <div className="h-[80vh] border flex flex-col bg-background/80 backdrop-blur-sm rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Guide</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
              </Button>
            </Link>
          </div>
        </div>
        <ScrollArea className="flex-grow p-6">
          <div className="grid gap-6 md:grid-cols-1">
            <GuideCard
              icon={<PlusCircle className="h-6 w-6 text-primary" />}
              title="Creating Tasks"
              description="Learn how to create and manage your tasks effectively."
              details="To create a task, go to the 'Tasks' section, click on 'Add Task', fill in the necessary details like title, description, and due date, and then save it. You can also categorize tasks and assign priority levels."
            />
            <GuideCard
              icon={<Star className="h-6 w-6 text-primary" />}
              title="Important Tasks"
              description="Understand how to mark and prioritize important tasks."
              details="Mark a task as important by clicking the star icon next to the task title. Important tasks are highlighted and will appear at the top of your task list for better visibility."
            />
            <GuideCard
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Task Scheduling"
              description="Discover how to set due dates and manage your task timeline."
              details="You can set due dates for each task in the 'Add Task' or 'Edit Task' forms. Once a due date is set, tasks will appear on your calendar view, helping you manage deadlines effectively."
            />
            <GuideCard
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              title="Task Completion"
              description="Learn how to mark tasks as completed and update them."
              details="Once you've finished a task, mark it as completed by clicking the checkbox next to the task. You can also edit any task details by selecting the task, making your changes, and saving them. Keep track of your progress by reviewing completed tasks regularly."
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
  details: string;
};

function GuideCard({ icon, title, description, details }: GuideCardProps) {
  return (
    <Card className="bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <div>
          <CardTitle className="text-primary">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{details}</p>
      </CardContent>
    </Card>
  );
}