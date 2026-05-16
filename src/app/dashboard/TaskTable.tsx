"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import TaskStatusUpdate from "./TaskStatusUpdate";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  project: { name: string };
  assignee: { name: string } | null;
};

export default function TaskTable({ tasks, isAdmin }: { tasks: Task[], isAdmin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setLoading(`delete-${taskId}`);
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusColor = (status: string, dueDate: Date | null) => {
    if (status !== "DONE" && dueDate && new Date(dueDate) < new Date(new Date().setHours(0,0,0,0))) {
      return "bg-red-100 text-red-700 border-red-200"; // Overdue
    }
    switch (status) {
      case "TODO": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 border-blue-200";
      case "DONE": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/30 border-b border-white/50">
            <th className="p-4 font-bold text-indigo-950">Title</th>
            <th className="p-4 font-bold text-indigo-950">Project</th>
            <th className="p-4 font-bold text-indigo-950">Assignee</th>
            <th className="p-4 font-bold text-indigo-950">Priority</th>
            <th className="p-4 font-bold text-indigo-950">Due Date</th>
            <th className="p-4 font-bold text-indigo-950">Status</th>
            {isAdmin && <th className="p-4 font-bold text-indigo-950 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/40">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-indigo-900/60 font-medium">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="hover:bg-white/30 transition-colors group">
                <td className="p-4">
                  <p className="font-semibold text-indigo-950">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-indigo-900/60 mt-1 truncate max-w-xs">{task.description}</p>
                  )}
                </td>
                <td className="p-4 text-indigo-900/80 font-medium">{task.project.name}</td>
                <td className="p-4 text-indigo-900/80 font-medium">
                  {task.assignee ? task.assignee.name : "Unassigned"}
                </td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-4 text-indigo-900/80 font-medium">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.status, task.dueDate)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    <TaskStatusUpdate taskId={task.id} currentStatus={task.status} />
                  </div>
                </td>
                {isAdmin && (
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={loading === `delete-${task.id}`}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
