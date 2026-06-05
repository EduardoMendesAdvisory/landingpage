"use client";

import { useState, useTransition } from "react";
import { User, Mail, Phone, MapPin, Loader2, ShieldCheck, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveLead } from "@/features/assessment/actions";
import { cn } from "@/lib/utils";

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "ACT", "TAS", "NT"] as const;

export interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
}

interface StepLeadCaptureProps {
  onComplete: (leadId: string, leadData: LeadData) => void;
  pendingQuoteName?: string | null;
}

function validate(data: LeadData): string | null {
  if (!data.fullName.trim()) return "Please enter your full name.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Please enter a valid email address.";
  if (!data.suburb.trim()) return "Please enter your suburb.";
  if (!data.state) return "Please select your state.";
  return null;
}

export function StepLeadCapture({ onComplete, pendingQuoteName }: StepLeadCaptureProps) {
  const [data, setData] = useState<LeadData>({
    fullName: "",
    email: "",
    phone: "",
    suburb: "",
    state: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const err = validate(data);
    if (err) { setError(err); return; }
    setError(null);

    startTransition(async () => {
      const result = await saveLead(data);
      if ("error" in result) {
        setError(result.error);
      } else {
        onComplete(result.leadId, data);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-amber uppercase tracking-widest mb-1">
          Free Preliminary AI Assessment
        </p>
        <h2 className="text-2xl font-bold text-navy">
          Let&apos;s get started
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Tell us a little about yourself so we can personalise your assessment. Your details are kept completely private.
        </p>
      </div>

      {pendingQuoteName && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs text-green-800">
          <FileText size={16} className="shrink-0 mt-0.5 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Quote ready to send</p>
            <p className="mt-0.5 leading-relaxed">
              <span className="font-medium">{pendingQuoteName}</span> will be uploaded securely after you submit your details.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm">Full Name <span className="text-red-500">*</span></Label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))}
              placeholder="e.g. Sarah Johnson"
              className="h-11 pl-9"
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email Address <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              placeholder="e.g. sarah@example.com"
              className="h-11 pl-9"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Phone (optional) */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm">
            Phone Number <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
              placeholder="e.g. 0412 345 678"
              className="h-11 pl-9"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Suburb + State row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="suburb" className="text-sm">Suburb <span className="text-red-500">*</span></Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="suburb"
                value={data.suburb}
                onChange={(e) => setData((d) => ({ ...d, suburb: e.target.value }))}
                placeholder="e.g. Buderim"
                className="h-11 pl-9"
                autoComplete="address-level2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">State <span className="text-red-500">*</span></Label>
            <select
              value={data.state}
              onChange={(e) => setData((d) => ({ ...d, state: e.target.value }))}
              className={cn(
                "h-11 w-full rounded-md border border-input bg-background px-3 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                !data.state && "text-gray-400"
              )}
            >
              <option value="" disabled>Select state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        <ShieldCheck size={14} className="shrink-0 mt-0.5 text-blue-600" />
        <span>
          Your information is kept 100% confidential and never shared with third parties. We only use it to personalise your assessment.
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
      >
        {isPending ? (
          <><Loader2 size={15} className="animate-spin" /> Saving...</>
        ) : (
          "Start My Free Assessment ->"
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Free | No obligation | Results in under 2 minutes
      </p>
    </div>
  );
}
