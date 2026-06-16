"use server";

import { sendContactFormEmail } from "@/lib/emails/templates";

export type SubmitContactFormResult =
  | { success: true }
  | { error: string };

export async function submitContactForm(input: {
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  helpWith: string;
  message: string;
}): Promise<SubmitContactFormResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const projectType = input.projectType.trim();
  const helpWith = input.helpWith.trim();
  const message = input.message.trim();

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (!phone || phone.length < 6) {
    return { error: "Please enter a valid phone number." };
  }
  if (!projectType) {
    return { error: "Please select a project type." };
  }
  if (!helpWith) {
    return { error: "Please select how we can help." };
  }
  if (!message || message.length < 10) {
    return { error: "Please write a short message about your project." };
  }

  const result = await sendContactFormEmail({
    fullName,
    email,
    phone,
    projectType,
    helpWith,
    message,
  });

  if (!result.ok) {
    return { error: "Could not send your message. Please try again or email us directly." };
  }

  return { success: true };
}
