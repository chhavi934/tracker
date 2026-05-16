import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderKanban, Users, CheckSquare } from "lucide-react";
import CreateProjectModal from "./CreateProjectModal";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const projects = await prisma.project.findMany({
    include: {
      user: { select: { name: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm">Projects</h1>
          <p className="text-indigo-900/60 mt-2 font-medium">Manage all projects and their progress.</p>
        </div>
        {session.user.role === "Admin" && <CreateProjectModal />}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 px-6 text-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-pink-50/50">
              <FolderKanban className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-950 mb-2">No projects found</h3>
            <p className="text-indigo-900/70 max-w-md mx-auto mb-8 text-lg font-medium">
              You haven't created or been assigned to any projects yet. 
              {session.user.role === "Admin" && " Get started by creating your first project."}
            </p>
            {session.user.role === "Admin" && (
              <div className="animate-bounce mt-4">
                <span className="text-sm font-bold text-pink-600 bg-pink-50 px-4 py-2 rounded-full inline-block border border-pink-200 shadow-sm">
                  Click "New Project" above to begin ✨
                </span>
              </div>
            )}
          </div>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 hover:border-pink-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 block relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="p-3 bg-pink-100 rounded-xl text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FolderKanban className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-indigo-950 mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-indigo-900/70 text-sm line-clamp-2 mb-6 font-medium">
                  {project.description}
                </p>
              )}
              
              <div className="pt-4 border-t border-white/50 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-indigo-900/80 font-medium">
                  <Users className="w-4 h-4" />
                  <span>Admin: {project.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-900/80 font-medium">
                  <CheckSquare className="w-4 h-4" />
                  <span>{project._count.tasks} Tasks</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
