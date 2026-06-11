import { redirect } from "next/navigation";

export default function QuoteReviewsRedirectPage() {
  redirect("/advisor/projects?filter=pending-reviews");
}
