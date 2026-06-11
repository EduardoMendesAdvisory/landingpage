import { Metadata } from "next";
import { redirect } from "next/navigation";
import { MasterLoginForm } from "@/features/auth/components/MasterLoginForm";
import { createClient } from "@/lib/supabase/server";
import {
  ADVISOR_DASHBOARD_PATH,
  ADVISOR_LOGIN_PATH,
} from "@/lib/auth/master-access";

export const metadata: Metadata = {
  title: "AdvisorHQ Sign In",
  robots: { index: false, follow: false },
};

interface AdvisorLoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AdvisorLoginPage({
  searchParams,
}: AdvisorLoginPageProps) {
  const { redirect: redirectPath } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if ((userData as { role: string } | null)?.role === "admin") {
      const safe =
        redirectPath?.startsWith("/advisor") &&
        !redirectPath.startsWith(ADVISOR_LOGIN_PATH)
          ? redirectPath
          : ADVISOR_DASHBOARD_PATH;
      redirect(safe);
    }
  }

  return (
    <div className="min-h-screen bg-[#111A24] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
            alt="Eduardo Mendes Advisory"
            className="h-8 w-auto mx-auto mb-6"
          />
          <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            AdvisorHQ
          </p>
          <h1 className="text-2xl font-bold text-white">Master sign in</h1>
          <p className="text-white/50 text-sm mt-2">
            Internal panel for Eduardo and authorised team members.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <MasterLoginForm redirectPath={redirectPath} />
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Not a staff member?{" "}
          <a href="/login" className="text-white/50 hover:text-white underline-offset-2 hover:underline">
            Client portal sign in
          </a>
        </p>
      </div>
    </div>
  );
}
