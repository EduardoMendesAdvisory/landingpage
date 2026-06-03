"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/features/auth/actions";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await forgotPassword({ email });
      if ("error" in result) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 px-5 py-4 text-sm text-green-700 text-center">
        <p className="font-medium mb-1">Check your email</p>
        <p>
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          disabled={isPending}
          className="h-10"
          placeholder="your@email.com"
        />
      </div>

      <Button type="submit" className="w-full h-10" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin mr-2" />
            Sending reset link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
}
