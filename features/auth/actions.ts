"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM } from "@/lib/resend";

// ── Register ─────────────────────────────────────────────────

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
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
        text: `Hi ${input.firstName},\n\nWelcome! Your account has been created.\n\nYour next step is to complete your free project assessment at ${process.env.NEXT_PUBLIC_SITE_URL}/assessment\n\nBest regards,\nEduardo Mendes`,
      });
    } catch (emailError) {
      console.error("[registerUser] Welcome email failed:", emailError);
    }
  }

  redirect("/assessment");
}

// ── Login ────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
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
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = (userData as { role: string } | null)?.role;

    if (role === "admin") redirect("/advisor/dashboard");
    if (role === "client") redirect("/buildiq/dashboard");
    redirect("/assessment");
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
