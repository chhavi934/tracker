"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TaskStatusUpdate({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className={`appearance-none font-medium px-4 py-2 pr-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 ${
          currentStatus === "TODO"
            ? "bg-slate-100 text-slate-700 border-slate-200"
            : currentStatus === "IN_PROGRESS"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : "bg-green-100 text-green-700 border-green-200"
        }`}
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      )}
    </div>
  );
}
