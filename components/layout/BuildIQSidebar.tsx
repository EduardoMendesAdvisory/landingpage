"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  CalendarDays,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/buildiq/dashboard", icon: LayoutDashboard },
  { label: "Documents", href: "/buildiq/documents", icon: FolderOpen },
  { label: "Projects", href: "/buildiq/project", icon: Layers },
  { label: "Meetings", href: "/buildiq/meetings", icon: CalendarDays },
  { label: "My Profile", href: "/buildiq/profile", icon: User },
];

interface BuildIQSidebarProps {
  userName?: string;
  userInitials?: string;
}

export function BuildIQSidebar({ userName, userInitials }: BuildIQSidebarProps) {
  const pathname = usePathname();

  const initials =
    userInitials ??
    (userName ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?");

  return (
    <aside className="flex flex-col w-[200px] min-h-screen bg-[#111A24] text-white border-r border-white/5">
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <img
          src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
          alt="Eduardo Mendes Advisory"
          className="h-6 w-auto mb-1"
        />
        <p className="text-[9px] font-semibold text-[#b67c2c] uppercase tracking-[0.18em]">
          Owner Builder Advisory
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative",
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/60 hover:bg-white/6 hover:text-white"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-[#b67c2c]" : "text-white/50 group-hover:text-white/80"
                )}
              />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-xl border border-[#b67c2c]/30 bg-[#b67c2c]/8 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={13} className="text-[#b67c2c] shrink-0" />
            <p className="text-[11px] font-semibold text-[#b67c2c]">Need help?</p>
          </div>
          <Link
            href="/buildiq/meetings"
            className="text-[11px] text-white/70 hover:text-white transition-colors"
          >
            Book a meeting with Eduardo
          </Link>
        </div>
      </div>

      <div className="px-3 pb-4 border-t border-white/8 pt-3">
        <div className="flex items-center gap-2.5 px-1 mb-2">
          <div className="h-8 w-8 rounded-full bg-[#b67c2c] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate leading-tight">
              {userName ?? "Client Account"}
            </p>
            <Link
              href="/buildiq/profile"
              className="text-[10px] text-white/50 hover:text-[#b67c2c] transition-colors"
            >
              Client Profile
            </Link>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:bg-white/6 hover:text-white transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
