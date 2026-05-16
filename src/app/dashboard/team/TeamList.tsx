"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserCog, Mail } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function TeamList({ team, currentUserRole, currentUserId }: { team: TeamMember[], currentUserRole: string, currentUserId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(`role-${userId}`);
    try {
      await fetch(`/api/team/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setLoading(`remove-${userId}`);
    try {
      await fetch(`/api/team/${userId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/30 border-b border-white/50">
              <th className="p-4 font-bold text-indigo-950">Member</th>
              <th className="p-4 font-bold text-indigo-950">Contact</th>
              <th className="p-4 font-bold text-indigo-950">Status</th>
              <th className="p-4 font-bold text-indigo-950">Role</th>
              {currentUserRole === "Admin" && (
                <th className="p-4 font-bold text-indigo-950 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-white/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white font-bold shadow-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-indigo-950">{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-indigo-900/80 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  {member.email}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-orange-100 text-orange-700 border border-orange-200"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      member.role === "Admin"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {member.role}
                  </span>
                </td>
                {currentUserRole === "Admin" && (
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {member.id !== currentUserId && (
                        <>
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            disabled={loading === `role-${member.id}`}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-purple-300"
                          >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRemove(member.id)}
                            disabled={loading === `remove-${member.id}`}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
