import { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Set New Password" };

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-navy">Set New Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a new password for your account.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
