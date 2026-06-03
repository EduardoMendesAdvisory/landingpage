import Link from "next/link";
import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectPath, message } = await searchParams;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Sign In</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Welcome back. Enter your details below.
        </p>
      </div>

      <LoginForm redirectPath={redirectPath} message={message} />

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-navy font-semibold hover:underline underline-offset-2"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
