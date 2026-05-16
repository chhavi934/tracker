import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InviteMemberModal from "./InviteMemberModal";
import TeamList from "./TeamList";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const team = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm">Team Members</h1>
          <p className="text-indigo-900/60 mt-2 font-medium">Manage your team and their roles.</p>
        </div>
        {session.user.role === "Admin" && <InviteMemberModal />}
      </header>

      <TeamList team={team} currentUserRole={session.user.role} currentUserId={session.user.id} />
    </div>
  );
}
