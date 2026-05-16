import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Clock, CheckCircle2, CircleDashed, AlertCircle } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";
import CreateTaskModal from "./CreateTaskModal";
import TaskTable from "./TaskTable";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const isAdmin = session.user.role === "Admin";
  
  const whereClause: any = {};
  if (!isAdmin) {
    whereClause.assigneeId = session.user.id;
  }

  const [tasks, projects, users] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    isAdmin ? prisma.project.findMany({ select: { id: true, name: true } }) : Promise.resolve([]),
    isAdmin ? prisma.user.findMany({ select: { id: true, name: true } }) : Promise.resolve([])
  ]);

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");
  
  const today = startOfDay(new Date());
  const overdueTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.dueDate && isBefore(new Date(t.dueDate), today)
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm">Dashboard</h1>
          <p className="text-indigo-900/60 mt-2 font-medium">Overview of your tasks and progress.</p>
        </div>
        {isAdmin && <CreateTaskModal projects={projects} users={users} isAdmin={isAdmin} />}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600 shadow-inner">
            <CircleDashed className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900/60">To Do</p>
            <p className="text-2xl font-black text-indigo-950">{todoTasks.length}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-xl text-blue-600 shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900/60">In Progress</p>
            <p className="text-2xl font-black text-indigo-950">{inProgressTasks.length}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="p-4 bg-green-100 rounded-xl text-green-600 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900/60">Done</p>
            <p className="text-2xl font-black text-indigo-950">{doneTasks.length}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-pink-200 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="p-4 bg-red-100 rounded-xl text-red-600 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900/60">Overdue</p>
            <p className="text-2xl font-black text-indigo-950">{overdueTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/50 bg-white/30">
          <h2 className="text-2xl font-bold text-indigo-950">Your Tasks</h2>
        </div>
        <TaskTable tasks={tasks as any} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
