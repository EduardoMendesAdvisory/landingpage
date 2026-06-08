import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Mail, MapPin, Phone, User } from "lucide-react";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const profileResult = await supabase
    .from("user_profiles")
    .select("first_name, last_name, phone, suburb, state")
    .eq("user_id", user!.id)
    .single();

  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    suburb: string | null;
    state: string | null;
  } | null;

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "--";
  const location = [profile?.suburb, profile?.state].filter(Boolean).join(", ") || "--";
  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account and profile information.</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-[#111A24] text-[#111A24] hover:bg-[#111A24] hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="px-8 py-6 max-w-3xl space-y-5">
        {/* Avatar + info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-[#b67c2c] flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#111A24]">{name}</h2>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="shrink-0" />
                  <span>{user!.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} className="shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="shrink-0" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User size={14} className="shrink-0" />
                  <span>Joined {new Date(user!.created_at ?? "").toLocaleDateString("en-AU", { dateStyle: "medium" })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account security */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-bold text-[#111A24] mb-4">Account Security</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">?</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#111A24]">Account Secure</p>
                <p className="text-xs text-muted-foreground">Email verified</p>
              </div>
            </div>
            <a
              href="/reset-password"
              className="text-xs font-semibold text-[#b67c2c] hover:underline"
            >
              Change Password ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
