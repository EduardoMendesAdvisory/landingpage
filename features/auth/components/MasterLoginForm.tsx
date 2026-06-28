"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginMaster } from "@/features/auth/master-actions";

interface MasterLoginFormProps {
  redirectPath?: string;
}

export function MasterLoginForm({ redirectPath }: MasterLoginFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await loginMaster({ email, password, redirectPath });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-[#111A24]/5 border border-[#111A24]/10 px-4 py-3 text-sm text-[#111A24] flex gap-2">
        <Lock size={16} className="shrink-0 mt-0.5 text-[#b67c2c]" />
        <span>Authorised staff only. Client portal sign-in is on the main website.</span>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="master-email">Email</Label>
        <Input
          id="master-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          disabled={isPending}
          className="h-10"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="master-password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#4b5564] hover:text-[#111A24] hover:underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="master-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          disabled={isPending}
          className="h-10"
        />
      </div>

      <Button type="submit" className="w-full h-10 mt-2" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          "Sign in to AdvisorHQ"
        )}
      </Button>
    </form>
  );
}
