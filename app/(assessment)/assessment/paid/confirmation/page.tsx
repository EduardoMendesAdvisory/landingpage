import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ assessment?: string }>;
}

/** Legacy URL — paid results now live on /assessment/results */
export default async function PaidConfirmationPage({ searchParams }: PageProps) {
  const { assessment: assessmentId } = await searchParams;
  if (!assessmentId) redirect("/");

  redirect(`/assessment/results?id=${assessmentId}`);
}
