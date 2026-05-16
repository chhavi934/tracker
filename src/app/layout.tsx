import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectFlow - Task Management",
  description: "Manage projects, assign tasks, and track progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
