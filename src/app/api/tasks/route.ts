import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Admins can see all tasks, Members can only see their own tasks
    // Or Members can see all tasks in a project but they are only "assignee" on some
    // Let's make it so members can see all tasks for projects, but the dashboard filters their own tasks.
    // For GET /api/tasks (dashboard), if no projectId is passed, return tasks assigned to the user (if member) or all tasks (if admin).
    if (!projectId && session.user.role !== "Admin") {
      whereClause.assigneeId = session.user.id;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { message: "Only Admins can create tasks" },
        { status: 403 }
      );
    }

    const { title, description, status, priority, dueDate, projectId, assigneeId } =
      await req.json();

    if (!title || !projectId) {
      return NextResponse.json(
        { message: "Title and Project ID are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        priority: priority || "Medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
