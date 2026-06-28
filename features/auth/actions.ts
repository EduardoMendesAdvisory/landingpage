"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/emails/templates";
import { getSiteUrl } from "@/lib/emails/send";
import { resolvePostLoginPath } from "@/lib/auth/post-login-redirect";
import {
  ADVISOR_LOGIN_PATH,
  isMasterAdminEmail,
} from "@/lib/auth/master-access";

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

    const continuePath = resolvePostRegisterPath(
      input.onboardingPath ?? "assessment",
      input.serviceSlug
    );

    const welcome = await sendWelcomeEmail({
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName,
      continuePath,
    });
    if (!welcome.ok) {
      console.error("[registerUser] Welcome email failed:", welcome.error);
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
  const email = input.email.trim().toLowerCase();

  if (isMasterAdminEmail(email)) {
    redirect(ADVISOR_LOGIN_PATH);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
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
  const email = input.email.trim().toLowerCase();
  if (!email) return { error: "Please enter your email address." };

  const admin = createAdminClient();
  const siteUrl = getSiteUrl();

  const { data: userRow } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!userRow) {
    return { success: true };
  }

  const userId = (userRow as { id: string }).id;

  const { data: profile } = await admin
    .from("user_profiles")
    .select("first_name")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${siteUrl}/reset-password` },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error("[forgotPassword] generateLink:", linkError);
    return { success: true };
  }

  const sent = await sendPasswordResetEmail({
    email,
    resetUrl: linkData.properties.action_link,
    firstName: (profile as { first_name: string | null } | null)?.first_name,
  });

  if (!sent.ok) {
    console.error("[forgotPassword] email:", sent.error);
  }

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
