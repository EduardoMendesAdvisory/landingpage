/**
 * Sends branded test emails via Resend.
 * Usage: node --env-file=.env.local scripts/test-resend-emails.mjs you@example.com
 */
import { Resend } from "resend";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvLocal();

const to = process.argv[2];
if (!to) {
  console.error("Usage: node --env-file=.env.local scripts/test-resend-emails.mjs recipient@example.com");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.FROM_EMAIL ??
  process.env.RESEND_FROM_EMAIL ??
  "info@eduardomendes.com.au";
const from = `${process.env.RESEND_FROM_NAME ?? "Eduardo Mendes Advisory"} <${fromEmail}>`;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eduardomendes.com.au";

if (!apiKey) {
  console.error("RESEND_API_KEY is missing.");
  process.exit(1);
}

const resend = new Resend(apiKey);

const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f6f8;padding:24px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table width="600" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ece8e1"><tr><td style="background:#111A24;padding:24px;color:#fff"><strong>Eduardo Mendes Advisory</strong><div style="color:#b67c2c;font-size:10px;letter-spacing:.16em;text-transform:uppercase;margin-top:8px">Owner Builder Advisory</div></td></tr><tr><td style="padding:24px;color:#111A24"><h1 style="margin-top:0">Resend test email</h1><p>This confirms Resend is configured for <strong>${fromEmail}</strong>.</p></td></tr></table></td></tr></table></body></html>`;

const tests = [
  {
    name: "welcome",
    subject: "Welcome to Eduardo Mendes Advisory",
    text: `Hi Test,\n\nWelcome! Continue: ${siteUrl}/assessment`,
  },
  {
    name: "password-reset",
    subject: "Reset your password",
    text: `Reset link: ${siteUrl}/reset-password`,
  },
  {
    name: "contact-form",
    subject: "We received your message",
    text: "Contact form test message.",
  },
  {
    name: "assessment",
    subject: "Your project assessment is ready",
    text: `View results: ${siteUrl}/assessment/results?id=test`,
  },
  {
    name: "meeting-booking",
    subject: "Your consultation is confirmed",
    text: "Your consultation is confirmed.",
  },
];

let failed = 0;

for (const test of tests) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `[TEST ${test.name}] ${test.subject}`,
    html,
    text: test.text,
  });

  if (error) {
    failed += 1;
    console.error(`FAIL ${test.name}:`, error);
  } else {
    console.log(`OK ${test.name}:`, data?.id);
  }
}

if (failed > 0) process.exit(1);
console.log(`\nSent ${tests.length - failed}/${tests.length} test emails to ${to}`);
