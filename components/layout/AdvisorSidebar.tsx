"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Phone,
  FileText,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/advisor/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/advisor/leads", icon: Users },
  { label: "Calls", href: "/advisor/calls", icon: Phone },
  { label: "Invoices", href: "/advisor/invoices", icon: FileText },
  { label: "Projects", href: "/advisor/projects", icon: FolderOpen },
  { label: "Messages", href: "/advisor/messages", icon: MessageSquare },
  { label: "Reports", href: "/advisor/reports", icon: BarChart3 },
  { label: "Settings", href: "/advisor/settings", icon: Settings },
];

interface AdvisorSidebarProps {
  userName?: string;
}

function SidebarContent({
  userName,
  pathname,
  onNavClick,
}: {
  userName?: string;
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex flex-col gap-2 px-5 py-5 border-b border-sidebar-border">
        <img
          src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
          alt="Eduardo Mendes Advisory"
          className="h-7 w-auto self-start"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-sidebar-foreground">AdvisorHQ</span>
          <span className="text-[10px] text-sidebar-foreground/40 border border-sidebar-foreground/20 rounded px-1.5 py-0.5 uppercase tracking-wide">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
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
        <form action="/api/auth/signout?next=/advisor/login" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}

export function AdvisorSidebar({ userName }: AdvisorSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground shrink-0">
        <SidebarContent userName={userName} pathname={pathname} />
      </aside>

      {/* Mobile hamburger button — rendered inside the header area via portal-like positioning */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 p-2 rounded-lg bg-sidebar text-sidebar-foreground shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-sidebar text-sidebar-foreground shadow-2xl">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              userName={userName}
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  );
}
