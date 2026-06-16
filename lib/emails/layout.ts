const LOGO_URL =
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png";

export type BrandedEmailContent = {
  preheader?: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderBrandedEmail(content: BrandedEmailContent): string {
  const preheader = content.preheader ?? content.title;
  const ctaBlock = content.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
        <tr>
          <td style="border-radius:8px;background:#b67c2c;">
            <a href="${escapeHtml(content.cta.href)}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(content.cta.label)}</a>
          </td>
        </tr>
      </table>`
    : "";

  const footerNote = content.footerNote
    ? `<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280;">${escapeHtml(content.footerNote)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(content.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111A24;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ece8e1;">
          <tr>
            <td style="background:#111A24;padding:28px 32px;">
              <img src="${LOGO_URL}" alt="Eduardo Mendes Advisory" width="180" style="display:block;height:auto;max-width:180px;" />
              <p style="margin:10px 0 0;font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#b67c2c;">Owner Builder Advisory</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:#111A24;">${escapeHtml(content.title)}</h1>
              <div style="font-size:15px;line-height:1.65;color:#374151;">${content.bodyHtml}</div>
              ${ctaBlock}
              ${footerNote}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #ece8e1;background:#fafafa;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                Eduardo Mendes Advisory - Queensland, Australia<br />
                <a href="https://eduardomendes.com.au" style="color:#b67c2c;text-decoration:none;">eduardomendes.com.au</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;">${escapeHtml(text)}</p>`;
}

export function bulletList(items: string[]): string {
  return `<ul style="margin:0 0 14px;padding-left:20px;color:#374151;">${items
    .map((item) => `<li style="margin-bottom:8px;">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}
