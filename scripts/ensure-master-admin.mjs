/**
 * Ensures info@eduardomendes.com.au exists in Supabase Auth with admin role.
 * Usage: node --env-file=.env.local scripts/ensure-master-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const EMAIL = "info@eduardomendes.com.au";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

function generatePassword() {
  return `${randomBytes(12).toString("base64url")}Aa1!`;
}

async function findUserByEmail(admin, email) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === email
    );
    if (match) return match;

    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const password = generatePassword();
  let userId;
  let created = false;

  const existing = await findUserByEmail(admin, EMAIL);

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Updated existing auth user: ${EMAIL}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    created = true;
    console.log(`Created auth user: ${EMAIL}`);
  }

  const { error: userRowError } = await admin.from("users").upsert(
    {
      id: userId,
      email: EMAIL,
      role: "admin",
    },
    { onConflict: "id" }
  );

  if (userRowError) throw userRowError;

  const { data: userRow, error: verifyError } = await admin
    .from("users")
    .select("id, email, role")
    .eq("id", userId)
    .single();

  if (verifyError || userRow?.role !== "admin") {
    throw verifyError ?? new Error("Failed to verify admin role");
  }

  console.log("");
  console.log("Master admin ready for /advisor/login");
  console.log(`Email: ${EMAIL}`);
  console.log(`Password: ${password}`);
  console.log(`Action: ${created ? "created" : "password reset"}`);
  console.log("");
  console.log("Save this password securely and change it after first login.");
}

main().catch((error) => {
  console.error("[ensure-master-admin]", error.message ?? error);
  process.exit(1);
});
