import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FileSearch,
  CalendarDays,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = { title: "My Dashboard" };

export default async function BuildIQDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileResult, clientResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("clients")
      .select("id, client_status")
      .eq("user_id", user!.id)
      .single(),
  ]);

  const profile = profileResult.data as { first_name: string | null; last_name: string | null } | null;
  const client = clientResult.data as { id: string; client_status: string } | null;
  const firstName = profile?.first_name ?? "there";

  // Fetch project data if client exists
  let project = null;
  let buildcheck = null;
  let unreadMessages = 0;

  if (client?.id) {
    const [projectResult, buildcheckResult, messagesResult] = await Promise.all([
      supabase
        .from("projects")
        .select("id, project_name, project_status, project_stage, confidence_score")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("buildchecks")
        .select("id, buildcheck_status, title")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("is_read", false),
    ]);

    project = projectResult.data as {
      id: string;
      project_name: string;
      project_status: string;
      project_stage: string | null;
      confidence_score: number | null;
    } | null;
    buildcheck = buildcheckResult.data;
    unreadMessages = messagesResult.count ?? 0;
  }

  return (
    <>
      <DashboardHeader
        title="My Dashboard"
        userName={firstName}
        userInitials={firstName.slice(0, 2).toUpperCase()}
      />
      <div className="flex-1 px-6 py-8 space-y-8">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Here's an overview of your project and next steps."
        />

        {/* Project status overview */}
        {project ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-center gap-2">
              <ProgressCircle
                value={project.confidence_score ?? 0}
                size="md"
                label="Project Confidence"
              />
            </div>

            <DashboardCard
              title="Project Status"
              description={project.project_name}
              icon={<FolderOpen size={16} />}
            >
              <div className="mt-2">
                <StatusBadge status={project.project_status} />
              </div>
            </DashboardCard>

            <DashboardCard
              title="BuildCheck"
              description="Latest report"
              icon={<FileSearch size={16} />}
            >
              <div className="mt-2">
                {buildcheck ? (
                  <StatusBadge
                    status={(buildcheck as { buildcheck_status: string }).buildcheck_status}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">None yet</span>
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Messages"
              value={unreadMessages}
              description={unreadMessages > 0 ? "unread messages" : "All caught up"}
              icon={<MessageSquare size={16} />}
            />
          </div>
        ) : (
          <EmptyState
            icon={<FolderOpen size={40} />}
            title="Your project is being set up"
            description="Eduardo will activate your BuildIQ project after your strategy call. In the meantime, complete your free assessment."
            action={
              <Link
                href="/assessment"
                className={cn(
                  buttonVariants(),
                  "bg-navy hover:bg-navy/90 text-white border-transparent"
                )}
              >
                Complete Assessment
              </Link>
            }
          />
        )}

        {/* Next steps */}
        <div>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "BuildCheck",
                description: "View your quote reviews",
                href: "/buildiq/buildcheck",
                icon: FileSearch,
              },
              {
                label: "Documents",
                description: "Upload and manage files",
                href: "/buildiq/documents",
                icon: FolderOpen,
              },
              {
                label: "Meetings",
                description: "View upcoming calls",
                href: "/buildiq/meetings",
                icon: CalendarDays,
              },
              {
                label: "Messages",
                description: "Chat with Eduardo",
                href: "/buildiq/messages",
                icon: MessageSquare,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 bg-white hover:bg-light-bg rounded-xl p-4 border border-border hover:border-navy/20 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <item.icon
                  size={18}
                  className="text-warm-soil mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-navy">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
