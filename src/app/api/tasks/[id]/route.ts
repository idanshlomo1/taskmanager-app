import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {

        const { userId } = auth()
        const { id } = params

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const task = await prisma?.task.delete({
            where: {
                id,
            }
        })
        console.log("Task deleted: ", task)
        return NextResponse.json(task)

    } catch (error) {
        console.log("Error deleting task", error)
        return NextResponse.json({ error: "Error deleting task", status: 500 })
    }
}


// PUT (Update) Task by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = auth();
        const { id } = params;
        const { title, description, date, isCompleted, isImportant } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if (!title || !description || !date) {
            return NextResponse.json({ error: "Missing required fields", status: 400 });
        }

        const updatedTask = await prisma?.task.update({
            where: { id },
            data: {
                title,
                description,
                date,
                isCompleted,
                isImportant,
                updatedAt: new Date().toISOString(), // Update the timestamp
            },
        });

        console.log("Task updated: ", updatedTask);
        return NextResponse.json(updatedTask);

    } catch (error) {
        console.log("Error updating task", error);
        return NextResponse.json({ error: "Error updating task", status: 500 });
    }
}