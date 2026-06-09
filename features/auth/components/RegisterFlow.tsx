"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Upload, FileText, ClipboardList, Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/features/auth/actions";
import { PUBLIC_SERVICES } from "@/lib/services-catalog";
import {
  REGISTER_PATH_LABELS,
  type RegisterOnboardingPath,
} from "@/lib/auth/onboarding-paths";
import { setPendingQuote } from "@/lib/pending-quote";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/utils/validators";
import { cn } from "@/lib/utils";

const ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

const PATH_OPTIONS: {
  id: RegisterOnboardingPath;
  icon: typeof Upload;
}[] = [
  { id: "quote", icon: Upload },
  { id: "assessment", icon: ClipboardList },
  { id: "service", icon: Briefcase },
];

function validateQuoteFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return `Accepted formats: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }
  if (file.size > MAX_FILE_SIZE.lead) {
    return "File too large. Maximum size is 25 MB.";
  }
  return null;
}

export function RegisterFlow() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [onboardingPath, setOnboardingPath] = useState<RegisterOnboardingPath>("assessment");
  const [serviceSlug, setServiceSlug] = useState<string>(PUBLIC_SERVICES[0].slug);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  function handleQuoteFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateQuoteFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setQuoteFile(file);
    setError(null);
    e.target.value = "";
  }

  function clearQuoteFile() {
    setQuoteFile(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (values.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (onboardingPath === "quote" && !quoteFile) {
      setError("Please upload your builder quote to continue with this option.");
      return;
    }

    startTransition(async () => {
      if (onboardingPath === "quote" && quoteFile) {
        setPendingQuote(quoteFile);
      }

      try {
        localStorage.removeItem("em_assessment_wizard_free");
      } catch {
        /* ignore */
      }

      const result = await registerUser({
        ...values,
        onboardingPath,
        serviceSlug: onboardingPath === "service" ? serviceSlug : undefined,
      });

      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#b67c2c] mb-3">
          Step 1 - How do you want to start?
        </p>
        <div className="grid gap-2">
          {PATH_OPTIONS.map(({ id, icon: Icon }) => {
            const active = onboardingPath === id;
            const meta = REGISTER_PATH_LABELS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setOnboardingPath(id);
                  setError(null);
                }}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-[#b67c2c] bg-[#b67c2c]/5 ring-1 ring-[#b67c2c]/30"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    active ? "bg-[#b67c2c] text-white" : "bg-gray-100 text-gray-600"
                  )}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{meta.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {onboardingPath === "quote" && (
        <div className="rounded-xl border border-dashed border-[#b67c2c]/40 bg-[#b67c2c]/5 p-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ACCEPT}
            onChange={handleQuoteFile}
          />
          {quoteFile ? (
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#b67c2c] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{quoteFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Ready to upload after account creation
                </p>
              </div>
              <button
                type="button"
                onClick={clearQuoteFile}
                className="p-1.5 rounded-lg hover:bg-white/80 text-muted-foreground"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#b67c2c] py-2"
            >
              <Upload size={16} />
              Select your builder quote (PDF, DOC, JPG)
            </button>
          )}
        </div>
      )}

      {onboardingPath === "service" && (
        <div className="space-y-2">
          <Label htmlFor="service">Select a service</Label>
          <select
            id="service"
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-navy bg-white"
            disabled={isPending}
          >
            {PUBLIC_SERVICES.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            We will use this to personalise your onboarding. You will complete the same
            project assessment as all new clients.
          </p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#b67c2c] mb-3">
          Step 2 - Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={values.firstName}
                onChange={handleChange}
                disabled={isPending}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={values.lastName}
                onChange={handleChange}
                disabled={isPending}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleChange}
              disabled={isPending}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="04XX XXX XXX"
              value={values.phone}
              onChange={handleChange}
              disabled={isPending}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={values.password}
                onChange={handleChange}
                disabled={isPending}
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>

          <Button type="submit" className="w-full h-10 mt-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin mr-2" />
                Creating account...
              </>
            ) : (
              "Create account and start onboarding"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By creating an account, you agree to our{" "}
            <Link href="/privacy" className="text-navy underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
