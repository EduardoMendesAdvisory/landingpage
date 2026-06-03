"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileSearch,
  FolderOpen,
  Layers,
  CalendarDays,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/buildiq/dashboard", icon: Home },
  { label: "BuildCheck", href: "/buildiq/buildcheck", icon: FileSearch },
  { label: "Documents", href: "/buildiq/documents", icon: FolderOpen },
  { label: "My Project", href: "/buildiq/project", icon: Layers },
  { label: "Meetings", href: "/buildiq/meetings", icon: CalendarDays },
  { label: "Messages", href: "/buildiq/messages", icon: MessageSquare },
  { label: "Profile", href: "/buildiq/profile", icon: User },
];

interface BuildIQSidebarProps {
  userName?: string;
}

export function BuildIQSidebar({ userName }: BuildIQSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <span className="text-warm-soil text-xl font-bold">EM</span>
        <div className="text-xs leading-tight">
          <p className="font-semibold text-sidebar-foreground">BuildIQ</p>
          <p className="text-sidebar-foreground/50">Client Portal</p>
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
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
