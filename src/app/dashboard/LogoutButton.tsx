"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-3 px-4 py-2 text-pink-400 rounded-lg hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300 group"
    >
      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium">Logout</span>
    </button>
  );
}
