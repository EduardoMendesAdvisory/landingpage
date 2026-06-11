import { redirect } from "next/navigation";
import { ADVISOR_DASHBOARD_PATH } from "@/lib/auth/master-access";

export default function AdvisorIndexPage() {
  redirect(ADVISOR_DASHBOARD_PATH);
}
