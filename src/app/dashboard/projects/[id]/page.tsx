import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, CircleDashed } from "lucide-react";
import CreateTaskModal from "./CreateTaskModal";
import TaskStatusUpdate from "../../TaskStatusUpdate";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: { assignee: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      user: { select: { name: true } },
    },
  });

  if (!project) {
    notFound();
  }

  // If user is a Member, filter tasks to only show theirs, but they can see project details.
  // Wait, should members see all project tasks? Yes, but they can only edit their own.
  // Let's allow them to see all tasks in the project to collaborate.
  const tasks = project.tasks;

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  // Fetch users for assignment (only Admins need this)
  const users =
    session.user.role === "Admin"
      ? await prisma.user.findMany({ select: { id: true, name: true } })
      : [];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            {project.description && (
              <p className="text-slate-500 mt-2">{project.description}</p>
            )}
            <p className="text-sm text-slate-400 mt-1">
              Created by {project.user.name}
            </p>
          </div>
          {session.user.role === "Admin" && (
            <CreateTaskModal projectId={project.id} users={users} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <CircleDashed className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-700">To Do ({todoTasks.length})</h2>
          </div>
          <div className="space-y-4">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} session={session} />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-blue-800">
              In Progress ({inProgressTasks.length})
            </h2>
          </div>
          <div className="space-y-4">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} session={session} />
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-green-800">Done ({doneTasks.length})</h2>
          </div>
          <div className="space-y-4">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, session }: { task: any; session: any }) {
  const canUpdate =
    session.user.role === "Admin" || task.assigneeId === session.user.id;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
      <h3 className="font-medium text-slate-900">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
          {task.assignee ? task.assignee.name : "Unassigned"}
        </span>
        {canUpdate ? (
          <TaskStatusUpdate taskId={task.id} currentStatus={task.status} />
        ) : (
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
            {task.status.replace("_", " ")}
          </span>
        )}
      </div>
    </div>
  );
}
