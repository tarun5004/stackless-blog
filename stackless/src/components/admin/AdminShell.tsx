/**
 * AdminShell — client-side wrapper providing sidebar nav and header.
 *
 * This is separated from the layout because it needs client interactivity
 * (active nav state, sign-out button) while the layout itself can
 * do the server-side auth check.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "◆" },
  { label: "Posts", href: "/admin/posts", icon: "▤" },
  { label: "Topics", href: "/admin/topics", icon: "◉" },
  { label: "Paths", href: "/admin/paths", icon: "⇢" },
  { label: "Analytics", href: "/admin/analytics", icon: "◔" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
  { label: "Deploy", href: "/admin/deploy", icon: "▲" },
];

interface AdminShellProps {
  userName: string;
  children: React.ReactNode;
}

export default function AdminShell({ userName, children }: AdminShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface-alt">
        <nav className="flex flex-col gap-1 p-3" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-brand-50 font-medium text-brand-600"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="mt-auto border-t border-border p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-text-primary truncate">
              {userName}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs text-text-muted hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
