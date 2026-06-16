import { BUSINESS_EMAIL } from "@/lib/site/contact";
import { sendBrandedEmail, getSiteUrl, type SendEmailResult } from "@/lib/emails/send";
import { bulletList, paragraph } from "@/lib/emails/layout";

export async function sendWelcomeEmail(input: {
  email: string;
  firstName: string;
  continuePath?: string;
}): Promise<SendEmailResult> {
  const siteUrl = getSiteUrl();
  const continueUrl = `${siteUrl}${input.continuePath ?? "/assessment"}`;

  return sendBrandedEmail({
    to: input.email,
    subject: "Welcome to Eduardo Mendes Advisory",
    replyTo: BUSINESS_EMAIL,
    text: [
      `Hi ${input.firstName},`,
      "",
      "Your account has been created successfully.",
      "",
      `Continue your project onboarding: ${continueUrl}`,
      "",
      "Best regards,",
      "Eduardo Mendes",
    ].join("\n"),
    content: {
      preheader: "Your account is ready - start your project assessment.",
      title: `Welcome, ${input.firstName}!`,
      bodyHtml: [
        paragraph("Thank you for joining Eduardo Mendes Advisory."),
        paragraph(
          "Your account is ready. Continue your project assessment to receive tailored guidance, risk insights, and recommended next steps for your build."
        ),
        bulletList([
          "Complete your free project assessment",
          "Book a complimentary strategy call with Eduardo",
          "Access your client portal once your project is activated",
        ]),
      ].join(""),
      cta: { label: "Continue assessment", href: continueUrl },
      footerNote: "If you did not create this account, please contact us.",
    },
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  resetUrl: string;
  firstName?: string | null;
}): Promise<SendEmailResult> {
  const greeting = input.firstName?.trim() ? input.firstName.trim() : "there";

  return sendBrandedEmail({
    to: input.email,
    subject: "Reset your password",
    replyTo: BUSINESS_EMAIL,
    text: [
      `Hi ${greeting},`,
      "",
      "We received a request to reset your password.",
      "",
      `Reset your password: ${input.resetUrl}`,
      "",
      "This link expires shortly. If you did not request a reset, you can ignore this email.",
      "",
      "Eduardo Mendes Advisory",
    ].join("\n"),
    content: {
      preheader: "Use this secure link to reset your password.",
      title: "Reset your password",
      bodyHtml: [
        paragraph(`Hi ${greeting},`),
        paragraph("We received a request to reset the password for your Eduardo Mendes Advisory account."),
        paragraph("Click the button below to choose a new password. This link expires shortly for your security."),
        paragraph("If you did not request this, you can safely ignore this email."),
      ].join(""),
      cta: { label: "Reset password", href: input.resetUrl },
    },
  });
}

export async function sendContactFormEmail(input: {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  helpWith: string;
  message: string;
}): Promise<SendEmailResult> {
  const lines = [
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Project type: ${input.projectType}`,
    `Help with: ${input.helpWith}`,
    "",
    input.message,
  ];

  const bodyHtml = [
    paragraph("A new message was submitted via the website contact form."),
    bulletList([
      `Name: ${input.fullName}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      `Project type: ${input.projectType}`,
      `Help with: ${input.helpWith}`,
    ]),
    paragraph("Message:"),
    `<p style="margin:0 0 14px;padding:14px 16px;background:#f5f6f8;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#374151;">${input.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
  ].join("");

  const toAdvisor = await sendBrandedEmail({
    to: BUSINESS_EMAIL,
    subject: `New contact form - ${input.fullName}`,
    replyTo: input.email,
    text: lines.join("\n"),
    content: {
      preheader: `New enquiry from ${input.fullName}`,
      title: "New contact form submission",
      bodyHtml,
    },
  });

  if (!toAdvisor.ok) return toAdvisor;

  const autoReply = await sendBrandedEmail({
    to: input.email,
    subject: "We received your message",
    replyTo: BUSINESS_EMAIL,
    text: [
      `Hi ${input.fullName.split(" ")[0] || input.fullName},`,
      "",
      "Thank you for contacting Eduardo Mendes Advisory.",
      "",
      "We have received your message and aim to reply within 24 hours.",
      "",
      "Best regards,",
      "Eduardo Mendes",
    ].join("\n"),
    content: {
      preheader: "Thanks for reaching out - we will reply within 24 hours.",
      title: "Thanks for getting in touch",
      bodyHtml: [
        paragraph(`Hi ${input.fullName.split(" ")[0] || input.fullName},`),
        paragraph("Thank you for contacting Eduardo Mendes Advisory."),
        paragraph("We have received your message and aim to reply within 24 hours."),
        paragraph("If your enquiry is urgent, you can also book a free consultation online."),
      ].join(""),
      cta: { label: "Book a free call", href: `${getSiteUrl()}/book-call` },
    },
  });

  if (!autoReply.ok) {
    console.error("[sendContactFormEmail] auto-reply failed:", autoReply.error);
  }

  return { ok: true, id: toAdvisor.id };
}

export async function sendAssessmentCompletedEmail(input: {
  email: string;
  firstName: string;
  assessmentScore: number;
  projectType: string;
  assessmentId: string;
  leadId?: string | null;
}): Promise<SendEmailResult> {
  const siteUrl = getSiteUrl();
  const resultsUrl = input.leadId
    ? `${siteUrl}/assessment/results?id=${input.assessmentId}&lead=${input.leadId}`
    : `${siteUrl}/assessment/results?id=${input.assessmentId}`;
  const projectLabel = input.projectType.replace(/_/g, " ");

  return sendBrandedEmail({
    to: input.email,
    subject: "Your project assessment is ready",
    replyTo: BUSINESS_EMAIL,
    text: [
      `Hi ${input.firstName},`,
      "",
      "Your project assessment is complete.",
      "",
      `Project Readiness Score: ${input.assessmentScore}/100`,
      `Project type: ${projectLabel}`,
      "",
      `View results: ${resultsUrl}`,
      `Book a call: ${siteUrl}/book-call`,
      "",
      "Best regards,",
      "Eduardo Mendes",
    ].join("\n"),
    content: {
      preheader: `Your readiness score is ${input.assessmentScore}/100.`,
      title: "Your assessment is ready",
      bodyHtml: [
        paragraph(`Hi ${input.firstName},`),
        paragraph("Your project assessment is complete. Here is a quick summary:"),
        bulletList([
          `Project Readiness Score: ${input.assessmentScore}/100`,
          `Project type: ${projectLabel}`,
        ]),
        paragraph("View your full results, risks, and recommended next steps in your assessment report."),
      ].join(""),
      cta: { label: "View my results", href: resultsUrl },
      footerNote: "Prefer to talk it through? Book a free 15-minute strategy call with Eduardo.",
    },
  });
}

export async function sendMeetingBookingConfirmationEmail(input: {
  email: string;
  inviteeName: string;
  scheduledAt: string | null;
  durationMinutes: number;
  meetingUrl: string | null;
  serviceLabel?: string | null;
}): Promise<SendEmailResult> {
  const siteUrl = getSiteUrl();
  const when = input.scheduledAt
    ? new Date(input.scheduledAt).toLocaleString("en-AU", {
        weekday: "long",
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Australia/Brisbane",
      })
    : "Date to be confirmed";
  const service = input.serviceLabel?.replace(/_/g, " ") ?? "Strategy consultation";
  const firstName = input.inviteeName.split(" ")[0] || input.inviteeName;

  const details = [
    `Consultation: ${service}`,
    `When: ${when}`,
    `Duration: ${input.durationMinutes} minutes`,
  ];
  if (input.meetingUrl) details.push(`Join link: ${input.meetingUrl}`);

  return sendBrandedEmail({
    to: input.email,
    subject: "Your consultation is confirmed",
    replyTo: BUSINESS_EMAIL,
    text: [
      `Hi ${firstName},`,
      "",
      "Your consultation with Eduardo Mendes is confirmed.",
      "",
      ...details,
      "",
      `Manage bookings: ${siteUrl}/buildiq/meetings`,
      "",
      "Best regards,",
      "Eduardo Mendes",
    ].join("\n"),
    content: {
      preheader: `Confirmed: ${when}`,
      title: "Your consultation is confirmed",
      bodyHtml: [
        paragraph(`Hi ${firstName},`),
        paragraph("Thank you for booking a consultation with Eduardo Mendes Advisory."),
        bulletList(details),
        paragraph("We look forward to discussing your project and helping you build with confidence."),
      ].join(""),
      cta: input.meetingUrl
        ? { label: "Join video call", href: input.meetingUrl }
        : { label: "View booking details", href: `${siteUrl}/book-call` },
    },
  });
}
