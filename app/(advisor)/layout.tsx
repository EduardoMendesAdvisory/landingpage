import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdvisorSidebar } from "@/components/layout/AdvisorSidebar";

export const dynamic = "force-dynamic";

export default async function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (userData as { role: string } | null)?.role;
  if (role !== "admin") redirect("/unauthorized");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .single();

  const firstName = (profile as { first_name: string | null } | null)?.first_name;
  const lastName = (profile as { last_name: string | null } | null)?.last_name;
  const userName = [firstName, lastName].filter(Boolean).join(" ") || user.email;

  return (
    <div className="flex min-h-screen bg-light-bg">
      <AdvisorSidebar userName={userName ?? undefined} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
