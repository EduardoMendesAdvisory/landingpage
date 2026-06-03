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
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-navy">Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Enter your details below.
          </p>
        </div>

        <LoginForm redirectPath={redirectPath} message={message} />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-navy font-medium hover:underline underline-offset-2"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
