#!/usr/bin/env node
/**
 * Register Calendly webhook and verify event type URL.
 * Usage: npm run calendly:setup
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const API = "https://api.calendly.com";
const key = process.env.CALENDLY_API_KEY?.trim();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const webhookUrl = `${siteUrl}/api/calendly/webhook`;
const configuredUrl = (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "").split("?")[0];

if (!key) {
  console.error("CALENDLY_API_KEY missing in .env.local");
  process.exit(1);
}

function userUuidFromToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return payload.user_uuid ?? null;
  } catch {
    return null;
  }
}

async function api(path, init) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message ?? body.title ?? `HTTP ${res.status}`);
  }
  return body;
}

const userUuid = userUuidFromToken(key);
if (!userUuid) {
  console.error("Could not read user UUID from CALENDLY_API_KEY");
  process.exit(1);
}

const userUri = process.env.CALENDLY_USER_URI?.trim() || `https://api.calendly.com/users/${userUuid}`;
const organizationUri =
  process.env.CALENDLY_ORGANIZATION_URI?.trim() || userUri;

console.log("User URI:", userUri);
console.log("Organization URI:", organizationUri);
console.log("Webhook target:", webhookUrl);

const eventData = await api(`/event_types?user=${encodeURIComponent(userUri)}`);
const eventTypes = eventData.collection ?? [];
const urlMatch = eventTypes.some(
  (et) => et.active && (configuredUrl === et.scheduling_url || configuredUrl.endsWith(et.scheduling_url.split("/").pop()))
);

console.log("\nActive event types:");
for (const et of eventTypes.filter((e) => e.active)) {
  console.log(`  - ${et.name}: ${et.scheduling_url}`);
}
console.log("\nConfigured NEXT_PUBLIC_CALENDLY_URL:", configuredUrl || "(not set)");
console.log("URL match:", urlMatch ? "yes" : "NO");

let hooksOk = false;
try {
  const params = new URLSearchParams({
    organization: organizationUri,
    user: userUri,
    scope: "user",
  });
  const hooksData = await api(`/webhook_subscriptions?${params.toString()}`);
  hooksOk = true;
  const existing = (hooksData.collection ?? []).find(
    (h) => h.callback_url === webhookUrl && h.state === "active"
  );

  if (existing) {
    console.log("\nWebhook already active:", existing.uri);
  } else {
    const created = await api("/webhook_subscriptions", {
      method: "POST",
      body: JSON.stringify({
        url: webhookUrl,
        events: ["invitee.created", "invitee.canceled"],
        organization: organizationUri,
        user: userUri,
        scope: "user",
      }),
    });
    console.log("\nWebhook created:", created.resource?.uri);
    if (created.resource?.signing_key) {
      console.log("Add to .env.local: CALENDLY_WEBHOOK_SIGNING_KEY=<signing key>");
    }
  }
} catch (err) {
  console.log("\nWebhook setup skipped:", err instanceof Error ? err.message : err);
  console.log(
    "Add CALENDLY_ORGANIZATION_URI to .env.local (Calendly > Integrations > API & Webhooks > Organization URI)."
  );
  console.log(
    "Or regenerate the token with users:read scope, then re-run npm run calendly:setup."
  );
}

if (!urlMatch) {
  console.log("\nAction: set NEXT_PUBLIC_CALENDLY_URL to one of the active URLs above.");
  process.exit(2);
}

if (!hooksOk) {
  process.exit(3);
}
