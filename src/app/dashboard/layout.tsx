import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, Users } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-50 to-pink-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 border-r border-indigo-800/50 md:min-h-screen flex flex-col text-slate-300 shadow-2xl relative z-20">
        <div className="p-6 border-b border-indigo-800/50 bg-black/10">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)] tracking-tight">ProjectFlow</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-r-lg border-l-4 border-transparent hover:border-pink-500 hover:bg-white/10 hover:text-white transition-all duration-300 group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            <span className="font-medium tracking-wide">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-r-lg border-l-4 border-transparent hover:border-pink-500 hover:bg-white/10 hover:text-white transition-all duration-300 group"
          >
            <FolderKanban className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            <span className="font-medium tracking-wide">Projects</span>
          </Link>
          <Link
            href="/dashboard/team"
            className="flex items-center gap-3 px-4 py-3 rounded-r-lg border-l-4 border-transparent hover:border-pink-500 hover:bg-white/10 hover:text-white transition-all duration-300 group"
          >
            <Users className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            <span className="font-medium tracking-wide">Team</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-800/50 bg-black/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 shadow-[0_0_12px_rgba(236,72,153,0.6)] flex-shrink-0 flex items-center justify-center text-white font-bold text-lg border border-white/30">
              {session.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
              <span className="inline-block px-2 py-0.5 mt-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] uppercase tracking-widest rounded-full font-bold">
                {session.user.role}
              </span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
