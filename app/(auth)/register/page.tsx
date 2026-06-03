import Link from "next/link";
import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-navy">Create Your Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Free to join. No credit card required.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-navy font-medium hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
