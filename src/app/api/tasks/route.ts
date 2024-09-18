import prisma from "@/lib/connectToDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// POST (Create Task)
export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, date, isCompleted, isImportant } = await req.json();

        if (!title || !description || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (title.length < 3) {
            return NextResponse.json({ error: "Title must be at least 3 characters long" }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                date,
                isCompleted,
                isImportant,
                userId,
            },
        });

        return NextResponse.json(task);

    } catch (error) {
        console.log("ERROR CREATING TASK: ", error);
        return NextResponse.json({ error: "Error creating task" }, { status: 500 });
    }
}

// GET (Fetch Tasks)
export async function GET(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tasks = await prisma.task.findMany({
            where: { userId },
        });

        console.log("TASKS: ", tasks);
        return NextResponse.json(tasks);

    } catch (error) {
        console.log("Error getting tasks", error);
        return NextResponse.json({ error: "Error getting tasks" }, { status: 500 });
    }
}

// PUT (Update Task Completion Status)
export async function PUT(req: Request) {
    try {
        const { userId } = auth();
        const { isCompleted, id } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const task = await prisma.task.update({
            where: { id },
            data: { isCompleted: !isCompleted },
        });

        console.log("Task updated: ", task);
        return NextResponse.json(task);

    } catch (error) {
        console.log("Error updating task", error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
    }
}
