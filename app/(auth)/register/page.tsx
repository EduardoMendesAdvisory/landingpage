import Link from "next/link";
import { Metadata } from "next";
import { RegisterFlow } from "@/features/auth/components/RegisterFlow";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Create Your Account</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Choose how you&apos;d like to start, then create your free account.
        </p>
      </div>

      <RegisterFlow />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-navy font-semibold hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
