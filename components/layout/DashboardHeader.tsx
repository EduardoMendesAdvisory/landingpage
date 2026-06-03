import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  userInitials?: string;
}

export function DashboardHeader({
  title,
  userName,
  userInitials,
}: DashboardHeaderProps) {
  const initials = userInitials ?? userName?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-white">
      <h1 className="text-base font-semibold text-navy">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg text-muted-foreground hover:text-navy hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs bg-navy text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          {userName && (
            <span className="text-sm font-medium text-navy hidden sm:block">
              {userName}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
