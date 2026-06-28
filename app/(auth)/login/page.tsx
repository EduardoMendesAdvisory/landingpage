import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { resolvePostLoginPath } from "@/lib/auth/post-login-redirect";
import { ADVISOR_LOGIN_PATH } from "@/lib/auth/master-access";

export const metadata: Metadata = { title: "Sign In" };

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectPath, message } = await searchParams;

  if (redirectPath?.startsWith("/advisor")) {
    redirect(
      `/advisor/login?redirect=${encodeURIComponent(redirectPath)}`
    );
  }

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

    const role = (userData as { role: string } | null)?.role;

    if (role === "admin") {
      redirect("/advisor/dashboard");
    }

    const { data: clientRecord } = await supabase
      .from("clients")
      .select("id, client_status")
      .eq("user_id", user.id)
      .maybeSingle();

    redirect(
      resolvePostLoginPath(
        role,
        Boolean(clientRecord),
        redirectPath,
        (clientRecord as { client_status: string } | null)?.client_status
      )
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Sign In</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Welcome back. Enter your details below.
        </p>
      </div>

      <LoginForm redirectPath={redirectPath} message={message} />

      <div className="mt-5 rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3 text-sm text-[#4b5564]">
        Eduardo or staff?{" "}
        <Link
          href={ADVISOR_LOGIN_PATH}
          className="font-semibold text-[#111A24] hover:underline underline-offset-2"
        >
          Sign in to AdvisorHQ
        </Link>{" "}
        (not the client portal).
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-navy font-semibold hover:underline underline-offset-2"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
