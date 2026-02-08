/**
 * Admin Layout — wraps all /admin/* pages.
 *
 * Provides:
 * - Sidebar navigation with section links
 * - Header with user info and logout
 * - Session provider for client components
 *
 * The layout is a client component because it uses SessionProvider
 * and interactive navigation state.
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false }, // Never index admin pages
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double-check auth (middleware handles redirect, but this is defense-in-depth)
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell userName={session.user.name ?? "Admin"}>
      {children}
    </AdminShell>
  );
}
