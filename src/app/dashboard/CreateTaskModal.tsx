"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

type Project = { id: string; name: string };
type User = { id: string; name: string };

export default function CreateTaskModal({ projects, users, isAdmin }: { projects: Project[], users: User[], isAdmin: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const projectId = formData.get("projectId") as string;
    const assigneeId = formData.get("assigneeId") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          projectId,
          assigneeId: assigneeId || undefined,
          priority,
          status,
          dueDate: dueDate || undefined,
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create task");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2.5 rounded-full hover:from-pink-400 hover:to-purple-500 hover:scale-105 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all duration-300 font-bold tracking-wide shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md border border-white/60 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-950">Add New Task</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-indigo-900 mb-1">
                  Task Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  autoFocus
                  className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                  placeholder="e.g. Design Landing Page"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-900 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none bg-white"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-indigo-900 mb-1">
                    Project
                  </label>
                  <select
                    name="projectId"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-indigo-900 mb-1">
                    Assign To
                  </label>
                  <select
                    name="assigneeId"
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-indigo-900 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    defaultValue="Medium"
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-indigo-900 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue="TODO"
                    className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-indigo-900 mb-1">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-indigo-100 text-indigo-900 rounded-lg hover:bg-indigo-200 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-bold disabled:opacity-70 shadow-md"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
