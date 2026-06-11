"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  getAdvisorNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AdvisorNotification,
} from "@/features/notifications/actions";

export function AdvisorNotificationsBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AdvisorNotification[]>([]);
  const [pending, startTransition] = useTransition();

  function load() {
    startTransition(async () => {
      const data = await getAdvisorNotifications();
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications);
    });
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  function handleOpen() {
    setOpen((prev) => !prev);
    if (!open) load();
  }

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
      load();
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead();
      load();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="p-2 rounded-lg text-muted-foreground hover:text-navy hover:bg-muted transition-colors relative"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b67c2c] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden bg-white rounded-xl border border-border shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-navy">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={pending}
                  className="text-[10px] font-semibold text-warm-soil hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 ${item.is_read ? "bg-white" : "bg-warm-soil/5"}`}
                  >
                    <p className="text-sm font-medium text-navy">{item.title}</p>
                    {item.message && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <time className="text-[10px] text-muted-foreground">
                        {new Date(item.created_at).toLocaleString("en-AU", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </time>
                      <div className="flex items-center gap-2">
                        {item.action_url && (
                          <Link
                            href={item.action_url}
                            onClick={() => {
                              if (!item.is_read) handleMarkRead(item.id);
                              setOpen(false);
                            }}
                            className="text-[10px] font-semibold text-warm-soil hover:underline"
                          >
                            View
                          </Link>
                        )}
                        {!item.is_read && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(item.id)}
                            className="text-[10px] text-muted-foreground hover:text-navy"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
