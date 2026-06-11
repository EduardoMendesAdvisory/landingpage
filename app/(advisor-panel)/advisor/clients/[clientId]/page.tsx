import { redirect } from "next/navigation";

export default async function AdvisorClientLegacyRedirectPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  redirect(`/advisor/projects/${clientId}`);
}
