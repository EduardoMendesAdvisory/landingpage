"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { submitContactForm } from "@/features/contact/actions";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await submitContactForm({
        fullName: String(data.get("fullName") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        projectType: String(data.get("projectType") ?? ""),
        helpWith: String(data.get("helpWith") ?? ""),
        message: String(data.get("projectDetails") ?? ""),
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setSuccess(true);
      form.reset();
    });
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-6 text-center">
        <p className="text-lg font-bold text-[#111A24] mb-2">Message sent</p>
        <p className="text-sm text-[#4b5564] leading-relaxed">
          Thank you for contacting us. We aim to reply within 24 hours and you will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-semibold text-[#111A24]">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="Enter your full name"
            disabled={pending}
            className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-[#111A24]">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com.au"
            disabled={pending}
            className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-semibold text-[#111A24]">
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0412 345 678"
            disabled={pending}
            className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="projectType" className="text-sm font-semibold text-[#111A24]">
            Project Type *
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            disabled={pending}
            className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="New Build">New Build</option>
            <option value="Renovation">Renovation</option>
            <option value="Owner Builder">Owner Builder</option>
            <option value="Site Inspection">Site Inspection</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="helpWith" className="text-sm font-semibold text-[#111A24]">
          What can we help you with? *
        </label>
        <select
          id="helpWith"
          name="helpWith"
          required
          defaultValue=""
          disabled={pending}
          className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="Quote & Contract Review">Quote &amp; Contract Review</option>
          <option value="Pre-Construction Advisory">Pre-Construction Advisory</option>
          <option value="Site Visits & Inspections">Site Visits &amp; Inspections</option>
          <option value="General Advice">General Advice</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="projectDetails" className="text-sm font-semibold text-[#111A24]">
          Tell us about your project *
        </label>
        <textarea
          id="projectDetails"
          name="projectDetails"
          rows={4}
          required
          minLength={10}
          placeholder="Include as much detail as you can about your project, where you are up to and how we can help."
          disabled={pending}
          className="w-full rounded-lg border border-[#d8d2c7] p-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] resize-none focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
        <p className="text-xs text-[#6b7280] flex items-center gap-2">
          Your information is secure and confidential.
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : null}
          {pending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
