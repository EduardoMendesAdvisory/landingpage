"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM } from "@/lib/resend";
import { resolvePostLoginPath } from "@/lib/auth/post-login-redirect";

import { resolvePostRegisterPath, type RegisterOnboardingPath } from "@/lib/auth/onboarding-paths";

// ── Register ─────────────────────────────────────────────────

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  onboardingPath?: RegisterOnboardingPath;
  serviceSlug?: string;
}

export async function registerUser(
  input: RegisterInput
): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { first_name: input.firstName, last_name: input.lastName },
    },
  });

  if (error) return { error: error.message };

  if (data.user) {
    // DB trigger (on_auth_user_created) creates public.users + leads rows.
    // user_profiles and audit_logs are best-effort — failures must never
    // block the registration redirect.
    try {
      const admin = createAdminClient();

      await admin.from("user_profiles").insert({
        user_id: data.user.id,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
      });

      await admin
        .from("leads")
        .update({
          full_name: [input.firstName, input.lastName].filter(Boolean).join(" "),
          email: input.email.trim().toLowerCase(),
          phone: input.phone?.trim() || null,
          lead_status: "assessment_started",
          source:
            input.onboardingPath === "quote"
              ? "quote_upload"
              : input.onboardingPath === "service"
                ? `service_${input.serviceSlug ?? "general"}`
                : "free_assessment",
          notes:
            input.onboardingPath === "service" && input.serviceSlug
              ? `Interested service: ${input.serviceSlug}`
              : null,
        })
        .eq("user_id", data.user.id);

      await admin.from("audit_logs").insert({
        user_id: data.user.id,
        action: "user_registered",
        metadata: { email: input.email },
      });
    } catch (adminError) {
      console.error("[registerUser] Admin post-registration steps failed:", adminError);
    }

    // Welcome email (non-blocking)
    try {
      await resend.emails.send({
        from: FROM,
        to: input.email,
        subject: "Welcome to Eduardo Mendes Advisory",
        text: `Hi ${input.firstName},\n\nWelcome! Your account has been created.\n\nContinue your project onboarding here: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/assessment\n\nBest regards,\nEduardo Mendes`,
      });
    } catch (emailError) {
      console.error("[registerUser] Welcome email failed:", emailError);
    }
  }

  redirect(
    resolvePostRegisterPath(input.onboardingPath ?? "assessment", input.serviceSlug)
  );
}

// ── Login ────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
  redirectPath?: string;
}

export async function loginUser(
  input: LoginInput
): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { error: error.message };

  if (data.user) {
    const [{ data: userData }, { data: clientRecord }] = await Promise.all([
      supabase.from("users").select("role").eq("id", data.user.id).single(),
      supabase
        .from("clients")
        .select("id, client_status")
        .eq("user_id", data.user.id)
        .maybeSingle(),
    ]);

    const role = (userData as { role: string } | null)?.role;
    const hasClientRecord = Boolean(clientRecord);
    const redirectPath = input.redirectPath?.startsWith("/") ? input.redirectPath : undefined;

    redirect(
      resolvePostLoginPath(
        role,
        hasClientRecord,
        redirectPath,
        (clientRecord as { client_status: string } | null)?.client_status
      )
    );
  }

  return { error: "Login failed. Please try again." };
}

// ── Logout ───────────────────────────────────────────────────

export async function logoutUser(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── Forgot Password ──────────────────────────────────────────

export interface ForgotPasswordInput {
  email: string;
}

export async function forgotPassword(
  input: ForgotPasswordInput
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) return { error: error.message };

  return { success: true };
}

// ── Reset Password ───────────────────────────────────────────

export interface ResetPasswordInput {
  password: string;
}

export async function resetPassword(
  input: ResetPasswordInput
): Promise<{ error: string } | never> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) return { error: error.message };

  redirect("/login?message=Password+updated+successfully");
}
