import { Metadata } from "next";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { getClientContext, resolveClientNames } from "@/lib/buildiq/get-client-context";
import { ProfileEditor } from "@/components/buildiq/ProfileEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createClient();

  const { firstName, fullName, client } = await getClientContext(user.id);

  const profileResult = await supabase
    .from("user_profiles")
    .select("first_name, last_name, phone, suburb, state")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    suburb: string | null;
    state: string | null;
  } | null;

  const derived = resolveClientNames({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    email: user.email,
  });

  const displayName = fullName !== "there" ? fullName : user.email?.split("@")[0] ?? "--";
  const initials =
    [profile?.first_name?.[0] ?? firstName[0], profile?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  const initial = {
    first_name: profile?.first_name?.trim() || derived.firstName,
    last_name: profile?.last_name?.trim() || "",
    phone: profile?.phone?.trim() || "",
    suburb: profile?.suburb?.trim() || "",
    state: profile?.state?.trim() || "",
  };

  return (
    <ProfileEditor
      email={user.email ?? ""}
      joinedAt={user.created_at ?? new Date().toISOString()}
      isClient={Boolean(client)}
      displayName={displayName}
      initials={initials}
      initial={initial}
    />
  );
}
