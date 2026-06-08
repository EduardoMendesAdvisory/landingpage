import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BuildIQSidebar } from "@/components/layout/BuildIQSidebar";

export default async function BuildIQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, unreadResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const profile = profileResult.data as { first_name: string | null; last_name: string | null } | null;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const userName = [firstName, lastName].filter(Boolean).join(" ") || user.email?.split("@")[0];
  const userInitials = [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "?";
  const unreadMessages = unreadResult.count ?? 0;

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <BuildIQSidebar
        userName={userName ?? undefined}
        userInitials={userInitials}
        unreadMessages={unreadMessages}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
