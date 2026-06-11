"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ADVISOR_DASHBOARD_PATH,
  isMasterAdminEmail,
} from "@/lib/auth/master-access";

export interface MasterLoginInput {
  email: string;
  password: string;
  redirectPath?: string;
}

export async function loginMaster(
  input: MasterLoginInput
): Promise<{ error: string } | never> {
  const email = input.email.trim().toLowerCase();

  if (!isMasterAdminEmail(email)) {
    return { error: "Access denied. This login is for authorised staff only." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) return { error: error.message };

  if (!data.user) {
    return { error: "Login failed. Please try again." };
  }

  const admin = createAdminClient();

  await admin
    .from("users")
    .update({ role: "admin" })
    .eq("id", data.user.id);

  const { data: userRow } = await admin
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = (userRow as { role: string } | null)?.role;
  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Your account is not authorised for AdvisorHQ." };
  }

  const safeRedirect =
    input.redirectPath?.startsWith("/advisor") &&
    !input.redirectPath.startsWith("/advisor/login")
      ? input.redirectPath
      : ADVISOR_DASHBOARD_PATH;

  redirect(safeRedirect);
}
