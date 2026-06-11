import { redirect } from "next/navigation";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { BuildIQSidebar } from "@/components/layout/BuildIQSidebar";
import { resolveClientNames } from "@/lib/buildiq/get-client-context";
import {
  BUILDIQ_PORTAL_PENDING_PATH,
  hasActiveClientPortalAccess,
} from "@/lib/auth/buildiq-access";

export const dynamic = "force-dynamic";

export default async function BuildIQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) redirect("/login?redirect=/buildiq/dashboard");

  const supabase = await createClient();

  const [{ data: userRow }, { data: clientRow }, profileResult] = await Promise.all([
    supabase.from("users").select("role").eq("id", user.id).single(),
    supabase
      .from("clients")
      .select("id, client_status")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const role = (userRow as { role: string } | null)?.role;
  const client = clientRow as { id: string; client_status: string } | null;

  if (role === "admin") {
    redirect("/advisor/dashboard");
  }

  if (!hasActiveClientPortalAccess(role, client)) {
    redirect(BUILDIQ_PORTAL_PENDING_PATH);
  }

  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
  } | null;

  const { firstName, fullName } = resolveClientNames({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    email: user.email,
  });

  const userName =
    fullName !== "there" ? fullName : user.email?.split("@")[0];
  const userInitials =
    [firstName[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() ||
    "?";

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <BuildIQSidebar userName={userName ?? undefined} userInitials={userInitials} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}
