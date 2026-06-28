/**
 * Removes the demo client account and related data.
 * Usage: node --env-file=.env.local scripts/delete-demo-client.mjs
 */
import { createClient } from "@supabase/supabase-js";

const EMAIL = process.env.DEMO_CLIENT_EMAIL?.trim() || "demo.client@eduardomendes.com.au";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
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

async function deleteByClientId(admin, table, clientId) {
  const { error } = await admin.from(table).delete().eq("client_id", clientId);
  if (error) throw error;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const admin = createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const normalizedEmail = EMAIL.toLowerCase();
  const authUser = await findUserByEmail(admin, normalizedEmail);

  if (!authUser) {
    console.log(`No auth user found for ${normalizedEmail} — nothing to delete.`);
    return;
  }

  const userId = authUser.id;

  const { data: clientRow } = await admin
    .from("clients")
    .select("id, lead_id")
    .eq("user_id", userId)
    .maybeSingle();

  const clientId = clientRow?.id ?? null;
  const leadId = clientRow?.lead_id ?? null;

  if (clientId) {
    await deleteByClientId(admin, "messages", clientId);
    await deleteByClientId(admin, "tasks", clientId);
    await deleteByClientId(admin, "documents", clientId);
    await deleteByClientId(admin, "invoices", clientId);
    await deleteByClientId(admin, "meetings", clientId);
    await deleteByClientId(admin, "projects", clientId);

    const { error: clientDeleteError } = await admin
      .from("clients")
      .delete()
      .eq("id", clientId);
    if (clientDeleteError) throw clientDeleteError;
    console.log(`Deleted client record ${clientId}`);
  }

  if (leadId) {
    const { error: leadDeleteError } = await admin.from("leads").delete().eq("id", leadId);
    if (leadDeleteError) throw leadDeleteError;
    console.log(`Deleted lead ${leadId}`);
  } else {
    const { error: orphanLeadError } = await admin
      .from("leads")
      .delete()
      .eq("user_id", userId);
    if (orphanLeadError) throw orphanLeadError;
  }

  const { error: profileDeleteError } = await admin
    .from("user_profiles")
    .delete()
    .eq("user_id", userId);
  if (profileDeleteError) throw profileDeleteError;

  const { error: userDeleteError } = await admin.from("users").delete().eq("id", userId);
  if (userDeleteError) throw userDeleteError;

  const { error: authDeleteError } = await admin.auth.admin.deleteUser(userId);
  if (authDeleteError) throw authDeleteError;

  console.log("");
  console.log(`Demo client removed: ${normalizedEmail}`);
}

main().catch((error) => {
  console.error("[delete-demo-client]", error.message ?? error);
  process.exit(1);
});
