import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-100/50 to-transparent -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-32 left-0 -translate-x-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -z-10" />

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="text-2xl font-bold gradient-text">ProjectFlow</div>
        <div className="flex gap-4 items-center">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-8 border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Now available for everyone
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-8 leading-tight">
          Manage projects with <span className="gradient-text">effortless</span> precision
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mb-12">
          The all-in-one platform for task management, team collaboration, and progress tracking. Role-based access ensures everyone stays focused on what matters.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="bg-white text-slate-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-slate-50 transition-colors border border-slate-200 flex items-center justify-center"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Task Tracking</h3>
            <p className="text-slate-600">Assign tasks, set due dates, and monitor progress across all your projects in real-time.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Role Management</h3>
            <p className="text-slate-600">Granular permissions with Admin and Member roles to ensure secure team collaboration.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Dashboard</h3>
            <p className="text-slate-600">Get a bird's-eye view of your workload, overdue tasks, and project completion status.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
