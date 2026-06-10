"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Phone,
  FileCheck,
  FileText,
  Briefcase,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/advisor/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/advisor/leads", icon: Users },
  { label: "Calls", href: "/advisor/calls", icon: Phone },
  { label: "Quote Reviews", href: "/advisor/quote-reviews", icon: FileCheck },
  { label: "Proposals", href: "/advisor/proposals", icon: FileText },
  { label: "Clients", href: "/advisor/clients", icon: Briefcase },
  { label: "Projects", href: "/advisor/projects", icon: FolderOpen },
  { label: "Reports", href: "/advisor/reports", icon: BarChart3 },
  { label: "Settings", href: "/advisor/settings", icon: Settings },
];

interface AdvisorSidebarProps {
  userName?: string;
}

export function AdvisorSidebar({ userName }: AdvisorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <img
          src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
          alt="Eduardo Mendes Advisory"
          className="h-7 w-auto"
        />
        <div className="text-xs leading-tight">
          <p className="font-semibold text-sidebar-foreground">AdvisorHQ</p>
          <p className="text-sidebar-foreground/50">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        {userName && (
          <p className="text-xs text-sidebar-foreground/50 px-3 mb-2 truncate">
            {userName}
          </p>
        )}
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
