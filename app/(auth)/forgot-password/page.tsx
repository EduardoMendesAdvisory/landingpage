import Link from "next/link";
import { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-navy">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-navy hover:underline underline-offset-2"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
