/**
 * Creates or refreshes an active demo client for BuildIQ portal preview.
 * Usage: node --env-file=.env.local scripts/ensure-demo-client.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const EMAIL = process.env.DEMO_CLIENT_EMAIL?.trim() || "demo.client@eduardomendes.com.au";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://eduardomendes.com.au";

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
  const existing = await findUserByEmail(admin, EMAIL.toLowerCase());
  let userId;
  let created = false;

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
      email: EMAIL.toLowerCase(),
      role: "client",
    },
    { onConflict: "id" }
  );
  if (userRowError) throw userRowError;

  const { error: profileError } = await admin.from("user_profiles").upsert(
    {
      user_id: userId,
      first_name: "Demo",
      last_name: "Client",
      phone: "0400 000 000",
    },
    { onConflict: "user_id" }
  );
  if (profileError) throw profileError;

  let leadId = null;
  const { data: existingLead } = await admin
    .from("leads")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLead?.id) {
    leadId = existingLead.id;
    await admin
      .from("leads")
      .update({
        full_name: "Demo Client",
        email: EMAIL.toLowerCase(),
        suburb: "Buderim",
        state: "QLD",
        lead_status: "client_approved",
        source: "demo_portal",
      })
      .eq("id", leadId);
  } else {
    const { data: lead, error: leadError } = await admin
      .from("leads")
      .insert({
        user_id: userId,
        full_name: "Demo Client",
        email: EMAIL.toLowerCase(),
        suburb: "Buderim",
        state: "QLD",
        lead_status: "client_approved",
        source: "demo_portal",
      })
      .select("id")
      .single();
    if (leadError) throw leadError;
    leadId = lead.id;
  }

  let clientId = null;
  const { data: existingClient } = await admin
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingClient?.id) {
    clientId = existingClient.id;
    await admin
      .from("clients")
      .update({
        client_status: "active",
        lead_id: leadId,
        notes: "Demo account for portal preview",
      })
      .eq("id", clientId);
  } else {
    const { data: client, error: clientError } = await admin
      .from("clients")
      .insert({
        user_id: userId,
        lead_id: leadId,
        client_status: "active",
        notes: "Demo account for portal preview",
      })
      .select("id")
      .single();
    if (clientError) throw clientError;
    clientId = client.id;
  }

  const { count: projectCount } = await admin
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId);

  if (!projectCount) {
    const { error: projectError } = await admin.from("projects").insert({
      client_id: clientId,
      project_name: "Sunshine Coast New Build",
      project_type: "new_home_build",
      project_status: "planning",
      project_stage: "project_assessment",
      budget_range: "500k_1m",
      suburb: "Buderim",
      state: "QLD",
      postcode: "4556",
    });
    if (projectError) throw projectError;
  }

  const { data: userRow } = await admin
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  const { data: clientRow } = await admin
    .from("clients")
    .select("client_status")
    .eq("id", clientId)
    .single();

  if (userRow?.role !== "client" || clientRow?.client_status !== "active") {
    throw new Error("Failed to verify active demo client");
  }

  console.log("");
  console.log("Demo client portal ready");
  console.log(`Login URL: ${SITE_URL}/login?redirect=/buildiq/dashboard`);
  console.log(`Email: ${EMAIL}`);
  console.log(`Password: ${password}`);
  console.log(`Action: ${created ? "created" : "password reset"}`);
  console.log("");
  console.log("This account has an active client record and sample project data.");
}

main().catch((error) => {
  console.error("[ensure-demo-client]", error.message ?? error);
  process.exit(1);
});
