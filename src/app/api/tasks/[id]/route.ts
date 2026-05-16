import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await req.json();
    const { title, description, status, priority, dueDate, assigneeId, projectId } = body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Members can only update their own tasks' status. Admins can update anything.
    if (session.user.role !== "Admin") {
      if (task.assigneeId !== session.user.id) {
        return NextResponse.json(
          { message: "You can only update your own tasks" },
          { status: 403 }
        );
      }
      // Members can only update status
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(status && { status }),
        },
      });
      return NextResponse.json(updatedTask);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(projectId && { projectId }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "Admin") {
      return NextResponse.json({ message: "Only Admins can delete tasks" }, { status: 403 });
    }

    const { id: taskId } = await params;

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
